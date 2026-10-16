/**
 * Interactive Dark Pattern Test Range Simulator - Indian E-Commerce & Food Delivery
 * Localized for Indian Consumers with CCPA (Dark Patterns) Guidelines 2023 Mapping.
 */

const MockSites = {
  activeSite: 'food_delivery',
  shieldActive: false,
  timerSeconds: 584,
  timerInterval: null,

  renderSneakersStore() {
    return this.renderFoodDeliveryStore();
  },

  renderFoodDeliveryStore() {
    const shield = this.shieldActive;
    return `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1e293b;">
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px; margin-bottom: 16px;">
          <div>
            <h2 style="color: #0f172a; font-size: 1.35rem; font-weight: 800; display:flex; align-items:center; gap:8px;">
              <span>🍛 SWIFT-BITES EXPRESS</span>
              <span style="font-size:0.75rem; background:#f1f5f9; color:#475569; padding:2px 8px; border-radius:12px; font-weight:600;">Koramangala, Bengaluru</span>
            </h2>
          </div>
          <span style="font-size: 0.8rem; background: #fee2e2; color: #ef4444; font-weight: bold; padding: 4px 10px; border-radius: 20px;">
            🔥 FESTIVE FEAST #402
          </span>
        </div>

        <!-- False Urgency Bar -->
        <div class="deceptive-timer" style="background: ${shield ? '#ecfdf5' : '#dc2626'}; border: 1px solid ${shield ? '#10b981' : '#b91c1c'}; color: ${shield ? '#065f46' : '#ffffff'}; padding: 12px 16px; border-radius: 8px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center; font-weight: bold; flex-wrap: wrap; gap: 8px;">
          <div style="display:flex; align-items:center; gap:8px;">
            <span>${shield ? '🛑 [FROZEN] False Urgency:' : '⏱️ 40% FESTIVE DISCOUNT EXPIRES IN:'}</span>
            <span id="mock-countdown-timer" style="font-family: monospace; font-size: 1.2rem; letter-spacing: 1.5px; background: ${shield ? '#d1fae5' : 'rgba(0,0,0,0.25)'}; padding: 2px 8px; border-radius: 4px;">09:44</span>
          </div>
          <span style="font-size: 0.78rem; opacity: 0.95;">
            ${shield ? '✅ DarkShield Froze Timer — shop without artificial pressure' : '⚠️ 38 foodies in Bengaluru ordering right now!'}
          </span>
        </div>

        <!-- Main Product Card -->
        <div style="display: grid; grid-template-columns: 120px 1fr; gap: 18px; background: #f8fafc; padding: 18px; border-radius: 10px; border: 1px solid #e2e8f0; margin-bottom: 16px;">
          <div style="background: linear-gradient(135deg, #f97316, #ea580c); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #ffffff; font-weight: bold; font-size: 0.85rem; text-align: center; height: 105px; padding: 10px; box-shadow: 0 4px 12px rgba(249, 115, 22, 0.25);">
            🍗 ROYAL DUM<br>BIRYANI COMBO
          </div>
          <div>
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
              <div>
                <h3 style="font-size: 1.15rem; color: #0f172a; font-weight: 700;">Special Lucknowi Dum Biryani + Kebabs Meal</h3>
                <p style="color: #64748b; font-size: 0.78rem; margin-top: 4px;">Serves 2 • Includes Gulab Jamun & Raita • Hot & Fresh Delivery</p>
              </div>
              <span style="font-weight: 800; font-size: 1.25rem; color: #0f172a; font-family: monospace;">₹449</span>
            </div>
            <!-- False Urgency Scarcity Trigger -->
            <p style="color: ${shield ? '#64748b' : '#ef4444'}; font-size: 0.8rem; font-weight: 600; margin-top: 6px;">
              ${shield ? 'ℹ️ Verified Stock: Standard kitchen preparation active' : '⚡ Only 2 chef portions left — high demand in your area!'}
            </p>
          </div>
        </div>

        <!-- Basket Sneaking (Pre-checked add-on fee) -->
        <div class="sneak-addon" style="background: ${shield ? '#ecfdf5' : '#fef2f2'}; border: 1px solid ${shield ? '#10b981' : '#f87171'}; padding: 14px 18px; border-radius: 8px; margin-bottom: 16px;">
          <label style="display: flex; align-items: flex-start; gap: 12px; cursor: pointer;">
            <input type="checkbox" id="mock-warranty-checkbox" ${shield ? '' : 'checked'} style="margin-top: 3px; transform: scale(1.2);" />
            <div style="flex: 1;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-weight: 700; font-size: 0.92rem; color: #0f172a;">
                  Add Priority Rain Surge + Safe Packaging Shield
                </span>
                <span style="font-weight: 800; color: ${shield ? '#64748b' : '#dc2626'}; font-size: 0.95rem;">+₹49</span>
              </div>
              <p style="font-size: 0.78rem; color: #475569; margin-top: 4px;">
                ${shield ? 
                  '<strong style="color:#059669;">🛡️ Basket Sneaking Neutralized:</strong> Pre-checked +₹49 fee unticked automatically. Explicit consent restored.' : 
                  'Pre-selected for your convenience. Guarantees priority dispatch and eco-thermal insulation.'}
              </p>
            </div>
          </label>
        </div>

        <!-- Trick Question & Double Negative -->
        <div style="background: #f8fafc; padding: 12px 18px; border-radius: 8px; margin-bottom: 16px; border: 1px solid #e2e8f0;">
          <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
            <input type="checkbox" id="mock-inverted-checkbox" style="transform: scale(1.15);" />
            <span style="font-size: 0.82rem; color: #334155;">
              ${shield ? 
                '<strong style="color:#0284c7;">[Trick Question Decoded] Affirmative Choice:</strong> Send me promotional WhatsApp meal alerts (Default: Unchecked)' : 
                'Uncheck this box if you wish not to prevent third-party dining partners from sending promotional WhatsApp alerts.'
              }
            </span>
          </label>
        </div>

        <!-- Interface Interference / Hidden Subscription Disclaimer -->
        <div style="margin-bottom: 20px; padding: 12px; border-radius: 6px; background: ${shield ? '#fffbeb' : '#f8fafc'}; border: ${shield ? '2px solid #f59e0b' : '1px dashed #cbd5e1'};">
          <p style="font-size: ${shield ? '0.85rem' : '7.5px'}; color: ${shield ? '#92400e' : '#94a3b8'}; line-height: 1.45; font-weight: ${shield ? '600' : 'normal'};">
            ${shield ? '⚠️ <strong>FINE PRINT ALERT (Interface Interference Exposed):</strong><br>' : ''}
            By clicking Place Order, you enroll in a 14-day trial of SwiftBites VIP Gourmet Pass, after which your payment method or UPI AutoPay will be debited ₹899 every year automatically. Cancellations require 7-day registered notice.
          </p>
        </div>

        <!-- Action Buttons & Dynamic Price Breakdown -->
        <div style="display: flex; gap: 14px; align-items: center;">
          <button id="btn-mock-buy" style="flex: 1; background: #0f172a; color: #ffffff; padding: 14px; border-radius: 8px; font-weight: 700; border: none; cursor: pointer; font-size: 0.95rem; box-shadow: 0 4px 14px rgba(15, 23, 42, 0.3);">
            Place Order (₹${shield ? '449' : '498'})
          </button>
          <button id="btn-mock-cancel" style="background: transparent; color: #64748b; border: 1px solid #cbd5e1; padding: 14px 18px; border-radius: 8px; font-size: 0.85rem; cursor: pointer; font-weight: 600;">
            Cancel
          </button>
        </div>

        <!-- Confirm Shaming Modal Placeholder -->
        <div id="mock-confirmshame-modal" style="display: none; margin-top: 18px; background: #fee2e2; border: 1px solid #fca5a5; padding: 16px; border-radius: 8px;">
          <h4 style="color: #991b1b; font-size: 0.95rem; font-weight: bold; margin-bottom: 6px;">Wait! Don't leave your hungry cart!</h4>
          <p style="font-size: 0.82rem; color: #7f1d1d; margin-bottom: 12px;">
            ${shield ? 'DarkShield Neutralized: Would you like to save this meal for later or exit checkout?' : 'If you leave now, you lose your ₹150 festive discount forever and will pay full price.'}
          </p>
          <div style="display: flex; gap: 10px; flex-wrap: wrap;">
            <button style="background: #dc2626; color: #fff; border: none; padding: 8px 14px; border-radius: 6px; font-size: 0.8rem; font-weight: bold; cursor: pointer;">
              ${shield ? 'Save For Later' : 'Keep My ₹150 Discount!'}
            </button>
            <button onclick="document.getElementById('mock-confirmshame-modal').style.display='none'" style="background: transparent; border: none; color: #7f1d1d; font-size: 0.8rem; text-decoration: underline; cursor: pointer;">
              ${shield ? 'Exit Checkout' : 'No thanks, I hate saving money and like overpaying'}
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
      container.innerHTML = this.renderFoodDeliveryStore();
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
