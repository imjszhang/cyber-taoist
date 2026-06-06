const SCHEME_KEY = 'cyber-taoist-scheme';

function setScheme(scheme) {
    document.documentElement.setAttribute('data-scheme', scheme);
    localStorage.setItem(SCHEME_KEY, scheme);
    document.querySelectorAll('.scheme-btn').forEach(b =>
        b.classList.toggle('active', b.dataset.scheme === scheme)
    );
    if (typeof setThreeScheme === 'function') {
        setThreeScheme(scheme);
    }
}

function toggleLocale() {
    const next = I18nManager.getLocale() === 'zh-CN' ? 'en-US' : 'zh-CN';
    I18nManager.setLocale(next);
    document.title = I18nManager.t('meta.title');
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.content = I18nManager.t('meta.desc');
}

// Restore saved scheme or keep default (dark)
(function() {
    const saved = localStorage.getItem(SCHEME_KEY);
    if (saved && ['daylight', 'dark'].includes(saved)) {
        setScheme(saved);
    }
})();

// Init i18n
I18nManager.init();
document.title = I18nManager.t('meta.title');

window.addEventListener('localechange', function() {
    document.title = I18nManager.t('meta.title');
    var metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.content = I18nManager.t('meta.desc');
});

function showCopyToast(msgKey) {
    var toast = document.getElementById('copy-toast');
    toast.textContent = I18nManager.t(msgKey);
    toast.style.opacity = '1';
    clearTimeout(toast._timer);
    toast._timer = setTimeout(function() { toast.style.opacity = '0'; }, 1800);
}

function copyConstitutionText() {
    var el = document.querySelector('#constitution .brutal-terminal .space-y-3');
    if (!el) return;
    var text = el.innerText.replace(/^\$\s*cat CONSTITUTION\.md.*\n?/, '').replace(/^_\s*$/, '').trim();
    navigator.clipboard.writeText(text).then(function() {
        showCopyToast('constitution.toastTextCopied');
    });
}

function copyConstitutionLink() {
    var link = location.origin + '/CONSTITUTION.md';
    navigator.clipboard.writeText(link).then(function() {
        showCopyToast('constitution.toastLinkCopied');
    });
}

function showSkillToast(msgKey) {
    var toast = document.getElementById('skill-toast');
    toast.textContent = I18nManager.t(msgKey);
    toast.style.opacity = '1';
    clearTimeout(toast._timer);
    toast._timer = setTimeout(function() { toast.style.opacity = '0'; }, 1800);
}

function copySkillFullText() {
    fetch(new URL('GUIDE.md', location.href), { cache: 'no-cache' })
        .then(function(r) {
            if (!r.ok) throw new Error('fetch');
            return r.text();
        })
        .then(function(text) {
            return navigator.clipboard.writeText(text.trim());
        })
        .then(function() {
            showSkillToast('works.toastSkillTextCopied');
        })
        .catch(function() {
            showSkillToast('works.toastSkillTextFailed');
        });
}

function copySkillLink() {
    var link = location.origin + '/GUIDE.md';
    navigator.clipboard.writeText(link).then(function() {
        showSkillToast('works.toastSkillLinkCopied');
    });
}

