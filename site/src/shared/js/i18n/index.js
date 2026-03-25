/**
 * Cyber-Taoist — Internationalization (i18n) Manager
 * Adapted from JS ClawHub I18nManager for static site.
 * Global script (not ES module).
 */

const I18nLocales = {};

const I18nManager = {
    STORAGE_KEY: 'cyber-taoist-locale',
    DEFAULT_LOCALE: 'zh-CN',
    SUPPORTED_LOCALES: ['zh-CN', 'en-US'],

    currentLocale: 'zh-CN',

    locales: I18nLocales,

    /**
     * Priority: localStorage > browser language > default
     */
    init() {
        const saved = localStorage.getItem(this.STORAGE_KEY);

        if (saved && this.SUPPORTED_LOCALES.includes(saved)) {
            this.currentLocale = saved;
        } else {
            const browserLang = navigator.language || navigator.userLanguage || '';
            this.currentLocale = browserLang.startsWith('zh') ? 'zh-CN' : 'en-US';
        }

        this.updateDOM();
        document.documentElement.lang = this.currentLocale;
        this._updateToggleUI();
    },

    setLocale(locale) {
        if (!this.SUPPORTED_LOCALES.includes(locale)) return;
        if (this.currentLocale === locale) return;

        this.currentLocale = locale;
        localStorage.setItem(this.STORAGE_KEY, locale);

        this.updateDOM();
        document.documentElement.lang = locale;
        this._updateToggleUI();

        window.dispatchEvent(new CustomEvent('localechange', {
            detail: { locale }
        }));
    },

    getLocale() {
        return this.currentLocale;
    },

    t(key, params = {}) {
        const pack = this.locales[this.currentLocale] || this.locales[this.DEFAULT_LOCALE];
        if (!pack) return key;

        const keys = key.split('.');
        let value = pack;

        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                if (this.currentLocale !== this.DEFAULT_LOCALE) {
                    return this._getFallback(key, params);
                }
                return key;
            }
        }

        if (typeof value !== 'string') return key;
        return this._interpolate(value, params);
    },

    updateDOM() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (key) el.textContent = this.t(key);
        });

        document.querySelectorAll('[data-i18n-html]').forEach(el => {
            const key = el.getAttribute('data-i18n-html');
            if (key) el.innerHTML = this.t(key);
        });

        document.querySelectorAll('[data-i18n-title]').forEach(el => {
            const key = el.getAttribute('data-i18n-title');
            if (key) el.title = this.t(key);
        });

        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (key) el.placeholder = this.t(key);
        });

        document.querySelectorAll('[data-i18n-aria]').forEach(el => {
            const key = el.getAttribute('data-i18n-aria');
            if (key) el.setAttribute('aria-label', this.t(key));
        });
    },

    _getFallback(key, params) {
        const pack = this.locales[this.DEFAULT_LOCALE];
        if (!pack) return key;

        const keys = key.split('.');
        let value = pack;

        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                return key;
            }
        }

        if (typeof value !== 'string') return key;
        return this._interpolate(value, params);
    },

    _interpolate(str, params) {
        if (!params || Object.keys(params).length === 0) return str;
        return str.replace(/\{(\w+)\}/g, (match, k) => {
            return k in params ? params[k] : match;
        });
    },

    _updateToggleUI() {
        const toggle = document.getElementById('lang-toggle');
        if (toggle) {
            toggle.textContent = this.currentLocale === 'zh-CN' ? 'EN' : '中';
        }
    }
};

window.I18nManager = I18nManager;
window.I18nLocales = I18nLocales;
