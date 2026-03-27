/**
 * 将仓库根目录 CONSTITUTION.md 复制到 site/src/，便于 `npm run site:dev` 下直接访问 /CONSTITUTION.md
 */
import { copyFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = join(root, 'CONSTITUTION.md');
const dest = join(root, 'site', 'src', 'CONSTITUTION.md');

if (!existsSync(src)) {
    console.error('sync-site-constitution: CONSTITUTION.md not found at repo root');
    process.exit(1);
}
copyFileSync(src, dest);
