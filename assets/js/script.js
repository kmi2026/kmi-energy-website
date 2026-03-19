/**
 * Author: YuanYuan
 * Project: KMI Energy Corporate Website
 */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Intersection Observer for Fade Up Animations
    const fadeElements = document.querySelectorAll('.fade-up');
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                fadeObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    fadeElements.forEach(el => fadeObserver.observe(el));

    // 3. Counter Animation
    const counters = document.querySelectorAll('.counter');
    let hasCounted = false;

    const counterObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !hasCounted) {
            hasCounted = true;
            counters.forEach(counter => {
                const updateCount = () => {
                    const target = +counter.getAttribute('data-target');
                    const count = +counter.innerText;
                    
                    // Lower increment = slower, Higher increment = faster
                    const inc = target / 50; 

                    if (count < target) {
                        counter.innerText = Math.ceil(count + inc);
                        setTimeout(updateCount, 40);
                    } else {
                        counter.innerText = target;
                    }
                };
                updateCount();
            });
        }
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.about-stats');
    if (statsSection) {
        counterObserver.observe(statsSection);
    }

    // 4. Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
    // Contact Form AJAX Submission
    const contactForm = document.getElementById('kmi-contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const btn = contactForm.querySelector('.submit-btn');
            const msgArea = document.getElementById('form-message');
            const lang = typeof getCookie === "function" ? getCookie('preferred_lang') : 'zh';
            const originalBtnText = btn.innerText;

            btn.innerText = (lang === 'zh') ? "提交中..." : "Submitting...";
            btn.disabled = true;

            const formData = new FormData(contactForm);
            
            // REPLACE THIS URL with your deployed Google Apps Script URL
            const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxebhehJkjAOs630kStXQQV3vaV-RVH6x6nP80NwM6N35I8rEj5-XguDRYOyY-PFMRdnQ/exec"; 

            if (GOOGLE_SCRIPT_URL === "YOUR_GOOGLE_SCRIPT_URL_HERE") {
                // Mock success for design presentation if URL is not configured
                setTimeout(() => {
                    msgArea.className = "form-message success";
                    msgArea.innerText = (lang === 'zh') ? "【演示模式】提交成功！后台链接尚未配置。" : "[Demo] Success! Backend URL not configured.";
                    btn.innerText = originalBtnText;
                    btn.disabled = false;
                    contactForm.reset();
                    setTimeout(() => msgArea.style.display = 'none', 5000);
                }, 1000);
                return;
            }

            fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                body: formData
            })
            .then(response => {
                msgArea.className = "form-message success";
                msgArea.innerText = (lang === 'zh') ? "提交成功！我们将尽快与您联系。" : "Success! We will contact you soon.";
                contactForm.reset();
            })
            .catch(error => {
                msgArea.className = "form-message error";
                msgArea.innerText = (lang === 'zh') ? "表单服务暂时不可用，请通过下方邮件直接联系。" : "Service unavailable, please email us directly.";
            })
            .finally(() => {
                btn.innerText = originalBtnText;
                btn.disabled = false;
                setTimeout(() => msgArea.style.display = 'none', 5000);
            });
        });
    }

    // Modal Display Logic
    const contactModal = document.getElementById('contact-modal');
    const closeBtn = document.querySelector('.close-modal');
    const openBtns = document.querySelectorAll('.open-contact-modal');

    function openModal(e) {
        if (e) { e.preventDefault(); e.stopPropagation(); }
        if (contactModal) contactModal.classList.add('show');
    }
    
    function closeModal() {
        if (contactModal) contactModal.classList.remove('show');
    }

    openBtns.forEach(btn => btn.addEventListener('click', openModal));
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    
    window.addEventListener('click', (e) => {
        if (e.target === contactModal) closeModal();
    });
});
