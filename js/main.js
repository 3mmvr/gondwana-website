/* ============================================================
   GONDWANA MINING — main.js
   Navbar scroll, mobile menu, tabs, scroll reveal, lang toggle
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

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
  const langBtns = document.querySelectorAll('.lang-toggle, .lang-btn');
  langBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const current = document.documentElement.lang || 'en';
      const next = current === 'en' ? 'ar' : 'en';
      // In a real app this would swap content; here we just update UI
      document.documentElement.lang = next;
      document.body.classList.toggle('rtl', next === 'ar');
      langBtns.forEach(b => {
        b.querySelector('span') && (b.querySelector('span').textContent = next === 'en' ? 'AR' : 'EN');
      });
    });
  });

  /* ── FORM SUBMIT (demo) ─────────────────────────────────── */
  const form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('[type=submit]');
      const orig = btn.textContent;
      btn.textContent = 'Sent!';
      btn.disabled = true;
      setTimeout(() => { btn.textContent = orig; btn.disabled = false; }, 3000);
    });
  }

});
