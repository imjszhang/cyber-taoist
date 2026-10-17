/**
 * Discover list + article pages.
 * Extends the Markdown reader in documents.js. Entries live in content/discover/*.md.
 * status: published requires an http(s) source. Anything else is an unpublished scaffold
 * and is marked noindex. Newsletter provider selection is intentionally not handled here.
 */

import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { escapeHtml, renderDocument } from './documents.js';

const TYPES = {
    method: { en: 'Method note', zh: '方法解读' },
    workflow: { en: 'Workflow note', zh: '工作流笔记' },
    'research-note': { en: 'Research note', zh: '研究笔记' }
};

export const DISCOVER_TOPICS = [
    { slug: 'ai-second-brain', en: 'AI Second Brain', zh: 'AI 第二大脑' },
    { slug: 'codex-pkm', en: 'Codex × PKM', zh: 'Codex × 个人知识管理' },
    { slug: 'tools-for-thought', en: 'Tools for Thought', zh: '思考工具' }
];

const TAG_LABELS = {
    placeholder: { en: 'Placeholder', zh: '占位' },
    'ai-pkm': { en: 'AI × PKM', zh: 'AI × 个人知识管理' },
    'ai-second-brain': DISCOVER_TOPICS[0],
    'codex-pkm': DISCOVER_TOPICS[1],
    'tools-for-thought': DISCOVER_TOPICS[2]
};

function fail(file, message) {
    throw new Error((file ? file + ': ' : '') + message);
}

function isIsoDate(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const [year, month, day] = value.split('-').map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

export function parseFrontMatter(raw, file = 'discover entry') {
    const match = String(raw).match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
    if (!match) fail(file, 'missing front matter');
    const meta = {};
    for (const line of match[1].split(/\r?\n/)) {
        if (!line.trim()) continue;
        const field = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
        if (!field) fail(file, 'cannot read front-matter line: ' + line);
        let value = field[2].trim();
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1);
        meta[field[1]] = value;
    }
    return { meta, body: match[2].trim() };
}

function tagSlug(label, file) {
    const slug = String(label).trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    if (!slug) fail(file, 'empty tag');
    return slug;
}

export function loadDiscoverEntries(dir) {
    if (!existsSync(dir)) return [];
    const entries = [];
    for (const name of readdirSync(dir)) {
        if (!name.endsWith('.md') || name === 'README.md') continue;
        const slug = name.slice(0, -3);
        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) fail(name, 'slug must be lowercase words separated by hyphens');
        const raw = readFileSync(join(dir, name), 'utf8');
        const { meta, body } = parseFrontMatter(raw, name);
        for (const key of ['title', 'date', 'summary', 'tags', 'source', 'type']) {
            if (!meta[key]) fail(name, 'missing ' + key);
        }
        if (!isIsoDate(meta.date)) fail(name, 'date must be YYYY-MM-DD');
        if (!TYPES[meta.type]) fail(name, 'type must be method, workflow, or research-note');
        const status = meta.status || 'placeholder';
        if (!['placeholder', 'published', 'unreviewed'].includes(status)) fail(name, 'unknown status ' + status);
        if (status === 'published' && !/^https?:\/\//i.test(meta.source)) fail(name, 'published entries need an http(s) source');
        if (status === 'placeholder' && !body.includes('PLACEHOLDER')) fail(name, 'placeholder body must include the word PLACEHOLDER');
        if (status === 'published' && body.includes('PLACEHOLDER')) fail(name, 'published entry still contains PLACEHOLDER');
        const tags = [...new Set(meta.tags.split(',').map(tag => tagSlug(tag, name)))];
        if (!tags.length) fail(name, 'missing tags');
        entries.push({
            slug,
            raw,
            body,
            title: meta.title,
            titleZh: meta.titleZh || meta.title,
            date: meta.date,
            summary: meta.summary,
            summaryZh: meta.summaryZh || meta.summary,
            tags,
            source: meta.source,
            sourceLabel: meta.sourceLabel || meta.source,
            type: meta.type,
            typeLabel: TYPES[meta.type],
            status
        });
    }
    entries.sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
    return entries;
}

function fill(template, values) {
    return template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
        if (!Object.prototype.hasOwnProperty.call(values, key)) throw new Error('Unknown Discover template token {{' + key + '}}');
        return String(values[key]);
    });
}

function tagLabel(slug) {
    return TAG_LABELS[slug] || { en: slug, zh: slug };
}

export function renderTopicAnchors(entries) {
    const topics = DISCOVER_TOPICS.map(topic => ({ ...topic }));
    const seen = new Set(topics.map(topic => topic.slug));
    for (const entry of entries) {
        for (const slug of entry.tags) {
            if (seen.has(slug)) continue;
            seen.add(slug);
            const label = tagLabel(slug);
            topics.push({ slug, en: label.en, zh: label.zh });
        }
    }
    return topics.map(topic => '<a id="tag-' + topic.slug + '" href="#discover-list" data-zh="' + escapeHtml(topic.zh) + '">' + escapeHtml(topic.en) + '</a>').join('\n');
}

function sourceHtml(entry) {
    const label = escapeHtml(entry.sourceLabel);
    if (/^https?:\/\//i.test(entry.source)) {
        return '<a href="' + escapeHtml(entry.source) + '" rel="noopener noreferrer">' + label + '</a>';
    }
    return '<span>' + label + '</span>';
}

function robots(entryOrEntries) {
    const published = Array.isArray(entryOrEntries)
        ? entryOrEntries.some(entry => entry.status === 'published')
        : entryOrEntries.status === 'published';
    return published ? '' : '<meta name="robots" content="noindex">';
}

function banner(entry) {
    if (entry.status === 'published') return '';
    if (entry.status === 'placeholder') {
        return '<p class="placeholder-banner" role="note"><strong>PLACEHOLDER.</strong> <span data-copy="placeholderBanner">This page is a scaffold stub, not a published Discover article.</span></p>';
    }
    return '<p class="placeholder-banner" role="note" data-copy="unreviewedBanner">Unreviewed draft. Not published content.</p>';
}

export function renderEntryCard(entry) {
    const flag = entry.status === 'published' ? '' : '<p class="placeholder-flag">' + (entry.status === 'placeholder' ? 'PLACEHOLDER' : 'UNREVIEWED') + '</p>';
    const tags = entry.tags.map(slug => {
        const label = tagLabel(slug);
        return '<a href="#tag-' + slug + '" data-zh="' + escapeHtml(label.zh) + '">' + escapeHtml(label.en) + '</a>';
    }).join('');
    return '<article class="discover-card">' + flag +
        '<p class="discover-meta"><time datetime="' + escapeHtml(entry.date) + '">' + escapeHtml(entry.date) + '</time><span data-zh="' + escapeHtml(entry.typeLabel.zh) + '">' + escapeHtml(entry.typeLabel.en) + '</span></p>' +
        '<h3><a href="./discover/' + entry.slug + '.html" data-zh="' + escapeHtml(entry.titleZh) + '">' + escapeHtml(entry.title) + '</a></h3>' +
        '<p data-zh="' + escapeHtml(entry.summaryZh) + '">' + escapeHtml(entry.summary) + '</p>' +
        '<p class="discover-source"><span data-copy="sourceLabel">Source</span> ' + sourceHtml(entry) + '</p>' +
        '<p class="discover-tags">' + tags + '</p></article>';
}

function scaffoldNote(entries) {
    if (!entries.length) return '<p class="source-note" data-copy="emptyDiscover">No published notes yet. This page is the Discover scaffold.</p>';
    if (entries.some(entry => entry.status !== 'published')) {
        return '<p class="source-note" data-copy="scaffoldNote">Entries marked PLACEHOLDER are not published writing. They keep the list and article template renderable.</p>';
    }
    return '';
}

function articleTags(entry) {
    return entry.tags.map(slug => {
        const label = tagLabel(slug);
        return '<a href="{{ROOT}}discover.html#tag-' + slug + '" data-zh="' + escapeHtml(label.zh) + '">' + escapeHtml(label.en) + '</a>';
    }).join('');
}

export function writeDiscover(contentDir, outDir, templates) {
    const entries = loadDiscoverEntries(join(contentDir, 'discover'));
    const listHtml = fill(templates.list, {
        ROOT: './',
        PAGE: 'discover.html',
        ROBOTS: robots(entries),
        TOPICS: renderTopicAnchors(entries),
        SCAFFOLD_NOTE: scaffoldNote(entries),
        ENTRIES: entries.map(renderEntryCard).join('\n')
    });
    writeFileSync(join(outDir, 'discover.html'), listHtml);
    mkdirSync(join(outDir, 'discover'), { recursive: true });
    const pages = ['discover.html'];
    for (const entry of entries) {
        const page = 'discover/' + entry.slug + '.html';
        const { html, toc } = renderDocument(entry.body, { root: '../' });
        const articleHtml = fill(templates.article, {
            ROOT: '../',
            PAGE: page,
            ROBOTS: robots(entry),
            TITLE: escapeHtml(entry.title),
            TITLE_ZH: escapeHtml(entry.titleZh),
            DESCRIPTION: escapeHtml(entry.summary),
            DESCRIPTION_ZH: escapeHtml(entry.summaryZh),
            BANNER: banner(entry),
            DATE: escapeHtml(entry.date),
            TYPE_EN: escapeHtml(entry.typeLabel.en),
            TYPE_ZH: escapeHtml(entry.typeLabel.zh),
            SOURCE: sourceHtml(entry),
            TAGS: fill(articleTags(entry), { ROOT: '../' }),
            CONTENT: html,
            TOC_BLOCK: toc
                ? '<aside class="document-sidebar"><details open class="toc"><summary data-copy="onThisPage">On this page</summary><nav aria-label="Document contents">' + toc + '</nav></details></aside>'
                : '',
            LAYOUT_CLASS: toc ? '' : ' document-layout-single',
            SLUG: entry.slug
        });
        writeFileSync(join(outDir, page), articleHtml);
        writeFileSync(join(outDir, 'discover', entry.slug + '.md'), entry.raw);
        pages.push(page);
    }
    return pages;
}
