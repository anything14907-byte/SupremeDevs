/**
 * Abstract Generative Canvas Background & Defense Grid Visualizer
 * Renders floating interconnected nodes, subtle neural mesh, and threat pulse shockwaves.
 */

class BackgroundVisualizer {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.nodes = [];
    this.ripples = [];
    this.mouse = { x: -1000, y: -1000 };
    this.nodeCount = 65;

    this.resize();
    this.initNodes();

    window.addEventListener('resize', () => this.resize());
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  initNodes() {
    this.nodes = [];
    for (let i = 0; i < this.nodeCount; i++) {
      this.nodes.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 2 + 1,
        baseColor: Math.random() > 0.4 ? 'rgba(0, 242, 254, ' : 'rgba(157, 78, 221, ',
        alpha: Math.random() * 0.35 + 0.15
      });
    }
  }

  triggerThreatShockwave(x, y, color = 'rgba(255, 51, 102, ') {
    this.ripples.push({
      x: x || this.canvas.width / 2,
      y: y || this.canvas.height / 3,
      radius: 5,
      maxRadius: Math.max(this.canvas.width, this.canvas.height) * 0.4,
      color: color,
      alpha: 0.7
    });
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw ripples
    for (let i = this.ripples.length - 1; i >= 0; i--) {
      const rip = this.ripples[i];
      rip.radius += 4.5;
      rip.alpha -= 0.012;

      if (rip.alpha <= 0 || rip.radius >= rip.maxRadius) {
        this.ripples.splice(i, 1);
        continue;
      }

      this.ctx.beginPath();
      this.ctx.arc(rip.x, rip.y, rip.radius, 0, Math.PI * 2);
      this.ctx.strokeStyle = rip.color + rip.alpha + ')';
      this.ctx.lineWidth = 1.5;
      this.ctx.stroke();
    }

    // Update & draw nodes
    for (let i = 0; i < this.nodes.length; i++) {
      const n = this.nodes[i];
      n.x += n.vx;
      n.y += n.vy;

      if (n.x < 0 || n.x > this.canvas.width) n.vx *= -1;
      if (n.y < 0 || n.y > this.canvas.height) n.vy *= -1;

      // Mouse repulsion / attraction
      const dx = this.mouse.x - n.x;
      const dy = this.mouse.y - n.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 140) {
        n.x -= (dx / dist) * 0.8;
        n.y -= (dy / dist) * 0.8;
      }

      // Draw node
      this.ctx.beginPath();
      this.ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = n.baseColor + n.alpha + ')';
      this.ctx.fill();

      // Draw connections
      for (let j = i + 1; j < this.nodes.length; j++) {
        const n2 = this.nodes[j];
        const d = Math.hypot(n.x - n2.x, n.y - n2.y);
        if (d < 120) {
          this.ctx.beginPath();
          this.ctx.moveTo(n.x, n.y);
          this.ctx.lineTo(n2.x, n2.y);
          const linkAlpha = (1 - d / 120) * 0.12;
          this.ctx.strokeStyle = 'rgba(0, 242, 254, ' + linkAlpha + ')';
          this.ctx.lineWidth = 0.8;
          this.ctx.stroke();
        }
      }
    }

    requestAnimationFrame(() => this.animate());
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.bgVisualizer = new BackgroundVisualizer('bg-canvas');
});
