/**
 * TinyFish Aegis Extension - Background Service Worker
 */

chrome.runtime.onInstalled.addListener(() => {
  console.log("🛡️ TinyFish Aegis Defense Service Worker initialized.");
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "GET_ENGINE_STATUS") {
    fetch("http://localhost:8000/api/health")
      .then(res => res.json())
      .then(data => sendResponse({ success: true, data }))
      .catch(err => sendResponse({ success: false, error: err.message }));
    return true; // asynchronous response
  }
});
