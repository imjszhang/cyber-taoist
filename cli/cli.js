#!/usr/bin/env node
/**
 * cyber-taoist CLI — 站点构建与部署辅助
 *
 *   node cli/cli.js build
 *   node cli/cli.js setup-cloudflare
 *   node cli/cli.js setup-github-pages
 *   node cli/cli.js help
 */

import { spawnSync } from 'child_process';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { setupCloudflare, setupGithubPages } from './lib/setup.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

function parseArgs(argv) {
    const args = argv.slice(2);
    const command = args[0] || '';
    return { command, rest: args.slice(1) };
}

function cmdBuild() {
    const r = spawnSync(process.execPath, [resolve(ROOT, 'build', 'build.js')], {
        cwd: ROOT,
        stdio: 'inherit',
    });
    process.exit(r.status ?? 1);
}

function printHelp() {
    console.log(`cyber-taoist CLI

用法:
  node cli/cli.js <command>

命令:
  build               执行 site:build（site/src → docs/）
  setup-cloudflare    配置 Cloudflare DNS（需 CLOUDFLARE_API_TOKEN 等）
  setup-github-pages  配置 GitHub Pages 自定义域名 + HTTPS（需 GITHUB_TOKEN）
  help                显示本说明

环境变量（可写入 .env）:
  DEPLOY_DOMAIN           默认 cyber-taoist.ai
  GITHUB_REPO             默认从 git remote 推断，否则 imjszhang/cyber-taoist
  GITHUB_PAGES_CNAME_TARGET  默认 <owner>.github.io
  PAGES_BRANCH            仅在未启用 Pages 时作为提示；已启用则沿用仓库设置
`);
}

async function main() {
    const { command } = parseArgs(process.argv);

    switch (command) {
        case 'build':
            cmdBuild();
            break;
        case 'setup-cloudflare':
            await setupCloudflare();
            break;
        case 'setup-github-pages':
            await setupGithubPages();
            break;
        case 'help':
        case '--help':
        case '-h':
            printHelp();
            break;
        default:
            if (!command) {
                console.error('请指定命令。运行: node cli/cli.js help');
                process.exit(1);
            }
            console.error(`未知命令: ${command}`);
            printHelp();
            process.exit(1);
    }
}

main().catch((err) => {
    console.error('错误:', err.message);
    process.exit(1);
});
