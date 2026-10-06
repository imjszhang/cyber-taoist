import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, resolve, relative, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const dist = join(root, 'dist');
const failures = [];
const files = [];
function walk(dir) {
    for (const entry of readdirSync(dir, {withFileTypes:true})) {
        const path = join(dir, entry.name);
        entry.isDirectory() ? walk(path) : files.push(path);
    }
}
if (!existsSync(dist)) throw new Error('Build the site before checking it.');
walk(dist);
const pages = files.filter(file => file.endsWith('.html'));
const ids = new Map();
for (const file of pages) {
    const html = readFileSync(file, 'utf8');
    const list = [...html.matchAll(/\bid=["']([^"']+)["']/g)].map(match => match[1]);
    if (new Set(list).size !== list.length) failures.push(relative(dist,file) + ': duplicate element IDs');
    ids.set(file, new Set(list));
    if (/<!--\s*@include|\{\{[A-Z_]+\}\}/.test(html)) failures.push(relative(dist,file) + ': unresolved template');
    if (!/<title>[^<]+<\/title>/.test(html) || !/<main\b/.test(html)) failures.push(relative(dist,file) + ': missing page structure');
    if (/<(?:script|img)\b[^>]*src=["']https?:\/\//.test(html)) failures.push(relative(dist,file) + ': external runtime resource');
    if (/\/Users\//.test(html)) failures.push(relative(dist,file) + ': local filesystem path leaked');
}
function checkReference(file, reference) {
    if (!reference || /^(?:data:|mailto:|tel:)/.test(reference)) return;
    const url = new URL(reference.replace(/&amp;/g,'&'), 'https://cyber-taoist.ai/' + relative(dist,file).replaceAll('\\','/'));
    if (url.origin !== 'https://cyber-taoist.ai') return;
    let path = join(dist, decodeURIComponent(url.pathname));
    if (existsSync(path) && statSync(path).isDirectory()) path = join(path, 'index.html');
    if (!existsSync(path)) { failures.push(relative(dist,file) + ': missing ' + reference); return; }
    if (url.hash && ids.has(path) && !ids.get(path).has(decodeURIComponent(url.hash.slice(1)))) failures.push(relative(dist,file) + ': missing anchor ' + reference);
}
for (const file of files.filter(file => ['.html','.css'].includes(extname(file)))) {
    const text = readFileSync(file,'utf8');
    const pattern = file.endsWith('.css') ? /url\(["']?([^"')]+)["']?\)/g : /\b(?:href|src)=["']([^"']+)["']/g;
    for (const match of text.matchAll(pattern)) checkReference(file,match[1]);
    if (file.endsWith('.html')) for (const match of text.matchAll(/\bsrcset="([^"]+)"/g)) {
        for (const candidate of match[1].split(',')) checkReference(file,candidate.trim().split(/\s+/)[0]);
    }
}
for (const source of ['CONSTITUTION.md','GUIDE.md','DAO-DE-JING.md','DAO-DE-JING-CYBERTAOIST.md']) {
    if (!readFileSync(join(root,'content',source)).equals(readFileSync(join(dist,source)))) failures.push(source + ': published source differs');
}
const artwork = files.filter(file => /\/assets\/[^/]+\.webp$/.test(file));
if (artwork.length !== 6) failures.push('Expected desktop and mobile artwork variants.');
if (artwork.reduce((total,file) => total + statSync(file).size, 0) > 1_500_000) failures.push('Artwork exceeds the 1.5 MB combined size budget.');
if (existsSync(join(dist,'assets','README.md'))) failures.push('Private asset provenance should not be published.');
if (failures.length) {
    console.error(failures.join('\n'));
    process.exit(1);
}
console.log('Site check passed: ' + pages.length + ' pages, local links and anchors, fonts, responsive artwork, and original documents.');
