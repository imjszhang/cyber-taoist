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

test('discover content supports multiple real entries', () => {
    const entries = loadDiscoverEntries(fileURLToPath(new URL('../content/discover/', import.meta.url)));
    assert.ok(entries.length >= 1);
    const slugs = new Set();
    for (const entry of entries) {
        assert.ok(['placeholder', 'published', 'unreviewed'].includes(entry.status), entry.slug);
        assert.ok(!slugs.has(entry.slug), 'duplicate slug ' + entry.slug);
        slugs.add(entry.slug);
        const card = renderEntryCard(entry);
        assert.match(card, new RegExp('href="./discover/' + entry.slug + '\\.html"'));
        if (entry.status === 'placeholder') {
            assert.match(entry.body, /PLACEHOLDER/);
            assert.match(card, /PLACEHOLDER/);
            assert.doesNotMatch(card, /href="https?:/);
        } else {
            assert.doesNotMatch(entry.body, /PLACEHOLDER/);
            assert.match(entry.source, /^https?:\/\//i);
            assert.match(card, /href="https?:/);
            if (entry.status === 'unreviewed') assert.match(card, /UNREVIEWED/);
        }
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
    writeFileSync(join(content, 'sample-stub.md'), `---
title: Sample Stub
date: 2026-10-17
summary: Fixture for template tokens
tags: ai-second-brain, tools-for-thought
type: research-note
source: not-a-url-yet
sourceLabel: Local fixture
status: placeholder
---

PLACEHOLDER

## What this stub is for

Keeps the Discover templates renderable in tests without depending on shipped content.
`);
    writeFileSync(join(content, 'sample-real.md'), `---
title: Sample Real Entry
date: 2026-10-17
summary: Second fixture proves multi-entry render
tags: ai-pkm, ai-second-brain
type: method
source: https://example.com/sample-real
sourceLabel: Example.com
status: unreviewed
---

## Why multi-entry matters

Body without the placeholder marker so list and article pages can carry more than one card.
`);
    const pages = writeDiscover(join(root, 'content'), out, {
        list: '<main id="main">{{ROOT}}|{{PAGE}}|{{ROBOTS}}|{{TOPICS}}|{{SCAFFOLD_NOTE}}|{{ENTRIES}}</main>',
        article: '<main id="main">{{ROOT}}|{{PAGE}}|{{TITLE}}|{{BANNER}}|{{SOURCE}}|{{CONTENT}}|{{TOC_BLOCK}}|{{SLUG}}</main>'
    });
    assert.deepEqual(pages, ['discover.html', 'discover/sample-real.html', 'discover/sample-stub.html']);
    const list = readFileSync(join(out, 'discover.html'), 'utf8');
    const stub = readFileSync(join(out, 'discover', 'sample-stub.html'), 'utf8');
    const real = readFileSync(join(out, 'discover', 'sample-real.html'), 'utf8');
    assert.match(list, /id="tag-ai-second-brain"/);
    assert.match(list, /PLACEHOLDER/);
    assert.match(list, /UNREVIEWED/);
    assert.match(list, /Sample Real Entry/);
    assert.match(list, /noindex/);
    assert.match(stub, /What this stub is for/);
    assert.match(stub, /<h2 id="what-this-stub-is-for">/);
    assert.match(real, /Why multi-entry matters/);
    assert.match(real, /href="https:\/\/example\.com\/sample-real"/);
    assert.doesNotMatch(list + stub + real, /\{\{[A-Z0-9_]+\}\}/);
    rmSync(root, { recursive: true, force: true });
});
