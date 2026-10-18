# 🛡️ DarkShield AI — Experimental Browser Prototype

> **Prototype Chromium extension (Manifest V3). Freezes simple countdown timers and flags pre-ticked fees on pages with these patterns. Tested on the demo store; behavior on real merchant sites may vary.**

Runs entirely on your device. No data is collected or sent.

---

## 📖 What It Does

DarkShield AI is an educational browser companion built to demonstrate client-side detection and mitigation of deceptive design patterns under India's Central Consumer Protection Authority (CCPA) 2023 Guidelines:
- **Freeze Fake Urgency Timers**: Freezes simple countdown timers on pages that use these patterns (tested on the demo store).
- **Untick Sneaked Fees**: Flags pre-ticked +₹49 packaging, surge and insurance charges. Optional auto-untick via the popup toggle (off by default).
- **Expose Confirm Shaming**: Highlights guilt-tripping decline copy in prominent warning outlines.
- **In-Page Defense HUD**: Floating indicator showing threat count and 1-click remedies on pages where patterns are detected.

---

## 🚀 How to Install in Chromium Browsers (Chrome, Edge, Brave)

1. Open your browser and navigate to the extensions management page:
   - Google Chrome / Brave: `chrome://extensions`
   - Microsoft Edge: `edge://extensions`
2. Toggle on **"Developer mode"** (switch in the top-right corner).
3. Click **"Load unpacked"** (button in top-left).
4. Select this `extension/` folder (or unzip `darkshield-extension.zip` and select the extracted folder).
5. The **DarkShield AI** shield icon will appear in your extensions toolbar. Test it on the demo store in the sandbox!

---

## 🔒 Permissions Used and Why

| Permission | Purpose | Why It Is Needed |
| :--- | :--- | :--- |
| `activeTab` | Temporary access to active tab | Allows the extension popup to send commands (freeze timers, untick sneaked fees) to the current page when explicitly clicked by the user without requiring permanent broad permissions. |
| `storage` | Local extension settings storage | Remembers your "Auto-fix" toggle preference (`true` or `false`) locally on your machine via `chrome.storage.local`. |

- **No `<all_urls>` permission requested**: Content scripts only target designated origins (`localhost`, `127.0.0.1`, and GitHub Pages demo origin).
- **Zero Network Activity**: Contains zero analytics, zero telemetry, zero remote code execution, and zero `eval`.

---

## ⚡ Modes & Popup Controls

- **Default Mode (Highlight & Warn Only)**: The extension strictly inspects elements and places non-disruptive dashed outlines around deceptive items with explanatory tooltips. It does not alter your cart or modify page layout.
- **Auto-fix Toggle (Default: OFF)**: Open the extension popup to enable "Auto-fix (untick fees, freeze timers)". When enabled, the extension proactively clears pre-checked sneaked checkboxes and halts interval countdown loops.

---

## ⚠️ Known Limitations

1. **Experimental Prototype**: Built as an educational prototype. It is specifically calibrated and tested against the sandbox demo store and standard DOM timer implementations.
2. **Dynamic SPA Frameworks**: Heavily obfuscated countdown scripts, canvas-rendered timers, or proprietary web workers on third-party merchant sites may not trigger client-side DOM heuristics.
3. **Origin Scoping**: For security and least-privilege compliance, automated content script injection is restricted to local test environments and GitHub Pages demo instances.
