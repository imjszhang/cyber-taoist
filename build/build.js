/**
 * Cyber-Taoist — Site Builder
 * Copies site/src/ to docs/ for GitHub Pages deployment.
 *
 * Usage: node build/build.js
 */

import { cpSync, mkdirSync, rmSync, writeFileSync, existsSync } from 'fs';
import { join, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const SRC = join(ROOT, 'site', 'src');
const DOCS = join(ROOT, 'docs');

const start = Date.now();

console.log('\n  Build: cyber-taoist site');
console.log('  ' + '='.repeat(40));

// 1. Clean docs/
console.log('  [1/3] Cleaning docs/ ...');
if (existsSync(DOCS)) {
    rmSync(DOCS, { recursive: true, force: true, maxRetries: 3, retryDelay: 100 });
}
mkdirSync(DOCS, { recursive: true });

// 2. Copy site/src/ -> docs/
console.log('  [2/3] Copying site/src/ -> docs/ ...');
cpSync(SRC, DOCS, { recursive: true });

// 3. Write .nojekyll + CNAME
console.log('  [3/3] Writing .nojekyll + CNAME ...');
writeFileSync(join(DOCS, '.nojekyll'), '');
writeFileSync(join(DOCS, 'CNAME'), 'cyber-taoist.ai');

const elapsed = Date.now() - start;
console.log('  ' + '='.repeat(40));
console.log(`  Done in ${elapsed}ms`);
console.log(`  Output: docs/\n`);
