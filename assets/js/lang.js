/**
 * Author: YuanYuan
 * Project: KMI Energy Corporate Website
 */
let translations = { en: {} };

async function loadTranslations() {
    try {
        const enRes = await fetch('assets/data/en.json');
        translations.en = await enRes.json();
    } catch (error) {
        console.error('Failed to load English translations:', error);
    }
}

function renderDynamicSliders() {
    const swipers = document.querySelectorAll('.dynamic-swiper');
    swipers.forEach(swiperEl => {
        const listKey = swiperEl.getAttribute('data-list-key') || swiperEl.getAttribute('data-list');
        const dataList = translations.en && translations.en[listKey];
        const wrapper = swiperEl.querySelector('.swiper-wrapper');
        
        if (!wrapper) return;
        
        if (!dataList || !Array.isArray(dataList)) {
            wrapper.innerHTML = '';
            return;
        }

        let html = '';
        
        // Custom override: If there are fewer than 3 items, inject an 'is-sparse' class to force flex-centering
        if (dataList.length > 0 && dataList.length < 3) {
            wrapper.classList.add('is-sparse');
        } else {
            wrapper.classList.remove('is-sparse');
        }
        
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
                        <p style="font-size: 0.95rem; color: var(--mid-grey); line-height: 1.6; white-space: pre-line;">${item.desc || ''}</p>
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

function updateTexts() {
    document.documentElement.lang = 'en';
    const uiTexts = document.querySelectorAll('[data-i18n]');
    uiTexts.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations.en && translations.en[key]) {
            el.innerHTML = translations.en[key];
        } else {
            console.warn(`Missing translation for key: ${key}`);
        }
    });

    // Update document title
    if (translations.en && translations.en['site_title']) {
        document.title = translations.en['site_title'];
    }

    // Render Dynamic Swiper Carousels AFTER static texts update
    renderDynamicSliders();
    renderLogoWall();
}

document.addEventListener('DOMContentLoaded', async () => {
    await loadTranslations();
    updateTexts();
});

function renderLogoWall() {
    const listKey = 'partners';
    const dataList = translations.en && translations.en[listKey];
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
