/**
 * Author: YuanYuan
 * Project: KMI Energy Corporate Website
 */
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

function renderDynamicSliders(lang) {
    const swipers = document.querySelectorAll('.dynamic-swiper');
    swipers.forEach(swiperEl => {
        const listKey = swiperEl.getAttribute('data-list-key') || swiperEl.getAttribute('data-list');
        const dataList = translations[lang] && translations[lang][listKey];
        const wrapper = swiperEl.querySelector('.swiper-wrapper');
        
        if (!wrapper) return;
        
        if (!dataList || !Array.isArray(dataList)) {
            wrapper.innerHTML = '';
            return;
        }

        let html = '';
        dataList.forEach(item => {
            let imgHtml = item.image 
                ? `<img src="${item.image}" alt="${item.title}" style="width: 100%; height: 220px; object-fit: cover;">`
                : `<div style="width:100%; height:220px; background: linear-gradient(135deg, var(--dark-blue), var(--primary-orange)); opacity:0.8;"></div>`;

            // Use generic card styling compatible with all grid containers
            html += `
            <div class="swiper-slide" style="height: auto;">
                <div class="card" style="height: 100%; display: flex; flex-direction: column; background: var(--white); border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                    ${imgHtml}
                    <div class="card-content" style="padding: 25px; flex-grow: 1;">
                        <h3 style="font-size: 1.25rem; color: var(--dark-blue); margin-bottom: 12px;">${item.title || ''}</h3>
                        <p style="font-size: 0.95rem; color: var(--mid-grey); line-height: 1.6;">${item.desc || ''}</p>
                    </div>
                </div>
            </div>`;
        });
        
        wrapper.innerHTML = html;

        // Initialize Swiper if not done yet
        if (!swiperEl.swiperInstance) {
            // Need setTimeout to ensure DOM is fully rendered before Swiper calculates widths
            setTimeout(() => {
                if (typeof Swiper !== 'undefined') {
                    swiperEl.swiperInstance = new Swiper(swiperEl, {
                        slidesPerView: 1,
                        spaceBetween: 30,
                        pagination: {
                            el: swiperEl.querySelector('.swiper-pagination'),
                            clickable: true,
                        },
                        navigation: {
                            nextEl: swiperEl.querySelector('.swiper-button-next'),
                            prevEl: swiperEl.querySelector('.swiper-button-prev'),
                        },
                        centerInsufficientSlides: true,
                        breakpoints: {
                            640: { slidesPerView: 1 },
                            768: { slidesPerView: 2 },
                            1024: { slidesPerView: 3 }
                        }
                    });
                }
            }, 0);
        } else {
            swiperEl.swiperInstance.update();
        }
    });
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

    // Render Dynamic Swiper Carousels AFTER static texts update
    renderDynamicSliders(lang);
    renderLogoWall(lang);
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

function renderLogoWall(lang) {
    const listKey = 'partners';
    const dataList = translations[lang] && translations[lang][listKey];
    const grid = document.querySelector('.logo-grid');
    if (!grid || !dataList) return;

    // Reset Swiper classes and clear duplicates
    grid.className = 'logo-grid';
    grid.innerHTML = '';

    dataList.forEach((item, idx) => {
        if (!item.name || !item.logo) return;
        const div = document.createElement('div');
        div.className = 'logo-item';
        div.title = item.name;
        div.innerHTML = `
            <div class="logo-img-wrapper">
                <img src="${item.logo}" alt="${item.name}">
            </div>
            <span class="logo-name">${item.name}</span>
        `;
        grid.appendChild(div);
    });
}
