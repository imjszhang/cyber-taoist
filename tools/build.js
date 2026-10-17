/**
 * Cyber-Taoist — Site Builder
 * Renders the static site into dist/ for local preview and GitHub Pages deployment.
 *
 * Usage: node tools/build.js
 */

import { cpSync, copyFileSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync, existsSync } from 'fs';
import { join, resolve, dirname, relative } from 'path';
import { fileURLToPath } from 'url';
import { execFileSync } from 'node:child_process';
import { writeDocuments, DOCUMENTS } from './documents.js';
import { writeDiscover } from './discover.js';
import { optimizeAssets } from './assets.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const SRC = join(ROOT, 'site', 'src');
const CONTENT = join(ROOT, 'content');
const OUT = join(ROOT, 'dist');
const CONTENT_FILES = new Set([
    'CONSTITUTION.md',
    'DAO-DE-JING.md',
    'DAO-DE-JING-CYBERTAOIST.md',
    'GUIDE.md',
    'CHANGELOG.md',
    'llms.txt',
]);

function shouldCopySiteFile(srcPath) {
    const rel = relative(SRC, srcPath);
    const parts = rel.split(/[\\/]/);
    if (parts[0] === 'partials') return false;
    if (parts[0] === 'assets' && (parts.at(-1) === 'README.md' || /\.png$/i.test(srcPath))) return false;
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

// 1. Clean dist/
console.log('  [1/5] Cleaning dist/ ...');
if (existsSync(OUT)) {
    rmSync(OUT, { recursive: true, force: true, maxRetries: 3, retryDelay: 100 });
}
mkdirSync(OUT, { recursive: true });

// 2. Copy site/src/ -> dist/
console.log('  [2/5] Copying site/src/ -> dist/ ...');
cpSync(SRC, OUT, { recursive: true, filter: shouldCopySiteFile });

// 3. Render includes for every root HTML page.
console.log('  [3/5] Rendering HTML pages ...');
for (const entry of readdirSync(SRC, { withFileTypes: true })) {
    if (entry.isFile() && /\.html$/i.test(entry.name)) {
        writeFileSync(join(OUT, entry.name), renderIncludes(join(SRC, entry.name)));
    }
}
writeDocuments(CONTENT, OUT, renderIncludes(join(SRC, 'partials', 'document.html')));
const discoverPages = writeDiscover(CONTENT, OUT, {
    list: renderIncludes(join(SRC, 'partials', 'discover-list.html')),
    article: renderIncludes(join(SRC, 'partials', 'discover-article.html'))
});
const newsletterFile = join(OUT, 'newsletter.html');
const newsletterHtml = readFileSync(newsletterFile, 'utf8').replaceAll('{{ROOT}}', './');
if (/\{\{[A-Z0-9_]+\}\}/.test(newsletterHtml)) throw new Error('newsletter.html has an unresolved template token');
writeFileSync(newsletterFile, newsletterHtml);
await optimizeAssets(SRC, OUT);

// 4. Copy content/ -> dist/
console.log('  [4/5] Copying content/ -> dist/ ...');
for (const file of readdirSync(CONTENT)) {
    const src = join(CONTENT, file);
    if (CONTENT_FILES.has(file)) {
        copyFileSync(src, join(OUT, file));
    }
}

// 5. Write .nojekyll
console.log('  [5/5] Writing .nojekyll ...');
writeFileSync(join(OUT, '.nojekyll'), '');
const pages = ['index.html', 'philosophy.html', 'newsletter.html', ...DOCUMENTS.map(doc => doc.page), ...discoverPages];
writeFileSync(join(OUT, 'sitemap.xml'), '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + pages.map(page => '<url><loc>https://cyber-taoist.ai/' + (page === 'index.html' ? '' : page) + '</loc></url>').join('') + '</urlset>\n');
writeFileSync(join(OUT, 'robots.txt'), 'User-agent: *\nAllow: /\nSitemap: https://cyber-taoist.ai/sitemap.xml\n');
const version = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8')).version;
let revision = process.env.GITHUB_SHA || null;
if (!revision) {
    try { revision = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim(); } catch { /* Source archives may not contain Git history. */ }
}
writeFileSync(join(OUT, 'version.json'), JSON.stringify({ version, revision }) + '\n');

const elapsed = Date.now() - start;
console.log('  ' + '='.repeat(40));
console.log(`  Done in ${elapsed}ms`);
console.log(`  Output: dist/\n`);
