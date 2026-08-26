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
        <div class="cookie-consent-header">
          <div class="cookie-consent-tabs">
            <button class="cookie-tab active" data-tab="consent">Consent</button>
            <button class="cookie-tab" data-tab="details">Details</button>
            <button class="cookie-tab" data-tab="about">About</button>
          </div>
        </div>
        
        <div class="cookie-consent-content">
          <div class="cookie-tab-content active" id="consent-tab">
            <h3>This website uses cookies</h3>
            <p>We use cookies to personalise content and ads, to provide social media features and to analyse our traffic. We also share information about your use of our site with our social media, advertising and analytics partners who may combine it with other information that you've provided to them or that they've collected from your use of their services.</p>
            
            <div class="cookie-consent-actions">
              <button id="cookie-reject" class="cookie-btn cookie-btn-outline">Deny all cookies</button>
              <button id="cookie-accept" class="cookie-btn cookie-btn-primary">Allow all cookies</button>
            </div>
          </div>
          
          <div class="cookie-tab-content" id="details-tab">
            <h3>Cookie Details</h3>
            <p>We use different types of cookies for different purposes. Essential cookies are necessary for the website to function, while analytical cookies help us understand how visitors use the site.</p>
          </div>
          
          <div class="cookie-tab-content" id="about-tab">
            <h3>About Cookies</h3>
            <p>Cookies are small text files stored on your device that help websites remember your preferences and improve your browsing experience. You can control cookie settings through your browser.</p>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(popup);

    // Trigger animation
    requestAnimationFrame(() => {
      popup.classList.add('show');
    });

    // Tab switching functionality
    const tabs = popup.querySelectorAll('.cookie-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const tabName = tab.dataset.tab;
        
        // Remove active class from all tabs and contents
        popup.querySelectorAll('.cookie-tab').forEach(t => t.classList.remove('active'));
        popup.querySelectorAll('.cookie-tab-content').forEach(c => c.classList.remove('active'));
        
        // Add active class to clicked tab and corresponding content
        tab.classList.add('active');
        const content = popup.querySelector(`#${tabName}-tab`);
        if (content) content.classList.add('active');
      });
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
