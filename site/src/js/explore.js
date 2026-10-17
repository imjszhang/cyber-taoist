/* Discover and Newsletter pages. English first, sharing the homepage locale key. */
(() => {
    const storageKey = 'cyber-taoist-locale';
    const english = {};
    document.querySelectorAll('[data-copy]').forEach(el => {
        if (!(el.dataset.copy in english)) english[el.dataset.copy] = el.innerHTML;
    });
    const chinese = {
        skip: '跳至正文',
        brandNote: 'AI × 个人知识',
        navPractice: '实践',
        navPhilosophy: '思想',
        navDiscover: '发现',
        navNewsletter: '周刊',
        navHome: '首页',
        footerNote: '在实践中，成为你选择成为的人。',
        backTop: '返回顶部 ↑',
        backHome: '← 返回首页',
        backDiscover: '← 返回发现',
        discoverEyebrow: '发现 / AI × 个人知识',
        discoverTitle: '发现',
        discoverLead: '方法解读、工作流笔记和研究札记会列在这里。这一版是脚手架，不是已发布的档案。',
        topicsTitle: '主题',
        topicsNote: '这些锚点只是入口，不会藏起其他条目。',
        scaffoldNote: '标成 PLACEHOLDER 的条目不是已发表的文章。它们只是为了让列表和文章模板能够渲染。',
        emptyDiscover: '还没有已发布的笔记。这个页面是 Discover 的脚手架。',
        sourceLabel: '来源',
        dateLabel: '日期',
        typeLabel: '类型',
        tagsLabel: '标签',
        markdownSource: 'Markdown 源文件',
        onThisPage: '本文目录',
        placeholderBanner: '这个页面是脚手架占位，不是已发布的 Discover 文章。',
        unreviewedBanner: '未经审阅的草稿，不是已发布内容。',
        newsletterEyebrow: '周刊',
        newsletterTitle: 'AI × PKM Weekly',
        newsletterLead: '一封关于把 AI 用进个人知识实践的短周报。',
        valueTitle: '这封信打算做什么',
        value1: '一个可以放进自己笔记里试的想法',
        value2: '带来源，而不是把整个互联网再讲一遍',
        value3: '留出空间，不合适的可以放下',
        formTitle: '订阅',
        emailLabel: '邮箱',
        subscribe: '订阅 — 尚未接入',
        formNote: '订阅暂时故意不接入。你输入的内容不会被发送。',
        relatedDiscover: '去 Discover'
    };

    let locale = 'en-US';
    try {
        if (localStorage.getItem(storageKey) === 'zh-CN') locale = 'zh-CN';
    } catch { /* The page works without browser storage. */ }

    function setLocale(next, persist = true) {
        locale = next;
        const zh = locale === 'zh-CN';
        const copy = zh ? chinese : english;
        document.documentElement.lang = zh ? 'zh-CN' : 'en';
        document.querySelectorAll('[data-copy]').forEach(el => {
            el.innerHTML = copy[el.dataset.copy] ?? english[el.dataset.copy];
        });
        document.querySelectorAll('[data-zh]').forEach(el => {
            if (!el.dataset.en) el.dataset.en = el.textContent;
            el.textContent = zh && el.dataset.zh ? el.dataset.zh : el.dataset.en;
        });
        document.querySelectorAll('[data-language]').forEach(button => {
            button.textContent = zh ? 'EN' : 'ZH';
            button.setAttribute('aria-label', zh ? 'Switch to English' : '切换为中文');
        });
        document.querySelectorAll('.main-nav').forEach(nav => nav.setAttribute('aria-label', zh ? '主导航' : 'Main navigation'));
        document.querySelectorAll('.footer-inner nav').forEach(nav => nav.setAttribute('aria-label', zh ? '页脚导航' : 'Footer navigation'));
        const title = zh ? document.body.dataset.titleZh : document.body.dataset.titleEn;
        if (title) {
            document.title = title;
            const ogTitle = document.querySelector('meta[property="og:title"]');
            if (ogTitle) ogTitle.content = title;
        }
        const description = zh ? document.body.dataset.descriptionZh : document.body.dataset.descriptionEn;
        if (description) {
            const meta = document.querySelector('meta[name="description"]');
            const og = document.querySelector('meta[property="og:description"]');
            if (meta) meta.content = description;
            if (og) og.content = description;
        }
        if (persist) {
            try { localStorage.setItem(storageKey, locale); } catch { /* Optional preference. */ }
        }
    }

    document.querySelectorAll('[data-language]').forEach(button => button.addEventListener('click', () => {
        setLocale(locale === 'en-US' ? 'zh-CN' : 'en-US');
    }));
    setLocale(locale, false);
    if (matchMedia('(max-width: 650px)').matches) document.querySelector('.toc')?.removeAttribute('open');
})();
