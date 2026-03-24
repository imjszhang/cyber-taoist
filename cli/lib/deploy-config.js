/**
 * 部署相关默认值：可通过环境变量覆盖（.env 或 shell）。
 */

import { readFileSync, existsSync } from 'fs';
import { execSync } from 'child_process';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
export const ROOT = resolve(__dirname, '..', '..');

const DEFAULT_DOMAIN = 'cyber-taoist.ai';
const DEFAULT_REPO = 'imjszhang/cyber-taoist';

export function loadEnv() {
    const env = { ...process.env };
    const envPath = resolve(ROOT, '.env');
    if (existsSync(envPath)) {
        const content = readFileSync(envPath, 'utf-8');
        for (const line of content.split('\n')) {
            const match = line.match(/^([^#=]+)=(.*)$/);
            if (match) env[match[1].trim()] = match[2].trim();
        }
    }
    return env;
}

function parseGithubRemote(url) {
    if (!url) return null;
    const m =
        url.match(/github\.com[:/]([^/]+)\/([^/.]+?)(?:\.git)?\/?$/i) ||
        url.match(/github\.com\/([^/]+)\/([^/.]+?)(?:\.git)?$/i);
    if (!m) return null;
    return `${m[1]}/${m[2]}`;
}

function repoFromGit() {
    try {
        const url = execSync('git config --get remote.origin.url', {
            cwd: ROOT,
            encoding: 'utf-8',
        }).trim();
        return parseGithubRemote(url);
    } catch {
        return null;
    }
}

/**
 * @returns {{
 *   root: string,
 *   domain: string,
 *   githubRepo: string,
 *   githubOwner: string,
 *   githubPagesTarget: string,
 *   pagesDefaultSource: { branch: string, path: string }
 * }}
 */
export function getDeployConfig() {
    const env = loadEnv();
    const domain = env.DEPLOY_DOMAIN || env.CYBER_TAOIST_DOMAIN || DEFAULT_DOMAIN;
    const githubRepo = env.GITHUB_REPO || repoFromGit() || DEFAULT_REPO;
    const [githubOwner] = githubRepo.split('/');
    const githubPagesTarget =
        env.GITHUB_PAGES_CNAME_TARGET || `${githubOwner}.github.io`;
    const branch = env.PAGES_BRANCH || 'main';
    return {
        root: ROOT,
        domain,
        githubRepo,
        githubOwner,
        githubPagesTarget,
        pagesDefaultSource: { branch, path: '/docs' },
    };
}
