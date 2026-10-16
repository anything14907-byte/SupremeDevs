document.addEventListener('DOMContentLoaded', () => {
  const btnFreeze = document.getElementById('btn-freeze-timers');
  const btnUntick = document.getElementById('btn-untick-addons');
  const btnAgent = document.getElementById('btn-open-agent');

  if (btnFreeze) {
    btnFreeze.addEventListener('click', () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.id) {
          chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: () => {
              const highestId = window.setInterval(() => {}, 9999);
              for (let i = 0; i < highestId; i++) window.clearInterval(i);
              alert("⏱️ Fake timers and intervals on this page have been halted.");
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
              alert("🛒 Pre-selected checkboxes have been unticked.");
            }
          });
        }
      });
    });
  }

  if (btnAgent) {
    btnAgent.addEventListener('click', () => {
      chrome.tabs.create({ url: "http://localhost:8000#tab-agent" });
    });
  }
});
