document.addEventListener('DOMContentLoaded', () => {
  const toggleAutofix = document.getElementById('toggle-autofix');
  const modePill = document.getElementById('hud-mode-pill');
  const threatCountEl = document.getElementById('threat-count');
  const btnFreeze = document.getElementById('btn-freeze-timers');
  const btnUntick = document.getElementById('btn-untick-addons');
  const btnDashboard = document.getElementById('btn-open-dashboard');

  const btnScan = document.getElementById('btn-scan-page');
  const scanBtnText = document.getElementById('scan-btn-text');
  const scanFeedback = document.getElementById('scan-feedback');
  const scanResultsContainer = document.getElementById('scan-results-container');
  const scanScoreNum = document.getElementById('scan-score-num');
  const scanRiskBadge = document.getElementById('scan-risk-badge');
  const scanFindingsList = document.getElementById('scan-findings-list');

  function updateModeUI(enabled) {
    if (modePill) {
      if (enabled) {
        modePill.innerText = 'AUTO-FIX ON';
        modePill.classList.add('active-fix');
      } else {
        modePill.innerText = 'HIGHLIGHT ONLY';
        modePill.classList.remove('active-fix');
      }
    }
  }

  // 1. Load auto-fix setting (default: false / OFF)
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
    chrome.storage.local.get({ autofix: false }, (result) => {
      const isEnabled = !!result.autofix;
      if (toggleAutofix) toggleAutofix.checked = isEnabled;
      updateModeUI(isEnabled);
    });
  }

  // 2. Toggle listener
  if (toggleAutofix) {
    toggleAutofix.addEventListener('change', () => {
      const isEnabled = toggleAutofix.checked;
      updateModeUI(isEnabled);
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        chrome.storage.local.set({ autofix: isEnabled });
      }

      // Notify active tab
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.id) {
          chrome.tabs.sendMessage(tabs[0].id, { action: 'SET_AUTOFIX', enabled: isEnabled }, () => {
            if (chrome.runtime && chrome.runtime.lastError) {
              // Ignore if content script is not running on active tab
            }
          });
        }
      });
    });
  }

  // 3. Query initial threat count from active tab if content script is active
  if (typeof chrome !== 'undefined' && chrome.tabs) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'GET_THREAT_COUNT' }, (response) => {
          if (!chrome.runtime.lastError && response && typeof response.count === 'number') {
            if (threatCountEl) threatCountEl.innerText = response.count;
          }
        });
      }
    });
  }

  // 4. Live Page Scanner Logic (runs directly in active tab DOM context)
  function scanLivePageDom(autoFixActive) {
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

      function highlightEl(el, reason) {
        try {
          if (!el || !el.style) return;
          el.style.outline = '2px dashed #ff3366';
          el.style.outlineOffset = '2px';
          el.setAttribute('data-darkshield-flagged', 'true');
          el.setAttribute('title', '🛡️ DarkShield AI: ' + reason);
        } catch (_) {}
      }

      const allElements = document.querySelectorAll('body *');

      // Rule 1: False Urgency (Weight 20)
      const timerRegex = /\b(0?[0-9]|1[0-9]|2[0-3]):[0-5][0-9]\b/;
      const scarcityRegex = /(only\s+\d+\s+(left|remaining|portions|items|slots)|in\s+high\s+demand|\d+\s+people\s+(viewing|ordering|looking|bought)|selling\s+fast|almost\s+sold\s+out|hurry,\s+last\s+few|reserved\s+for)/i;
      let urgencyFound = false;

      for (const el of allElements) {
        if (['SCRIPT', 'STYLE', 'NOSCRIPT', 'SVG', 'PATH', 'IFRAME'].includes(el.tagName)) continue;
        if (el.children && el.children.length > 5) continue;

        const text = (el.innerText || el.textContent || '').trim();
        const hasClass = (el.className && typeof el.className === 'string' ? el.className : '').toLowerCase();
        const hasId = (el.id && typeof el.id === 'string' ? el.id : '').toLowerCase();
        const isTimer = hasClass.includes('timer') || hasClass.includes('countdown') || hasClass.includes('clock') ||
                        hasId.includes('timer') || hasId.includes('countdown') || (text.length < 30 && timerRegex.test(text));

        if (!urgencyFound && (isTimer || (text.length < 120 && scarcityRegex.test(text)))) {
          urgencyFound = true;
          detectedPatterns.add('False Urgency');
          highlightEl(el, 'False Urgency: Artificial countdown or scarcity pressure');
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
          const sneakKeywords = ['packaging', 'surge', 'rain', 'insurance', 'warranty', 'care plan', 'protection', 'donation', 'vip', 'fee', 'tip', 'delivery'];
          const textLower = parentText.toLowerCase();
          const matchesSneak = sneakKeywords.some(kw => textLower.includes(kw)) || cb.hasAttribute('checked');

          if (!sneakFound && matchesSneak) {
            sneakFound = true;
            detectedPatterns.add('Basket Sneaking');
            highlightEl(parent, 'Basket Sneaking: Pre-ticked fee or add-on checkbox');
            findings.push({
              pattern: 'Basket Sneaking',
              severity: 'CRITICAL',
              weight: 20,
              reason: 'Pre-selects optional fees or add-on items into cart without explicit consumer consent.',
              snippet: (parent.outerHTML || cb.outerHTML || parentText).substring(0, 160)
            });

            if (autoFixActive) {
              cb.checked = false;
              cb.dispatchEvent(new Event('change', { bubbles: true }));
            }
            break;
          }
        }
      }

      // Rule 3: Trick Question (Weight 15)
      const trickRegex = /(uncheck\s+if\s+you\s+(wish|prefer)\s+not|do\s+not\s+uncheck|opt-out\s+by\s+not|prevent\s+third-party)/i;
      let trickFound = false;
      for (const el of allElements) {
        if (['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(el.tagName)) continue;
        if (el.children && el.children.length > 3) continue;
        const text = (el.innerText || el.textContent || '').trim();
        if (text.length > 5 && text.length < 250 && trickRegex.test(text)) {
          if (!trickFound) {
            trickFound = true;
            detectedPatterns.add('Trick Question');
            highlightEl(el, 'Trick Question: Inverted double-negative consent syntax');
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
          let computedSmall = false;
          let computedFaint = false;
          try {
            const comp = window.getComputedStyle(el);
            const fs = parseFloat(comp.fontSize);
            const op = parseFloat(comp.opacity);
            if (!isNaN(fs) && fs > 0 && fs <= 10.5) computedSmall = true;
            if (!isNaN(op) && op > 0 && op <= 0.4) computedFaint = true;
          } catch (_) {}

          if (hasSmallFontAttr || hasLowOpacityAttr || computedSmall || computedFaint || el.tagName === 'SMALL') {
            if (!interfaceFound) {
              interfaceFound = true;
              detectedPatterns.add('Interface Interference');
              highlightEl(el, 'Interface Interference: Microscopic or visually obscured terms');
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
      const shameRegex = /(hate\s+saving|hate\s+discounts|pay\s+full\s+price|no\s+thanks,?\s+i('m|\s+am)?\s+(poor|cheap|don't\s+care)|lose\s+my\s+discount)/i;
      let shameFound = false;
      for (const el of allElements) {
        if (['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(el.tagName)) continue;
        const text = (el.innerText || el.textContent || '').trim();
        if (text.length > 4 && text.length < 150 && shameRegex.test(text)) {
          if (['A', 'BUTTON', 'SPAN', 'P', 'DIV'].includes(el.tagName)) {
            if (!shameFound) {
              shameFound = true;
              detectedPatterns.add('Confirm Shaming');
              highlightEl(el, 'Confirm Shaming: Emotionally manipulative decline phrasing');
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
            highlightEl(el, 'Subscription Trap: Hidden recurring mandate or continuous auto-debit terms');
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

      // Apply auto-fix freeze if enabled
      if (autoFixActive && urgencyFound) {
        try {
          const highestId = window.setInterval(() => {}, 9999);
          for (let i = 0; i < highestId; i++) window.clearInterval(i);
        } catch (_) {}
      }

      // Compute total score and risk level
      let totalScore = 0;
      detectedPatterns.forEach(pat => {
        totalScore += (weightsMap[pat] || 15);
      });
      const deceptionIndex = Math.min(100, totalScore);
      const riskLevel = deceptionIndex > 60 ? 'CRITICAL DECEPTION RISK' :
                       (deceptionIndex >= 30 ? 'MODERATE RISK' :
                       (deceptionIndex >= 11 ? 'LOW RISK' : 'NO DARK PATTERNS DETECTED'));

      return {
        success: true,
        score: deceptionIndex,
        riskLevel: riskLevel,
        threatCount: findings.length,
        findings: findings
      };
    } catch (err) {
      return {
        success: false,
        error: err && err.message ? err.message : String(err)
      };
    }
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;')
              .replace(/'/g, '&#039;');
  }

  function renderScanResults(scanData) {
    if (!scanResultsContainer) return;
    scanResultsContainer.style.display = 'block';

    const score = typeof scanData.score === 'number' ? scanData.score : 0;
    if (scanScoreNum) scanScoreNum.innerText = score;
    if (threatCountEl) threatCountEl.innerText = scanData.threatCount || 0;

    if (scanRiskBadge) {
      scanRiskBadge.innerText = scanData.riskLevel;
      scanRiskBadge.className = 'scan-risk-pill';
      if (score > 60) {
        scanRiskBadge.classList.add('risk-critical');
      } else if (score >= 30) {
        scanRiskBadge.classList.add('risk-moderate');
      } else if (score >= 11) {
        scanRiskBadge.classList.add('risk-low');
      } else {
        scanRiskBadge.classList.add('risk-clean');
      }
    }

    if (scanFindingsList) {
      if (!scanData.findings || scanData.findings.length === 0) {
        scanFindingsList.innerHTML = `
          <div class="finding-empty">
            <span class="finding-empty-icon">✅</span>
            <div class="finding-empty-title">Clean Page</div>
            <div class="finding-empty-desc">No deceptive patterns detected under CCPA 2023 Guidelines (Score: 0/100).</div>
          </div>
        `;
      } else {
        scanFindingsList.innerHTML = scanData.findings.map(f => `
          <div class="finding-item">
            <div class="finding-header">
              <span class="finding-pattern">${escapeHtml(f.pattern)}</span>
              <span class="finding-badge ${f.severity === 'CRITICAL' ? 'badge-crit' : 'badge-warn'}">+${f.weight} PTS</span>
            </div>
            <div class="finding-reason">${escapeHtml(f.reason)}</div>
            ${f.snippet ? `<pre class="finding-snippet"><code>${escapeHtml(f.snippet)}</code></pre>` : ''}
          </div>
        `).join('');
      }
    }
  }

  // 5. Scan button handler (activeTab + scripting)
  if (btnScan) {
    btnScan.addEventListener('click', () => {
      btnScan.disabled = true;
      if (scanBtnText) scanBtnText.innerText = 'Scanning Live DOM...';
      if (scanFeedback) {
        scanFeedback.style.display = 'none';
        scanFeedback.className = 'scan-feedback';
      }

      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs && tabs[0];
        if (!activeTab || !activeTab.id) {
          btnScan.disabled = false;
          if (scanBtnText) scanBtnText.innerText = 'Scan This Page';
          if (scanFeedback) {
            scanFeedback.innerText = '⚠️ No active browser tab found.';
            scanFeedback.style.display = 'block';
          }
          return;
        }

        const url = activeTab.url || '';
        if (url.startsWith('chrome://') || url.startsWith('chrome-extension://') || url.startsWith('edge://') || url.startsWith('about:') || url.startsWith('devtools://')) {
          btnScan.disabled = false;
          if (scanBtnText) scanBtnText.innerText = 'Scan This Page';
          if (scanFeedback) {
            scanFeedback.innerText = '⚠️ Browser security prevents scanning internal ' + (url.split('://')[0] || 'chrome') + ':// pages. Please test on a shopping page or the demo store.';
            scanFeedback.style.display = 'block';
          }
          return;
        }

        const autoFixEnabled = toggleAutofix ? toggleAutofix.checked : false;

        chrome.scripting.executeScript({
          target: { tabId: activeTab.id },
          func: scanLivePageDom,
          args: [autoFixEnabled]
        }, (results) => {
          btnScan.disabled = false;
          if (scanBtnText) scanBtnText.innerText = 'Re-Scan This Page';

          if (chrome.runtime.lastError) {
            if (scanFeedback) {
              scanFeedback.innerText = '⚠️ ' + chrome.runtime.lastError.message;
              scanFeedback.style.display = 'block';
            }
            return;
          }

          if (!results || !results[0] || !results[0].result) {
            if (scanFeedback) {
              scanFeedback.innerText = '⚠️ No analysis data returned from active page.';
              scanFeedback.style.display = 'block';
            }
            return;
          }

          const scanData = results[0].result;
          if (!scanData.success) {
            if (scanFeedback) {
              scanFeedback.innerText = '⚠️ ' + (scanData.error || 'DOM scan encountered an issue.');
              scanFeedback.style.display = 'block';
            }
            return;
          }

          renderScanResults(scanData);
        });
      });
    });
  }

  // 6. Manual action: Freeze Timers
  if (btnFreeze) {
    btnFreeze.addEventListener('click', () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.id) {
          chrome.tabs.sendMessage(tabs[0].id, { action: 'FREEZE_TIMERS' }, (response) => {
            if (chrome.runtime.lastError) {
              alert("DarkShield AI: Notice sent. Please ensure the target page has loaded.");
            }
          });
        }
      });
    });
  }

  // 7. Manual action: Untick Addons
  if (btnUntick) {
    btnUntick.addEventListener('click', () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.id) {
          chrome.tabs.sendMessage(tabs[0].id, { action: 'UNTICK_FEES' }, (response) => {
            if (chrome.runtime.lastError) {
              alert("DarkShield AI: Notice sent. Please ensure the target page has loaded.");
            }
          });
        }
      });
    });
  }

  // 8. Open Dashboard
  if (btnDashboard) {
    btnDashboard.addEventListener('click', () => {
      chrome.tabs.create({ url: "https://anything14907-byte.github.io/SupremeDevs/?v=4" });
    });
  }
});
