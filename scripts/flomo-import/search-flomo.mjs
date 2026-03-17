import { execFile } from 'node:child_process';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function loadConfig() {
  const raw = await readFile(resolve(__dirname, 'search-config.json'), 'utf-8');
  return JSON.parse(raw);
}

function runFlomoSearch(cliPath, args) {
  return new Promise((resolve, reject) => {
    const cliJs = `${cliPath}/cli/cli.js`;
    execFile('node', [cliJs, ...args], { maxBuffer: 10 * 1024 * 1024 }, (err, stdout, stderr) => {
      if (err) return reject(new Error(`CLI error: ${err.message}\nstderr: ${stderr}`));
      try {
        resolve(JSON.parse(stdout));
      } catch {
        reject(new Error(`Failed to parse CLI output: ${stdout.slice(0, 200)}`));
      }
    });
  });
}

function buildSearchArgs(search, defaults) {
  const args = ['search'];
  if (search.keyword) args.push(search.keyword);
  if (search.tag) args.push('--tag', search.tag);
  if (!search.keyword && !search.tag) return null;
  args.push('--limit', String(defaults.limit || 50));
  return args;
}

function describeSearch(search) {
  const parts = [];
  if (search.keyword) parts.push(`keyword:"${search.keyword}"`);
  if (search.tag) parts.push(`tag:"${search.tag}"`);
  return parts.join(' + ');
}

async function main() {
  const config = await loadConfig();
  const { flomoCliPath, searches, searchDefaults } = config;

  const allMemos = new Map();
  let totalFetched = 0;

  for (const search of searches) {
    const args = buildSearchArgs(search, searchDefaults);
    if (!args) continue;

    const label = describeSearch(search);
    process.stderr.write(`搜索: ${label} ...`);

    try {
      const result = await runFlomoSearch(flomoCliPath, args);
      const memos = result.memos || [];
      process.stderr.write(` ${memos.length} 条\n`);
      totalFetched += memos.length;

      for (const memo of memos) {
        if (allMemos.has(memo.id)) {
          allMemos.get(memo.id).matchedBy.push(label);
        } else {
          allMemos.set(memo.id, { ...memo, matchedBy: [label] });
        }
      }
    } catch (err) {
      process.stderr.write(` 失败: ${err.message}\n`);
    }
  }

  const candidates = [...allMemos.values()];
  candidates.sort((a, b) => b.matchedBy.length - a.matchedBy.length);

  const today = new Date().toISOString().slice(0, 10);
  const outDir = resolve(__dirname, 'data');
  await mkdir(outDir, { recursive: true });
  const outPath = resolve(outDir, `candidates-${today}.json`);

  const output = {
    date: today,
    searchCount: searches.length,
    totalFetched,
    uniqueCount: candidates.length,
    candidates,
  };

  await writeFile(outPath, JSON.stringify(output, null, 2), 'utf-8');
  process.stderr.write(`\n完成: ${candidates.length} 条去重候选 (从 ${totalFetched} 条原始结果)\n`);
  process.stderr.write(`输出: ${outPath}\n`);
}

main().catch(err => {
  process.stderr.write(`致命错误: ${err.message}\n`);
  process.exit(1);
});
