(() => {
    const en = {};
    document.querySelectorAll('[data-reader]').forEach(el => { en[el.dataset.reader] = el.textContent; });
    const zh = {
        practice: '实践', philosophy: '思想', home: '首页', skip: '跳至正文',
        footer: '在实践中，成为你选择成为的人。', top: '返回顶部 ↑',
        back: '← 返回首页', backPhilosophy: '← 返回思想页',
        eyebrow: '实践背后的思想', basis: '控制论反馈 × 道家自然观。',
        intro: '观察变化，理解规则的边界，让行动与反馈指引下一步。',
        readCharter: '阅读宪章 ↓', readGuide: '探索实践指南 ↗', continue: '继续探索',
        protocol: '实践 / 分析协议', guideTitle: '实践指南',
        guideDesc: '从观察到的后果出发，设计一次小而明确的尝试。',
        commentaryLabel: '注疏 / 八十一章', commentaryTitle: '道德经注疏',
        commentaryDesc: '探索道家思想与控制论反馈之间的对话。',
        agentDesc: '对行动、验证和反馈的开源工程探索。',
        sourceNote: '以下完整保留中文原始文档。', download: '下载 Markdown ↗',
        copy: '复制原文', contents: '本文目录'
    };
    let locale = 'en-US';
    try { if (localStorage.getItem('cyber-taoist-locale') === 'zh-CN') locale = 'zh-CN'; } catch {}
    function applyLocale() {
        const isZh = locale === 'zh-CN';
        document.documentElement.lang = isZh ? 'zh-CN' : 'en';
        document.querySelectorAll('[data-reader]').forEach(el => { el.textContent = (isZh ? zh : en)[el.dataset.reader] || en[el.dataset.reader]; });
        const toggle = document.getElementById('reader-language');
        toggle.textContent = isZh ? 'EN' : 'ZH';
        toggle.setAttribute('aria-label', isZh ? 'Switch to English' : '切换为中文');
        if (window.I18nManager) {
            I18nManager.currentLocale = locale;
            I18nManager.updateDOM();
        }
        const documentTitle = document.body.dataset.documentTitle;
        const title = documentTitle
            ? (isZh ? document.body.dataset.documentTitleZh : documentTitle) + ' — Cyber-Taoism'
            : 'Cyber-Taoism — ' + (isZh ? '思想体系' : 'Philosophy');
        document.title = title;
        document.querySelector('meta[property="og:title"]').content = title;
        const heading = document.querySelector('[data-document-heading]');
        if (heading) heading.textContent = isZh ? document.body.dataset.documentTitleZh : documentTitle;
        try { localStorage.setItem('cyber-taoist-locale', locale); } catch {}
    }
    document.getElementById('reader-language').addEventListener('click', () => {
        locale = locale === 'zh-CN' ? 'en-US' : 'zh-CN';
        applyLocale();
    });
    applyLocale();

    function notify(success, element = document.querySelector('.copy-status') || document.getElementById('copy-toast')) {
        if (!element) return;
        element.setAttribute('role', 'status');
        element.textContent = locale === 'zh-CN'
            ? (success ? '已复制。' : '无法复制，请下载原文。')
            : (success ? 'Copied.' : 'Copy unavailable. Download the source instead.');
        element.style.opacity = '1';
    }
    async function copyText(text) {
        try {
            await navigator.clipboard.writeText(text);
            notify(true);
        } catch { notify(false); }
    }
    window.copyConstitutionText = () => {
        const content = document.querySelector('#constitution .space-y-3');
        if (content) copyText(content.innerText.replace(/^\$\s*cat CONSTITUTION\.md.*\n?/, '').replace(/_\s*$/, '').trim());
    };
    window.copyConstitutionLink = () => copyText(new URL('./CONSTITUTION.md', location.href).href);
    document.querySelectorAll('[data-copy-source]').forEach(button => button.addEventListener('click', async () => {
        try {
            const response = await fetch(new URL(button.dataset.copySource, location.href));
            if (!response.ok) throw new Error('Source unavailable');
            await copyText(await response.text());
        } catch { notify(false); }
    }));
    // The long table of contents starts collapsed on small screens.
    if (matchMedia('(max-width: 650px)').matches) document.querySelector('.toc')?.removeAttribute('open');
})();
