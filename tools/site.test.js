import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderDocument, DOCUMENTS } from './documents.js';
import { loadDiscoverEntries, renderEntryCard, renderTopicAnchors, writeDiscover } from './discover.js';

test('documents retain headings, tables, code, and safe local reading links', () => {
    const fence = String.fromCharCode(96).repeat(3);
    const {html, toc} = renderDocument('# Title\n\n## 一、观察\n\nA [charter](CONSTITUTION.md).\n\n## 一、观察\n\n| A | B |\n| - | - |\n| 1 | 2 |\n\n' + fence + 'js\nconst x = "<tag>";\n' + fence + '\n');
    assert.match(html, /id="一观察"/);
    assert.match(html, /id="一观察-1"/);
    assert.match(toc, /href="#一观察-1"/);
    assert.match(html, /href="\.\/charter.html"/);
    assert.match(html, /class="table-scroll"/);
    assert.match(html, /&lt;tag&gt;/);
});

test('unsafe Markdown links never become executable anchors', () => {
    const {html} = renderDocument('[test](javascript:alert%281%29)');
    assert.doesNotMatch(html, /href=/);
    assert.match(html, /test/);
});

test('all original chapters remain in the commentary reader', () => {
    const source = readFileSync(new URL('../content/DAO-DE-JING-CYBERTAOIST.md', import.meta.url), 'utf8');
    const {html, toc} = renderDocument(source);
    for (let chapter = 1; chapter <= 81; chapter++) {
        assert.match(html, new RegExp('第 ' + chapter + ' 章'));
        assert.match(toc, new RegExp('第 ' + chapter + ' 章'));
    }
});

test('all library pages have distinct routes and source files', () => {
    assert.deepEqual(DOCUMENTS.map(d => d.page), ['guide.html', 'commentary.html', 'tao-te-ching.html', 'charter.html']);
    for (const doc of DOCUMENTS) {
        const source = readFileSync(new URL('../content/' + doc.source, import.meta.url), 'utf8');
        assert.ok(source.startsWith('# '), doc.source);
        assert.ok(renderDocument(source).toc.length > 0, doc.source);
    }
});

test('library links can be rooted for nested Discover articles', () => {
    const {html} = renderDocument('See the [charter](CONSTITUTION.md).', { root: '../' });
    assert.match(html, /href="\.\.\/charter\.html"/);
});

test('homepage keeps identity, practice, and philosophy and adds Explore after them', () => {
    const html = readFileSync(new URL('../site/src/index.html', import.meta.url), 'utf8');
    for (const id of ['hero-title', 'identity', 'practice', 'philosophy', 'explore']) assert.match(html, new RegExp('id="' + id + '"'));
    const practiceAt = html.indexOf('id="practice"');
    const exploreAt = html.indexOf('id="explore"');
    const philosophyAt = html.indexOf('id="philosophy"');
    assert.ok(practiceAt < exploreAt && exploreAt < philosophyAt);
    assert.match(html, /href="\.\/discover\.html"/);
    assert.match(html, /href="\.\/newsletter\.html"/);
});

test('homepage topic links match Discover anchors', () => {
    const home = readFileSync(new URL('../site/src/index.html', import.meta.url), 'utf8');
    const anchors = [...home.matchAll(/discover\.html#(tag-[a-z0-9-]+)/g)].map(match => match[1]);
    assert.ok(anchors.length >= 3);
    const topics = renderTopicAnchors([]);
    for (const id of anchors) assert.match(topics, new RegExp('id="' + id + '"'));
});

test('discover scaffold stays placeholder-only', () => {
    const entries = loadDiscoverEntries(fileURLToPath(new URL('../content/discover/', import.meta.url)));
    assert.ok(entries.length <= 1);
    for (const entry of entries) {
        assert.equal(entry.status, 'placeholder');
        assert.match(entry.body, /PLACEHOLDER/);
        assert.match(renderEntryCard(entry), /PLACEHOLDER/);
        assert.match(renderEntryCard(entry), /no published source yet/);
        assert.doesNotMatch(renderEntryCard(entry), /href="https?:/);
    }
});

test('discover entries reject a missing source and do not link unsafe sources', () => {
    const dir = mkdtempSync(join(tmpdir(), 'discover-'));
    writeFileSync(join(dir, 'broken.md'), '---\ntitle: Broken\ndate: 2026-10-17\nsummary: Missing source\ntags: placeholder\ntype: research-note\nstatus: placeholder\n---\n\nPLACEHOLDER\n');
    assert.throws(() => loadDiscoverEntries(dir), /missing source/);
    const html = renderEntryCard({
        status: 'placeholder', date: '2026-10-17', typeLabel: { en: 'Research note', zh: '研究笔记' },
        title: 'Unsafe', titleZh: '不安全', slug: 'unsafe', summary: 'Stub', summaryZh: '占位',
        source: 'javascript:alert(1)', sourceLabel: 'javascript:alert(1)', tags: ['placeholder']
    });
    assert.match(html, /javascript:alert\(1\)/);
    assert.doesNotMatch(html, /href="javascript:/);
    rmSync(dir, { recursive: true, force: true });
});

test('discover templates render without leftover tokens', () => {
    const root = mkdtempSync(join(tmpdir(), 'discover-site-'));
    const content = join(root, 'content', 'discover');
    const out = join(root, 'out');
    mkdirSync(content, { recursive: true });
    mkdirSync(out, { recursive: true });
    writeFileSync(join(content, 'placeholder.md'), readFileSync(new URL('../content/discover/placeholder.md', import.meta.url)));
    const pages = writeDiscover(join(root, 'content'), out, {
        list: '<main id="main">{{ROOT}}|{{PAGE}}|{{ROBOTS}}|{{TOPICS}}|{{SCAFFOLD_NOTE}}|{{ENTRIES}}</main>',
        article: '<main id="main">{{ROOT}}|{{PAGE}}|{{TITLE}}|{{BANNER}}|{{SOURCE}}|{{CONTENT}}|{{TOC_BLOCK}}|{{SLUG}}</main>'
    });
    assert.deepEqual(pages, ['discover.html', 'discover/placeholder.html']);
    const list = readFileSync(join(out, 'discover.html'), 'utf8');
    const article = readFileSync(join(out, 'discover', 'placeholder.html'), 'utf8');
    assert.match(list, /id="tag-ai-second-brain"/);
    assert.match(list, /PLACEHOLDER/);
    assert.match(list, /noindex/);
    assert.match(article, /href="\.\.\/charter\.html"|What this stub is for/);
    assert.match(article, /<h2 id="what-this-stub-is-for">/);
    assert.doesNotMatch(list + article, /\{\{[A-Z0-9_]+\}\}/);
    rmSync(root, { recursive: true, force: true });
});
