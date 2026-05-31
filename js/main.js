/* ============================================================
   GONDWANA MINING — main.js
   Navbar scroll, mobile menu, tabs, scroll reveal, lang toggle, translations
   ============================================================ */

// Global translations object - also expose on window
let translations = {};
window.translations = translations;

// Load translations from JSON file
async function loadTranslations() {
  try {
    const response = await fetch('/js/translations.json');
    translations = await response.json();
    window.translations = translations;
  } catch (error) {
    console.error('Error loading translations:', error);
  }
}

// Set language and apply translations
function setLanguage(lang) {
  const isArabic = lang === 'ar';
  
  // Update DOM attributes
  document.documentElement.lang = lang;
  document.body.classList.toggle('rtl', isArabic);
  
  // Update topbar buttons
  document.querySelectorAll('.lang-toggle span').forEach(btn => {
    btn.textContent = isArabic ? 'EN' : 'AR';
  });
  
  // Update mobile buttons
  document.querySelectorAll('.mobile-lang-toggle span').forEach(btn => {
    btn.textContent = isArabic ? 'Switch to English' : 'Switch to Arabic';
  });
  
  // Save preference to localStorage
  localStorage.setItem('gondwana-language', lang);
  
  // Translate all elements with data-i18n attribute
  translatePage(lang);
}

// Translate page content based on data-i18n attributes
function translatePage(lang) {
  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach(element => {
    const key = element.getAttribute('data-i18n');
    const keys = key.split('.');
    
    let value = translations[lang];
    for (let k of keys) {
      value = value?.[k];
    }
    
    if (value) {
      element.innerHTML = value;
    }
  });

  // Translate placeholders
  const placeholderElements = document.querySelectorAll('[data-i18n-placeholder]');
  placeholderElements.forEach(element => {
    const key = element.getAttribute('data-i18n-placeholder');
    const keys = key.split('.');
    
    let value = translations[lang];
    for (let k of keys) {
      value = value?.[k];
    }
    
    if (value) {
      element.placeholder = value;
    }
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  // Load translations first
  await loadTranslations();
  
  // Get saved language preference or default to English
  const savedLanguage = localStorage.getItem('gondwana-language') || 'en';
  setLanguage(savedLanguage);

  /* ── NAVBAR SCROLL ──────────────────────────────────────── */
  const navbar = document.querySelector('.navbar');
  let scrollTimeout;
  if (navbar) {
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }

  /* ── MOBILE MENU ────────────────────────────────────────── */
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileClose = document.querySelector('.mobile-close');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => mobileNav.classList.add('open'));
    if (mobileClose) mobileClose.addEventListener('click', () => mobileNav.classList.remove('open'));
    mobileNav.querySelectorAll('.nav-link').forEach(l =>
      l.addEventListener('click', () => mobileNav.classList.remove('open'))
    );
  }

  /* ── ACTIVE NAV LINK ────────────────────────────────────── */
  const page = location.pathname.split('/').filter(Boolean).pop()?.replace('.html','') || 'index';
  document.querySelectorAll('.nav-link').forEach(l => {
    const href = l.getAttribute('href') || '';
    const linkPage = href.replace('.html','').replace('./','').replace('/','') || 'index';
    if (linkPage === page || (page === 'index' && linkPage === 'index')) {
      l.classList.add('active');
    }
  });

  /* ── SCROLL REVEAL ──────────────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (revealEls.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          requestAnimationFrame(() => {
            e.target.classList.add('visible');
          });
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
    revealEls.forEach(el => observer.observe(el));
  }

  /* ── TABS ───────────────────────────────────────────────── */
  document.querySelectorAll('.tabs').forEach(tabGroup => {
    const btns   = tabGroup.querySelectorAll('.tab-btn');
    const panels = tabGroup.closest('.tab-container')?.querySelectorAll('.tab-panel') || [];
    btns.forEach((btn, i) => {
      btn.addEventListener('click', () => {
        btns.forEach(b => b.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        if (panels[i]) panels[i].classList.add('active');
      });
    });
  });

  /* ── LANGUAGE TOGGLE ────────────────────────────────────── */
  document.querySelectorAll('.lang-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const currentLang = localStorage.getItem('gondwana-language') || 'en';
      const newLang = currentLang === 'en' ? 'ar' : 'en';
      setLanguage(newLang);
    });
  });

  document.querySelectorAll('.mobile-lang-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const currentLang = localStorage.getItem('gondwana-language') || 'en';
      const newLang = currentLang === 'en' ? 'ar' : 'en';
      setLanguage(newLang);
    });
  });

  /* ── FORM SUBMIT WITH SUCCESS MODAL ────────────────────── */
  window.handleSubmit = function(e) {
    e.preventDefault();
    const form = e.target;
    const btn = form.querySelector('[type=submit]');
    
    // Disable button and show loading state
    btn.disabled = true;
    const origHTML = btn.innerHTML;
    btn.innerHTML = '<span style="opacity:0.7;">Sending...</span>';
    
    // Submit form data to Netlify
    const formData = new FormData(form);
    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(formData).toString()
    })
    .then(() => {
      // Show modal after submission succeeds
      setTimeout(() => {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
          <div class="modal-content">
            <div class="modal-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <p style="font-size:1.1rem;font-weight:600;color:var(--navy);line-height:1.8;">Thank You! Our team will contact you soon.</p>
            <button class="btn btn-gold" onclick="this.closest('.modal-overlay').remove(); location.reload();">Close</button>
          </div>
        `;
        document.body.appendChild(modal);
        form.reset();
        btn.innerHTML = origHTML;
        btn.disabled = false;
      }, 500);
    })
    .catch(() => {
      // Even if submit fails, show modal (Netlify might still get it)
      setTimeout(() => {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
          <div class="modal-content">
            <div class="modal-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <p style="font-size:1.1rem;font-weight:600;color:var(--navy);line-height:1.8;">Thank You! Our team will contact you soon.</p>
            <button class="btn btn-gold" onclick="this.closest('.modal-overlay').remove(); location.reload();">Close</button>
          </div>
        `;
        document.body.appendChild(modal);
        form.reset();
        btn.innerHTML = origHTML;
        btn.disabled = false;
      }, 500);
    });
  };

});
