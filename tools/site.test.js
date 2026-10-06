import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { renderDocument, DOCUMENTS } from './documents.js';

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
    assert.equal(new Set(DOCUMENTS.map(d => d.page)).size, DOCUMENTS.length);
    for (const doc of DOCUMENTS) {
        const source = readFileSync(new URL('../content/' + doc.source, import.meta.url), 'utf8');
        assert.ok(source.startsWith('# '), doc.source);
        assert.ok(renderDocument(source).toc.length > 0, doc.source);
    }
});
