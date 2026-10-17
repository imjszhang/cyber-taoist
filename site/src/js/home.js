/* Identity homepage: English first, with a remembered Chinese alternative. */
(() => {
    const key = 'cyber-taoist-locale';
    const english = {};
    document.querySelectorAll('[data-copy]').forEach(el => {
        if (!(el.dataset.copy in english)) english[el.dataset.copy] = el.innerHTML;
    });
    const chinese = {
        skip: '跳至正文',
        brandNote: '技术 × 自我 × 更多可能',
        navPractice: '实践', navPhilosophy: '思想', navDiscover: '发现', navNewsletter: '周刊', navAbout: '关于',
        eyebrow: '赛博道者 / A WAY OF BEING',
        heroLine1: '借技术', heroLine2: '拓展可能', heroLine3: '在变化中走自己的路',
        heroDescription: 'Cyber-Taoist，是借助技术拓展自身，在实践中感知变化、修正方法，探索自身道路的人。',
        start: '开始一次实践', meet: '认识 Cyber-Taoist',
        heroFootnote: '有自己的判断，也有改变的余地。',
        artNote: '观察变化。<br>保持好奇。<br>走自己的路。',
        identityTitle: '我们如何面对世界', identityAside: '技术是工具，生活赋予它意义。',
        principle1: '借助技术', principle1Body: '让工具扩展能力，让判断留在自己手里。',
        principle2: '回应现实', principle2Body: '把想法付诸行动，从结果中修正方法。',
        principle3: '保留余地', principle3Body: '守住重要的事，为未知留出尝试的空间。',
        practiceTitle: '从一个真实问题开始', practiceSubtitle: '把读到的观点，变成自己的判断。',
        rockNote: '问题<br>是起点。',
        exampleLabel: '实践示意 / 个人知识管理', exampleTitle: '一条观点，如何成为一次行动？',
        flow1: '材料', flow2: '判断', flow3: '行动', flow4: '反馈', flow5: '修正',
        explore: '查看实践路径', exampleContext: '这是一个实验示例，不是已经发生的成果记录。',
        storyQuestion: '问题', storyQuestionBody: '用自己的话写一则短笔记，是否能帮助我用上读过的内容？',
        storyTry: '尝试', storyTryBody: '本周选三篇文章。每读完一篇，写下一条观点、来源和一种可能的用途。',
        storyObserve: '反馈', storyObserveBody: '一周后检查：有没有一则笔记帮助自己做了一个决定，或完成了一件工作？',
        storyRevise: '修正', storyReviseBody: '如果笔记没有用上，就调整记录方式或问题本身。留下真正有用的部分。',
        tryOwn: '试试自己的问题',
        firstTitle: '你的第一次实践', firstSubtitle: '选一个正在面对的问题，开始一次小尝试。',
        step1: '写下判断与依据', step2: '做一次可承受的尝试', step3: '约定回看与修正的时间', begin: '开始记录',
        philosophySubtitle: '支撑实践的思想', philosophyBasis: '控制论反馈 × 道家自然观',
        philosophyBody: '理解变化。<br>更清醒地生活与创造。',
        charter: '思想宪章', guide: '实践指南', commentary: '道德经注疏',
        exploreTitle: '探索', exploreAside: '占位文案。这一版还没有已发布的笔记。',
        exploreLatestLabel: '最新发现', exploreLatestTitle: 'Discover',
        exploreLatestBody: '关于 AI 与个人知识的方法、工作流和研究札记，以后放在这里。',
        exploreTopicsLabel: '主题', exploreTopicsTitle: 'AI × 个人知识',
        exploreTopicBrain: 'AI Second Brain', exploreTopicCodex: 'Codex × 个人知识管理', exploreTopicTools: '思考工具',
        exploreTopicsNote: '这些链接先跳到 Discover 的主题锚点，还不能筛选。',
        exploreNewsLabel: '周刊', exploreNewsTitle: 'AI × PKM Weekly',
        exploreNewsBody: '一封周报。订阅表单目前只是占位。',
        footerNote: '在实践中，成为你选择成为的人。',
        aboutEyebrow: '一种面对世界的方式',
        aboutBody: 'Cyber-Taoist，是借助技术、回应现实并保留改变余地的人可以认领的共同身份。Cyber-Taoism 是支撑这种实践、持续发展的思想体系。',
        aboutInvite: '从一个问题和一次小尝试开始。你可以对其中的论述保留不同看法，探索自己的道路。',
        aboutCredit: '由 @imjszhang 发起的开放项目。', readPhilosophy: '深入阅读思想 ↗'
    };
    let locale = 'en-US';
    try {
        if (localStorage.getItem(key) === 'zh-CN') locale = 'zh-CN';
    } catch { /* The page and controls also work without browser storage. */ }

    function setLocale(next, persist = true) {
        locale = next;
        const zh = locale === 'zh-CN';
        const copy = zh ? chinese : english;
        document.documentElement.lang = zh ? 'zh-CN' : 'en';
        document.querySelectorAll('[data-copy]').forEach(el => {
            // Both dictionaries are trusted, authored static text; no user input is rendered here.
            el.innerHTML = copy[el.dataset.copy] ?? english[el.dataset.copy];
        });
        document.querySelectorAll('[data-language]').forEach(button => {
            button.textContent = zh ? 'EN' : 'ZH';
            button.setAttribute('aria-label', zh ? 'Switch to English' : '切换为中文');
        });
        document.querySelector('[data-close-about]').setAttribute('aria-label', zh ? '关闭' : 'Close');
        document.querySelector('.main-nav').setAttribute('aria-label', zh ? '主导航' : 'Main navigation');
        document.querySelector('.footer-inner nav').setAttribute('aria-label', zh ? '页脚导航' : 'Footer navigation');
        document.querySelector('.practice-flow').setAttribute('aria-label', zh ? '实践过程' : 'Practice process');
        const title = zh ? 'Cyber-Taoist — 在变化中走自己的路' : 'Cyber-Taoist — Find your own way';
        document.title = title;
        document.querySelector('meta[property="og:title"]').content = title;
        document.querySelector('meta[name="description"]').content = copy.heroDescription;
        document.querySelector('meta[property="og:description"]').content = copy.heroDescription;
        if (persist) {
            try { localStorage.setItem(key, locale); } catch { /* Optional preference. */ }
        }
        window.dispatchEvent(new CustomEvent('localechange', { detail: { locale } }));
    }
    document.querySelectorAll('[data-language]').forEach(button => button.addEventListener('click', () => {
        setLocale(locale === 'en-US' ? 'zh-CN' : 'en-US');
    }));
    setLocale(locale);

    const about = document.getElementById('about-dialog');
    let aboutTrigger;
    document.querySelectorAll('[data-open-about]').forEach(button => button.addEventListener('click', () => {
        aboutTrigger = button;
        about.showModal();
    }));
    document.querySelector('[data-close-about]').addEventListener('click', () => about.close());
    about.addEventListener('click', event => {
        if (event.target !== about) return;
        const rect = about.getBoundingClientRect();
        if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) about.close();
    });
    about.addEventListener('close', () => aboutTrigger?.focus());
})();
