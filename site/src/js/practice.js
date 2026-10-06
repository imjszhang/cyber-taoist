/* A private, local notebook for the first practice. No account or service needed. */
(() => {
    'use strict';

    const STORAGE_KEY = 'cyber-taoist-practice-v1';
    const FIELDS = ['question', 'judgment', 'experiment', 'signal', 'reviewDate'];
    const COPY = {
        en: {
            eyebrow: 'A SMALL PRACTICE',
            title: 'Give one idea a reality check.',
            intro: 'Start with something that matters to you. Make the next step small enough to try.',
            privacy: 'No account. No upload. Drafts are saved only in this browser, on this device. Download a copy to keep it elsewhere.',
            close: 'Close notebook',
            question: 'What question are you working on?',
            questionHint: 'Choose a real decision, a recurring difficulty, or something you want to understand.',
            questionPlaceholder: 'For example: will a weekly review help me finish a project?',
            judgment: 'What do you believe, and why?',
            judgmentHint: 'Write your current judgment and the evidence behind it. It can be provisional.',
            judgmentPlaceholder: 'I currently think… My evidence is…',
            experiment: 'What is one small experiment?',
            experimentHint: 'Pick an action you can take with a cost you can afford.',
            experimentPlaceholder: 'This week, I will try…',
            signal: 'What would change your mind?',
            signalHint: 'Name a result that would challenge your judgment or call for a different approach.',
            signalPlaceholder: 'I will reconsider if…',
            reviewDate: 'When will you come back to this?',
            reviewDateHint: 'Choose a review date. This notebook does not send reminders.',
            download: 'Download Markdown',
            copy: 'Copy notes',
            clear: 'Clear draft',
            confirmClear: 'Clear this draft from this browser? This cannot be undone. Download a copy first if you want to keep it.',
            ready: 'Your draft will save here as you write.',
            saving: 'Saving draft…',
            saved: 'Saved in this browser.',
            restored: 'Your draft has been restored.',
            cleared: 'Draft cleared.',
            storageError: 'This browser could not save your draft. Keep this window open and download or copy your notes.',
            readError: 'Your saved draft could not be read. New notes can still be downloaded or copied.',
            clearError: 'The saved draft could not be cleared. Your notes are still here.',
            copying: 'Copying notes…',
            copied: 'Notes copied.',
            copyError: 'Copy was unavailable. Download your notes instead.',
            downloaded: 'Download started. Check your browser’s downloads.',
            downloadError: 'Download was unavailable. Try copying your notes instead.',
            markdownTitle: 'Cyber-Taoist · A small practice',
            empty: 'Not yet written',
        },
        zh: {
            eyebrow: '从一次小实践开始',
            title: '让一个想法，接受现实的检验。',
            intro: '从你真正关心的事出发，把下一步缩小到可以动手尝试。',
            privacy: '无需账号，不会上传。草稿仅保存在当前设备的此浏览器中；如需另存，请下载一份。',
            close: '关闭实践笔记',
            question: '你正在面对什么问题？',
            questionHint: '选择一个真实的决定、反复遇到的困难，或想弄明白的事。',
            questionPlaceholder: '例如：每周复盘是否能帮助我完成一个项目？',
            judgment: '你现在相信什么，依据是什么？',
            judgmentHint: '写下目前的判断和支持它的证据。它可以只是一个暂时的看法。',
            judgmentPlaceholder: '我目前认为……依据是……',
            experiment: '你能做一个什么样的小尝试？',
            experimentHint: '选择一个可以行动、代价也能够承受的尝试。',
            experimentPlaceholder: '这周，我会尝试……',
            signal: '什么结果会让你改变看法？',
            signalHint: '写下一种可能挑战当前判断，或让你调整方法的结果。',
            signalPlaceholder: '如果出现……我会重新考虑。',
            reviewDate: '你什么时候回来检查？',
            reviewDateHint: '选择复盘日期。此笔记不会发送提醒。',
            download: '下载 Markdown',
            copy: '复制笔记',
            clear: '清空草稿',
            confirmClear: '确定清空此浏览器中的草稿吗？此操作无法撤销。如需保留，请先下载一份。',
            ready: '开始书写后，草稿会自动保存在这里。',
            saving: '正在保存草稿……',
            saved: '已保存在此浏览器中。',
            restored: '已恢复你的草稿。',
            cleared: '草稿已清空。',
            storageError: '此浏览器无法保存草稿。请保持窗口打开，并下载或复制你的笔记。',
            readError: '无法读取已保存的草稿。你仍可以下载或复制新笔记。',
            clearError: '无法清空已保存的草稿。你的笔记仍保留在这里。',
            copying: '正在复制笔记……',
            copied: '笔记已复制。',
            copyError: '无法复制。请改用下载保存笔记。',
            downloaded: '下载已开始，请查看浏览器的下载列表。',
            downloadError: '无法下载。请尝试复制笔记。',
            markdownTitle: 'Cyber-Taoist · 一次小实践',
            empty: '尚未填写',
        },
    };

    let dialog;
    let opener;
    let previousOverflow;
    let saveTimer;
    let saveState = 'ready';
    let actionState = '';
    let draft = Object.fromEntries(FIELDS.map(key => [key, '']));

    function copy() {
        return COPY[document.documentElement.lang.toLowerCase().startsWith('zh') ? 'zh' : 'en'];
    }

    function updateStatus() {
        if (!dialog) return;
        const text = copy();
        const status = dialog.querySelector('[data-practice-save-status]');
        status.textContent = text[saveState];
        status.classList.toggle('practice-notebook__status--error', saveState.endsWith('Error'));
        const action = dialog.querySelector('[data-practice-action-status]');
        action.textContent = text[actionState] || '';
        action.classList.toggle('practice-notebook__status--error', actionState.endsWith('Error'));
    }

    function localize() {
        if (!dialog) return;
        const text = copy();
        dialog.lang = document.documentElement.lang || 'en';
        dialog.querySelectorAll('[data-practice-text]').forEach(el => {
            el.textContent = text[el.dataset.practiceText];
        });
        dialog.querySelectorAll('[data-practice-placeholder]').forEach(el => {
            el.placeholder = text[el.dataset.practicePlaceholder];
        });
        dialog.querySelector('[data-practice-close]').setAttribute('aria-label', text.close);
        updateStatus();
    }

    function readDraft() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (!saved) return;
            const parsed = JSON.parse(saved);
            if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('Invalid draft');
            FIELDS.forEach(key => {
                draft[key] = typeof parsed[key] === 'string' ? parsed[key] : '';
            });
            saveState = 'restored';
        } catch (_) {
            saveState = 'readError';
        }
    }

    function saveDraft() {
        clearTimeout(saveTimer);
        saveTimer = undefined;
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
            saveState = 'saved';
        } catch (_) {
            saveState = 'storageError';
        }
        updateStatus();
    }

    function flushSave() {
        if (saveTimer !== undefined) saveDraft();
    }

    function markdown() {
        const text = copy();
        return '# ' + text.markdownTitle + '\n\n' + FIELDS.map((key, index) => (
            '## ' + (index + 1) + '. ' + text[key] + '\n\n' + (draft[key].trim() || text.empty)
        )).join('\n\n') + '\n';
    }

    function downloadNotes() {
        flushSave();
        let url;
        let link;
        try {
            url = URL.createObjectURL(new Blob([markdown()], { type: 'text/markdown;charset=utf-8' }));
            link = document.createElement('a');
            link.href = url;
            link.download = 'cyber-taoist-practice-' + new Date().toISOString().slice(0, 10) + '.md';
            document.body.append(link);
            link.click();
            actionState = 'downloaded';
        } catch (_) {
            actionState = 'downloadError';
        } finally {
            if (link) link.remove();
            if (url) setTimeout(() => URL.revokeObjectURL(url), 1000);
        }
        updateStatus();
    }

    async function copyNotes() {
        flushSave();
        actionState = 'copying';
        updateStatus();
        try {
            if (!navigator.clipboard || !navigator.clipboard.writeText) throw new Error('Clipboard unavailable');
            await navigator.clipboard.writeText(markdown());
            actionState = 'copied';
        } catch (_) {
            actionState = 'copyError';
        }
        updateStatus();
    }

    function clearDraft() {
        if (!window.confirm(copy().confirmClear)) return;
        clearTimeout(saveTimer);
        saveTimer = undefined;
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch (_) {
            saveState = 'clearError';
            updateStatus();
            return;
        }
        FIELDS.forEach(key => {
            draft[key] = '';
            dialog.querySelector('[name="' + key + '"]').value = '';
        });
        saveState = 'cleared';
        actionState = '';
        updateStatus();
        dialog.querySelector('[name="question"]').focus();
    }

    function buildDialog() {
        readDraft();
        dialog = document.createElement('dialog');
        dialog.className = 'practice-notebook';
        dialog.setAttribute('aria-labelledby', 'practice-notebook-title');
        dialog.setAttribute('aria-describedby', 'practice-notebook-intro');
        dialog.innerHTML = `
            <div class="practice-notebook__body">
                <button type="button" class="practice-notebook__close" data-practice-close><span aria-hidden="true">×</span></button>
                <p class="practice-notebook__eyebrow" data-practice-text="eyebrow"></p>
                <h2 id="practice-notebook-title" data-practice-text="title"></h2>
                <p id="practice-notebook-intro" class="practice-notebook__intro" data-practice-text="intro"></p>
                <form class="practice-notebook__form">
                    ${FIELDS.map((key, index) => `
                        <div class="practice-notebook__field">
                            <label for="practice-${key}"><span class="practice-notebook__number" aria-hidden="true">0${index + 1}</span><span data-practice-text="${key}"></span></label>
                            <p id="practice-${key}-hint" class="practice-notebook__hint" data-practice-text="${key}Hint"></p>
                            ${key === 'reviewDate'
                                ? `<input type="date" id="practice-${key}" name="${key}" aria-describedby="practice-${key}-hint">`
                                : `<textarea id="practice-${key}" name="${key}" rows="3" aria-describedby="practice-${key}-hint" data-practice-placeholder="${key}Placeholder"${index === 0 ? ' autofocus' : ''}></textarea>`}
                        </div>
                    `).join('')}
                </form>
                <div class="practice-notebook__saving" role="status" aria-live="polite" aria-atomic="true" data-practice-save-status></div>
                <div class="practice-notebook__actions">
                    <button type="button" class="practice-notebook__button practice-notebook__button--primary" data-practice-download data-practice-text="download"></button>
                    <button type="button" class="practice-notebook__button" data-practice-copy data-practice-text="copy"></button>
                    <button type="button" class="practice-notebook__clear" data-practice-clear data-practice-text="clear"></button>
                </div>
                <div class="practice-notebook__feedback" role="status" aria-live="polite" aria-atomic="true" data-practice-action-status></div>
                <p class="practice-notebook__privacy" data-practice-text="privacy"></p>
            </div>`;
        document.body.append(dialog);
        FIELDS.forEach(key => {
            dialog.querySelector('[name="' + key + '"]').value = draft[key];
        });
        dialog.querySelector('form').addEventListener('submit', event => event.preventDefault());
        dialog.querySelector('form').addEventListener('input', event => {
            if (!FIELDS.includes(event.target.name)) return;
            draft[event.target.name] = event.target.value;
            saveState = 'saving';
            actionState = '';
            updateStatus();
            clearTimeout(saveTimer);
            saveTimer = setTimeout(saveDraft, 350);
        });
        dialog.querySelector('form').addEventListener('change', flushSave);
        dialog.querySelector('[data-practice-close]').addEventListener('click', () => dialog.close());
        dialog.querySelector('[data-practice-download]').addEventListener('click', downloadNotes);
        dialog.querySelector('[data-practice-copy]').addEventListener('click', copyNotes);
        dialog.querySelector('[data-practice-clear]').addEventListener('click', clearDraft);
        dialog.addEventListener('close', () => {
            flushSave();
            document.body.style.overflow = previousOverflow;
            if (opener && opener.isConnected) opener.focus({ preventScroll: true });
        });
        window.addEventListener('pagehide', flushSave);
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') flushSave();
        });
        localize();
    }

    document.addEventListener('click', event => {
        const trigger = event.target instanceof Element && event.target.closest('[data-open-practice]');
        if (!trigger) return;
        event.preventDefault();
        if (!dialog) buildDialog();
        if (dialog.open) return;
        opener = trigger;
        localize();
        previousOverflow = document.body.style.overflow;
        dialog.showModal();
        document.body.style.overflow = 'hidden';
    });
    window.addEventListener('localechange', localize);
})();
