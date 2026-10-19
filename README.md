# 🛡️ DarkShield AI // Real-Time Dark Pattern & Scam Defense

> **Educational prototype and client-side defense tool designed to detect, neutralize, and explain deceptive UI dark patterns under India's Central Consumer Protection Authority (CCPA) 2023 Guidelines.**

📺 **[Watch Full Video Demonstration (Google Drive)](https://drive.google.com/file/d/18q09w1QRxs_u_6uatC4jWzWGJRUQHgbP/view?usp=sharing)** • 🌐 **[Live Website](https://anything14907-byte.github.io/SupremeDevs/)**

---

## 🎯 The Problem: Deceptive Dark Patterns in India

Indian consumers face deceptive design practices across e-commerce, quick-commerce, food delivery, and digital subscription services daily:
- **False Urgency**: Artificial countdown timers and fake scarcity claims (*"Only 2 portions left — 38 people ordering now!"*) that reset upon page refresh to force impulse purchases.
- **Basket Sneaking**: Pre-selected checkboxes quietly adding ₹49 packaging surge, weather fees, or transit protection into cart totals without affirmative consent.
- **Confirm Shaming**: Insulting opt-out language (*"No thanks, I hate saving money and prefer overpaying"*) designed to induce psychological guilt.
- **Interface Interference**: Microscopic 7.5px disclaimers and low-contrast fine print burying ₹899/year recurring UPI AutoPay mandates.
- **Subscription Traps & Obstruction**: 1-click subscription sign-ups paired with labyrinthine cancellation flows and hidden exit buttons.

In November 2023, the **Central Consumer Protection Authority (CCPA)** notified the *Guidelines for Prevention and Regulation of Dark Patterns, 2023* under the Consumer Protection Act, 2019, prohibiting deceptive patterns including False Urgency, Basket Sneaking, Confirm Shaming, Forced Action, Subscription Trap, Interface Interference, Bait and Switch, Drip Pricing, Disguised Advertisement, Nagging, Trick Question, SaaS Billing, and Rogue Malwares.

---

## 🔍 What's Real vs. Simulated

| Feature | Implementation Mode | How It Works |
| :--- | :--- | :--- |
| **Website HTML Checker** | **Real Client-Side Rules** | Real DOMParser engine that parses pasted HTML snippets, evaluates attributes and styles (countdown timers, pre-checked checkboxes, microscopic `<11px` font, double-negative syntax), computes a weighted deception score (`min(100, sum)`), and renders the exact triggering code snippet in a scrollable viewer. |
| **Contract Decoder** | **Keyword Rules** | Computes a 0–100 hazard score directly from legal text keyword patterns: auto-renewal (25 pts), lock-in commitment (25 pts), non-refundable terms (20 pts), unilateral price increase (15 pts), and cancellation fees/friction (15 pts). |
| **Store Protection Sandbox** | **Interactive Client Simulator** | A realistic Indian food delivery checkout (*SwiftBites Express*) demonstrating how client-side shields freeze fake timers, untick sneaked cart fees, decode inverted copy, and expose fine print in real time. |
| **Subscription Canceller** | **Simulated Walkthrough** | Educational walkthrough demonstrating how an autonomous agent navigates a 5-gate cancellation maze (Confirm Shaming, Retention Discount Trap, Trick Question, Forced Action, Subscription Trap) and provides step-by-step guidance for manual UPI mandate revocation in apps like GPay, PhonePe, and Paytm. |
| **Browser Extension** | **Experimental Prototype (Tested on Demo Store)** | Prototype Chromium extension (Manifest V3). Freezes simple countdown timers and flags pre-ticked fees on pages with these patterns (tested on the demo store; behavior on real merchant sites may vary). Default mode: highlight and warn only, with a popup toggle for "Auto-fix" (off by default). |

---

## ✨ Features

1. **🛍️ Store Protection (Live Test Sandbox)**:
   - Interactive Indian food delivery checkout with toggleable **Defense Shield**.
   - Watch fake countdown timers freeze, sneaked +₹49 packaging surge fees untick automatically, and hidden ₹899/year recurring VIP passes enlarge into clear warnings.
2. **🔍 Website Dark Pattern Checker**:
   - Paste raw HTML code or click preloaded samples (Food Delivery Cart, OTT AutoPay, Flash Sale, or Clean Compliant HTML).
   - Weighted scoring: False Urgency (20), Basket Sneaking (20), Trick Question (15), Interface Interference (15), Confirm Shaming (15), Subscription Trap (15).
   - Score categories: Critical Deception Risk (>60), Moderate Risk (30–60), Low Risk (11–29), and green "No dark patterns detected" (0–10).
   - Clean compliant HTML scores under 10/100 and shows a verified green badge.
   - Every detected threat shows pattern name, one-line explanation, and exact triggering HTML snippet.
3. **📜 Contract & Fine Print Decoder**:
   - Translates Indian subscription terms and UPI AutoPay fine print into plain English.
   - Computes hazard scores directly from detected clauses and flags unilateral price hikes, lock-ins, and non-refundable terms.
4. **🤖 1-Click Subscription Canceller**:
   - Sequential 5-gate cancellation simulation with ~600ms delay per gate and live progress counter.
   - Generates a sample cancellation summary with demo reference and actionable guidance to revoke mandates inside UPI apps.
   - Includes a one-click "Reset Demo" button returning all panels to their initial state.
5. **🧩 Browser Extension (Experimental Prototype)**:
   - Prototype Chromium extension (Manifest V3). Freezes simple countdown timers on pages that use these patterns (tested on the demo store).
   - Flags pre-ticked +₹49 packaging, surge and insurance charges. Optional auto-untick via popup toggle (off by default).
   - Compatible with Chromium browsers (Chrome, Edge, Brave).
   - Floating indicator showing threat count and 1-click remedies on pages where patterns are detected.
   - 1-click download available right from the dashboard with quick 3-step setup guide.
6. **☀️/🌙 Adaptive Day & Night Theme**:
   - Instant toggle between a clean, crisp, energetic Day Mode (light slate) and a sleek Cyberpunk Night Mode.
   - Strict WCAG AA (4.5:1) contrast compliance across all text and UI boxes.
   - Persistent preference remembered in localStorage.

---

## 🛠️ Tech Stack

- **Frontend**: Pure Vanilla JavaScript (ES6+), HTML5, CSS3. Zero external frameworks, zero build steps, and zero external runtime dependencies.
- **TinyFish Integration**: DarkShield AI uses TinyFish browser infrastructure and web agents to safely automate complex cancellation flows, navigate retention traps, and guide users through safe subscription exits with full visibility and control.
- **Audio Synthesizer**: Web Audio API cyber synthesizer for interactive sound effects (mute toggleable).
- **Visualizer**: HTML5 Canvas procedural neural particle network reacting to threat events.
- **Accessibility & Contrast**: Built to WCAG AA contrast standards (4.5:1), responsive down to 360px viewport width without horizontal scrolling, keyboard accessible navigation with visible focus states, ARIA roles, and modal focus trapping with Escape key dismissal.
- **Server (Optional)**: Python 3 standard library (`server.py` or `python3 -m http.server`). Can be hosted purely statically on GitHub Pages.

---

## 🏁 How to Run Locally

### Option 1: Python Standard Server (Recommended)
```bash
# Clone the repository
git clone https://github.com/anything14907-byte/SupremeDevs.git
cd SupremeDevs

# Start local server
python3 -m http.server 8000
```
Open your browser at:
```
http://localhost:8000/
```

### Option 2: Using the Included Engine Runner
```bash
python3 server.py 8000
```
Open your browser at:
```
http://localhost:8000/
```

---

## 🧩 How to Load the Browser Extension

1. Open your Chromium-based browser and navigate to the extensions page:
   - **Google Chrome / Brave**: `chrome://extensions`
   - **Microsoft Edge**: `edge://extensions`
2. Enable **"Developer mode"** via the toggle switch in the top-right corner.
3. Click the **"Load unpacked"** button in the top-left toolbar.
4. Select the `extension/` directory from this repository (or unzip `darkshield-extension.zip` and select the unzipped folder).
5. The DarkShield AI shield icon will appear in your browser toolbar. Open the demo store in the sandbox to test it live!

---

## ⚠️ Known Limitations

1. **Client-Side Scanner**: The website link scanner runs in the browser. Because browsers enforce Cross-Origin Resource Sharing (CORS) security policies, direct URL scanning of arbitrary external websites requires a backend crawler; users must paste the page HTML for full in-depth DOM inspection.
2. **Experimental Extension Scope**: The companion extension is an experimental prototype tested specifically on the demo store and standard DOM timer patterns. Dynamic SPAs with obfuscated countdown loops or canvas-drawn graphics may not be captured by client-side regex heuristics.
3. **Simulated Agent Cancellation**: Autonomous cancellation is demonstrated via a simulated CDP walkthrough for safety and educational compliance; actual bank mandate revocations must always be confirmed directly in the user's UPI app.

---

## 🔒 Privacy Statement

**Everything runs entirely on your device. Zero data is collected or sent.**
- DarkShield AI does not make external API requests or transmit page contents to third-party servers.
- The browser extension requests only `activeTab` and `storage` (to remember your local Auto-fix preference), contains no tracking scripts, no telemetry, no analytics, no remote code execution, and no `eval`.
- The educational prototype does not store passwords, bank account details, or payment credentials. Always manage and revoke active recurring auto-debit mandates directly inside your authorized UPI app (Google Pay, PhonePe, Paytm, BHIM, or your bank's portal).
