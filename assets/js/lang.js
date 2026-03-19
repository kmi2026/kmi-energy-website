let translations = { zh: {}, en: {} };

async function loadTranslations() {
    try {
        const [zhRes, enRes] = await Promise.all([
            fetch('assets/data/zh.json'),
            fetch('assets/data/en.json')
        ]);
        translations.zh = await zhRes.json();
        translations.en = await enRes.json();
    } catch (error) {
        console.error('Failed to load translations:', error);
    }
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

function setCookie(name, value, days = 30) {
    const d = new Date();
    d.setTime(d.getTime() + (days*24*60*60*1000));
    document.cookie = `${name}=${value};expires=${d.toUTCString()};path=/;SameSite=Lax`;
}

function updateTexts(lang) {
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    const uiTexts = document.querySelectorAll('[data-i18n]');
    uiTexts.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            el.innerHTML = translations[lang][key];
        } else {
            console.warn(`Missing translation for key: ${key}`);
        }
    });

    // Update document title
    if (translations[lang] && translations[lang]['site_title']) {
        document.title = translations[lang]['site_title'];
    }

    // Update language dropdown UI
    document.querySelectorAll('.lang-dropdown a').forEach(a => {
        if (a.getAttribute('data-lang') === lang) {
            a.classList.add('active');
        } else {
            a.classList.remove('active');
        }
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    await loadTranslations();
    // Determine user language
    let userLang = getCookie('preferred_lang');
    
    if (!userLang) {
        try {
            // Detect based on IP using free ipapi.co
            const response = await fetch('https://ipapi.co/json/');
            const data = await response.json();
            // Default to zh for China, HK, Macau, Taiwan
            const zhCountries = ['CN', 'HK', 'MO', 'TW'];
            if (zhCountries.includes(data.country_code)) {
                userLang = 'zh';
            } else {
                userLang = 'en';
            }
        } catch (error) {
            console.error('IP detection failed, defaulting to zh', error);
            userLang = 'zh';
        }
        // Save initial detection in cookie
        setCookie('preferred_lang', userLang);
    }

    updateTexts(userLang);

    // Language switcher toggle logic
    const langToggleBtn = document.querySelector('.lang-toggle');
    const langDropdown = document.querySelector('.lang-dropdown');
    
    if (langToggleBtn && langDropdown) {
        langToggleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            langDropdown.classList.toggle('show');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.lang-switcher')) {
                langDropdown.classList.remove('show');
            }
        });

        // Handle language selection
        const langLinks = langDropdown.querySelectorAll('a[data-lang]');
        langLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const selectedLang = link.getAttribute('data-lang');
                setCookie('preferred_lang', selectedLang);
                updateTexts(selectedLang);
                langDropdown.classList.remove('show');
            });
        });
    }
});
