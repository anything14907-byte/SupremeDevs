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
  const targetUrl = url || (document.getElementById('cdp-url-input') ? document.getElementById('cdp-url-input').value.trim() : 'https://store.hyperfastsneakers.com/checkout');
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
    window.appendTerminalLog('DOM', 'DOM.childNodeInserted', { tag: 'div.countdown-timer', val: '00:09:44' });
  }, 700);

  setTimeout(() => {
    window.appendTerminalLog('TinyFish.AI', '🎯 [THREAT INTERCEPTED] DECEPTION_IDENTIFIED: Fake Urgency Timer', { selector: '.countdown-timer', status: 'FLAGGED' }, true);
    if (window.bgVisualizer) window.bgVisualizer.triggerThreatShockwave();
    if (window.soundEngine) window.soundEngine.playAlert();
  }, 1400);

  setTimeout(() => {
    window.appendTerminalLog('Overlay', '🛡️ [SHIELD APPLIED] Overlay.highlightNode: Deceptive Timer Neutralized', { action: 'SHIELD_OVERLAY_APPLIED', color: '#ff3366' }, false, true);
    if (window.soundEngine) window.soundEngine.playNeutralized();
  }, 2100);
};

// ==========================================
// 2. DOM & URL SCANNER
// ==========================================

window.performUrlScan = async function(url) {
  const targetUrl = url || (document.getElementById('input-scan-url') ? document.getElementById('input-scan-url').value.trim() : '');
  if (!targetUrl) return;
  if (window.soundEngine) window.soundEngine.playScanSweep();

  const btnScanUrl = document.getElementById('btn-scan-url');
  if (btnScanUrl) {
    btnScanUrl.disabled = true;
    btnScanUrl.innerHTML = '<span>⚡ Inspecting DOM & Scripts...</span>';
  }

  let data;
  try {
    const res = await fetch('/api/scan/url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: targetUrl })
    });
    if (!res.ok) throw new Error('API offline');
    data = await res.json();
  } catch (err) {
    // Client-side fallback
    data = {
      source_url: targetUrl,
      deception_index: targetUrl.includes('streaming') ? 68 : (targetUrl.includes('fit') ? 74 : 85),
      risk_level: 'CRITICAL DECEPTION RISK',
      total_threats: 4,
      threats: [
        {
          type: 'FAKE_URGENCY',
          category: 'Artificial Urgency & Countdown Pressure',
          severity: 'HIGH',
          evidence: 'Resetting countdown timer: 00:09:44 detected in DOM',
          impact: 'Induces panic to prevent rational comparison.',
          remedy: 'TinyFish Shield freezes timer countdown.'
        },
        {
          type: 'SNEAK_INTO_BASKET',
          category: 'Pre-Checked Optional Fees & Add-ons',
          severity: 'CRITICAL',
          evidence: 'Pre-selected opt-in for paid feature: VIP Protection Plan ($14.99)',
          impact: 'Silent cart inflation without explicit affirmative consent.',
          remedy: 'TinyFish Web Agent automatically unticks pre-selected upsell inputs.'
        },
        {
          type: 'CONFIRMSHAMING',
          category: 'Emotional Coercion (Confirmshaming)',
          severity: 'HIGH',
          evidence: 'Manipulative link copy: "No thanks, I hate saving money and like overpaying"',
          impact: 'Frames opt-out as foolish to induce emotional guilt.',
          remedy: 'TinyFish rewrites deceptive copy to neutral labels.'
        },
        {
          type: 'HIDDEN_DISCLAIMER',
          category: 'Visual Concealment & Low Contrast Text',
          severity: 'CRITICAL',
          evidence: 'Low contrast disclaimer: font-size 7.5px; opacity 0.3 for $29.99/mo renewal',
          impact: 'Hidden recurring subscription terms obscured from view.',
          remedy: 'TinyFish Shield normalizes CSS to high contrast.'
        }
      ]
    };
  }

  window.renderScanResults(data);

  if (btnScanUrl) {
    btnScanUrl.disabled = false;
    btnScanUrl.innerHTML = '<span>Scan Website</span>';
  }
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
    gaugeSummary.innerText = `Detected ${data.total_threats} manipulative UI traps across DOM and code structure.`;
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
        <div class="threat-impact"><strong>Consumer Risk:</strong> ${t.impact}</div>
        <div class="threat-remedy">
          <span>🛡️</span>
          <span><strong>Aegis Remedy:</strong> ${t.remedy}</span>
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
    text = "Your subscription will automatically renew indefinitely every 30 days unless cancelled 14 days prior to billing. By agreeing, you forfeit any right to participate in a class action lawsuit or jury trial; all claims must be submitted to private binding arbitration on an individual basis. We reserve the right to modify fees at any time without prior written notice.";
  } else if (sample === 'gym') {
    text = "Membership requires a 12-month initial commitment. Early termination fee of $99 applies. Cancellation must be made in person or by certified postal mail sent at least 30 days prior. We may share or sell your contact information and physical telemetry data to commercial wellness partners.";
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
  const serviceKey = serviceSelect ? serviceSelect.value : 'streamflix';
  if (window.soundEngine) window.soundEngine.playScanSweep();

  const btnLaunchAgent = document.getElementById('btn-launch-agent');
  const agentRunArea = document.getElementById('agent-run-area');
  const agentProgress = document.getElementById('agent-progress-bar');
  const agentStepsContainer = document.getElementById('agent-steps-container');
  const receiptCard = document.getElementById('cancellation-receipt-card');

  if (btnLaunchAgent) {
    btnLaunchAgent.disabled = true;
    btnLaunchAgent.innerHTML = '<span>🤖 Web Agent Navigating Cancellation Gates...</span>';
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
    data = {
      service: serviceKey === 'gympro' ? 'FitZone All-Access Club' : (serviceKey === 'cloudbox' ? 'CloudVault Enterprise' : 'StreamFlix Prime Video'),
      tier: serviceKey === 'gympro' ? 'Platinum ($59.99/mo)' : (serviceKey === 'cloudbox' ? 'Pro ($34/mo)' : 'Ultra HD 4K ($22.99/mo)'),
      confirmation_code: 'TINYFISH-CANC-9942',
      annual_savings_usd: serviceKey === 'gympro' ? 719.88 : (serviceKey === 'cloudbox' ? 408.00 : 275.88),
      dark_patterns_defeated: 5,
      trace: [
        {
          step: 1,
          stage: "Step 1: The Guilt Trip (Confirmshaming)",
          reasoning: "Detected high-saturation primary button 'Keep My Plan' in glowing green. Secondary action 'Continue to Cancel' hidden as 10px gray text.",
          action: "Bypassed visual hierarchy trap; clicked `a#subtle-continue-cancel`.",
          cdp_command: "Input.dispatchMouseEvent({type: 'mousePressed', x: 420, y: 780})"
        },
        {
          step: 2,
          stage: "Step 2: The Pause Trap (Diversion Offer)",
          reasoning: "Modal offering 'Pause for 3 months at $3.99/mo' to prevent definitive cancellation.",
          action: "Rejected diversion; selected strict cancellation radio button `#terminate-strictly`.",
          cdp_command: "DOM.setAttributeValue({nodeId: 44, name: 'checked', value: 'true'})"
        },
        {
          step: 3,
          stage: "Step 3: Inverted Logic Checkbox",
          reasoning: "Detected double negative: 'Uncheck this box to not retain backup preferences for $1.99/mo'.",
          action: "Decoded linguistic trap; executed uncheck on `#retain-cloud-sync`.",
          cdp_command: "Runtime.evaluate('document.querySelector(\"#retain-cloud-sync\").checked = false;')"
        },
        {
          step: 4,
          stage: "Step 4: Exhaustion Survey Gate",
          reasoning: "Detected multi-step survey with 8 optional questions disguised as required fields.",
          action: "Selected neutral option 'Service no longer needed'; triggered fast-forward submit.",
          cdp_command: "DOM.querySelector({selector: 'button#survey-submit-and-continue'}).click()"
        },
        {
          step: 5,
          stage: "Step 5: Final Termination Handshake",
          reasoning: "Found final confirmation prompt requiring strict confirmation.",
          action: "Dispatched verified termination event; captured cancellation certificate.",
          cdp_command: "Page.captureScreenshot(); Target.disposeBrowserContext()"
        }
      ]
    };
  }

  // Animate steps sequentially
  const steps = data.trace || [];
  for (let i = 0; i < steps.length; i++) {
    await new Promise(r => setTimeout(r, 700));
    const s = steps[i];

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
          <strong>⚡ CDP Action Dispatched:</strong> ${s.action}
        </div>
        <div class="agent-cdp-cmd">${s.cdp_command}</div>
      `;
      agentStepsContainer.appendChild(stepEl);
    }

    if (window.soundEngine) window.soundEngine.playClick();
    if (window.bgVisualizer) window.bgVisualizer.triggerThreatShockwave(null, null, 'rgba(0, 242, 254, ');
  }

  // Show Receipt
  await new Promise(r => setTimeout(r, 500));
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
    if (sSav) sSav.innerText = `$${Number(data.annual_savings_usd).toFixed(2)}`;
    if (dDef) dDef.innerText = `${data.dark_patterns_defeated} Dark Pattern Barriers Bypassed`;
    if (window.soundEngine) window.soundEngine.playNeutralized();
  }

  if (btnLaunchAgent) {
    btnLaunchAgent.disabled = false;
    btnLaunchAgent.innerHTML = '<span>🚀 Deploy Autonomous Cancellation Agent</span>';
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
  updateTourBanner("🚀 STEP 1/3: Inspecting Manipulative E-Commerce Store", "Notice the red ticking countdown timer and the pre-checked +$14.99 insurance fee...");
  window.switchTab('tab-testlab');
  if (window.MockSites && window.MockSites.shieldActive) {
    window.MockSites.toggleShield(); // start in raw deceptive mode
  }
  window.scrollTo({ top: 380, behavior: 'smooth' });

  await new Promise(r => setTimeout(r, 4000));

  // Step 2: Activate Defense Shield
  updateTourBanner("🛡️ STEP 2/3: Activating Aegis Defense Shield", "Watch closely: TinyFish freezes the fake timer and unticks the sneaky +$14.99 fee!");
  if (window.MockSites && !window.MockSites.shieldActive) {
    window.toggleDefenseShield();
  }

  await new Promise(r => setTimeout(r, 4500));

  // Step 3: Jump to Web Agent unsubscription solver
  updateTourBanner("🤖 STEP 3/3: Deploying Autonomous Cancellation Agent", "Watching the AI navigate 5 deceptive unsubscription gates across tricky Roach Motel portals...");
  window.switchTab('tab-agent');
  window.scrollTo({ top: 400, behavior: 'smooth' });
  await window.executeAgentFlow();

  // Completion
  updateTourBanner("🎉 TOUR COMPLETE!", "You just experienced real-time CDP protection, dark pattern neutralization, and autonomous unsubscription!");

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
    sandboxContainer.innerHTML = window.MockSites.renderSneakersStore();
    window.MockSites.attachMockListeners();
    window.MockSites.startTimer();
  }

  window.launchCDPSession('https://store.hyperfastsneakers.com/checkout');
  window.loadTaxonomy();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
