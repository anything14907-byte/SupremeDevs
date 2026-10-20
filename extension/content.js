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

    function highlightElement(el, tooltipText) {
      try {
        if (!el || !el.style) return;
        el.style.outline = "2px dashed #ff3366";
        el.style.outlineOffset = "2px";
        el.setAttribute("data-darkshield-flagged", "true");
        el.setAttribute("title", "🛡️ DarkShield AI: " + tooltipText);
      } catch (_) {}
    }

    function freezeTimers() {
      try {
        let count = 0;
        const flagged = new Set();
        const timerElements = document.querySelectorAll('[class*="countdown"], [class*="timer"], [class*="clock"], [id*="countdown"], [id*="timer"], [id*="clock"]');
        timerElements.forEach(el => {
          const txt = el.innerText || el.textContent || "";
          if (TIMER_REGEX.test(txt) || (el.className && typeof el.className === 'string' && (el.className.toLowerCase().includes('timer') || el.className.toLowerCase().includes('countdown')))) {
            flagged.add(el);
          }
        });

        if (flagged.size === 0) {
          document.querySelectorAll('div, span, p, b, strong').forEach(el => {
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
          badge.style.transform = 'scale(1.05)';
          setTimeout(() => {
            try { badge.style.transform = 'scale(1)'; } catch (_) {}
          }, 200);
        };
      } catch (_) {}
    }

    function runDetailedScan() {
      try {
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
          if (el.children && el.children.length > 5) continue;

          const text = (el.innerText || el.textContent || '').trim();
          const hasClass = (el.className && typeof el.className === 'string' ? el.className : '').toLowerCase();
          const hasId = (el.id && typeof el.id === 'string' ? el.id : '').toLowerCase();
          const isTimer = hasClass.includes('timer') || hasClass.includes('countdown') || hasClass.includes('clock') ||
                          hasId.includes('timer') || hasId.includes('countdown') || (text.length < 30 && TIMER_REGEX.test(text));

          if (!urgencyFound && (isTimer || (text.length < 120 && SCARCITY_REGEX.test(text)))) {
            urgencyFound = true;
            detectedPatterns.add('False Urgency');
            highlightElement(el, 'False Urgency: Artificial countdown or scarcity pressure');
            findings.push({
              pattern: 'False Urgency',
              severity: 'HIGH',
              weight: 20,
              reason: 'Uses artificial countdown timers or scarcity counters to create psychological pressure.',
              snippet: (el.outerHTML || text).substring(0, 160)
            });
            break;
          }
        }

        // Rule 2: Basket Sneaking (Weight 20)
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        let sneakFound = false;
        for (const cb of checkboxes) {
          const isChecked = cb.checked || cb.hasAttribute('checked');
          if (isChecked) {
            const parent = cb.closest('label') || cb.parentElement || cb;
            const parentText = (parent.innerText || parent.textContent || cb.name || cb.id || 'Pre-checked add-on fee').trim();
            const textLower = parentText.toLowerCase();
            const matchesSneak = SNEAK_KEYWORDS.some(kw => textLower.includes(kw)) || cb.hasAttribute('checked');

            if (!sneakFound && matchesSneak) {
              sneakFound = true;
              detectedPatterns.add('Basket Sneaking');
              highlightElement(parent, 'Basket Sneaking: Pre-ticked fee or add-on checkbox');
              findings.push({
                pattern: 'Basket Sneaking',
                severity: 'CRITICAL',
                weight: 20,
                reason: 'Pre-selects optional fees or add-on items into cart without explicit consumer consent.',
                snippet: (parent.outerHTML || cb.outerHTML || parentText).substring(0, 160)
              });
              break;
            }
          }
        }

        // Rule 3: Trick Question (Weight 15)
        let trickFound = false;
        for (const el of allElements) {
          if (['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(el.tagName)) continue;
          if (el.children && el.children.length > 3) continue;
          const text = (el.innerText || el.textContent || '').trim();
          if (text.length > 5 && text.length < 250 && TRICK_REGEX.test(text)) {
            if (!trickFound) {
              trickFound = true;
              detectedPatterns.add('Trick Question');
              highlightElement(el, 'Trick Question: Inverted double-negative consent syntax');
              findings.push({
                pattern: 'Trick Question',
                severity: 'MEDIUM',
                weight: 15,
                reason: 'Uses confusing double-negative syntax to mislead consumers into granting unintended consent.',
                snippet: (el.outerHTML || text).substring(0, 160)
              });
              break;
            }
          }
        }

        // Rule 4: Interface Interference (Weight 15)
        let interfaceFound = false;
        for (const el of allElements) {
          if (['SCRIPT', 'STYLE', 'NOSCRIPT', 'SVG'].includes(el.tagName)) continue;
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
                highlightElement(el, 'Interface Interference: Microscopic or visually obscured terms');
                findings.push({
                  pattern: 'Interface Interference',
                  severity: 'HIGH',
                  weight: 15,
                  reason: 'Uses microscopic or low-contrast styling to visually obscure critical transaction terms.',
                  snippet: (el.outerHTML || text).substring(0, 160)
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
          const text = (el.innerText || el.textContent || '').trim();
          if (text.length > 4 && text.length < 150 && CONFIRMSHAME_REGEX.test(text)) {
            if (['A', 'BUTTON', 'SPAN', 'P', 'DIV'].includes(el.tagName)) {
              if (!shameFound) {
                shameFound = true;
                detectedPatterns.add('Confirm Shaming');
                highlightElement(el, 'Confirm Shaming: Emotionally manipulative decline phrasing');
                findings.push({
                  pattern: 'Confirm Shaming',
                  severity: 'HIGH',
                  weight: 15,
                  reason: 'Uses manipulative language to shame consumers for exercising their right to decline.',
                  snippet: (el.outerHTML || text).substring(0, 160)
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
          if (el.children && el.children.length > 3) continue;
          const text = (el.innerText || el.textContent || '').toLowerCase().trim();
          const hasSubTerms = (text.includes('autopay') || text.includes('upi mandate') || text.includes('debited') || text.includes('recurring') || text.includes('every year automatically') || text.includes('every month automatically')) && text.length > 25 && text.length < 400;
          if (hasSubTerms) {
            if (!subFound) {
              subFound = true;
              detectedPatterns.add('Subscription Trap');
              highlightElement(el, 'Subscription Trap: Hidden recurring mandate or continuous auto-debit terms');
              findings.push({
                pattern: 'Subscription Trap',
                severity: 'CRITICAL',
                weight: 15,
                reason: 'Enrolls consumers into recurring payments without clear, upfront affirmative agreement.',
                snippet: (el.outerHTML || el.innerText || text).substring(0, 160)
              });
              break;
            }
          }
        }

        let totalScore = 0;
        detectedPatterns.forEach(pat => {
          totalScore += (weightsMap[pat] || 15);
        });
        const deceptionIndex = Math.min(100, totalScore);
        const riskLevel = deceptionIndex > 60 ? 'CRITICAL DECEPTION RISK' :
                         (deceptionIndex >= 30 ? 'MODERATE RISK' :
                         (deceptionIndex >= 11 ? 'LOW RISK' : 'NO DARK PATTERNS DETECTED'));

        currentThreatCount = findings.length;
        if (currentThreatCount > 0) {
          injectFloatingBadge(currentThreatCount);
        } else {
          removeFloatingBadge();
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
