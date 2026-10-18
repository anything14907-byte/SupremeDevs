/**
 * DarkShield AI Extension - In-Browser Content Script (Prototype)
 * Runs entirely on your device. Zero network requests, tracking, or eval.
 * Default Mode: Highlight and warn only.
 */

(function () {
  'use strict';

  try {
    const SNEAK_KEYWORDS = ["packaging", "surge", "rain", "insurance", "warranty", "care plan", "protection", "donation", "vip membership", "cutlery"];
    const CONFIRMSHAME_REGEX = /no thanks,?\s+i\s+(hate|prefer|don'?t\s+want|dislike|don't\s+care)\s+/i;
    const TRICK_REGEX = /(uncheck\s+if\s+you\s+(wish|prefer)\s+not|do\s+not\s+uncheck|opt-out\s+by\s+not)/i;

    let currentThreatCount = 0;
    let autoFixActive = false;

    function scanPage() {
      try {
        currentThreatCount = 0;

        // 1. Inspect Pre-checked Checkboxes (Basket Sneaking)
        const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
        checkboxes.forEach(cb => {
          try {
            const parent = cb.closest('label') || cb.parentElement || cb;
            const parentText = (parent.innerText || parent.textContent || "").toLowerCase();
            if (SNEAK_KEYWORDS.some(kw => parentText.includes(kw))) {
              currentThreatCount++;
              highlightElement(parent, "⚠️ BASKET SNEAKING: Pre-checked add-on fee detected!");
            }
          } catch (_) {}
        });

        // 2. Inspect Countdown Timers (False Urgency)
        const timerElements = document.querySelectorAll('[class*="countdown"], [class*="timer"], [id*="countdown"], [id*="timer"]');
        timerElements.forEach(el => {
          try {
            const txt = el.innerText || el.textContent || "";
            if (/\d{1,2}:\d{2}/.test(txt)) {
              currentThreatCount++;
              highlightElement(el, "⏱️ FALSE URGENCY: Artificial countdown timer detected.");
            }
          } catch (_) {}
        });

        // 3. Inspect Confirm Shaming Links / Buttons
        const buttons = document.querySelectorAll('button, a, span');
        buttons.forEach(btn => {
          try {
            const txt = btn.innerText || btn.textContent || "";
            if (CONFIRMSHAME_REGEX.test(txt)) {
              currentThreatCount++;
              highlightElement(btn, "💬 CONFIRM SHAMING: Guilt-tripping copy detected.");
            }
          } catch (_) {}
        });

        // 4. Inspect Trick Questions (Double Negatives)
        const formLabels = document.querySelectorAll('label, p, span');
        formLabels.forEach(lbl => {
          try {
            const txt = lbl.innerText || lbl.textContent || "";
            if (TRICK_REGEX.test(txt)) {
              currentThreatCount++;
              highlightElement(lbl, "❓ TRICK QUESTION: Inverted double-negative consent syntax detected.");
            }
          } catch (_) {}
        });

        // Inject Floating HUD Badge only on pages where patterns are detected
        if (currentThreatCount > 0) {
          injectFloatingBadge(currentThreatCount);
        } else {
          removeFloatingBadge();
        }
      } catch (err) {
        // Never throw to prevent breaking host page execution
      }
    }

    function highlightElement(el, tooltipText) {
      try {
        // Use outline only - never changes layout or button dimensions
        el.style.outline = "2px dashed #ff3366";
        el.style.outlineOffset = "2px";
        el.setAttribute("title", "🛡️ DarkShield AI: " + tooltipText);
      } catch (_) {}
    }

    function freezeTimers() {
      try {
        const highestId = window.setInterval(() => {}, 9999);
        for (let i = 0; i < highestId; i++) window.clearInterval(i);
        const badge = document.getElementById('darkshield-floating-badge');
        if (badge) {
          const statusEl = badge.querySelector('.badge-status');
          if (statusEl) statusEl.innerText = "Timers Frozen";
        }
      } catch (_) {}
    }

    function untickFees() {
      try {
        const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
        checkboxes.forEach(cb => {
          try {
            const parent = cb.closest('label') || cb.parentElement || cb;
            const parentText = (parent.innerText || parent.textContent || "").toLowerCase();
            if (SNEAK_KEYWORDS.some(kw => parentText.includes(kw))) {
              cb.checked = false;
              cb.dispatchEvent(new Event('change', { bubbles: true }));
            }
          } catch (_) {}
        });
      } catch (_) {}
    }

    function applyAutoFix() {
      autoFixActive = true;
      freezeTimers();
      untickFees();
    }

    function removeFloatingBadge() {
      const existing = document.getElementById('darkshield-floating-badge');
      if (existing) existing.remove();
    }

    function injectFloatingBadge(threatCount) {
      if (!document.body) return;
      let badge = document.getElementById('darkshield-floating-badge');
      if (!badge) {
        badge = document.createElement('div');
        badge.id = 'darkshield-floating-badge';
        badge.style.cssText = `
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 2147483647;
          background: #090c14;
          border: 1px solid #ff3366;
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
          user-select: none;
          transition: all 0.25s ease;
        `;
        document.body.appendChild(badge);
      }

      badge.innerHTML = `
        <span style="font-size: 16px;">🛡️</span>
        <span style="font-weight: 700;">DarkShield AI:</span>
        <span class="badge-status" style="color: #ff3366; font-weight: 800;">
          ${threatCount} Traps Flagged
        </span>
      `;

      badge.onclick = () => {
        alert("🛡️ DarkShield AI Browser Prototype\n\nDetected " + threatCount + " deceptive pattern(s) under CCPA 2023 Guidelines.\nDefault Mode: Highlight and warn only.\nRuns entirely on your device with zero data collected.");
      };
    }

    // Handle runtime messages from popup
    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
      chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        try {
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
        } catch (_) {}
      });
    }

    // Check stored auto-fix preference (default OFF)
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.get({ autofix: false }, (res) => {
        try {
          if (res && res.autofix) {
            applyAutoFix();
          }
        } catch (_) {}
      });
    }

    // Initial scan on page load
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', scanPage);
    } else {
      scanPage();
    }
  } catch (_) {
    // Top-level safety guard
  }
})();
