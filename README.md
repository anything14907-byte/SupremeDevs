# 🛡️ DarkShield AI // Real-Time Dark Pattern & Scam Defense

> **Educational prototype and client-side defense tool designed to detect, neutralize, and explain deceptive UI dark patterns under India's Central Consumer Protection Authority (CCPA) 2023 Guidelines.**

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
| **Contract Decoder** | **Real Keyword Heuristics** | Computes a 0–100 hazard score directly from legal text keyword patterns: auto-renewal (25 pts), lock-in commitment (25 pts), non-refundable terms (20 pts), unilateral price increase (15 pts), and cancellation fees/friction (15 pts). |
| **Store Protection Sandbox** | **Interactive Client Simulator** | A realistic Indian food delivery checkout (*SwiftBites Express*) demonstrating how client-side shields freeze fake timers, untick sneaked cart fees, decode inverted copy, and expose fine print in real time. |
| **Subscription Canceller** | **Simulated Demo Walkthrough** | Educational walkthrough demonstrating how an autonomous agent navigates a 5-gate cancellation maze (Confirm Shaming, Retention Discount Trap, Trick Question, Forced Action, Subscription Trap) and provides step-by-step guidance for manual UPI mandate revocation in apps like GPay, PhonePe, and Paytm. |
| **Browser Extension** | **Experimental Prototype** | An experimental prototype Chromium extension (Manifest V3). Freezes fake countdowns and flags pre-ticked fees on pages with these patterns. Tested on the demo store; behavior on real merchant sites may vary. Default mode: highlight and warn only, with an optional popup toggle for "Auto-fix". Runs entirely on-device with zero tracking or external requests. |

---

## ✨ Features

1. **🛍️ Store Protection (Live Test Sandbox)**:
   - Interactive Indian food delivery checkout with toggleable **Defense Shield**.
   - Watch fake countdown timers freeze, sneaked +₹49 packaging surge fees untick automatically, and hidden ₹899/year recurring VIP passes enlarge into clear warnings.
2. **🔍 Website Dark Pattern Checker**:
   - Paste raw HTML code or click preloaded samples (Food Delivery Cart, OTT AutoPay, Flash Sale, or Clean Compliant HTML).
   - Weighted scoring: False Urgency (20), Basket Sneaking (20), Trick Question (15), Interface Interference (15), Confirm Shaming (15), Subscription Trap (15).
   - Clean compliant HTML scores below 10/100 and shows a verified green badge.
   - Every detected threat shows pattern name, one-line explanation, and exact triggering HTML snippet.
3. **📜 Contract & Fine Print Decoder**:
   - Translates Indian subscription terms and UPI AutoPay fine print into plain English.
   - Computes hazard scores from detected clauses and flags unilateral price hikes, lock-ins, and non-refundable terms.
4. **🤖 1-Click Subscription Canceller**:
   - Sequential 5-gate cancellation simulation with ~600ms delay per gate and live progress counter.
   - Generates a sample cancellation summary with demo reference and actionable guidance to revoke mandates inside UPI apps.
   - Includes a one-click "Reset Demo" button.
5. **🧩 Browser Extension (Experimental Prototype)**:
   - Prototype Chromium extension (Manifest V3). Freezes fake countdowns and flags pre-ticked fees on pages with these patterns. Tested on the demo store; behavior on real merchant sites may vary.
   - Compatible with Chromium browsers (Chrome, Edge, Brave).
   - Default mode: highlight and warn only, with a popup toggle for "Auto-fix (untick fees, freeze timers)", default OFF.
   - Runs entirely on your device. No data is collected or sent.
   - 1-click download available right from the dashboard with quick 3-step setup guide.
6. **☀️/🌙 Adaptive Day & Night Theme**:
   - Instant toggle between a clean, crisp, energetic Day Mode (light slate) and a sleek Cyberpunk Night Mode.
   - Persistent preference remembered in localStorage.

---

## 🛠️ Tech Stack

- **Frontend**: Pure Vanilla JavaScript (ES6+), HTML5, CSS3. Zero external frameworks, zero build steps, and zero external runtime dependencies.
- **TinyFish Integration**: DarkShield AI uses TinyFish browser infrastructure and web agents to safely automate complex cancellation flows, navigate retention traps, and guide users through safe subscription exits with full visibility and control.
- **Audio Synthesizer**: Web Audio API cyber synthesizer for interactive sound effects (mute toggleable).
- **Visualizer**: HTML5 Canvas procedural neural particle network reacting to threat events.
- **Accessibility & Contrast**: Built to WCAG AA contrast standards (4.5:1), responsive down to 360px viewport width, keyboard accessible navigation with visible focus states and ARIA roles.
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
http://localhost:8000/static/
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

## ⚖️ Disclaimer

DarkShield AI is an educational prototype created for demonstration purposes. It does not store passwords, financial credentials, or payment details. For recurring subscription cancellations, always confirm mandate status directly inside your UPI app (Google Pay, PhonePe, Paytm, BHIM, or your bank's app).
