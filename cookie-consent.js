/* ============================================================
   COOKIE CONSENT POPUP
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const COOKIE_NAME = 'gondwana_cookie_consent';
  const COOKIE_DURATION = 365; // days

  // Check if user has already given consent
  function getCookie(name) {
    const nameEQ = name + '=';
    const cookies = document.cookie.split(';');
    for (let c of cookies) {
      c = c.trim();
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length);
    }
    return null;
  }

  // Set cookie
  function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = 'expires=' + date.toUTCString();
    document.cookie = name + '=' + value + ';' + expires + ';path=/';
  }

  // Show cookie popup if not already accepted
  if (!getCookie(COOKIE_NAME)) {
    showCookiePopup();
  }

  function showCookiePopup() {
    const popup = document.createElement('div');
    popup.id = 'cookie-consent-popup';
    popup.innerHTML = `
      <div class="cookie-consent-container">
        <div class="cookie-consent-content">
          <div class="cookie-consent-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
              <!-- Cookie with bite -->
              <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.9"/>
              <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="0.5" opacity="0.4"/>
              <!-- Bite mark -->
              <path d="M 20 8 Q 18 6 16 8 Q 18 10 20 8" fill="white" opacity="0.7"/>
              <!-- Chocolate chips -->
              <circle cx="9" cy="9" r="1.2" fill="white" opacity="0.8"/>
              <circle cx="14" cy="10" r="1" fill="white" opacity="0.8"/>
              <circle cx="11" cy="15" r="1.2" fill="white" opacity="0.8"/>
              <circle cx="15" cy="14" r="0.9" fill="white" opacity="0.8"/>
            </svg>
          </div>
          <div class="cookie-consent-text">
            <h3>Privacy & Cookies</h3>
            <p>We use cookies to enhance your experience and analyze our site traffic. By clicking "Accept," you consent to our use of cookies.</p>
          </div>
          <div class="cookie-consent-actions">
            <button id="cookie-reject" class="cookie-btn cookie-btn-outline">Reject</button>
            <button id="cookie-accept" class="cookie-btn cookie-btn-primary">Accept All</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(popup);

    // Trigger animation
    requestAnimationFrame(() => {
      popup.classList.add('show');
    });

    // Accept button
    document.getElementById('cookie-accept').addEventListener('click', () => {
      setCookie(COOKIE_NAME, 'accepted', COOKIE_DURATION);
      closeCookiePopup();
      // Load analytics or other tracking scripts here
    });

    // Reject button
    document.getElementById('cookie-reject').addEventListener('click', () => {
      setCookie(COOKIE_NAME, 'rejected', COOKIE_DURATION);
      closeCookiePopup();
    });
  }

  function closeCookiePopup() {
    const popup = document.getElementById('cookie-consent-popup');
    if (popup) {
      popup.classList.remove('show');
      setTimeout(() => popup.remove(), 300);
    }
  }
});
