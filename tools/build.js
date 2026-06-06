/**
 * Cyber-Taoist — Site Builder
 * Renders the static site into docs/ for GitHub Pages deployment.
 *
 * Usage: node tools/build.js
 */

import { cpSync, copyFileSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync, existsSync } from 'fs';
import { join, resolve, dirname, relative } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const SRC = join(ROOT, 'site', 'src');
const CONTENT = join(ROOT, 'content');
const DOCS = join(ROOT, 'docs');
const CONTENT_FILES = new Set([
    'CONSTITUTION.md',
    'DAO-DE-JING.md',
    'DAO-DE-JING-CYBERTAOIST.md',
    'GUIDE.md',
    'llms.txt',
]);

function shouldCopySiteFile(srcPath) {
    const rel = relative(SRC, srcPath);
    const parts = rel.split(/[\\/]/);
    if (parts[0] === 'partials') return false;
    return !CONTENT_FILES.has(parts[0]);
}

function renderIncludes(filePath, seen = new Set()) {
    const abs = resolve(filePath);
    if (seen.has(abs)) {
        throw new Error(`Circular include detected: ${abs}`);
    }
    seen.add(abs);
    const source = readFileSync(abs, 'utf8');
    return source.replace(/<!--\s*@include\s+([^>]+?)\s*-->/g, (_, includePath) => {
        const child = join(dirname(abs), includePath.trim());
        if (!existsSync(child)) {
            throw new Error(`Missing include: ${includePath.trim()}`);
        }
        return renderIncludes(child, new Set(seen)).trimEnd();
    });
}

const start = Date.now();

console.log('\n  Build: cyber-taoist site');
console.log('  ' + '='.repeat(40));

// 1. Clean docs/
console.log('  [1/5] Cleaning docs/ ...');
if (existsSync(DOCS)) {
    rmSync(DOCS, { recursive: true, force: true, maxRetries: 3, retryDelay: 100 });
}
mkdirSync(DOCS, { recursive: true });

// 2. Copy site/src/ -> docs/
console.log('  [2/5] Copying site/src/ -> docs/ ...');
cpSync(SRC, DOCS, { recursive: true, filter: shouldCopySiteFile });

// 3. Render index.html includes
console.log('  [3/5] Rendering index.html ...');
writeFileSync(join(DOCS, 'index.html'), renderIncludes(join(SRC, 'index.html')));

// 4. Copy content/ -> docs/
console.log('  [4/5] Copying content/ -> docs/ ...');
for (const file of readdirSync(CONTENT)) {
    const src = join(CONTENT, file);
    if (CONTENT_FILES.has(file)) {
        copyFileSync(src, join(DOCS, file));
    }
}

// 5. Write .nojekyll
console.log('  [5/5] Writing .nojekyll ...');
writeFileSync(join(DOCS, '.nojekyll'), '');

const elapsed = Date.now() - start;
console.log('  ' + '='.repeat(40));
console.log(`  Done in ${elapsed}ms`);
console.log(`  Output: docs/\n`);
