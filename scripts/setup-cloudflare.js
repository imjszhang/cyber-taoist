/**
 * Cloudflare DNS：将 cyber-taoist.ai（及 www）CNAME 到 GitHub Pages。
 * 凭证：.env 中 CLOUDFLARE_API_TOKEN（或 Global Key + CLOUDFLARE_EMAIL）。
 */

import { setupCloudflare } from '../cli/lib/setup.js';

setupCloudflare().catch((err) => {
    console.error('错误:', err.message);
    process.exit(1);
});
