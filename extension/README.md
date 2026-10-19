# 🛡️ DarkShield AI — Experimental Browser Prototype

> **Prototype Chromium extension (Manifest V3). Features live in-page scanning, countdown timer freezing, and pre-ticked fee detection under India CCPA 2023 Guidelines. Tested on the demo store; behavior on real merchant sites may vary.**

Runs entirely on your device. Zero telemetry. No data is collected or sent.

---

## 📖 What It Does

DarkShield AI is an educational browser companion built to demonstrate client-side detection and mitigation of deceptive design patterns under India's Central Consumer Protection Authority (CCPA) 2023 Guidelines:
- **Scan This Page (New)**: On-demand live DOM analysis from the popup. Computes a Deception Score out of 100, assigns a risk badge (Critical, Moderate, Low, or Clean), and details findings with one-line reasons and trigger snippets.
- **Visual Outlining**: Outlines deceptive elements in real-time (`2px dashed #ff3366`) without modifying page layout or mutating DOM elements.
- **Untick Sneaked Fees**: Flags pre-ticked +₹49 packaging, surge, delivery, and insurance charges. Optional auto-untick via the popup toggle (off by default).
- **Freeze Fake Urgency Timers**: Freezes simple countdown timers on pages that use these patterns (tested on the demo store).
- **Expose Confirm Shaming & Trick Questions**: Highlights guilt-tripping decline copy and inverted double-negative consent syntax.
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
| `activeTab` | Temporary access to active tab | Allows the extension popup to interact with the current page only when explicitly invoked by the user, without requiring permanent broad host access. |
| `scripting` | Live in-page DOM scanner | Executes the lightweight client-side analyzer directly on the active tab upon clicking "Scan This Page", highlighting deceptive patterns in-place without needing broad `<all_urls>` permissions. |
| `storage` | Local extension settings storage | Remembers your "Auto-fix" toggle preference (`true` or `false`) locally on your machine via `chrome.storage.local`. |

- **No `<all_urls>` permission requested**: Follows strict Chrome Web Store least-privilege principles. Automated background content scripts are scoped to local and demo origins (`localhost`, `127.0.0.1`, and GitHub Pages), while live page scanning is user-initiated via `activeTab` + `scripting`.
- **Zero Network Activity**: Contains zero analytics, zero telemetry, zero remote code execution, and zero `eval`.

---

## ⚡ Modes & Popup Controls

- **Default Mode (Highlight & Warn Only)**: The extension strictly inspects elements and places non-disruptive dashed outlines around deceptive items with explanatory tooltips. It does not alter your cart or modify page layout.
- **Auto-fix Toggle (Default: OFF)**: Open the extension popup to enable "Auto-fix (untick fees, freeze timers)". When enabled, the extension proactively clears pre-checked sneaked checkboxes and halts interval countdown loops.
- **Scan This Page Button**: Triggers an immediate DOM scan of the active tab, rendering the Deception Score (0–100), risk tier badge, and an itemized breakdown of findings.

---

## ⚠️ Known Limitations

1. **Experimental Prototype**: Built as an educational prototype. It is calibrated against the CCPA 2023 Guidelines and standard DOM timer implementations.
2. **May Miss Patterns on Real Sites**: Heavily obfuscated single-page applications (React, Angular, Vue), canvas-based or SVG countdown animations, web workers, shadow DOM components, or dynamic iframe checkout gates may bypass heuristic DOM queries.
3. **Potential False Positives**: Heuristics may flag legitimate countdown timers (e.g. security-mandated banking session expirations or reserved ticket holds) or standard legal disclaimers if they use small typography.
4. **Browser Internal Pages**: Chrome security forbids running content scripts or extensions on `chrome://`, `edge://`, `chrome-extension://`, and Web Store pages.
