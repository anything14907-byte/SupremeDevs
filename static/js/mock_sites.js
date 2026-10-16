/**
 * Interactive Dark Pattern Test Range Simulator
 * Generates interactive test environments demonstrating common e-commerce & SaaS deception.
 */

const MockSites = {
  activeSite: 'sneakers',
  shieldActive: false,
  timerSeconds: 584,
  timerInterval: null,

  renderSneakersStore() {
    const shield = this.shieldActive;
    return `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1e293b;">
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px; margin-bottom: 16px;">
          <h2 style="color: #0f172a; font-size: 1.4rem; font-weight: 800;">⚡ HYPER-KICKS GLOBAL STORE</h2>
          <span style="font-size: 0.8rem; background: #fee2e2; color: #ef4444; font-weight: bold; padding: 4px 10px; border-radius: 20px;">
            🔥 HOT DROP #902
          </span>
        </div>

        <!-- Fake Urgency Bar -->
        <div class="deceptive-timer" style="background: ${shield ? '#fef2f2' : '#dc2626'}; color: ${shield ? '#991b1b' : '#ffffff'}; padding: 10px 16px; border-radius: 8px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center; font-weight: bold;">
          <div>
            <span>⏱️ RESERVED CART EXPIRES IN: </span>
            <span id="mock-countdown-timer" style="font-family: monospace; font-size: 1.15rem; letter-spacing: 1px;">09:44</span>
          </div>
          <span style="font-size: 0.78rem; opacity: 0.9;">⚠️ Items will be released to 48 waiting buyers</span>
        </div>

        <!-- Main Product Card -->
        <div style="display: grid; grid-template-columns: 140px 1fr; gap: 20px; background: #f8fafc; padding: 18px; border-radius: 10px; border: 1px solid #e2e8f0; margin-bottom: 18px;">
          <div style="background: linear-gradient(135deg, #1e293b, #0f172a); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #38bdf8; font-weight: bold; font-size: 0.8rem; text-align: center; height: 110px;">
            👟 AERO-GLIDE<br>PRO 2026
          </div>
          <div>
            <div style="display: flex; justify-content: space-between;">
              <h3 style="font-size: 1.15rem; color: #0f172a;">Aero-Glide Velocity Edition (Size 10.5)</h3>
              <span style="font-weight: 800; font-size: 1.2rem; color: #0f172a;">\$189.00</span>
            </div>
            <p style="color: #ef4444; font-size: 0.8rem; font-weight: 600; margin-top: 4px;">
              ⚡ Only 2 left in stock — 38 people viewing this item right now!
            </p>
            <p style="color: #64748b; font-size: 0.78rem; margin-top: 6px;">Express 2-day delivery guaranteed</p>
          </div>
        </div>

        <!-- Sneak Into Basket Addon -->
        <div class="sneak-addon" style="background: ${shield ? '#ecfdf5' : '#f1f5f9'}; border: 1px solid ${shield ? '#10b981' : '#cbd5e1'}; padding: 14px 18px; border-radius: 8px; margin-bottom: 16px;">
          <label style="display: flex; align-items: flex-start; gap: 12px; cursor: pointer;">
            <input type="checkbox" id="mock-warranty-checkbox" ${shield ? '' : 'checked'} style="margin-top: 3px; transform: scale(1.15);" />
            <div>
              <div style="display: flex; justify-content: space-between;">
                <span style="font-weight: 700; font-size: 0.9rem; color: #0f172a;">Add Sneaker Armor & Sole Insurance</span>
                <span style="font-weight: 700; color: #059669;">+\$14.99</span>
              </div>
              <p style="font-size: 0.75rem; color: #64748b; margin-top: 2px;">
                ${shield ? '<span style="color:#059669; font-weight:bold;">🛡️ TinyFish Neutralized: Pre-checked add-on unticked.</span>' : 'Pre-selected for your convenience. Covers mud, scuffs, and laces for 12 months.'}
              </p>
            </div>
          </label>
        </div>

        <!-- Inverted Checkbox -->
        <div style="background: #f8fafc; padding: 12px 18px; border-radius: 8px; margin-bottom: 16px; border: 1px solid #e2e8f0;">
          <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
            <input type="checkbox" id="mock-inverted-checkbox" style="transform: scale(1.1);" />
            <span style="font-size: 0.8rem; color: #334155;">
              ${shield ? 
                '<strong>Clear Affirmative Choice:</strong> Send me partner promotional offers (Default: Unchecked)' : 
                'Uncheck this box if you wish not to prevent third-party marketing affiliates from receiving transactional updates.'
              }
            </span>
          </label>
        </div>

        <!-- Hidden Microscopic Disclaimer -->
        <div style="margin-bottom: 20px; padding: 10px; border-radius: 6px; background: ${shield ? '#fffbeb' : 'transparent'}; border: ${shield ? '1px solid #f59e0b' : 'none'};">
          <p style="font-size: ${shield ? '0.85rem' : '7.5px'}; color: ${shield ? '#b45309' : '#94a3b8'}; line-height: 1.4;">
            ${shield ? '⚠️ <strong>TINYFISH FINE PRINT EXPOSURE:</strong> ' : ''}
            By clicking Complete Order, you agree that after your 7-day complimentary VIP trial, you will be automatically billed \$29.99 every month until cancelled. Disputes must be submitted via binding arbitration.
          </p>
        </div>

        <!-- Action Buttons -->
        <div style="display: flex; gap: 14px; align-items: center;">
          <button id="btn-mock-buy" style="flex: 1; background: #0f172a; color: #ffffff; padding: 14px; border-radius: 8px; font-weight: 700; border: none; cursor: pointer; font-size: 0.95rem;">
            Complete Order (\$${shield ? '189.00' : '203.99'})
          </button>
          <button id="btn-mock-cancel" style="background: transparent; color: #64748b; border: 1px solid #cbd5e1; padding: 14px 18px; border-radius: 8px; font-size: 0.85rem; cursor: pointer;">
            Cancel
          </button>
        </div>

        <!-- Confirmshaming Modal Placeholder -->
        <div id="mock-confirmshame-modal" style="display: none; margin-top: 18px; background: #fee2e2; border: 1px solid #fca5a5; padding: 16px; border-radius: 8px;">
          <h4 style="color: #991b1b; font-size: 0.95rem; font-weight: bold; margin-bottom: 6px;">Wait! Don't leave empty handed!</h4>
          <p style="font-size: 0.82rem; color: #7f1d1d; margin-bottom: 12px;">
            ${shield ? 'Neutralized: Would you like to save this item for later or exit?' : 'If you leave now, you forfeit your exclusive 20% reserved member coupon forever.'}
          </p>
          <div style="display: flex; gap: 10px;">
            <button style="background: #dc2626; color: #fff; border: none; padding: 8px 14px; border-radius: 6px; font-size: 0.8rem; font-weight: bold; cursor: pointer;">
              ${shield ? 'Keep In Cart' : 'Claim My 20% Discount!'}
            </button>
            <button onclick="document.getElementById('mock-confirmshame-modal').style.display='none'" style="background: transparent; border: none; color: #7f1d1d; font-size: 0.78rem; text-decoration: underline; cursor: pointer;">
              ${shield ? 'Exit Store' : 'No thanks, I hate saving money and like overpaying'}
            </button>
          </div>
        </div>
      </div>
    `;
  },

  startTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerSeconds = 584; // 9:44
    this.timerInterval = setInterval(() => {
      if (this.shieldActive) return; // Freeze timer if shield is active!
      this.timerSeconds--;
      if (this.timerSeconds <= 0) this.timerSeconds = 599; // Loops forever (fake urgency proof!)
      const mins = Math.floor(this.timerSeconds / 60).toString().padStart(2, '0');
      const secs = (this.timerSeconds % 60).toString().padStart(2, '0');
      const el = document.getElementById('mock-countdown-timer');
      if (el) el.innerText = `${mins}:${secs}`;
    }, 1000);
  },

  toggleShield() {
    this.shieldActive = !this.shieldActive;
    if (window.soundEngine) {
      if (this.shieldActive) window.soundEngine.playNeutralized();
      else window.soundEngine.playAlert();
    }
    const container = document.getElementById('mock-sandbox-container');
    if (container) {
      container.innerHTML = this.renderSneakersStore();
      this.attachMockListeners();
    }
    return this.shieldActive;
  },

  attachMockListeners() {
    const cancelBtn = document.getElementById('btn-mock-cancel');
    if (cancelBtn) {
      cancelBtn.onclick = () => {
        const modal = document.getElementById('mock-confirmshame-modal');
        if (modal) modal.style.display = 'block';
        if (window.soundEngine) window.soundEngine.playAlert();
      };
    }
  }
};

window.MockSites = MockSites;
