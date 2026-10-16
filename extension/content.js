/**
 * DarkShield AI Extension - In-Browser Content Script (Prototype)
 * Runs entirely on your device. No data is collected or sent.
 * Default Mode: Highlight and warn only.
 */

(function () {
  const SNEAK_KEYWORDS = ["packaging", "surge", "rain", "insurance", "warranty", "care plan", "protection", "donation", "vip membership", "cutlery"];
  const CONFIRMSHAME_REGEX = /no thanks,?\s+i\s+(hate|prefer|don'?t\s+want|dislike|don't\s+care)\s+/i;
  const TRICK_REGEX = /(uncheck\s+if\s+you\s+(wish|prefer)\s+not|do\s+not\s+uncheck|opt-out\s+by\s+not)/i;

  let currentThreatCount = 0;
  let autoFixActive = false;

  function scanPage() {
    currentThreatCount = 0;

    // 1. Inspect Pre-checked Checkboxes (Basket Sneaking)
    const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    checkboxes.forEach(cb => {
      const parent = cb.closest('label') || cb.parentElement || cb;
      const parentText = (parent.innerText || "").toLowerCase();
      if (SNEAK_KEYWORDS.some(kw => parentText.includes(kw))) {
        currentThreatCount++;
        highlightElement(parent, "⚠️ BASKET SNEAKING: Pre-checked add-on fee detected!");
      }
    });

    // 2. Inspect Countdown Timers (False Urgency)
    const timerElements = document.querySelectorAll('[class*="countdown"], [class*="timer"], [id*="countdown"], [id*="timer"]');
    timerElements.forEach(el => {
      if (/\d{1,2}:\d{2}/.test(el.innerText || "")) {
        currentThreatCount++;
        highlightElement(el, "⏱️ FALSE URGENCY: Artificial countdown timer detected.");
      }
    });

    // 3. Inspect Confirm Shaming Links / Buttons
    const buttons = document.querySelectorAll('button, a, span');
    buttons.forEach(btn => {
      if (CONFIRMSHAME_REGEX.test(btn.innerText || "")) {
        currentThreatCount++;
        highlightElement(btn, "💬 CONFIRM SHAMING: Guilt-tripping copy detected.");
      }
    });

    // 4. Inspect Trick Questions (Double Negatives)
    const formLabels = document.querySelectorAll('label, p, span');
    formLabels.forEach(lbl => {
      if (TRICK_REGEX.test(lbl.innerText || "")) {
        currentThreatCount++;
        highlightElement(lbl, "❓ TRICK QUESTION: Inverted double-negative consent syntax detected.");
      }
    });

    // Inject Floating HUD Badge (Highlight and warn only by default)
    injectFloatingBadge(currentThreatCount);
  }

  function highlightElement(el, tooltipText) {
    el.style.outline = "2px dashed #ff3366";
    el.style.backgroundColor = "rgba(255, 51, 102, 0.08)";
    el.setAttribute("title", "🛡️ DarkShield AI: " + tooltipText);
  }

  function freezeTimers() {
    const highestId = window.setInterval(() => {}, 9999);
    for (let i = 0; i < highestId; i++) window.clearInterval(i);
    const badge = document.getElementById('darkshield-floating-badge');
    if (badge) {
      const statusEl = badge.querySelector('.badge-status');
      if (statusEl) statusEl.innerText = "Timers Frozen";
    }
  }

  function untickFees() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    checkboxes.forEach(cb => {
      const parent = cb.closest('label') || cb.parentElement || cb;
      const parentText = (parent.innerText || "").toLowerCase();
      if (SNEAK_KEYWORDS.some(kw => parentText.includes(kw))) {
        cb.checked = false;
        cb.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
  }

  function applyAutoFix() {
    autoFixActive = true;
    freezeTimers();
    untickFees();
  }

  function injectFloatingBadge(threatCount) {
    let badge = document.getElementById('darkshield-floating-badge');
    if (!badge) {
      badge = document.createElement('div');
      badge.id = 'darkshield-floating-badge';
      badge.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        z-index: 9999999;
        background: #090c14;
        border: 1px solid ${threatCount > 0 ? '#ff3366' : '#00f5a0'};
        border-radius: 30px;
        padding: 8px 16px;
        display: flex;
        align-items: center;
        gap: 10px;
        box-shadow: 0 8px 24px rgba(0,0,0,0.6);
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 13px;
        color: #fff;
        cursor: pointer;
        transition: all 0.25s ease;
      `;
      document.body.appendChild(badge);
    }

    badge.innerHTML = `
      <span style="font-size: 16px;">🛡️</span>
      <span style="font-weight: 700;">DarkShield AI:</span>
      <span class="badge-status" style="color: ${threatCount > 0 ? '#ff3366' : '#00f5a0'}; font-weight: 800;">
        ${threatCount > 0 ? threatCount + ' Traps Flagged' : 'Page Clean'}
      </span>
    `;

    badge.onclick = () => {
      alert("🛡️ DarkShield AI Browser Prototype\n\nDetected " + threatCount + " deceptive pattern(s) under CCPA 2023 Guidelines.\nDefault Mode: Highlight and warn only.\nRuns entirely on your device with zero data collected.");
    };
  }

  // Handle runtime messages from popup
  if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === 'GET_THREAT_COUNT') {
        sendResponse({ count: currentThreatCount, autoFix: autoFixActive });
      } else if (request.action === 'SET_AUTOFIX') {
        if (request.enabled) {
          applyAutoFix();
        } else {
          autoFixActive = false;
        }
        sendResponse({ success: true, autoFix: autoFixActive });
      } else if (request.action === 'FREEZE_TIMERS') {
        freezeTimers();
        sendResponse({ success: true });
      } else if (request.action === 'UNTICK_FEES') {
        untickFees();
        sendResponse({ success: true });
      }
    });
  }

  // Check stored auto-fix preference (default OFF)
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
    chrome.storage.local.get({ autofix: false }, (res) => {
      if (res && res.autofix) {
        applyAutoFix();
      }
    });
  }

  // Initial scan on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scanPage);
  } else {
    scanPage();
  }
})();
