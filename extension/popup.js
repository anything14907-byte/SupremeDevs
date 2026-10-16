document.addEventListener('DOMContentLoaded', () => {
  const toggleAutofix = document.getElementById('toggle-autofix');
  const modePill = document.getElementById('hud-mode-pill');
  const threatCountEl = document.getElementById('threat-count');
  const btnFreeze = document.getElementById('btn-freeze-timers');
  const btnUntick = document.getElementById('btn-untick-addons');
  const btnDashboard = document.getElementById('btn-open-dashboard');

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
  if (chrome.storage && chrome.storage.local) {
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
      if (chrome.storage && chrome.storage.local) {
        chrome.storage.local.set({ autofix: isEnabled });
      }

      // Notify active tab
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.id) {
          chrome.tabs.sendMessage(tabs[0].id, { action: 'SET_AUTOFIX', enabled: isEnabled }, () => {
            if (chrome.runtime.lastError) {
              // Ignore if content script is not running on active tab
            }
          });
        }
      });
    });
  }

  // 3. Query threat count from active tab
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]?.id) {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'GET_THREAT_COUNT' }, (response) => {
        if (!chrome.runtime.lastError && response && typeof response.count === 'number') {
          if (threatCountEl) threatCountEl.innerText = response.count;
        }
      });
    }
  });

  // 4. Manual actions
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

  if (btnDashboard) {
    btnDashboard.addEventListener('click', () => {
      chrome.tabs.create({ url: "https://anything14907-byte.github.io/SupremeDevs/?v=4" });
    });
  }
});
