/**
 * DarkShield AI Extension - In-Browser Content Script (Prototype)
 * Runs entirely on your device. Zero network requests, tracking, or eval.
 * Default Mode: Highlight and warn only.
 */

(function () {
  'use strict';

  if (window.__darkshield_content_injected) {
    return;
  }
  window.__darkshield_content_injected = true;

  try {
    const SNEAK_KEYWORDS = [
      "packaging", "surge", "rain", "insurance", "warranty",
      "care plan", "protection", "donation", "vip membership", "cutlery",
      "convenience fee", "delivery partner tip", "platform fee"
    ];
    const CONFIRMSHAME_REGEX = /(hate\s+saving|hate\s+discounts|pay\s+full\s+price|no\s+thanks,?\s+i('m|\s+am)?\s+(poor|cheap|don't\s+care)|lose\s+my\s+discount)/i;
    const TRICK_REGEX = /(uncheck\s+if\s+you\s+(wish|prefer)\s+not|do\s+not\s+uncheck|opt-out\s+by\s+not|prevent\s+third-party)/i;
    const TIMER_REGEX = /\b(0?[0-9]|1[0-9]|2[0-3]):[0-5][0-9]\b/;
    const SCARCITY_REGEX = /(only\s+\d+\s+(left|remaining|portions|items|slots)|in\s+high\s+demand|\d+\s+people\s+(viewing|ordering|looking|bought)|selling\s+fast|almost\s+sold\s+out|hurry,\s+last\s+few|reserved\s+for)/i;

    let currentThreatCount = 0;
    let autoFixActive = false;
    let flaggedItems = []; // Array of { index: 1-based, element, pattern, reason, snippet, reachable: true }
    let currentNavIndex = 0;
    let keyListenerAttached = false;

    function isDarkShieldOrIgnored(el) {
      if (!el) return true;
      try {
        if (el.closest && (
          el.closest('[data-darkshield-demo]') ||
          el.closest('#darkshield-floating-badge') ||
          el.closest('#darkshield-navigator-panel') ||
          el.closest('#darkshield-badge-container') ||
          el.closest('.darkshield-number-badge')
        )) {
          return true;
        }
      } catch (_) {}
      return false;
    }

    function highlightElement(el, tooltipText) {
      try {
        if (!el || !el.style || isDarkShieldOrIgnored(el)) return;
        el.style.outline = "2px dashed #ff3366";
        el.style.outlineOffset = "2px";
        el.setAttribute("data-darkshield-flagged", "true");
        el.setAttribute("title", "🛡️ DarkShield AI: " + tooltipText);
      } catch (_) {}
    }

    function clearAllHighlightsAndBadges() {
      try {
        const badgeContainer = document.getElementById('darkshield-badge-container');
        if (badgeContainer) badgeContainer.remove();

        const nav = document.getElementById('darkshield-navigator-panel');
        if (nav) nav.remove();

        if (keyListenerAttached) {
          window.removeEventListener('keydown', handleKeyNav);
          keyListenerAttached = false;
        }

        document.querySelectorAll('[data-darkshield-flagged]').forEach(el => {
          try {
            el.style.outline = '';
            el.style.outlineOffset = '';
            el.removeAttribute('data-darkshield-flagged');
            el.removeAttribute('title');
            el.classList.remove('darkshield-pulsing');
          } catch (_) {}
        });

        flaggedItems = [];
      } catch (_) {}
    }

    function renderNumberedBadges() {
      try {
        let badgeContainer = document.getElementById('darkshield-badge-container');
        if (badgeContainer) badgeContainer.remove();

        if (!flaggedItems || flaggedItems.length === 0) return;

        badgeContainer = document.createElement('div');
        badgeContainer.id = 'darkshield-badge-container';
        badgeContainer.style.cssText = `
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 2147483640;
          overflow: visible;
        `;
        document.body.appendChild(badgeContainer);

        flaggedItems.forEach(item => {
          try {
            if (!item.element || !document.body.contains(item.element) || !item.reachable) return;
            const rect = item.element.getBoundingClientRect();
            const badge = document.createElement('div');
            badge.className = 'darkshield-number-badge';
            badge.textContent = String(item.index);
            badge.setAttribute('data-index', String(item.index));
            badge.style.cssText = `
              position: absolute;
              top: ${Math.max(0, rect.top + window.scrollY - 10)}px;
              left: ${Math.max(0, rect.left + window.scrollX - 10)}px;
              width: 22px;
              height: 22px;
              border-radius: 50%;
              background: #ff3366;
              color: #ffffff;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
              font-size: 11px;
              font-weight: 800;
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 2px 8px rgba(0,0,0,0.5);
              border: 2px solid #090c14;
              pointer-events: none;
              user-select: none;
              z-index: 2147483642;
            `;
            badgeContainer.appendChild(badge);
          } catch (_) {}
        });
      } catch (_) {}
    }

    function playPulseAnimation(el) {
      try {
        if (!el) return;
        if (!document.getElementById('darkshield-pulse-style')) {
          const style = document.createElement('style');
          style.id = 'darkshield-pulse-style';
          style.textContent = `
            @keyframes darkshield-pulse-glow {
              0% {
                outline: 4px solid #ff3366 !important;
                outline-offset: 3px !important;
                box-shadow: 0 0 0 0 rgba(255, 51, 102, 0.95) !important;
              }
              50% {
                outline: 5px solid #00f2fe !important;
                outline-offset: 4px !important;
                box-shadow: 0 0 28px 10px rgba(0, 242, 254, 0.8) !important;
              }
              100% {
                outline: 2px dashed #ff3366 !important;
                outline-offset: 2px !important;
                box-shadow: 0 0 0 0 rgba(255, 51, 102, 0) !important;
              }
            }
            .darkshield-pulsing {
              animation: darkshield-pulse-glow 2s cubic-bezier(0.2, 0.9, 0.3, 1) !important;
            }
          `;
          document.head.appendChild(style);
        }

        el.classList.remove('darkshield-pulsing');
        void el.offsetWidth;
        el.classList.add('darkshield-pulsing');
        setTimeout(() => {
          try { el.classList.remove('darkshield-pulsing'); } catch (_) {}
        }, 2100);
      } catch (_) {}
    }

    function jumpToElement(index) {
      try {
        if (!flaggedItems || flaggedItems.length === 0) {
          return { success: false, reason: 'NOT_FOUND' };
        }
        const idx = Math.max(0, Math.min(flaggedItems.length - 1, index - 1));
        const item = flaggedItems[idx];
        if (!item || !item.element || !document.body.contains(item.element) || !item.reachable) {
          return { success: false, reason: 'NOT_FOUND' };
        }

        currentNavIndex = idx;
        item.element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        playPulseAnimation(item.element);
        updateNavigatorPanel();

        return {
          success: true,
          index: item.index,
          total: flaggedItems.length,
          pattern: item.pattern,
          reason: item.reason
        };
      } catch (err) {
        return { success: false, error: String(err) };
      }
    }

    function handleKeyNav(e) {
      try {
        if (e.altKey && e.shiftKey) {
          if (e.code === 'KeyN' || e.key === 'N' || e.key === 'n') {
            e.preventDefault();
            if (flaggedItems.length > 0) {
              const nextIdx = (currentNavIndex + 1) % flaggedItems.length;
              jumpToElement(nextIdx + 1);
            }
          } else if (e.code === 'KeyP' || e.key === 'P' || e.key === 'p') {
            e.preventDefault();
            if (flaggedItems.length > 0) {
              const prevIdx = (currentNavIndex - 1 + flaggedItems.length) % flaggedItems.length;
              jumpToElement(prevIdx + 1);
            }
          }
        }
      } catch (_) {}
    }

    function showNavigatorPanel() {
      try {
        if (!document.body || flaggedItems.length === 0) return;

        let nav = document.getElementById('darkshield-navigator-panel');
        if (!nav) {
          nav = document.createElement('div');
          nav.id = 'darkshield-navigator-panel';
          nav.setAttribute('role', 'region');
          nav.setAttribute('aria-label', 'DarkShield flagged elements navigator');
          nav.style.cssText = `
            position: fixed;
            bottom: 24px;
            left: 24px;
            z-index: 2147483647;
            background: #090c14;
            border: 1px solid rgba(0, 242, 254, 0.45);
            border-radius: 12px;
            padding: 10px 14px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.75), 0 0 16px rgba(0, 242, 254, 0.15);
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            font-size: 13px;
            color: #f0f3fc;
            user-select: none;
            display: flex;
            flex-direction: column;
            gap: 4px;
            min-width: 250px;
            max-width: 320px;
            box-sizing: border-box;
          `;
          document.body.appendChild(nav);
        }

        updateNavigatorPanel();

        if (!keyListenerAttached) {
          window.addEventListener('keydown', handleKeyNav);
          keyListenerAttached = true;
        }
      } catch (_) {}
    }

    function updateNavigatorPanel() {
      try {
        const nav = document.getElementById('darkshield-navigator-panel');
        if (!nav) return;

        if (flaggedItems.length === 0) {
          nav.remove();
          return;
        }

        const total = flaggedItems.length;
        const curNum = Math.min(total, currentNavIndex + 1);
        const curItem = flaggedItems[currentNavIndex] || flaggedItems[0];
        const patternName = curItem ? curItem.pattern : 'Flagged Threat';
        const reasonText = curItem ? curItem.reason : '';

        nav.innerHTML = `
          <div style="display: flex; justify-content: space-between; align-items: center; gap: 8px;">
            <span style="font-weight: 800; color: #ff3366; font-size: 12px; letter-spacing: 0.3px;">
              ${total} flagged
            </span>
            <div style="display: flex; align-items: center; gap: 6px;">
              <button id="ds-nav-prev" type="button" aria-label="Previous flagged element (Alt+Shift+P)" style="
                background: rgba(255,255,255,0.08);
                border: 1px solid rgba(255,255,255,0.2);
                color: #00f2fe;
                border-radius: 4px;
                cursor: pointer;
                padding: 2px 7px;
                font-size: 11px;
                font-weight: bold;
              ">◀</button>
              <span id="ds-nav-counter" style="font-family: monospace; font-size: 12px; font-weight: 700; color: #fff;">
                ${curNum}/${total}
              </span>
              <button id="ds-nav-next" type="button" aria-label="Next flagged element (Alt+Shift+N)" style="
                background: rgba(255,255,255,0.08);
                border: 1px solid rgba(255,255,255,0.2);
                color: #00f2fe;
                border-radius: 4px;
                cursor: pointer;
                padding: 2px 7px;
                font-size: 11px;
                font-weight: bold;
              ">▶</button>
            </div>
            <button id="ds-nav-close" type="button" aria-label="Close navigator and clear highlights" style="
              background: transparent;
              border: none;
              color: #94a3b8;
              font-size: 14px;
              cursor: pointer;
              padding: 0 4px;
              line-height: 1;
            ">✕</button>
          </div>
          <div style="font-size: 11px; color: #cbd5e1; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 2px;" title="${reasonText}">
            #${curNum} ${patternName}
          </div>
        `;

        const btnPrev = nav.querySelector('#ds-nav-prev');
        const btnNext = nav.querySelector('#ds-nav-next');
        const btnClose = nav.querySelector('#ds-nav-close');

        if (btnPrev) {
          btnPrev.onclick = () => {
            const prevIdx = (currentNavIndex - 1 + flaggedItems.length) % flaggedItems.length;
            jumpToElement(prevIdx + 1);
          };
        }
        if (btnNext) {
          btnNext.onclick = () => {
            const nextIdx = (currentNavIndex + 1) % flaggedItems.length;
            jumpToElement(nextIdx + 1);
          };
        }
        if (btnClose) {
          btnClose.onclick = () => {
            clearAllHighlightsAndBadges();
          };
        }
      } catch (_) {}
    }

    function freezeTimers() {
      try {
        let count = 0;
        const flagged = new Set();
        const timerElements = document.querySelectorAll('[class*="countdown"], [class*="timer"], [class*="clock"], [id*="countdown"], [id*="timer"], [id*="clock"]');
        timerElements.forEach(el => {
          if (isDarkShieldOrIgnored(el)) return;
          const txt = el.innerText || el.textContent || "";
          if (TIMER_REGEX.test(txt) || (el.className && typeof el.className === 'string' && (el.className.toLowerCase().includes('timer') || el.className.toLowerCase().includes('countdown')))) {
            flagged.add(el);
          }
        });

        if (flagged.size === 0) {
          document.querySelectorAll('div, span, p, b, strong').forEach(el => {
            if (isDarkShieldOrIgnored(el)) return;
            if (el.children.length === 0 && TIMER_REGEX.test(el.innerText || "")) {
              flagged.add(el);
            }
          });
        }
        count = flagged.size;

        const highestId = window.setInterval(() => {}, 9999);
        for (let i = 0; i < highestId; i++) window.clearInterval(i);

        const badge = document.getElementById('darkshield-floating-badge');
        if (badge) {
          const statusEl = badge.querySelector('.badge-status');
          if (statusEl) statusEl.innerText = count > 0 ? "Timers Frozen" : "Active";
        }
        return count;
      } catch (_) {
        return 0;
      }
    }

    function untickFees() {
      try {
        let count = 0;
        const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
        checkboxes.forEach(cb => {
          try {
            if (isDarkShieldOrIgnored(cb)) return;
            const parent = cb.closest('label') || cb.parentElement || cb;
            const parentText = (parent.innerText || parent.textContent || cb.name || cb.id || "").toLowerCase();
            if (SNEAK_KEYWORDS.some(kw => parentText.includes(kw)) || cb.hasAttribute('checked')) {
              cb.checked = false;
              cb.dispatchEvent(new Event('change', { bubbles: true }));
              cb.dispatchEvent(new Event('input', { bubbles: true }));
              count++;
            }
          } catch (_) {}
        });
        return count;
      } catch (_) {
        return 0;
      }
    }

    function applyAutoFix() {
      try {
        autoFixActive = true;
        freezeTimers();
        untickFees();
      } catch (_) {}
    }

    function removeFloatingBadge() {
      try {
        const existing = document.getElementById('darkshield-floating-badge');
        if (existing) existing.remove();
      } catch (_) {}
    }

    function injectFloatingBadge(threatCount) {
      try {
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
          showNavigatorPanel();
          if (flaggedItems.length > 0) {
            jumpToElement(1);
          }
        };
      } catch (_) {}
    }

    function runDetailedScan() {
      try {
        flaggedItems = [];
        currentNavIndex = 0;

        const findings = [];
        const detectedPatterns = new Set();
        const weightsMap = {
          'False Urgency': 20,
          'Basket Sneaking': 20,
          'Trick Question': 15,
          'Interface Interference': 15,
          'Confirm Shaming': 15,
          'Subscription Trap': 15
        };

        const allElements = document.querySelectorAll('body *');

        // Rule 1: False Urgency (Weight 20)
        let urgencyFound = false;
        for (const el of allElements) {
          if (['SCRIPT', 'STYLE', 'NOSCRIPT', 'SVG', 'PATH', 'IFRAME'].includes(el.tagName)) continue;
          if (isDarkShieldOrIgnored(el)) continue;
          if (el.children && el.children.length > 5) continue;

          const text = (el.innerText || el.textContent || '').trim();
          const hasClass = (el.className && typeof el.className === 'string' ? el.className : '').toLowerCase();
          const hasId = (el.id && typeof el.id === 'string' ? el.id : '').toLowerCase();
          const isTimer = hasClass.includes('timer') || hasClass.includes('countdown') || hasClass.includes('clock') ||
                          hasId.includes('timer') || hasId.includes('countdown') || (text.length < 30 && TIMER_REGEX.test(text));

          if (!urgencyFound && (isTimer || (text.length < 120 && SCARCITY_REGEX.test(text)))) {
            urgencyFound = true;
            detectedPatterns.add('False Urgency');
            const reason = 'Uses artificial countdown timers or scarcity counters to create psychological pressure.';
            highlightElement(el, 'False Urgency: ' + reason);
            const itemIndex = flaggedItems.length + 1;
            flaggedItems.push({
              index: itemIndex,
              element: el,
              pattern: 'False Urgency',
              reason: reason,
              snippet: (el.outerHTML || text).substring(0, 160),
              reachable: true
            });
            findings.push({
              index: itemIndex,
              pattern: 'False Urgency',
              severity: 'HIGH',
              weight: 20,
              reason: reason,
              snippet: (el.outerHTML || text).substring(0, 160),
              reachable: true
            });
            break;
          }
        }

        // Rule 2: Basket Sneaking (Weight 20)
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        let sneakFound = false;
        for (const cb of checkboxes) {
          if (isDarkShieldOrIgnored(cb)) continue;
          const isChecked = cb.checked || cb.hasAttribute('checked');
          if (isChecked) {
            const parent = cb.closest('label') || cb.parentElement || cb;
            const parentText = (parent.innerText || parent.textContent || cb.name || cb.id || 'Pre-checked add-on fee').trim();
            const textLower = parentText.toLowerCase();
            const matchesSneak = SNEAK_KEYWORDS.some(kw => textLower.includes(kw)) || cb.hasAttribute('checked');

            if (!sneakFound && matchesSneak) {
              sneakFound = true;
              detectedPatterns.add('Basket Sneaking');
              const reason = 'Pre-selects optional fees or add-on items into cart without explicit consumer consent.';
              highlightElement(parent, 'Basket Sneaking: ' + reason);
              const itemIndex = flaggedItems.length + 1;
              flaggedItems.push({
                index: itemIndex,
                element: parent,
                pattern: 'Basket Sneaking',
                reason: reason,
                snippet: (parent.outerHTML || cb.outerHTML || parentText).substring(0, 160),
                reachable: true
              });
              findings.push({
                index: itemIndex,
                pattern: 'Basket Sneaking',
                severity: 'CRITICAL',
                weight: 20,
                reason: reason,
                snippet: (parent.outerHTML || cb.outerHTML || parentText).substring(0, 160),
                reachable: true
              });
              break;
            }
          }
        }

        // Rule 3: Trick Question (Weight 15)
        let trickFound = false;
        for (const el of allElements) {
          if (['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(el.tagName)) continue;
          if (isDarkShieldOrIgnored(el)) continue;
          if (el.children && el.children.length > 3) continue;
          const text = (el.innerText || el.textContent || '').trim();
          if (text.length > 5 && text.length < 250 && TRICK_REGEX.test(text)) {
            if (!trickFound) {
              trickFound = true;
              detectedPatterns.add('Trick Question');
              const reason = 'Uses confusing double-negative syntax to mislead consumers into granting unintended consent.';
              highlightElement(el, 'Trick Question: ' + reason);
              const itemIndex = flaggedItems.length + 1;
              flaggedItems.push({
                index: itemIndex,
                element: el,
                pattern: 'Trick Question',
                reason: reason,
                snippet: (el.outerHTML || text).substring(0, 160),
                reachable: true
              });
              findings.push({
                index: itemIndex,
                pattern: 'Trick Question',
                severity: 'MEDIUM',
                weight: 15,
                reason: reason,
                snippet: (el.outerHTML || text).substring(0, 160),
                reachable: true
              });
              break;
            }
          }
        }

        // Rule 4: Interface Interference (Weight 15)
        let interfaceFound = false;
        for (const el of allElements) {
          if (['SCRIPT', 'STYLE', 'NOSCRIPT', 'SVG'].includes(el.tagName)) continue;
          if (isDarkShieldOrIgnored(el)) continue;
          if (el.children && el.children.length > 2) continue;
          const text = (el.innerText || el.textContent || '').trim();
          if (text.length > 20 && text.length < 500) {
            const styleAttr = (el.getAttribute('style') || '').toLowerCase();
            const hasSmallFontAttr = /font-size:\s*([4-9]|10)px/.test(styleAttr) || /font-size:\s*0\.[0-7]rem/.test(styleAttr);
            const hasLowOpacityAttr = /opacity:\s*0\.[1-4]/.test(styleAttr);
            let compSmall = false;
            let compFaint = false;
            try {
              const comp = window.getComputedStyle(el);
              const fs = parseFloat(comp.fontSize);
              const op = parseFloat(comp.opacity);
              if (!isNaN(fs) && fs > 0 && fs <= 10.5) compSmall = true;
              if (!isNaN(op) && op > 0 && op <= 0.4) compFaint = true;
            } catch (_) {}

            if (hasSmallFontAttr || hasLowOpacityAttr || compSmall || compFaint || el.tagName === 'SMALL') {
              if (!interfaceFound) {
                interfaceFound = true;
                detectedPatterns.add('Interface Interference');
                const reason = 'Uses microscopic or low-contrast styling to visually obscure critical transaction terms.';
                highlightElement(el, 'Interface Interference: ' + reason);
                const itemIndex = flaggedItems.length + 1;
                flaggedItems.push({
                  index: itemIndex,
                  element: el,
                  pattern: 'Interface Interference',
                  reason: reason,
                  snippet: (el.outerHTML || text).substring(0, 160),
                  reachable: true
                });
                findings.push({
                  index: itemIndex,
                  pattern: 'Interface Interference',
                  severity: 'HIGH',
                  weight: 15,
                  reason: reason,
                  snippet: (el.outerHTML || text).substring(0, 160),
                  reachable: true
                });
                break;
              }
            }
          }
        }

        // Rule 5: Confirm Shaming (Weight 15)
        let shameFound = false;
        for (const el of allElements) {
          if (['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(el.tagName)) continue;
          if (isDarkShieldOrIgnored(el)) continue;
          const text = (el.innerText || el.textContent || '').trim();
          if (text.length > 4 && text.length < 150 && CONFIRMSHAME_REGEX.test(text)) {
            if (['A', 'BUTTON', 'SPAN', 'P', 'DIV'].includes(el.tagName)) {
              if (!shameFound) {
                shameFound = true;
                detectedPatterns.add('Confirm Shaming');
                const reason = 'Uses manipulative language to shame consumers for exercising their right to decline.';
                highlightElement(el, 'Confirm Shaming: ' + reason);
                const itemIndex = flaggedItems.length + 1;
                flaggedItems.push({
                  index: itemIndex,
                  element: el,
                  pattern: 'Confirm Shaming',
                  reason: reason,
                  snippet: (el.outerHTML || text).substring(0, 160),
                  reachable: true
                });
                findings.push({
                  index: itemIndex,
                  pattern: 'Confirm Shaming',
                  severity: 'HIGH',
                  weight: 15,
                  reason: reason,
                  snippet: (el.outerHTML || text).substring(0, 160),
                  reachable: true
                });
                break;
              }
            }
          }
        }

        // Rule 6: Subscription Trap (Weight 15)
        let subFound = false;
        for (const el of allElements) {
          if (['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(el.tagName)) continue;
          if (isDarkShieldOrIgnored(el)) continue;
          if (el.children && el.children.length > 3) continue;
          const text = (el.innerText || el.textContent || '').toLowerCase().trim();
          const hasSubTerms = (text.includes('autopay') || text.includes('upi mandate') || text.includes('debited') || text.includes('recurring') || text.includes('every year automatically') || text.includes('every month automatically')) && text.length > 25 && text.length < 400;
          if (hasSubTerms) {
            if (!subFound) {
              subFound = true;
              detectedPatterns.add('Subscription Trap');
              const reason = 'Enrolls consumers into recurring payments without clear, upfront affirmative agreement.';
              highlightElement(el, 'Subscription Trap: ' + reason);
              const itemIndex = flaggedItems.length + 1;
              flaggedItems.push({
                index: itemIndex,
                element: el,
                pattern: 'Subscription Trap',
                reason: reason,
                snippet: (el.outerHTML || el.innerText || text).substring(0, 160),
                reachable: true
              });
              findings.push({
                index: itemIndex,
                pattern: 'Subscription Trap',
                severity: 'CRITICAL',
                weight: 15,
                reason: reason,
                snippet: (el.outerHTML || el.innerText || text).substring(0, 160),
                reachable: true
              });
              break;
            }
          }
        }

        // Safe check for iframes/shadow DOM
        try {
          const iframes = document.querySelectorAll('iframe');
          iframes.forEach(ifr => {
            try {
              if (!ifr.contentDocument) {
                // If frame cannot be accessed due to cross-origin policies
                // Handled gracefully without throwing
              }
            } catch (_) {}
          });
        } catch (_) {}

        // Compute total score and risk level
        let totalScore = 0;
        detectedPatterns.forEach(pat => {
          totalScore += (weightsMap[pat] || 15);
        });
        const deceptionIndex = Math.min(100, totalScore);
        const riskLevel = deceptionIndex > 60 ? 'CRITICAL DECEPTION RISK' :
                         (deceptionIndex >= 30 ? 'MODERATE RISK' :
                         (deceptionIndex >= 11 ? 'LOW RISK' : 'NO DARK PATTERNS DETECTED'));

        currentThreatCount = findings.length;

        // Render numbered badges and floating UI
        renderNumberedBadges();

        if (currentThreatCount > 0) {
          injectFloatingBadge(currentThreatCount);
          showNavigatorPanel();
        } else {
          removeFloatingBadge();
          const nav = document.getElementById('darkshield-navigator-panel');
          if (nav) nav.remove();
        }

        return {
          success: true,
          score: deceptionIndex,
          riskLevel: riskLevel,
          threatCount: currentThreatCount,
          findings: findings
        };
      } catch (err) {
        return {
          success: false,
          error: err && err.message ? err.message : String(err),
          threatCount: 0,
          score: 0,
          findings: []
        };
      }
    }

    function scanPage() {
      try {
        runDetailedScan();
      } catch (_) {}
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
            const count = freezeTimers();
            scanPage();
            sendResponse({ success: true, count: count, threats: currentThreatCount });
          } else if (request.action === 'UNTICK_FEES') {
            const count = untickFees();
            scanPage();
            sendResponse({ success: true, count: count, threats: currentThreatCount });
          } else if (request.action === 'SCAN_PAGE') {
            if (request.autoFix) {
              untickFees();
              freezeTimers();
            }
            const res = runDetailedScan();
            sendResponse(res);
          } else if (request.action === 'JUMP_TO_ELEMENT') {
            const jumpRes = jumpToElement(request.index || 1);
            sendResponse(jumpRes);
          } else if (request.action === 'CLEAR_HIGHLIGHTS') {
            clearAllHighlightsAndBadges();
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
