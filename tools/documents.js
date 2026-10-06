import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { Marked } from 'marked';

export const DOCUMENTS = [
    { source: 'GUIDE.md', page: 'guide.html', title: 'Practice guide', titleZh: '实践指南', description: 'The Cyber-Taoism practice guide: observe consequences, examine rules, and design deliberate experiments.' },
    { source: 'DAO-DE-JING-CYBERTAOIST.md', page: 'commentary.html', title: 'Tao Te Ching commentary', titleZh: '道德经注疏', description: 'A complete commentary on the 81 chapters of the Tao Te Ching through the lens of cybernetic feedback.' },
    { source: 'DAO-DE-JING.md', page: 'tao-te-ching.html', title: 'Tao Te Ching', titleZh: '道德经原文', description: 'The original Chinese Tao Te Ching text in the Cyber-Taoism library.' },
    { source: 'CONSTITUTION.md', page: 'charter.html', title: 'The charter', titleZh: '思想宪章', description: 'The original Chinese charter of Cyber-Taoism, preserved in full.' }
];
export const escapeHtml = text => String(text).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

export function renderDocument(markdown) {
    const toc = [];
    const ids = new Map();
    const parser = new Marked({
        gfm: true,
        renderer: {
            heading({tokens, depth}) {
                const content = this.parser.parseInline(tokens);
                const plain = content.replace(/<[^>]*>/g, '');
                const base = plain.toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, '').trim().replace(/\s+/g, '-') || 'section';
                const count = ids.get(base) || 0;
                ids.set(base, count + 1);
                const id = count ? base + '-' + count : base;
                if (depth === 2 || depth === 3) toc.push({ id, text: plain, depth });
                return '<h' + depth + ' id="' + escapeHtml(id) + '">' + content + '</h' + depth + '>\n';
            },
            link({ href, title, tokens }) {
                const route = DOCUMENTS.find(doc => doc.source === href);
                const safeHref = /^(?:https?:|mailto:|#|\.?\.?\/|[A-Za-z0-9])/i.test(href) && !/^(?:javascript|data|vbscript):/i.test(href);
                return safeHref
                    ? '<a href="' + escapeHtml(route ? './' + route.page : href) + '"' + (title ? ' title="' + escapeHtml(title) + '"' : '') + '>' + this.parser.parseInline(tokens) + '</a>'
                    : this.parser.parseInline(tokens);
            }
        }
    });
    // Source documents are repository-owned Markdown. Preserve their text and layout.
    const html = parser.parse(markdown).replace(/<table>/g, '<div class="table-scroll"><table>').replace(/<\/table>/g, '</table></div>');
    return { html, toc: toc.map(item => '<a class="' + (item.depth === 3 ? 'toc-sub' : 'toc-main') + '" href="#' + escapeHtml(item.id) + '">' + escapeHtml(item.text) + '</a>').join('\n') };
}

export function writeDocuments(contentDir, outDir, template) {
    for (const doc of DOCUMENTS) {
        const {html, toc} = renderDocument(readFileSync(join(contentDir, doc.source), 'utf8'));
        const values = { TITLE: escapeHtml(doc.title), TITLE_ZH: escapeHtml(doc.titleZh), DESCRIPTION: escapeHtml(doc.description), PAGE: doc.page, SOURCE: doc.source, CONTENT: html, TOC: toc };
        writeFileSync(join(outDir, doc.page), template.replace(/\{\{(\w+)\}\}/g, (_, key) => values[key] ?? ''));
    }
}
