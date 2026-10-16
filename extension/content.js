/**
 * DarkShield AI Extension - Real-Time In-Browser Content Script
 * Injected on web pages to highlight deceptive patterns and inject floating guardian HUD.
 */

(function () {
  const SNEAK_KEYWORDS = ["packaging", "surge", "rain", "insurance", "warranty", "care plan", "protection", "donation", "vip membership", "cutlery"];
  const CONFIRMSHAME_REGEX = /no thanks,?\s+i\s+(hate|prefer|don'?t\s+want|dislike|don't\s+care)\s+/i;
  const TRICK_REGEX = /(uncheck\s+if\s+you\s+(wish|prefer)\s+not|do\s+not\s+uncheck|opt-out\s+by\s+not)/i;

  function scanPage() {
    let threats = 0;

    // 1. Inspect Pre-checked Checkboxes (Basket Sneaking)
    const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    checkboxes.forEach(cb => {
      const parent = cb.closest('label') || cb.parentElement || cb;
      const parentText = (parent.innerText || "").toLowerCase();
      if (SNEAK_KEYWORDS.some(kw => parentText.includes(kw))) {
        threats++;
        highlightElement(parent, "⚠️ BASKET SNEAKING: Pre-checked add-on fee detected!");
      }
    });

    // 2. Inspect Countdown Timers (False Urgency)
    const timerElements = document.querySelectorAll('[class*="countdown"], [class*="timer"], [id*="countdown"], [id*="timer"]');
    timerElements.forEach(el => {
      if (/\d{1,2}:\d{2}/.test(el.innerText || "")) {
        threats++;
        highlightElement(el, "⏱️ FALSE URGENCY: Artificial countdown timer detected. DarkShield can freeze this.");
      }
    });

    // 3. Inspect Confirm Shaming Links / Buttons
    const buttons = document.querySelectorAll('button, a, span');
    buttons.forEach(btn => {
      if (CONFIRMSHAME_REGEX.test(btn.innerText || "")) {
        threats++;
        highlightElement(btn, "💬 CONFIRM SHAMING: Guilt-tripping copy detected.");
      }
    });

    // 4. Inspect Trick Questions (Double Negatives)
    const formLabels = document.querySelectorAll('label, p, span');
    formLabels.forEach(lbl => {
      if (TRICK_REGEX.test(lbl.innerText || "")) {
        threats++;
        highlightElement(lbl, "❓ TRICK QUESTION: Inverted double-negative consent syntax detected.");
      }
    });

    // Inject Floating HUD Badge
    injectFloatingBadge(threats);
  }

  function highlightElement(el, tooltipText) {
    el.style.outline = "2px dashed #ff3366";
    el.style.backgroundColor = "rgba(255, 51, 102, 0.08)";
    el.setAttribute("title", "🛡️ DarkShield AI: " + tooltipText);
  }

  function injectFloatingBadge(threatCount) {
    if (document.getElementById('darkshield-floating-badge')) return;

    const badge = document.createElement('div');
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

    badge.innerHTML = `
      <span style="font-size: 16px;">🛡️</span>
      <span style="font-weight: 700;">DarkShield AI:</span>
      <span style="color: ${threatCount > 0 ? '#ff3366' : '#00f5a0'}; font-weight: 800;">
        ${threatCount > 0 ? threatCount + ' Traps Flagged' : 'Page Clean'}
      </span>
    `;

    badge.onclick = () => {
      alert("🛡️ DarkShield AI Browser Companion\n\nDetected " + threatCount + " deceptive pattern(s) under CCPA 2023 Guidelines.\nCheck outlined elements on this page.");
    };

    document.body.appendChild(badge);
  }

  // Initial scan & dynamic observer
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scanPage);
  } else {
    scanPage();
  }
})();
