/**
 * TinyFish Aegis Extension - Content Script
 * Injected on web pages to highlight deceptive patterns and inject floating guardian HUD.
 */

(function () {
  const SNEAK_KEYWORDS = ["insurance", "warranty", "care plan", "protection", "donation", "vip membership"];
  const CONFIRMSHAME_REGEX = /no thanks,?\s+i\s+(hate|prefer|don'?t\s+want|dislike)\s+/i;

  function scanPage() {
    let threats = 0;

    // 1. Inspect Pre-checked Checkboxes
    const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    checkboxes.forEach(cb => {
      const parentText = (cb.parentElement ? cb.parentElement.innerText : "").toLowerCase();
      if (SNEAK_KEYWORDS.some(kw => parentText.includes(kw))) {
        threats++;
        highlightElement(cb.parentElement || cb, "⚠️ SNEAK INTO BASKET: Pre-checked paid add-on detected!");
      }
    });

    // 2. Inspect Countdown Timers
    const timerElements = document.querySelectorAll('[class*="countdown"], [class*="timer"], [id*="countdown"], [id*="timer"]');
    timerElements.forEach(el => {
      if (/\d{1,2}:\d{2}/.test(el.innerText)) {
        threats++;
        highlightElement(el, "⏱️ FAKE URGENCY: Synthetic timer detected. TinyFish can freeze countdown.");
      }
    });

    // 3. Inspect Confirmshaming Links / Buttons
    const buttons = document.querySelectorAll('button, a');
    buttons.forEach(btn => {
      if (CONFIRMSHAME_REGEX.test(btn.innerText)) {
        threats++;
        highlightElement(btn, "💬 CONFIRMSHAMING: Emotional guilt-trip detected.");
      }
    });

    // Inject Floating HUD Badge
    injectFloatingBadge(threats);
  }

  function highlightElement(el, tooltipText) {
    el.style.outline = "2px dashed #ff3366";
    el.style.backgroundColor = "rgba(255, 51, 102, 0.08)";
    el.setAttribute("title", "🛡️ TinyFish Aegis: " + tooltipText);
  }

  function injectFloatingBadge(threatCount) {
    if (document.getElementById('tinyfish-floating-badge')) return;

    const badge = document.createElement('div');
    badge.id = 'tinyfish-floating-badge';
    badge.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 9999999;
      background: #090c15;
      border: 1px solid rgba(0, 242, 254, 0.4);
      color: #fff;
      padding: 10px 16px;
      border-radius: 30px;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.7), 0 0 15px rgba(0, 242, 254, 0.25);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-size: 13px;
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      backdrop-filter: blur(12px);
    `;

    const statusColor = threatCount > 0 ? '#ff3366' : '#00f5a0';
    badge.innerHTML = `
      <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:${statusColor}; box-shadow:0 0 8px ${statusColor};"></span>
      <strong>TinyFish Aegis:</strong> ${threatCount > 0 ? `<span style="color:#ff3366;">${threatCount} Threats Blocked</span>` : '<span style="color:#00f5a0;">Page Clean</span>'}
    `;

    badge.onclick = () => {
      alert(`🛡️ TinyFish Aegis Defense Active\nThreats Intercepted: ${threatCount}\nVisit local engine dashboard at http://localhost:8000 for full CDP analysis.`);
    };

    document.body.appendChild(badge);
  }

  window.addEventListener('load', () => {
    setTimeout(scanPage, 1000);
  });
})();
