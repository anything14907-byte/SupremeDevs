# 🛡️ DarkShield AI — Experimental Browser Prototype

> **Prototype Chromium extension (Manifest V3). Freezes fake countdowns and flags pre-ticked fees on pages with these patterns. Tested on the demo store; behavior on real merchant sites may vary.**

Runs entirely on your device. No data is collected or sent.

---

## 🚀 How to Install in Chromium browsers (Chrome, Edge, Brave)

1. Open your browser and navigate to:
   - Chrome / Brave: `chrome://extensions`
   - Microsoft Edge: `edge://extensions`
2. Toggle on **"Developer mode"** (top-right switch).
3. Click **"Load unpacked"** (top-left button).
4. Select the `extension/` folder from this repository (or unzip `darkshield-extension.zip` and select that folder).
5. Done! The **DarkShield AI** badge will appear in your extensions bar.

---

## ⚡ Modes & Capabilities
- **Default Mode (Highlight & Warn Only)**: Automatically outlines deceptive countdown clocks, pre-ticked add-on checkboxes, and guilt-tripping confirm shaming copy in warning borders. Does not alter page content unless instructed.
- **Auto-fix Toggle (Default OFF)**: Toggle "Auto-fix (untick fees, freeze timers)" in the extension popup to automatically freeze synthetic timers and untick pre-selected sneak fees.
- **Floating In-Page Guardian HUD**: Discreet indicator showing the number of CCPA traps identified on the page.
- **Privacy First**: Zero external API calls, zero analytics, zero data storage. Runs 100% locally on your machine.
