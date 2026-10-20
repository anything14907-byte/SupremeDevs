document.addEventListener('DOMContentLoaded', () => {
  try {
    const toggleAutofix = document.getElementById('toggle-autofix');
    const modePill = document.getElementById('hud-mode-pill');
    const threatCountEl = document.getElementById('threat-count');
    const btnFreeze = document.getElementById('btn-freeze-timers');
    const btnUntick = document.getElementById('btn-untick-addons');
    const btnDashboard = document.getElementById('btn-open-dashboard');

    const btnScan = document.getElementById('btn-scan-page');
    const scanBtnText = document.getElementById('scan-btn-text');
    const scanFeedback = document.getElementById('scan-feedback');
    const actionStatus = document.getElementById('action-status');
    const scanResultsContainer = document.getElementById('scan-results-container');
    const scanScoreNum = document.getElementById('scan-score-num');
    const scanRiskBadge = document.getElementById('scan-risk-badge');
    const scanFindingsList = document.getElementById('scan-findings-list');

    function updateModeUI(enabled) {
      try {
        if (modePill) {
          if (enabled) {
            modePill.innerText = 'AUTO-FIX ON';
            modePill.classList.add('active-fix');
          } else {
            modePill.innerText = 'HIGHLIGHT ONLY';
            modePill.classList.remove('active-fix');
          }
        }
      } catch (_) {}
    }

    function isRestrictedUrl(url) {
      if (!url || typeof url !== 'string') return true;
      const u = url.trim().toLowerCase();
      return (
        u.startsWith('chrome://') ||
        u.startsWith('brave://') ||
        u.startsWith('edge://') ||
        u.startsWith('opera://') ||
        u.startsWith('chrome-extension://') ||
        u.startsWith('devtools://') ||
        u.startsWith('view-source:') ||
        u.startsWith('about:') ||
        u === 'about:blank' ||
        u.includes('chromewebstore.google.com') ||
        u.includes('chrome.google.com/webstore')
      );
    }

    function showActionStatus(message, type = 'info') {
      try {
        if (!actionStatus) return;
        actionStatus.innerText = message;
        actionStatus.className = 'action-status ' + type;
        actionStatus.style.display = 'block';
      } catch (_) {}
    }

    function showScanFeedback(message, type = 'info') {
      try {
        if (!scanFeedback) return;
        scanFeedback.innerText = message;
        scanFeedback.className = 'scan-feedback ' + type;
        scanFeedback.style.display = 'block';
      } catch (_) {}
    }

    function hideStatusLines() {
      try {
        if (actionStatus) {
          actionStatus.style.display = 'none';
          actionStatus.innerText = '';
        }
        if (scanFeedback) {
          scanFeedback.style.display = 'none';
          scanFeedback.innerText = '';
        }
      } catch (_) {}
    }

    function escapeHtml(str) {
      if (!str) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }

    // Tries chrome.tabs.sendMessage; if failed, injects content.js and retries once
    function sendMessageWithInjection(tabId, message, callback) {
      try {
        chrome.tabs.sendMessage(tabId, message, (response) => {
          if (chrome.runtime && chrome.runtime.lastError || !response) {
            // No receiver in tab - inject content.js and retry once
            try {
              chrome.scripting.executeScript({
                target: { tabId: tabId },
                files: ['content.js']
              }, () => {
                if (chrome.runtime && chrome.runtime.lastError) {
                  callback(chrome.runtime.lastError, null);
                  return;
                }
                setTimeout(() => {
                  try {
                    chrome.tabs.sendMessage(tabId, message, (retryResponse) => {
                      if (chrome.runtime && chrome.runtime.lastError) {
                        callback(chrome.runtime.lastError, null);
                      } else {
                        callback(null, retryResponse);
                      }
                    });
                  } catch (retryErr) {
                    callback(retryErr, null);
                  }
                }, 80);
              });
            } catch (injErr) {
              callback(injErr, null);
            }
          } else {
            callback(null, response);
          }
        });
      } catch (err) {
        callback(err, null);
      }
    }

    // 1. Load auto-fix setting (default: false / OFF)
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      try {
        chrome.storage.local.get({ autofix: false }, (result) => {
          try {
            const isEnabled = !!(result && result.autofix);
            if (toggleAutofix) toggleAutofix.checked = isEnabled;
            updateModeUI(isEnabled);
          } catch (_) {}
        });
      } catch (_) {}
    }

    // 2. Toggle listener
    if (toggleAutofix) {
      toggleAutofix.addEventListener('change', () => {
        try {
          const isEnabled = toggleAutofix.checked;
          updateModeUI(isEnabled);
          if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
            chrome.storage.local.set({ autofix: isEnabled });
          }

          chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            try {
              const activeTab = tabs && tabs[0];
              if (activeTab && activeTab.id && !isRestrictedUrl(activeTab.url)) {
                sendMessageWithInjection(activeTab.id, { action: 'SET_AUTOFIX', enabled: isEnabled }, () => {});
              }
            } catch (_) {}
          });
        } catch (_) {}
      });
    }

    // 3. Query initial threat count from active tab
    if (typeof chrome !== 'undefined' && chrome.tabs) {
      try {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          try {
            const activeTab = tabs && tabs[0];
            if (activeTab && activeTab.id && !isRestrictedUrl(activeTab.url)) {
              sendMessageWithInjection(activeTab.id, { action: 'GET_THREAT_COUNT' }, (err, response) => {
                try {
                  if (!err && response && typeof response.count === 'number') {
                    if (threatCountEl) threatCountEl.innerText = response.count;
                  }
                } catch (_) {}
              });
            }
          } catch (_) {}
        });
      } catch (_) {}
    }

    // 4. Render Scan Results in Popup
    function renderScanResults(scanData) {
      try {
        if (!scanResultsContainer) return;
        scanResultsContainer.style.display = 'block';

        const score = typeof scanData.score === 'number' ? scanData.score : 0;
        if (scanScoreNum) scanScoreNum.innerText = score;
        if (threatCountEl) threatCountEl.innerText = scanData.threatCount || 0;

        if (scanRiskBadge) {
          scanRiskBadge.innerText = scanData.riskLevel || (score > 0 ? 'RISK DETECTED' : 'NO DARK PATTERNS');
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
                <div class="finding-empty-title">No dark patterns detected.</div>
                <div class="finding-empty-desc">This page is clean under CCPA 2023 Guidelines (Score: 0/100).</div>
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
      } catch (_) {}
    }

    // 5. Scan button handler
    if (btnScan) {
      btnScan.addEventListener('click', () => {
        try {
          hideStatusLines();
          btnScan.disabled = true;
          if (scanBtnText) scanBtnText.innerText = 'Scanning Live DOM...';

          chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            try {
              const activeTab = tabs && tabs[0];
              if (!activeTab || !activeTab.id || isRestrictedUrl(activeTab.url)) {
                btnScan.disabled = false;
                if (scanBtnText) scanBtnText.innerText = 'Scan This Page';
                showScanFeedback("DarkShield can't run on this page. Open a shopping page or our demo store.", "restricted");
                return;
              }

              const autoFixEnabled = toggleAutofix ? toggleAutofix.checked : false;

              sendMessageWithInjection(activeTab.id, { action: 'SCAN_PAGE', autoFix: autoFixEnabled }, (err, response) => {
                try {
                  btnScan.disabled = false;
                  if (scanBtnText) scanBtnText.innerText = 'Re-Scan This Page';

                  if (err || !response || !response.success) {
                    showScanFeedback("DarkShield can't run on this page. Open a shopping page or our demo store.", "restricted");
                    return;
                  }

                  renderScanResults(response);
                } catch (_) {
                  btnScan.disabled = false;
                  if (scanBtnText) scanBtnText.innerText = 'Scan This Page';
                }
              });
            } catch (_) {
              btnScan.disabled = false;
              if (scanBtnText) scanBtnText.innerText = 'Scan This Page';
            }
          });
        } catch (_) {
          if (btnScan) btnScan.disabled = false;
        }
      });
    }

    // 6. Manual action: Freeze Timers
    if (btnFreeze) {
      btnFreeze.addEventListener('click', () => {
        try {
          hideStatusLines();
          chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            try {
              const activeTab = tabs && tabs[0];
              if (!activeTab || !activeTab.id || isRestrictedUrl(activeTab.url)) {
                showActionStatus("DarkShield can't run on this page. Open a shopping page or our demo store.", "restricted");
                return;
              }

              sendMessageWithInjection(activeTab.id, { action: 'FREEZE_TIMERS' }, (err, response) => {
                try {
                  if (err || !response) {
                    showActionStatus("DarkShield can't run on this page. Open a shopping page or our demo store.", "restricted");
                    return;
                  }

                  const count = typeof response.count === 'number' ? response.count : 0;
                  if (count > 0) {
                    showActionStatus(`Froze ${count} timer(s)`, "success");
                  } else {
                    showActionStatus("No countdown timers found on this page.", "info");
                  }

                  if (typeof response.threats === 'number' && threatCountEl) {
                    threatCountEl.innerText = response.threats;
                  }
                } catch (_) {}
              });
            } catch (_) {}
          });
        } catch (_) {}
      });
    }

    // 7. Manual action: Untick Addons
    if (btnUntick) {
      btnUntick.addEventListener('click', () => {
        try {
          hideStatusLines();
          chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            try {
              const activeTab = tabs && tabs[0];
              if (!activeTab || !activeTab.id || isRestrictedUrl(activeTab.url)) {
                showActionStatus("DarkShield can't run on this page. Open a shopping page or our demo store.", "restricted");
                return;
              }

              sendMessageWithInjection(activeTab.id, { action: 'UNTICK_FEES' }, (err, response) => {
                try {
                  if (err || !response) {
                    showActionStatus("DarkShield can't run on this page. Open a shopping page or our demo store.", "restricted");
                    return;
                  }

                  const count = typeof response.count === 'number' ? response.count : 0;
                  if (count > 0) {
                    showActionStatus(`Unticked ${count} fee(s)`, "success");
                  } else {
                    showActionStatus("No pre-ticked fees found on this page.", "info");
                  }

                  if (typeof response.threats === 'number' && threatCountEl) {
                    threatCountEl.innerText = response.threats;
                  }
                } catch (_) {}
              });
            } catch (_) {}
          });
        } catch (_) {}
      });
    }

    // 8. Open Dashboard
    if (btnDashboard) {
      btnDashboard.addEventListener('click', () => {
        try {
          chrome.tabs.create({ url: "https://anything14907-byte.github.io/SupremeDevs/?v=7" });
        } catch (_) {}
      });
    }
  } catch (_) {}
});
