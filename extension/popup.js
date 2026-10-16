document.addEventListener('DOMContentLoaded', () => {
  const btnFreeze = document.getElementById('btn-freeze-timers');
  const btnUntick = document.getElementById('btn-untick-addons');
  const btnDashboard = document.getElementById('btn-open-dashboard');

  if (btnFreeze) {
    btnFreeze.addEventListener('click', () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.id) {
          chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: () => {
              const highestId = window.setInterval(() => {}, 9999);
              for (let i = 0; i < highestId; i++) window.clearInterval(i);
              alert("⏱️ DarkShield AI: Fake urgency countdown timers on this page have been halted.");
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
          chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: () => {
              const inputs = document.querySelectorAll('input[type="checkbox"]:checked');
              inputs.forEach(i => i.checked = false);
              alert("🛒 DarkShield AI: Sneaked pre-checked add-on fees unticked.");
            }
          });
        }
      });
    });
  }

  if (btnDashboard) {
    btnDashboard.addEventListener('click', () => {
      chrome.tabs.create({ url: "https://anything14907-byte.github.io/SupremeDevs/" });
    });
  }
});
