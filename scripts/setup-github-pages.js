/**
 * GitHub API：设置 Pages 自定义域名并（在证书就绪后）强制 HTTPS。
 * 凭证：.env 中 GITHUB_TOKEN（需 repo 或 Pages 写权限）。
 */

import { setupGithubPages } from '../cli/lib/setup.js';

setupGithubPages().catch((err) => {
    console.error('错误:', err.message);
    process.exit(1);
});
