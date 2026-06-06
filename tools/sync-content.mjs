/**
 * 将 content/ 中的公开内容同步到 site/src/，便于 `npm run site:dev` 下直接访问。
 */
import { copyFileSync, existsSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const contentDir = join(root, 'content');
const siteDir = join(root, 'site', 'src');
const contentFiles = new Set([
    'CONSTITUTION.md',
    'DAO-DE-JING.md',
    'DAO-DE-JING-CYBERTAOIST.md',
    'GUIDE.md',
    'CHANGELOG.md',
    'llms.txt',
]);

if (!existsSync(contentDir)) {
    console.error('sync-content: content/ not found');
    process.exit(1);
}

for (const file of readdirSync(contentDir)) {
    if (!contentFiles.has(file)) continue;
    copyFileSync(join(contentDir, file), join(siteDir, file));
}
