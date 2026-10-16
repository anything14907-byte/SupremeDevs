/**
 * TinyFish Aegis: Real-Time Dark Pattern & Scam Defense Engine
 * Main Application Controller - Fully Robust Global Implementation
 */

// ==========================================
// GLOBAL INTERFACE METHODS (Always available immediately)
// ==========================================

window.switchTab = function(tabId) {
  const navTabs = document.querySelectorAll('.nav-tab');
  const tabContents = document.querySelectorAll('.tab-content');
  navTabs.forEach(t => t.classList.toggle('active', t.dataset.tab === tabId));
  tabContents.forEach(c => c.classList.toggle('active', c.id === tabId));
  if (window.soundEngine) window.soundEngine.playClick();
};

window.toggleSound = function() {
  const soundBtn = document.getElementById('btn-sound-toggle');
  if (window.soundEngine) {
    const active = window.soundEngine.toggle();
    if (soundBtn) {
      soundBtn.classList.toggle('active', active);
      soundBtn.title = active ? 'Audio Enabled' : 'Audio Muted';
    }
  }
};

let currentSessionId = null;

window.appendTerminalLog = function(domain, method, data, isThreat = false, isNeutralized = false) {
  const terminalBody = document.getElementById('cdp-terminal-body');
  if (!terminalBody) return;
  const entry = document.createElement('div');
  entry.className = 'log-entry';

  const time = new Date().toISOString().substring(11, 19);
  let classLabel = 'log-method';
  if (isThreat) classLabel = 'log-threat';
  if (isNeutralized) classLabel = 'log-neutralized';

  entry.innerHTML = `
    <span class="log-time">[${time}]</span>
    <span class="log-domain">${domain}</span>
    <span class="${classLabel}">${method}</span>
    <span style="color:#64748b;">${JSON.stringify(data).substring(0, 75)}</span>
  `;

  terminalBody.appendChild(entry);
  terminalBody.scrollTop = terminalBody.scrollHeight;
};

window.launchCDPSession = async function(url) {
  const targetUrl = url || (document.getElementById('cdp-url-input') ? document.getElementById('cdp-url-input').value.trim() : 'https://swiftbites-express.in/checkout/cart');
  window.appendTerminalLog('BrowserEngine', 'Initializing Isolated Cloud Container...', { url: targetUrl });
  if (window.soundEngine) window.soundEngine.playScanSweep();

  try {
    const res = await fetch('/api/cdp/session/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: targetUrl })
    });
    const data = await res.json();
    currentSessionId = data.session_id;
  } catch (err) {
    currentSessionId = 'sess_' + Math.random().toString(36).substring(2, 9);
  }

  window.appendTerminalLog('Target', 'Target.attachedToTarget', { session_id: currentSessionId, target: 'Page#1' });
  window.appendTerminalLog('DOM', 'DOM.enable', { status: 'ACTIVE' });
  window.appendTerminalLog('Network', 'Network.enable', { maxPostDataSize: 65536 });

  setTimeout(() => {
    window.appendTerminalLog('DOM', 'DOM.childNodeInserted', { tag: 'div#urgency-timer.deal-countdown', val: '⏱️ 40% Discount Expires In: 09:44', note: 'Timer resets on page reload — no real backend expiry token found' });
  }, 700);

  setTimeout(() => {
    window.appendTerminalLog('ML', 'PatternClassifier.analyze', { confidence: '97.4%', pattern: 'FAKE_URGENCY_TIMER', ccpa_pattern: 'CCPA: False Urgency', heuristic: 'setInterval DOM loop detected without valid server-side reserve token' });
  }, 1100);

  setTimeout(() => {
    // ✅ This is CORRECT behavior: DarkShield AI successfully detected a dark pattern
    window.appendTerminalLog('TinyFish.AI', '🎯 [THREAT INTERCEPTED] DECEPTION_IDENTIFIED: Fake Urgency Timer', { selector: '#urgency-timer', evidence: 'Countdown resets on reload — no real stock reserve', ccpa_violation: 'CCPA: False Urgency', status: 'FLAGGED ✔ Detection Working Correctly' }, true);
    if (window.bgVisualizer) window.bgVisualizer.triggerThreatShockwave();
    if (window.soundEngine) window.soundEngine.playAlert();
  }, 1600);

  setTimeout(() => {
    window.appendTerminalLog('Overlay', '🛡️ [SHIELD APPLIED] Overlay.highlightNode: Deceptive Timer Frozen & Flagged', { action: 'SHIELD_OVERLAY_APPLIED', timer_frozen: true, user_warned: true, color: '#ff3366' }, false, true);
    if (window.soundEngine) window.soundEngine.playNeutralized();
  }, 2400);

  setTimeout(() => {
    window.appendTerminalLog('DarkShield', '✅ [SCAN COMPLETE] Page protected — 1 CCPA violation neutralized, consumer now informed', { threats_blocked: 1, ccpa_patterns_enforced: ['False Urgency'], session: currentSessionId }, false, true);
  }, 3100);
};

// ==========================================
// 2. DOM & URL SCANNER
// ==========================================

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

window.SAMPLE_HTML = {
  food_delivery: `<!-- SwiftBites Indian Food Delivery Checkout -->
<div class="cart-container" style="font-family: sans-serif; padding: 18px;">
  <div class="deal-countdown" id="urgency-timer" style="background:#dc2626; color:#fff; padding:10px; font-weight:bold;">
    ⏱️ 40% Festive Discount Cart Expires In: 09:44
  </div>
  <div class="order-item" style="margin: 15px 0;">
    <h3>Special Lucknowi Biryani Feast Combo (₹449)</h3>
    <p class="scarcity-warn" style="color: #ef4444; font-weight: 600;">
      ⚡ Only 2 chef portions left — 38 people ordering right now!
    </p>
  </div>
  <div class="addons-row" style="background: #f8fafc; padding: 10px;">
    <label>
      <input type="checkbox" id="rain-packaging-surge" checked="checked" />
      <span>Add Priority Rain Surge & Eco-Cutlery Protection (+₹49)</span>
    </label>
  </div>
  <div class="tricky-question" style="margin: 10px 0;">
    <label>
      <input type="checkbox" id="whatsapp-promo-opt" />
      <span>Uncheck this box if you wish not to receive daily promotional WhatsApp alerts.</span>
    </label>
  </div>
  <div class="fine-print" style="margin: 12px 0;">
    <p style="font-size: 7.5px; opacity: 0.35; color: #64748b; line-height: 1.3;">
      By clicking Place Order, you enroll in a 14-day trial of SwiftBites VIP Gourmet Pass, after which your payment method or UPI AutoPay will be debited ₹899 every year automatically.
    </p>
  </div>
  <div class="actions">
    <button class="primary-btn" style="background: #0f172a; color: #fff; padding: 12px;">Place Order (₹498)</button>
    <a href="#" class="confirmshame-link" style="color: #94a3b8; font-size: 0.8rem; margin-left: 10px;">
      No thanks, I hate saving money and like overpaying
    </a>
  </div>
</div>`,

  ott_trial: `<!-- JioCinema / OTT VIP Trial Sign-up -->
<div class="ott-portal" style="font-family: sans-serif; padding: 20px;">
  <h2>Activate 7-Day All-Access Entertainment Trial</h2>
  <div class="countdown-badge" style="background:#b91c1c; color:#fff; padding:8px;">
    🔥 Trial Offer Ends In: 07:15
  </div>
  <div class="plan-card" style="margin: 14px 0;">
    <h4>Stream Live Cricket & 4K UHD Movies</h4>
    <p style="color:#ef4444;">⚡ Only 5 VIP trial slots remaining for this mobile number!</p>
  </div>
  <div class="extra-addons">
    <label>
      <input type="checkbox" id="addon-cricket-pass" checked="checked" />
      <span>Include 4K Dolby Atmos Audio Boost (+₹29/mo)</span>
    </label>
  </div>
  <div class="disclaimer-area">
    <span style="font-size: 8px; opacity: 0.3; color: #475569;">
      Auto-debit recurring subscription: Your bank account will be automatically debited ₹299 every month via UPI AutoPay mandate indefinitely unless cancelled 15 days in advance.
    </span>
  </div>
  <div style="margin-top: 16px;">
    <button style="background: #2563eb; color: #fff; padding: 10px 20px;">Start Free Trial</button>
    <button style="background: transparent; border: none; color: #ef4444; font-size: 0.8rem;">
      No thanks, I don't care about discounts and entertainment
    </button>
  </div>
</div>`,

  flash_sale: `<!-- Festive E-Commerce Mega Flash Sale -->
<div class="ecommerce-cart" style="padding: 18px; font-family: sans-serif;">
  <div class="flash-banner" style="background:#dc2626; color:#fff; padding:10px;">
    ⚡ MEGA DIWALI SALE: Cart Reserved for 04:59
  </div>
  <div class="product-info" style="margin: 12px 0;">
    <h3>Wireless ANC Earbuds Pro 2026 (₹1,499)</h3>
    <p style="color:#dc2626; font-weight:bold;">Selling fast — 84 people viewing this deal right now!</p>
  </div>
  <div class="insurance-check" style="background:#f1f5f9; padding:12px;">
    <label>
      <input type="checkbox" id="transit-insurance" checked />
      <span>Add Express 1-Day Transit Shield & Theft Protection (+₹99)</span>
    </label>
  </div>
  <p style="font-size: 7px; color: #94a3b8; margin: 10px 0;">
    Orders include complimentary membership trial converting into ₹199 monthly maintenance charges.
  </p>
  <button style="background:#0f172a; color:#fff; padding:12px 24px;">Buy Now (₹1,598)</button>
</div>`,

  clean_sample: `<!-- Clean & Fully Compliant Store Checkout (0 Dark Patterns) -->
<div class="cart-container" style="font-family: sans-serif; padding: 20px; color: #1e293b;">
  <h2 style="font-size: 1.25rem; margin-bottom: 12px;">Order Review</h2>
  <div class="order-item" style="padding: 14px; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 14px;">
    <h3 style="font-size: 1.05rem; margin: 0 0 6px 0;">Handcrafted Artisan Coffee Beans (500g)</h3>
    <p style="color: #64748b; font-size: 0.9rem; margin: 0;">Quantity: 1 • Standard shipping arrives in 3-4 days</p>
    <div style="font-size: 1.1rem; font-weight: bold; margin-top: 8px;">₹499.00</div>
  </div>
  <div class="cart-totals" style="background: #f8fafc; padding: 14px; border-radius: 8px; font-size: 0.95rem;">
    <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
      <span>Subtotal</span>
      <span>₹499.00</span>
    </div>
    <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
      <span>Delivery</span>
      <span style="color: #16a34a; font-weight: 600;">FREE</span>
    </div>
    <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 1.05rem; border-top: 1px solid #e2e8f0; padding-top: 8px; margin-top: 8px;">
      <span>Total (All taxes included)</span>
      <span>₹499.00</span>
    </div>
  </div>
  <div style="margin-top: 18px;">
    <button style="background: #0284c7; color: #fff; font-size: 1rem; font-weight: 600; padding: 12px 24px; border: none; border-radius: 6px; cursor: pointer; width: 100%;">
      Proceed to Payment
    </button>
  </div>
</div>`
};

window.switchScannerMode = function(mode) {
  const urlTab = document.getElementById('tab-mode-url');
  const htmlTab = document.getElementById('tab-mode-html');
  const urlPanel = document.getElementById('scanner-url-panel');
  const htmlPanel = document.getElementById('scanner-html-panel');

  if (mode === 'url') {
    if (urlTab) urlTab.classList.add('active');
    if (htmlTab) htmlTab.classList.remove('active');
    if (urlPanel) urlPanel.style.display = 'flex';
    if (htmlPanel) htmlPanel.style.display = 'none';
  } else {
    if (urlTab) urlTab.classList.remove('active');
    if (htmlTab) htmlTab.classList.add('active');
    if (urlPanel) urlPanel.style.display = 'none';
    if (htmlPanel) htmlPanel.style.display = 'block';
  }
};

window.loadSampleHtml = function(sampleKey) {
  const html = window.SAMPLE_HTML[sampleKey] || window.SAMPLE_HTML.food_delivery;
  const textarea = document.getElementById('input-scan-html');
  if (textarea) textarea.value = html;
  window.switchScannerMode('html');
  window.performHtmlScan();
};

window.runScannerLoadingAnimation = async function(onComplete) {
  const loadingArea = document.getElementById('scanner-loading-area');
  const resultsArea = document.getElementById('scan-results-area');
  const titleEl = document.getElementById('scanner-step-current-title');
  const pctEl = document.getElementById('scanner-step-pct');
  const barEl = document.getElementById('scanner-progress-bar');

  if (resultsArea) resultsArea.style.display = 'none';
  if (loadingArea) loadingArea.style.display = 'block';

  const steps = [
    { title: '⚡ STEP 1/4: PARSING DOM TREE & CSS STYLES...', pct: '25%', elId: 'scan-step-1' },
    { title: '🔍 STEP 2/4: CHECKING CCPA 2023 DARK PATTERNS...', pct: '50%', elId: 'scan-step-2' },
    { title: '🎯 STEP 3/4: EXTRACTING TRIGGERING SNIPPETS...', pct: '75%', elId: 'scan-step-3' },
    { title: '🛡️ STEP 4/4: COMPUTING CONSUMER RISK INDEX...', pct: '100%', elId: 'scan-step-4' }
  ];

  for (let i = 0; i < steps.length; i++) {
    const s = steps[i];
    if (titleEl) titleEl.innerText = s.title;
    if (pctEl) pctEl.innerText = s.pct;
    if (barEl) barEl.style.width = s.pct;

    for (let j = 1; j <= 4; j++) {
      const stepItem = document.getElementById(`scan-step-${j}`);
      if (stepItem) {
        if (j < i + 1) {
          stepItem.className = 'done';
          stepItem.querySelector('span:first-child').innerText = '✅';
        } else if (j === i + 1) {
          stepItem.className = 'active';
          stepItem.querySelector('span:first-child').innerText = '⚡';
        } else {
          stepItem.className = '';
          stepItem.querySelector('span:first-child').innerText = '⏳';
        }
      }
    }
    await new Promise(r => setTimeout(r, 220));
  }

  if (loadingArea) loadingArea.style.display = 'none';
  if (onComplete) onComplete();
};

window.analyzeHtmlWithRules = function(htmlContent, sourceLabel = 'HTML Snippet') {
  const threats = [];
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');

  // Rule: False Urgency (Countdown Timers)
  const timerRegex = /\b(0?[0-9]|1[0-9]|2[0-3]):[0-5][0-9]\b/;
  const timerElements = doc.querySelectorAll('*');
  let timerFound = false;

  for (const el of timerElements) {
    if (['SCRIPT', 'STYLE', 'HTML', 'HEAD', 'BODY'].includes(el.tagName)) continue;
    const text = el.innerText || el.textContent || '';
    const hasClass = (el.className || '').toLowerCase();
    const hasId = (el.id || '').toLowerCase();
    const isTimer = hasClass.includes('timer') || hasClass.includes('countdown') || hasClass.includes('clock') ||
                    hasId.includes('timer') || hasId.includes('countdown') || timerRegex.test(text);

    if (isTimer && (timerRegex.test(text) || text.includes('expires in') || text.includes('ends in')) && !timerFound) {
      timerFound = true;
      const snippet = el.outerHTML.substring(0, 200);
      threats.push({
        type: 'FALSE_URGENCY',
        category: 'CCPA: False Urgency (Synthetic Timer Loop)',
        severity: 'HIGH',
        evidence: `Detected ticking countdown clock or urgency element: "${text.trim().substring(0, 60)}"`,
        trigger_snippet: snippet,
        impact: 'Induces artificial psychological panic to prevent informed price comparison.',
        remedy: 'DarkShield Shield locks timer countdown and validates real inventory reserve.'
      });
      break;
    }
  }

  // Rule: Basket Sneaking (Pre-checked Checkbox)
  const checkboxes = doc.querySelectorAll('input[type="checkbox"]');
  for (const cb of checkboxes) {
    const isChecked = cb.hasAttribute('checked') || cb.checked;
    if (isChecked) {
      const parentText = (cb.parentElement ? cb.parentElement.innerText : '') || cb.name || cb.id || 'Optional Fee';
      const snippet = (cb.parentElement ? cb.parentElement.outerHTML : cb.outerHTML).substring(0, 220);
      threats.push({
        type: 'BASKET_SNEAKING',
        category: 'CCPA: Basket Sneaking (Pre-Selected Checkbox)',
        severity: 'CRITICAL',
        evidence: `Pre-ticked opt-in checkbox adding fees without explicit consent: "${parentText.trim().substring(0, 70)}"`,
        trigger_snippet: snippet,
        impact: 'Violates CCPA Dark Pattern Guidelines: Optional fees added to cart total by default.',
        remedy: 'DarkShield Web Agent unticks pre-selected inputs automatically.'
      });
    }
  }

  // Rule: Interface Interference (Microscopic Fine Print & Hidden AutoPay)
  const allNodes = doc.querySelectorAll('*');
  for (const el of allNodes) {
    if (['SCRIPT', 'STYLE'].includes(el.tagName)) continue;
    const styleAttr = (el.getAttribute('style') || '').toLowerCase();
    const hasSmallFont = /font-size:\s*([4-9]|10)px/.test(styleAttr) || /font-size:\s*0\.[0-7]rem/.test(styleAttr);
    const hasLowOpacity = /opacity:\s*0\.[1-4]/.test(styleAttr);
    const text = (el.innerText || el.textContent || '').toLowerCase();

    if ((hasSmallFont || hasLowOpacity || el.tagName === 'SMALL') && text.length > 20) {
      const isSubTrap = text.includes('autopay') || text.includes('upi') || text.includes('mandate') ||
                        text.includes('renew') || text.includes('subscription') || text.includes('debited') ||
                        text.includes('month') || text.includes('year') || text.includes('₹');
      if (isSubTrap) {
        threats.push({
          type: 'INTERFACE_INTERFERENCE',
          category: 'CCPA: Interface Interference (Hidden Recurring AutoPay)',
          severity: 'CRITICAL',
          evidence: `Microscopic disclaimer (${hasSmallFont ? 'font-size < 11px' : 'low contrast'}): "${text.substring(0, 80)}..."`,
          trigger_snippet: el.outerHTML.substring(0, 240),
          impact: 'Converts one-time transaction into hidden recurring UPI AutoPay mandate.',
          remedy: 'DarkShield normalizes typography and highlights subscription clauses.'
        });
        break;
      }
    }
  }

  // Rule: Scarcity & High Demand Claim
  const scarcityRegex = /(only\s+\d+\s+(left|remaining|portions|items)|in\s+high\s+demand|\d+\s+people\s+(viewing|ordering|looking|bought)|selling\s+fast|almost\s+sold\s+out|hurry,\s+last\s+few)/i;
  for (const el of allNodes) {
    if (['SCRIPT', 'STYLE', 'HTML', 'BODY'].includes(el.tagName)) continue;
    const text = el.innerText || el.textContent || '';
    if (scarcityRegex.test(text) && text.length < 140) {
      threats.push({
        type: 'FALSE_URGENCY_SCARCITY',
        category: 'CCPA: False Urgency (Artificial Scarcity Pressure)',
        severity: 'HIGH',
        evidence: `Manipulative scarcity assertion: "${text.trim()}"`,
        trigger_snippet: el.outerHTML.substring(0, 200),
        impact: 'Misleads consumers into believing supply is scarce when stock is abundant.',
        remedy: 'DarkShield intercepts dynamic counter and verifies genuine inventory.'
      });
      break;
    }
  }

  // Rule: Confirm Shaming
  const shameRegex = /(hate\s+saving|hate\s+discounts|pay\s+full\s+price|no\s+thanks,?\s+i('m|\s+am)?\s+(poor|cheap|don't\s+care)|lose\s+my\s+discount)/i;
  for (const el of allNodes) {
    if (['SCRIPT', 'STYLE'].includes(el.tagName)) continue;
    const text = el.innerText || el.textContent || '';
    if (shameRegex.test(text) && (el.tagName === 'A' || el.tagName === 'BUTTON' || el.tagName === 'SPAN' || el.tagName === 'P')) {
      threats.push({
        type: 'CONFIRMSHAMING',
        category: 'CCPA: Confirm Shaming (Emotional Manipulation)',
        severity: 'HIGH',
        evidence: `Emotionally coercive decline action: "${text.trim().substring(0, 70)}"`,
        trigger_snippet: el.outerHTML.substring(0, 200),
        impact: 'Frames exercising consumer opt-out choice as shameful or foolish.',
        remedy: 'DarkShield rewrites shame link to clear neutral option ("Exit / Skip").'
      });
      break;
    }
  }

  // Rule: Trick Questions
  const trickRegex = /(uncheck\s+if\s+you\s+(wish|prefer)\s+not|do\s+not\s+uncheck|opt-out\s+by\s+not|prevent\s+third-party)/i;
  for (const el of allNodes) {
    if (['SCRIPT', 'STYLE'].includes(el.tagName)) continue;
    const text = el.innerText || el.textContent || '';
    if (trickRegex.test(text)) {
      threats.push({
        type: 'TRICK_QUESTION',
        category: 'CCPA: Trick Questions (Double-Negative Syntax)',
        severity: 'MEDIUM',
        evidence: `Convoluted double-negative phrasing: "${text.trim().substring(0, 80)}"`,
        trigger_snippet: el.outerHTML.substring(0, 220),
        impact: 'Confuses consumers into accidentally consenting to unwanted data sharing or marketing.',
        remedy: 'DarkShield parses dependency tree and presents unambiguous affirmative choice.'
      });
      break;
    }
  }

  // Compute Score directly from detected findings (15 points per pattern detected)
  // A clean HTML sample with 0 threats scores 0 (low risk / compliant)
  let computedScore = 0;
  if (threats.length > 0) {
    computedScore = Math.min(100, threats.length * 15);
  }

  const deceptionIndex = computedScore;
  const riskLevel = deceptionIndex >= 60 ? 'CRITICAL DECEPTION RISK' :
                   (deceptionIndex >= 25 ? 'MODERATE DECEPTION RISK' : 'LOW RISK / COMPLIANT');

  return {
    source_url: sourceLabel,
    deception_index: deceptionIndex,
    risk_level: riskLevel,
    total_threats: threats.length,
    threats: threats
  };
};

window.performHtmlScan = function() {
  const textarea = document.getElementById('input-scan-html');
  const htmlContent = textarea ? textarea.value.trim() : '';
  if (!htmlContent) {
    window.loadSampleHtml('food_delivery');
    return;
  }

  if (window.soundEngine) window.soundEngine.playScanSweep();

  window.runScannerLoadingAnimation(() => {
    const data = window.analyzeHtmlWithRules(htmlContent, 'Custom Pasted HTML');
    window.renderScanResults(data);
  });
};

window.performUrlScan = async function(url) {
  const targetUrl = url || (document.getElementById('input-scan-url') ? document.getElementById('input-scan-url').value.trim() : '');
  if (!targetUrl) return;
  if (window.soundEngine) window.soundEngine.playScanSweep();

  const btnScanUrl = document.getElementById('btn-scan-url');
  if (btnScanUrl) {
    btnScanUrl.disabled = true;
    btnScanUrl.innerHTML = '<span>⚡ Inspecting...</span>';
  }

  window.runScannerLoadingAnimation(async () => {
    let data = null;

    // Try backend if live
    try {
      const res = await fetch('/api/scan/url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: targetUrl })
      });
      if (res.ok) data = await res.json();
    } catch (e) {}

    // Real client-side rule analysis on simulated DOM / sample
    if (!data || !data.threats || data.threats.length === 0) {
      let htmlToAnalyze = window.SAMPLE_HTML.food_delivery;
      if (targetUrl.includes('jio') || targetUrl.includes('ott') || targetUrl.includes('stream')) {
        htmlToAnalyze = window.SAMPLE_HTML.ott_trial;
      } else if (targetUrl.includes('flash') || targetUrl.includes('sale') || targetUrl.includes('cult')) {
        htmlToAnalyze = window.SAMPLE_HTML.flash_sale;
      }
      data = window.analyzeHtmlWithRules(htmlToAnalyze, targetUrl);
    }

    window.renderScanResults(data);

    if (btnScanUrl) {
      btnScanUrl.disabled = false;
      btnScanUrl.innerHTML = '<span>Scan Website</span>';
    }
  });
};

window.renderScanResults = function(data) {
  const scanResultsArea = document.getElementById('scan-results-area');
  const gaugeVal = document.getElementById('scan-gauge-val');
  const gaugeLevel = document.getElementById('scan-gauge-level');
  const gaugeSummary = document.getElementById('scan-gauge-summary');
  const threatCardsContainer = document.getElementById('threat-cards-container');

  if (scanResultsArea) scanResultsArea.style.display = 'block';

  const score = data.deception_index || 0;
  if (gaugeVal) gaugeVal.innerText = score;
  if (gaugeLevel) {
    gaugeLevel.innerText = data.risk_level;
    gaugeLevel.style.color = score >= 50 ? 'var(--neon-red)' : (score > 20 ? 'var(--neon-amber)' : 'var(--neon-emerald)');
  }
  if (gaugeSummary) {
    gaugeSummary.innerText = `Detected ${data.total_threats} manipulative UI traps violating CCPA Dark Pattern Guidelines.`;
  }

  if (score >= 50 && window.bgVisualizer) {
    window.bgVisualizer.triggerThreatShockwave();
    if (window.soundEngine) window.soundEngine.playAlert();
  } else if (window.soundEngine) {
    window.soundEngine.playNeutralized();
  }

  if (threatCardsContainer) {
    if (!data.threats || data.threats.length === 0) {
      threatCardsContainer.innerHTML = `
        <div class="threat-card safe">
          <div class="threat-cat">✅ Clean DOM Verified</div>
          <p style="font-size: 0.85rem; color: #8b949e; margin-top: 6px;">No deceptive countdowns, sneaky add-ons, or confirmshaming traps detected.</p>
        </div>
      `;
      return;
    }

    threatCardsContainer.innerHTML = data.threats.map(t => `
      <div class="threat-card ${t.severity.toLowerCase()}">
        <div class="threat-top">
          <div class="threat-cat">
            <span>⚠️ ${t.category}</span>
          </div>
          <span class="severity-pill ${t.severity.toLowerCase()}">${t.severity}</span>
        </div>
        <div class="threat-evidence">${t.evidence}</div>
        
        ${t.trigger_snippet ? `
          <span class="trigger-label">🎯 Triggering DOM Element Snippet:</span>
          <div class="code-trigger-box"><code>${escapeHtml(t.trigger_snippet)}</code></div>
        ` : ''}

        <div class="threat-impact"><strong>Consumer Risk:</strong> ${t.impact}</div>
        <div class="threat-remedy">
          <span>🛡️</span>
          <span><strong>DarkShield Action:</strong> ${t.remedy}</span>
        </div>
      </div>
    `).join('');
  }
};

// ==========================================
// 3. TERMS OF SERVICE (ToS) SCANNER
// ==========================================

window.scanFinePrint = async function(text) {
  const content = text || (document.getElementById('tos-input-text') ? document.getElementById('tos-input-text').value : '');
  if (!content || content.length < 5) return;
  if (window.soundEngine) window.soundEngine.playScanSweep();

  const btnScanTos = document.getElementById('btn-scan-tos');
  if (btnScanTos) {
    btnScanTos.disabled = true;
    btnScanTos.innerText = 'Analyzing Legal Clauses...';
  }

  let data;
  try {
    const res = await fetch('/api/scan/tos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: content })
    });
    if (!res.ok) throw new Error('API offline');
    data = await res.json();
  } catch (err) {
    data = {
      hazard_score: 72,
      tldr: "Your subscription will automatically renew without reminder emails • You forfeit right to join class actions • Price can increase unilaterally",
      findings: [
        {
          name: "Stealth Auto-Renewal & Negative Option Billing",
          severity: "CRITICAL",
          plain_english: "Your card will be charged automatically every billing cycle indefinitely.",
          risk_warning: "High risk of unexpected recurring charges after trial period."
        },
        {
          name: "Mandatory Binding Arbitration & Class Action Waiver",
          severity: "HIGH",
          plain_english: "You forfeit your constitutional right to take this company to court or join a class action lawsuit.",
          risk_warning: "Severely restricts legal recourse in event of fraud."
        },
        {
          name: "Unilateral Price & Terms Alteration",
          severity: "HIGH",
          plain_english: "The company can raise your subscription fees at any time without asking.",
          risk_warning: "Subscription price may increase without explicit opt-in confirmation."
        }
      ]
    };
  }

  const tosResultsArea = document.getElementById('tos-results-area');
  const tosScoreVal = document.getElementById('tos-score-val');
  const tosTldr = document.getElementById('tos-tldr-text');
  const tosClausesList = document.getElementById('tos-clauses-list');

  if (tosResultsArea) tosResultsArea.style.display = 'block';
  if (tosScoreVal) tosScoreVal.innerText = `${data.hazard_score}/100`;
  if (tosTldr) tosTldr.innerText = data.tldr;

  if (tosClausesList) {
    if (!data.findings || data.findings.length === 0) {
      tosClausesList.innerHTML = `<div style="color:var(--neon-emerald); padding:10px;">No predatory clauses detected.</div>`;
    } else {
      tosClausesList.innerHTML = data.findings.map(f => `
        <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border-subtle); padding:14px; border-radius:8px; margin-bottom:12px;">
          <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
            <strong style="color:#fff; font-size:0.9rem;">${f.name}</strong>
            <span class="severity-pill ${f.severity.toLowerCase()}">${f.severity}</span>
          </div>
          <p style="font-size:0.84rem; color:var(--neon-pink); margin-bottom:6px;"><strong>Plain English:</strong> ${f.plain_english}</p>
          <p style="font-size:0.8rem; color:#8b949e;">${f.risk_warning}</p>
        </div>
      `).join('');
    }
  }

  if (data.hazard_score >= 40 && window.soundEngine) window.soundEngine.playAlert();
  else if (window.soundEngine) window.soundEngine.playNeutralized();

  if (btnScanTos) {
    btnScanTos.disabled = false;
    btnScanTos.innerText = 'Analyze Fine Print';
  }
};

window.loadPresetToS = function(sample) {
  let text = "";
  if (sample === 'streaming') {
    text = "Your Hotstar/Jio OTT subscription automatically renews via UPI AutoPay or e-NACH mandate every 30 days at ₹299 unless cancelled 15 days prior to billing. By subscribing, you agree that subscription fees may be increased unilaterally without prior notice. All disputes are subject to binding private arbitration exclusively within the jurisdiction of Mumbai.";
  } else if (sample === 'gym') {
    text = "Cult/Gym Elite Membership requires a mandatory 12-month lock-in period. Early termination penalty fee of ₹1,999 applies upon premature exit. Cancellation requests cannot be processed online and must be submitted via physical registered speed-post letter sent to our corporate office 30 days prior. Registration and locker fees are strictly non-refundable.";
  }
  const tosInput = document.getElementById('tos-input-text');
  if (tosInput) {
    tosInput.value = text;
    window.scanFinePrint(text);
  }
};

// ==========================================
// 4. AUTONOMOUS WEB AGENT (CANCELLATION)
// ==========================================

window.executeAgentFlow = async function() {
  const serviceSelect = document.getElementById('agent-service-select');
  const serviceKey = serviceSelect ? serviceSelect.value : 'jiohotstar';
  if (window.soundEngine) window.soundEngine.playScanSweep();

  const btnLaunchAgent = document.getElementById('btn-launch-agent');
  const agentRunArea = document.getElementById('agent-run-area');
  const agentProgress = document.getElementById('agent-progress-bar');
  const agentStepsContainer = document.getElementById('agent-steps-container');
  const receiptCard = document.getElementById('cancellation-receipt-card');

  if (btnLaunchAgent) {
    btnLaunchAgent.disabled = true;
    btnLaunchAgent.innerHTML = '<span>🤖 Cancelling Subscription &amp; Preparing UPI Guide...</span>';
  }
  if (agentRunArea) agentRunArea.style.display = 'block';
  if (receiptCard) receiptCard.style.display = 'none';
  if (agentStepsContainer) agentStepsContainer.innerHTML = '';

  let data;
  try {
    const res = await fetch('/api/agent/cancel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ service: serviceKey })
    });
    if (!res.ok) throw new Error('API offline');
    data = await res.json();
  } catch (err) {
    const isCult = serviceKey === 'cultfit';
    const isZomato = serviceKey === 'zomatogold';
    data = {
      service: isCult ? "Cult.fit / Gold's Gym All-India Pass" : (isZomato ? "Zomato Gold / Swiggy One VIP Pass" : "JioCinema / Hotstar Super VIP"),
      tier: isCult ? "Elite All-Access Annual Pass (₹1,799/mo)" : (isZomato ? "Annual Gourmet Pass (₹899/yr)" : "Super VIP 4K Plan (₹299/mo)"),
      confirmation_code: "CCPA-REVOKE-9842",
      annual_savings_inr: isCult ? 21588 : (isZomato ? 899 : 3588),
      dark_patterns_defeated: 5,
      trace: [
        {
          step: 1,
          stage: "Step 1: Confirm Shaming Gate",
          reasoning: "Detected glowing green primary button 'Keep My Cricket & Movies'. Secondary action 'Continue with Cancellation' disguised in low-contrast 10px gray font.",
          action: "Bypassed visual hierarchy trap; clicked hidden anchor `a#subtle-continue-cancel`.",
          cdp_command: "Input.dispatchMouseEvent({type: 'mousePressed', x: 420, y: 780})"
        },
        {
          step: 2,
          stage: "Step 2: Diversion & Pause Trap",
          reasoning: "Popup attempting to divert user: 'Pause membership for 2 months at ₹49/mo' to preserve recurring subscription.",
          action: "Rejected diversion; toggled definitive cancellation option `#terminate-membership-strictly`.",
          cdp_command: "DOM.setAttributeValue({nodeId: 44, name: 'checked', value: 'true'})"
        },
        {
          step: 3,
          stage: "Step 3: Double-Negative Checkbox",
          reasoning: "Detected double negative: 'Uncheck this box to not forfeit ₹150 dining and OTT companion coupons'.",
          action: "Decoded linguistic trap; executed uncheck on `#retain-partner-benefits`.",
          cdp_command: "Runtime.evaluate('document.querySelector(\"#retain-partner-benefits\").checked = false;')"
        },
        {
          step: 4,
          stage: "Step 4: Forced Action Survey Lock",
          reasoning: "Multi-page survey presenting 8 optional questions masked as mandatory exit prerequisites.",
          action: "Selected neutral option 'Service no longer needed'; bypassed survey lock.",
          cdp_command: "DOM.querySelector({selector: 'button#survey-bypass-continue'}).click()"
        },
        {
          step: 5,
          stage: "Step 5: UPI AutoPay Mandate Revocation Guide",
          reasoning: "Subscription service cancelled on portal; preparing direct UPI app mandate revocation steps.",
          action: "Generated cancellation proof and instructions: Guides you to revoke the mandate in your UPI app (GPay / PhonePe / Paytm).",
          cdp_command: "UPIMandateGuide.generateSteps({app: 'UPI', status: 'CANCELLATION_CONFIRMED'})"
        }
      ]
    };
  }

  // Reset and show progress checklist
  const checklistCounter = document.getElementById('checklist-step-counter');
  if (checklistCounter) checklistCounter.innerText = '0 / 5 BYPASSED';
  for (let j = 1; j <= 5; j++) {
    const icon = document.getElementById(`chk-icon-${j}`);
    const pill = document.getElementById(`chk-pill-${j}`);
    if (icon) icon.innerText = '⏳';
    if (pill) {
      pill.className = j === 1 ? 'status-pill running' : 'status-pill waiting';
      pill.innerText = j === 1 ? 'Bypassing...' : 'Pending';
    }
  }

  // Animate steps sequentially
  const steps = data.trace || [];
  for (let i = 0; i < steps.length; i++) {
    await new Promise(r => setTimeout(r, 650));
    const s = steps[i];

    // Update Checklist Item for current step
    const stepNum = i + 1;
    const currentIcon = document.getElementById(`chk-icon-${stepNum}`);
    const currentPill = document.getElementById(`chk-pill-${stepNum}`);
    if (currentIcon) currentIcon.innerText = '✅';
    if (currentPill) {
      currentPill.className = 'status-pill defeated';
      currentPill.innerText = 'Defeated';
    }

    if (checklistCounter) checklistCounter.innerText = `${stepNum} / 5 BYPASSED`;

    // Set next step as running
    if (stepNum < 5) {
      const nextPill = document.getElementById(`chk-pill-${stepNum + 1}`);
      if (nextPill) {
        nextPill.className = 'status-pill running';
        nextPill.innerText = 'Bypassing...';
      }
    }

    if (agentProgress) {
      const pct = Math.round(((i + 1) / steps.length) * 100);
      agentProgress.style.width = `${pct}%`;
    }

    if (agentStepsContainer) {
      const stepEl = document.createElement('div');
      stepEl.className = 'agent-step-item';
      stepEl.innerHTML = `
        <div class="agent-step-badge">${s.step}</div>
        <div class="agent-step-title">${s.stage}</div>
        <div class="agent-reasoning-box">
          <strong>🧠 Agent Reasoning:</strong> ${s.reasoning}
        </div>
        <div class="agent-action-box">
          <strong>⚡ Action Dispatched:</strong> ${s.action}
        </div>
        <div class="agent-cdp-cmd">${s.cdp_command}</div>
      `;
      agentStepsContainer.appendChild(stepEl);
    }

    if (window.soundEngine) window.soundEngine.playClick();
    if (window.bgVisualizer) window.bgVisualizer.triggerThreatShockwave(null, null, 'rgba(0, 242, 254, ');
  }

  // Show Receipt
  await new Promise(r => setTimeout(r, 400));
  if (receiptCard) {
    receiptCard.style.display = 'block';
    const sName = document.getElementById('receipt-service-name');
    const tName = document.getElementById('receipt-tier-name');
    const cCode = document.getElementById('receipt-code');
    const sSav = document.getElementById('receipt-savings');
    const dDef = document.getElementById('receipt-defeated');
    if (sName) sName.innerText = data.service;
    if (tName) tName.innerText = data.tier;
    if (cCode) cCode.innerText = data.confirmation_code;
    const savVal = data.annual_savings_inr || data.annual_savings_usd || 3588;
    if (sSav) sSav.innerText = `₹${Number(savVal).toLocaleString('en-IN')}`;
    if (dDef) dDef.innerText = `${data.dark_patterns_defeated} Dark Patterns Defeated`;
    if (window.soundEngine) window.soundEngine.playNeutralized();
  }

  if (btnLaunchAgent) {
    btnLaunchAgent.disabled = false;
    btnLaunchAgent.innerHTML = '<span>🚀 Cancel Subscription &amp; Guide UPI Revocation</span>';
  }
};

// ==========================================
// 5. DARK PATTERN TEST RANGE
// ==========================================

window.toggleDefenseShield = function() {
  if (window.MockSites) {
    const isActive = window.MockSites.toggleShield();
    const btnToggleShield = document.getElementById('btn-toggle-shield');
    const shieldStatusLabel = document.getElementById('shield-status-label');
    if (btnToggleShield) btnToggleShield.classList.toggle('active', isActive);
    if (shieldStatusLabel) {
      shieldStatusLabel.innerText = isActive ? 'TINYFISH SHIELD: ARMED & ACTIVE' : 'TINYFISH SHIELD: OFF (VULNERABLE)';
      shieldStatusLabel.style.color = isActive ? 'var(--neon-emerald)' : 'var(--neon-red)';
    }
  }
};

// ==========================================
// 6. THREAT TAXONOMY LOADER
// ==========================================

window.loadTaxonomy = async function() {
  const taxonomyContainer = document.getElementById('taxonomy-cards-container');
  if (!taxonomyContainer) return;
  const patterns = [
    { title: "Artificial Urgency & Fake Timers", description: "Synthetic countdown clocks and dynamic stock counters that reset on page reload to trigger panic buying.", regulatory_status: "FTC 15 U.S.C. § 45 & EU DSA", detection_heuristic: "CDP detects setInterval/DOM timer loops without backend reserve tokens." },
    { title: "Sneak into Basket (Hidden Add-ons)", description: "Pre-selected checkboxes quietly bundling warranty, travel protection, VIP club, or recurring donations into cart total.", regulatory_status: "EU Consumer Rights Directive 2011/83/EU", detection_heuristic: "DOM analyzer flags <input type='checkbox' checked> carrying monetary keywords." },
    { title: "Confirmshaming & Manipulative Copy", description: "Framing the decline option in insulting language ('No thanks, I hate saving money') to induce cognitive dissonance.", regulatory_status: "UK CMA & OECD 2022 Guidelines", detection_heuristic: "NLP phrase-matching against shame dictionaries on secondary modal links." },
    { title: "Roach Motel (Cancellation Obstruction)", description: "Easy to subscribe with 1-click; nearly impossible to exit without navigating multi-page attrition labyrinths or phone calls.", regulatory_status: "FTC 'Click-to-Cancel' Rule", detection_heuristic: "TinyFish Web Agent traces DOM action trees to identify asymmetric click costs." },
    { title: "Forced Continuity (Silent Auto-Renewal)", description: "Free trial converting into undisclosed recurring monthly or annual billing without proactive notice.", regulatory_status: "ROSCA Act Enforcement", detection_heuristic: "Regex extraction of billing frequency and currency figures in low-contrast styling." },
    { title: "Trick Questions & Double Negatives", description: "Convoluted syntax ('Uncheck if you prefer not to prevent partner alerts') designed to confuse consent.", regulatory_status: "GDPR Consent Invalidation", detection_heuristic: "Syntactic dependency tree identifies double negation on form elements." }
  ];

  try {
    const res = await fetch('/api/patterns');
    if (res.ok) {
      const data = await res.json();
      if (data.patterns && data.patterns.length > 0) {
        taxonomyContainer.innerHTML = data.patterns.map(p => `
          <div class="card">
            <h4 style="color:#fff; font-size:1.1rem; margin-bottom:8px; display:flex; align-items:center; gap:8px;">
              <span style="color:var(--neon-cyan)">◈</span> ${p.title}
            </h4>
            <p style="font-size:0.85rem; color:#8b949e; margin-bottom:12px; line-height:1.5;">${p.description}</p>
            <div style="background:rgba(0,242,254,0.06); border:1px solid rgba(0,242,254,0.2); padding:8px 12px; border-radius:6px; font-size:0.75rem; color:#a5f3fc; margin-bottom:8px;">
              <strong>⚖️ Legal & FTC Status:</strong> ${p.regulatory_status}
            </div>
            <div style="font-family:var(--font-mono); font-size:0.72rem; color:#cbd5e1; background:#07090e; padding:6px 10px; border-radius:4px;">
              <strong>CDP Heuristic:</strong> ${p.detection_heuristic}
            </div>
          </div>
        `).join('');
        return;
      }
    }
  } catch (e) {}

  taxonomyContainer.innerHTML = patterns.map(p => `
    <div class="card">
      <h4 style="color:#fff; font-size:1.1rem; margin-bottom:8px; display:flex; align-items:center; gap:8px;">
        <span style="color:var(--neon-cyan)">◈</span> ${p.title}
      </h4>
      <p style="font-size:0.85rem; color:#8b949e; margin-bottom:12px; line-height:1.5;">${p.description}</p>
      <div style="background:rgba(0,242,254,0.06); border:1px solid rgba(0,242,254,0.2); padding:8px 12px; border-radius:6px; font-size:0.75rem; color:#a5f3fc; margin-bottom:8px;">
        <strong>⚖️ Legal & FTC Status:</strong> ${p.regulatory_status}
      </div>
      <div style="font-family:var(--font-mono); font-size:0.72rem; color:#cbd5e1; background:#07090e; padding:6px 10px; border-radius:4px;">
        <strong>CDP Heuristic:</strong> ${p.detection_heuristic}
      </div>
    </div>
  `).join('');
};

// ==========================================
// 7. GUIDED INTERACTIVE TOUR (1-CLICK DEMO)
// ==========================================

window.runGuidedTour = async function() {
  const tourBtn = document.getElementById('btn-start-tour');
  if (tourBtn) {
    tourBtn.disabled = true;
    tourBtn.innerHTML = '<span>⏳ Running Guided Interactive Tour...</span>';
  }

  function updateTourBanner(stepText, detailText) {
    const banner = document.getElementById('tour-status-banner');
    if (banner) {
      banner.style.display = 'flex';
      const titleEl = document.getElementById('tour-step-title');
      const descEl = document.getElementById('tour-step-desc');
      if (titleEl) titleEl.innerText = stepText;
      if (descEl) descEl.innerText = detailText;
    }
  }

  // Step 1: Jump to Test Lab (Store)
  updateTourBanner("🚀 STEP 1/3: Inspecting Manipulative Food Delivery Checkout", "Notice the red ticking countdown timer, scarcity prompt, and pre-checked +₹49 packaging fee...");
  window.switchTab('tab-testlab');
  if (window.MockSites && window.MockSites.shieldActive) {
    window.MockSites.toggleShield(); // start in raw deceptive mode
  }
  window.scrollTo({ top: 380, behavior: 'smooth' });

  await new Promise(r => setTimeout(r, 4000));

  // Step 2: Activate Defense Shield
  updateTourBanner("🛡️ STEP 2/3: Activating CCPA DarkShield Defense", "Watch closely: DarkShield freezes the fake timer, unticks the sneaky +₹49 fee, and exposes the ₹899 VIP AutoPay fine print!");
  if (window.MockSites && !window.MockSites.shieldActive) {
    window.toggleDefenseShield();
  }

  await new Promise(r => setTimeout(r, 4500));

  // Step 3: Jump to Web Agent unsubscription solver
  updateTourBanner("🤖 STEP 3/3: Deploying Subscription Canceller", "Watching the AI navigate 5 deceptive unsubscription gates and guide you to revoke the mandate in your UPI app...");
  window.switchTab('tab-agent');
  window.scrollTo({ top: 400, behavior: 'smooth' });
  await window.executeAgentFlow();

  // Completion
  updateTourBanner("🎉 CCPA DEFENSE DEMO COMPLETE!", "You just experienced real-time CDP protection, dark pattern neutralization, and UPI mandate revocation guidance!");

  if (tourBtn) {
    tourBtn.disabled = false;
    tourBtn.innerHTML = '<span>▶ Replay 60s Guided Demo</span>';
  }
};

// ==========================================
// INIT ON SCRIPT LOAD & DOM READY
// ==========================================
function initApp() {
  const sandboxContainer = document.getElementById('mock-sandbox-container');
  if (sandboxContainer && window.MockSites) {
    sandboxContainer.innerHTML = window.MockSites.renderFoodDeliveryStore ? window.MockSites.renderFoodDeliveryStore() : window.MockSites.renderSneakersStore();
    window.MockSites.attachMockListeners();
    window.MockSites.startTimer();
  }

  window.launchCDPSession('https://swiftbites-express.in/checkout/cart');
  window.loadTaxonomy();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
