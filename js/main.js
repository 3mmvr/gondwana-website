/* ============================================================
   GONDWANA MINING — main.js
   Navbar scroll, mobile menu, tabs, scroll reveal, lang toggle, translations
   ============================================================ */

// Global translations object - also expose on window
let translations = {};
window.translations = translations;

// Translation debug mode (set to true to see console logs)
const TRANSLATION_DEBUG = true;

function debugLog(message, data) {
  if (TRANSLATION_DEBUG) {
    console.log(`[Gondwana Translation] ${message}`, data || '');
  }
}

// Load translations from JSON file
async function loadTranslations() {
  try {
    // Try multiple paths to find the translations file
    const paths = [
      '/js/translations.json',
      './js/translations.json',
      '../js/translations.json'
    ];
    
    debugLog('Attempting to load translations from paths:', paths);
    
    let response;
    for (let path of paths) {
      try {
        response = await fetch(path);
        if (response.ok) {
          translations = await response.json();
          window.translations = translations;
          debugLog('✓ Translations loaded successfully from:', path);
          debugLog('Available languages:', Object.keys(translations));
          return true;
        }
      } catch (e) {
        debugLog(`× Failed to load from ${path}`, e.message);
        continue;
      }
    }
    
    console.error('[Gondwana Translation ERROR] Could not load translations from any path');
    return false;
  } catch (error) {
    console.error('[Gondwana Translation ERROR] Fatal error loading translations:', error);
    return false;
  }
}

// Get translation value safely
function getTranslationValue(lang, keyPath) {
  if (!translations[lang]) {
    debugLog(`Language '${lang}' not found in translations`);
    return null;
  }
  
  const keys = keyPath.split('.');
  let value = translations[lang];
  
  for (let k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      debugLog(`Missing translation key: ${lang}.${keyPath}`);
      return null;
    }
  }
  
  return value;
}

// Set language and apply translations
function setLanguage(lang) {
  const isArabic = lang === 'ar';
  
  debugLog('Setting language to:', lang);
  
  // Update DOM attributes (batch these together to avoid multiple reflows)
  const htmlElement = document.documentElement;
  htmlElement.lang = lang;
  htmlElement.dir = isArabic ? 'rtl' : 'ltr';
  
  const bodyElement = document.body;
  if (isArabic) {
    bodyElement.classList.add('rtl');
    bodyElement.classList.remove('ltr');
  } else {
    bodyElement.classList.remove('rtl');
    bodyElement.classList.add('ltr');
  }
  
  // Update language toggle buttons (cache selector results)
  const newButtonText = isArabic ? 'EN' : 'AR';
  document.querySelectorAll('.lang-toggle span').forEach(span => {
    span.textContent = newButtonText;
  });
  
  // Update mobile buttons
  const mobileButtonText = isArabic ? 'Switch to English' : 'Switch to Arabic';
  document.querySelectorAll('.mobile-lang-toggle span').forEach(span => {
    span.textContent = mobileButtonText;
  });
  
  // Save preference to localStorage
  localStorage.setItem('gondwana-language', lang);
  
  // Translate all elements with data-i18n attribute
  translatePage(lang);
  
  debugLog('Language set complete');
}

// Translate page content based on data-i18n attributes
function translatePage(lang) {
  // Check if translations are loaded
  if (!translations || !translations[lang]) {
    console.error(`[Gondwana Translation ERROR] Translations not loaded for language: ${lang}`);
    debugLog('Available translations:', Object.keys(translations));
    return;
  }
  
  let translatedCount = 0;
  let missingCount = 0;
  
  debugLog(`Starting translation for language: ${lang}`);
  const startTime = performance.now();
  
  // Cache HTML regex for reuse
  const htmlRegex = /<[^>]*>/;
  
  // Translate text content - batch all DOM queries together
  const elements = document.querySelectorAll('[data-i18n]');
  debugLog(`Found ${elements.length} elements with data-i18n`);
  
  elements.forEach(element => {
    const key = element.getAttribute('data-i18n');
    const value = getTranslationValue(lang, key);
    
    if (value) {
      // Check if the translation contains HTML tags (like <br> or <span>)
      if (htmlRegex.test(value)) {
        // Use innerHTML only if there are actual HTML tags in the translation
        element.innerHTML = value;
      } else {
        // Use textContent for plain text (safer, preserves special characters)
        element.textContent = value;
      }
      translatedCount++;
    } else {
      console.warn(`[Gondwana Translation WARNING] Missing translation: ${lang}.${key}`);
      missingCount++;
    }
  });

  // Translate placeholders
  const placeholderElements = document.querySelectorAll('[data-i18n-placeholder]');
  placeholderElements.forEach(element => {
    const key = element.getAttribute('data-i18n-placeholder');
    const value = getTranslationValue(lang, key);
    
    if (value) {
      element.placeholder = value;
      translatedCount++;
    } else {
      console.warn(`[Gondwana Translation WARNING] Missing placeholder translation: ${lang}.${key}`);
      missingCount++;
    }
  });

  // Translate aria-labels
  const ariaLabelElements = document.querySelectorAll('[data-i18n-aria]');
  ariaLabelElements.forEach(element => {
    const key = element.getAttribute('data-i18n-aria');
    const value = getTranslationValue(lang, key);
    
    if (value) {
      element.setAttribute('aria-label', value);
      translatedCount++;
    }
  });

  const duration = (performance.now() - startTime).toFixed(2);
  debugLog(`Translation complete in ${duration}ms: ${translatedCount} translated, ${missingCount} missing`);

  // Trigger scroll reveal animations if available (use requestAnimationFrame to defer this)
  if (window.revealObserver) {
    requestAnimationFrame(() => {
      document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .how-phase').forEach(el => {
        el.classList.remove('visible');
        window.revealObserver.observe(el);
      });
    });
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  debugLog('DOMContentLoaded event fired');
  
  // Load translations first
  const translationsLoaded = await loadTranslations();
  
  if (!translationsLoaded) {
    console.error('[Gondwana] Failed to load translations - website may not translate properly');
  }
  
  // Get saved language preference or default to English
  const savedLanguage = localStorage.getItem('gondwana-language') || 'en';
  debugLog('Saved language:', savedLanguage);
  
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
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .how-phase');
  if (revealEls.length > 0) {
    window.revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          requestAnimationFrame(() => {
            e.target.classList.add('visible');
          });
          window.revealObserver.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
    revealEls.forEach(el => window.revealObserver.observe(el));
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
  // Setup language toggles with proper event handling
  let languageToggleSetup = false;
  
  const setupLanguageToggle = () => {
    if (languageToggleSetup) return; // Prevent duplicate setup
    
    debugLog('Setting up language toggles');
    
    const setupToggleButtons = (selector) => {
      document.querySelectorAll(selector).forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const currentLang = localStorage.getItem('gondwana-language') || 'en';
          const newLang = currentLang === 'en' ? 'ar' : 'en';
          debugLog('Language toggle clicked:', `${currentLang} -> ${newLang}`);
          setLanguage(newLang);
        });
      });
    };
    
    setupToggleButtons('.lang-toggle');
    setupToggleButtons('.mobile-lang-toggle');
    
    languageToggleSetup = true;
    debugLog('Language toggles setup complete');
  };
  
  setupLanguageToggle();

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

/* ── TRANSLATION DIAGNOSTICS UTILITY ────────────────────────── */
// Call window.diagnoseTranslations() in browser console to get a report
window.diagnoseTranslations = function() {
  console.log('═════════════════════════════════════════════════════════════');
  console.log('         GONDWANA TRANSLATION DIAGNOSTIC REPORT');
  console.log('═════════════════════════════════════════════════════════════\n');
  
  // Check if translations are loaded
  console.log('1. TRANSLATIONS LOADED:', Object.keys(window.translations).length > 0 ? '✓ YES' : '✗ NO');
  if (Object.keys(window.translations).length > 0) {
    console.log('   Available languages:', Object.keys(window.translations));
  }
  
  // Check for data-i18n attributes on page
  const i18nElements = document.querySelectorAll('[data-i18n]');
  console.log('\n2. ELEMENTS WITH data-i18n:', i18nElements.length);
  
  // Collect all missing translations
  const missingTranslations = {};
  const currentLang = localStorage.getItem('gondwana-language') || 'en';
  
  i18nElements.forEach(el => {
    const key = el.getAttribute('data-i18n');
    const value = getTranslationValue(currentLang, key);
    if (!value) {
      if (!missingTranslations[key]) {
        missingTranslations[key] = 0;
      }
      missingTranslations[key]++;
    }
  });
  
  if (Object.keys(missingTranslations).length > 0) {
    console.log('\n3. MISSING TRANSLATIONS (for ' + currentLang + '):');
    Object.entries(missingTranslations).forEach(([key, count]) => {
      console.log(`   - ${key} (${count} element${count > 1 ? 's' : ''})`);
    });
  } else {
    console.log('\n3. MISSING TRANSLATIONS: ✓ NONE');
  }
  
  // Check language toggle buttons
  const langToggles = document.querySelectorAll('.lang-toggle, .mobile-lang-toggle');
  console.log('\n4. LANGUAGE TOGGLE BUTTONS:', langToggles.length);
  
  // Check for translation keys that don't have elements
  console.log('\n5. TRANSLATION KEYS ANALYSIS:');
  if (window.translations[currentLang]) {
    const keysInJSON = getAllTranslationKeys(window.translations[currentLang], '');
    console.log('   Total keys in JSON:', keysInJSON.length);
    
    // Sample of keys
    console.log('   Sample keys:', keysInJSON.slice(0, 10).join(', '));
  }
  
  console.log('\n═════════════════════════════════════════════════════════════');
  console.log('Current Language:', currentLang);
  console.log('Current LTR/RTL:', document.body.classList.contains('rtl') ? 'RTL (Arabic)' : 'LTR (English)');
  console.log('═════════════════════════════════════════════════════════════\n');
};

// Helper function to get all keys from translation object
function getAllTranslationKeys(obj, prefix = '') {
  let keys = [];
  for (let key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      keys = keys.concat(getAllTranslationKeys(obj[key], prefix ? `${prefix}.${key}` : key));
    } else {
      keys.push(prefix ? `${prefix}.${key}` : key);
    }
  }
  return keys;
}

// Expose utility functions globally for debugging
window.switchLanguage = function(lang) {
  console.log(`Switching to ${lang}...`);
  setLanguage(lang);
  console.log(`✓ Switched to ${lang}`);
  window.diagnoseTranslations();
};

