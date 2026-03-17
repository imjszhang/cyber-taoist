import { readFile, writeFile, readdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function loadConfig() {
  const raw = await readFile(resolve(__dirname, 'search-config.json'), 'utf-8');
  return JSON.parse(raw);
}

async function findCandidatesFile(explicit) {
  if (explicit) return resolve(explicit);
  const dataDir = resolve(__dirname, 'data');
  const files = (await readdir(dataDir)).filter(f => f.startsWith('candidates-') && f.endsWith('.json'));
  if (!files.length) throw new Error('scripts/data/ 下未找到 candidates-*.json 文件，请先运行 search-flomo');
  files.sort();
  return resolve(dataDir, files[files.length - 1]);
}

function scoreMemo(memo, scoring) {
  const text = `${memo.content || ''} ${(memo.tags || []).join(' ')}`;
  const scores = {};
  let total = 0;
  for (const [dim, keywords] of Object.entries(scoring)) {
    let count = 0;
    for (const kw of keywords) {
      const regex = new RegExp(kw, 'gi');
      const matches = text.match(regex);
      if (matches) count += matches.length;
    }
    scores[dim] = count;
    total += count;
  }
  const bestDim = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
  return { scores, total, suggestedDim: bestDim[1] > 0 ? bestDim[0] : '?' };
}

function truncateContent(content, maxLen = 200) {
  if (!content) return '';
  const cleaned = content.replace(/\n+/g, ' ').trim();
  return cleaned.length > maxLen ? cleaned.slice(0, maxLen) + '...' : cleaned;
}

function formatDate(dateStr) {
  if (!dateStr) return '?';
  return dateStr.slice(0, 10);
}

function generateMarkdown(data, scoredCandidates) {
  const lines = [];
  const today = new Date().toISOString().slice(0, 10);

  lines.push(`# Flomo 素材审阅 — ${today}`);
  lines.push('');
  lines.push(`> 候选总数：${scoredCandidates.length} | 来源搜索：${data.searchCount} 组关键词/标签`);
  lines.push(`> 使用方法：在 [ ] 中打 x 表示纳入，填写维度和解读，完成后运行 generate-atoms`);
  lines.push('');

  for (let i = 0; i < scoredCandidates.length; i++) {
    const { memo, scores, suggestedDim } = scoredCandidates[i];
    const scoreStr = Object.entries(scores).map(([d, s]) => `${d}:${s}`).join(' ');

    lines.push('---');
    lines.push('');
    lines.push(`## #${i + 1} [${scoreStr}] 建议维度: ${suggestedDim}`);
    lines.push('');
    lines.push(`- ID: \`${memo.id}\``);
    lines.push(`- 创建: ${formatDate(memo.created_at)}`);
    lines.push(`- 标签: ${(memo.tags || []).map(t => `#${t}`).join(' ') || '(无)'}`);
    lines.push(`- 命中: ${(memo.matchedBy || []).join(', ')}`);
    lines.push('');
    lines.push(`> ${truncateContent(memo.content)}`);
    lines.push('');
    lines.push(`- 纳入: [ ]`);
    lines.push(`- 维度: ${suggestedDim}`);
    lines.push(`- 类型: ____`);
    lines.push(`- 一句话解读: ____`);
    lines.push('');
  }

  return lines.join('\n');
}

async function main() {
  const config = await loadConfig();
  const candidatesPath = await findCandidatesFile(process.argv[2]);

  process.stderr.write(`读取: ${candidatesPath}\n`);
  const data = JSON.parse(await readFile(candidatesPath, 'utf-8'));

  const scoredCandidates = data.candidates
    .map(memo => {
      const { scores, total, suggestedDim } = scoreMemo(memo, config.scoring);
      return { memo, scores, total, suggestedDim };
    })
    .filter(c => c.total > 0)
    .sort((a, b) => b.total - a.total);

  process.stderr.write(`评分完成: ${scoredCandidates.length} 条有效候选 (${data.candidates.length - scoredCandidates.length} 条零分已过滤)\n`);

  const md = generateMarkdown(data, scoredCandidates);

  const today = new Date().toISOString().slice(0, 10);
  const outPath = resolve(__dirname, 'data', `review-${today}.md`);
  await writeFile(outPath, md, 'utf-8');
  process.stderr.write(`输出: ${outPath}\n`);
}

main().catch(err => {
  process.stderr.write(`致命错误: ${err.message}\n`);
  process.exit(1);
});
