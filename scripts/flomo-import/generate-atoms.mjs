import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import { resolve, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..', '..');

// ── Parse the human-annotated review markdown ────────────────────────

function parseReview(md) {
  const sections = md.split(/^---$/m).filter(s => s.trim());
  const items = [];

  for (const section of sections) {
    const idMatch = section.match(/- ID: `([^`]+)`/);
    if (!idMatch) continue;

    const includeMatch = section.match(/- 纳入: \[([xX])\]/);
    if (!includeMatch) continue;

    const dimMatch = section.match(/- 维度:\s*([RTN])/);
    const typeMatch = section.match(/- 类型:\s*(事实|经验|判断|步骤)/);
    const interpretMatch = section.match(/- 一句话解读:\s*(.+)/);

    const dim = dimMatch ? dimMatch[1] : null;
    const type = typeMatch ? typeMatch[1] : null;
    const interpret = interpretMatch ? interpretMatch[1].trim() : null;

    if (!dim || !type || !interpret || interpret === '____') {
      process.stderr.write(`警告: ID ${idMatch[1]} 已勾选纳入但缺少必填字段（维度/类型/解读），跳过\n`);
      continue;
    }

    items.push({ id: idMatch[1], dim, type, interpret });
  }

  return items;
}

// ── Load candidates JSON to get full memo data ──────────────────────

async function loadCandidatesForReview(reviewPath) {
  const reviewDate = reviewPath.match(/review-(\d{4}-\d{2}-\d{2})\.md/)?.[1];
  const dataDir = resolve(__dirname, 'data');

  if (reviewDate) {
    const candidatePath = resolve(dataDir, `candidates-${reviewDate}.json`);
    try {
      return JSON.parse(await readFile(candidatePath, 'utf-8'));
    } catch { /* fall through */ }
  }

  const files = (await readdir(dataDir)).filter(f => f.startsWith('candidates-') && f.endsWith('.json'));
  files.sort();
  if (!files.length) throw new Error('未找到 candidates JSON');
  return JSON.parse(await readFile(resolve(dataDir, files[files.length - 1]), 'utf-8'));
}

// ── Generate journal file ───────────────────────────────────────────

function buildJournalContent(dimLabel, memos) {
  const lines = [];
  lines.push(`# Flomo 导入：${dimLabel} 维度素材`);
  lines.push('');
  lines.push(`> 导入时间：${new Date().toISOString().slice(0, 10)}`);
  lines.push(`> 笔记数量：${memos.length}`);
  lines.push('');

  for (let i = 0; i < memos.length; i++) {
    const { memo, type, interpret } = memos[i];
    lines.push(`## ${i + 1}. ${interpret}`);
    lines.push('');
    lines.push(`**类型**：${type} | **标签**：${(memo.tags || []).map(t => `#${t}`).join(' ') || '(无)'} | **创建**：${(memo.created_at || '').slice(0, 10)}`);
    lines.push('');
    lines.push(memo.content || '(无内容)');
    lines.push('');
    lines.push(`> flomo ID: ${memo.id}`);
    lines.push('');
  }

  return lines.join('\n');
}

// ── Generate atom file ──────────────────────────────────────────────

const DIM_ABBREV = { R: 'FR', T: 'FT', N: 'FN' };
const DIM_LABELS = { R: '规则 (R)', T: '交易 (T)', N: '生态位 (N)' };

function buildAtomContent(dim, journalRelPath, memos) {
  const abbrev = DIM_ABBREV[dim];
  const today = new Date().toISOString().slice(0, 10);
  const lines = [];

  lines.push(`# ${today} — Flomo 导入：${DIM_LABELS[dim]}`);
  lines.push('');
  lines.push(`> 来源：[${journalRelPath}](${journalRelPath})`);
  lines.push(`> 缩写：${abbrev}`);
  lines.push('');
  lines.push('## Atoms');
  lines.push('');
  lines.push('| 编号  | 类型 | 内容 | 原文定位 |');
  lines.push('| ----- | ---- | ---- | -------- |');

  for (let i = 0; i < memos.length; i++) {
    const { memo, type, interpret } = memos[i];
    const num = String(i + 1).padStart(2, '0');
    const tags = (memo.tags || []).map(t => `#${t}`).join(' ') || 'flomo';
    const escapedInterpret = interpret.replace(/\|/g, '\\|');
    const escapedTags = tags.replace(/\|/g, '\\|');
    lines.push(`| ${abbrev}-${num} | ${type} | ${escapedInterpret} | ${escapedTags} |`);
  }

  lines.push('');
  return lines.join('\n');
}

// ── Main ────────────────────────────────────────────────────────────

async function findReviewFile(explicit) {
  if (explicit) return resolve(explicit);
  const dataDir = resolve(__dirname, 'data');
  const files = (await readdir(dataDir)).filter(f => f.startsWith('review-') && f.endsWith('.md'));
  if (!files.length) throw new Error('scripts/data/ 下未找到 review-*.md 文件');
  files.sort();
  return resolve(dataDir, files[files.length - 1]);
}

async function main() {
  const reviewPath = await findReviewFile(process.argv[2]);
  process.stderr.write(`读取审阅文件: ${reviewPath}\n`);

  const reviewMd = await readFile(reviewPath, 'utf-8');
  const items = parseReview(reviewMd);

  if (!items.length) {
    process.stderr.write('未找到任何已标注纳入的条目。请先编辑 review markdown 文件，在需要纳入的条目中将 [ ] 改为 [x]。\n');
    process.exit(0);
  }

  process.stderr.write(`已解析 ${items.length} 条纳入条目\n`);

  const candidatesData = await loadCandidatesForReview(reviewPath);
  const memoMap = new Map(candidatesData.candidates.map(m => [m.id, m]));

  const grouped = { R: [], T: [], N: [] };
  for (const item of items) {
    const memo = memoMap.get(item.id);
    if (!memo) {
      process.stderr.write(`警告: 未在 candidates 中找到 ID ${item.id}，跳过\n`);
      continue;
    }
    grouped[item.dim].push({ memo, type: item.type, interpret: item.interpret });
  }

  const today = new Date().toISOString().slice(0, 10);
  const yearMonth = today.slice(0, 7);
  let totalGenerated = 0;

  for (const dim of ['R', 'T', 'N']) {
    const memos = grouped[dim];
    if (!memos.length) continue;

    const journalDir = resolve(ROOT, 'journal', today);
    const atomDir = resolve(ROOT, 'pyramid', 'analysis', 'atoms', yearMonth);
    await mkdir(journalDir, { recursive: true });
    await mkdir(atomDir, { recursive: true });

    const journalFile = `flomo-import-${dim}.md`;
    const atomFile = `flomo-import-${dim}.md`;

    const journalPath = resolve(journalDir, journalFile);
    const atomPath = resolve(atomDir, atomFile);

    const journalContent = buildJournalContent(DIM_LABELS[dim], memos);
    await writeFile(journalPath, journalContent, 'utf-8');
    process.stderr.write(`生成 journal: ${relative(ROOT, journalPath)} (${memos.length} 条)\n`);

    const journalRelPath = relative(dirname(atomPath), journalPath).replace(/\\/g, '/');
    const atomContent = buildAtomContent(dim, journalRelPath, memos);
    await writeFile(atomPath, atomContent, 'utf-8');
    process.stderr.write(`生成 atom:    ${relative(ROOT, atomPath)} (${memos.length} 条)\n`);

    totalGenerated += memos.length;
  }

  process.stderr.write(`\n完成: 共生成 ${totalGenerated} 条 atom\n`);
  process.stderr.write('\n请手动更新以下文件：\n');
  process.stderr.write('  1. pyramid/analysis/atoms/README.md — 缩写映射表追加 FR/FT/FN\n');
  process.stderr.write('  2. pyramid/analysis/groups/ — 将新 atom 归入对应 group\n');
  process.stderr.write('  3. pyramid/analysis/synthesis.md — 检查是否需要调整顶层观点\n');
}

main().catch(err => {
  process.stderr.write(`致命错误: ${err.message}\n`);
  process.exit(1);
});
