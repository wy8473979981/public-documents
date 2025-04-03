Page({
  data: {
    bubbles: [],
    time: 0,
    animationId: null, // 用于存储动画ID，方便清除
  },

  onReady() {
    this.initCanvas();
  },

  onUnload() {
    // 页面卸载时清除动画，防止内存泄漏
    if (this.data.animationId) {
      clearTimeout(this.data.animationId);
    }
  },

  initCanvas() {
    const query = wx.createSelectorQuery();
    query.select('#liquidCanvas')
      .fields({ node: true, size: true })
      .exec((res) => {
        if (!res[0]) return;

        const canvas = res[0].node;
        const ctx = canvas.getContext('2d');
        const dpr = wx.getSystemInfoSync().pixelRatio;
        
        canvas.width = res[0].width * dpr;
        canvas.height = res[0].height * dpr;
        ctx.scale(dpr, dpr);
        
        // 初始化气泡
        const bubbles = Array.from({ length: 8 }, () => ({
          x: Math.random() * res[0].width,
          y: res[0].height + Math.random() * 50,
          radius: Math.random() * 4 + 3,
          speed: Math.random() * 0.3 + 0.2,
        }));
        
        this.setData({ bubbles }, () => {
          this.animate();
        });
      });
  },

  animate() {
    const query = wx.createSelectorQuery();
    query.select('#liquidCanvas')
      .fields({ node: true, size: true })
      .exec((res) => {
        if (!res[0]) return;

        const canvas = res[0].node;
        const ctx = canvas.getContext('2d');
        const width = res[0].width;
        const height = res[0].height;
        let time = this.data.time;
        const bubbles = this.data.bubbles;
        
        ctx.clearRect(0, 0, width, height);

        // 底层波浪（加速版）
        ctx.beginPath();
        for (let x = 0; x <= width; x += 8) {
          const y = height / 2 + Math.sin(x * 0.025 + time * 0.9) * 8 + 6;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        ctx.fillStyle = 'rgba(180, 160, 100, 0.4)';
        ctx.fill();

        // 主波浪（加速版）
        ctx.beginPath();
        for (let x = 0; x <= width; x += 5) {
          const y = height / 2 + Math.sin(x * 0.03 + time) * 10;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();

        const waveGradient = ctx.createLinearGradient(0, height / 2, 0, height);
        waveGradient.addColorStop(0, 'rgba(255,240,180,0.7)');
        waveGradient.addColorStop(1, 'rgba(230,210,140,0.9)');
        ctx.fillStyle = waveGradient;
        ctx.fill();

        // 高光（同步加速）
        ctx.beginPath();
        for (let x = 0; x <= width; x += 5) {
          const y = height / 2 + Math.sin(x * 0.03 + time) * 10 - 2;
          ctx.lineTo(x, y);
        }
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        time += 0.08; // 动画速度加倍
        this.setData({ time });

        // 使用 setTimeout 模拟 requestAnimationFrame
        const animationId = setTimeout(() => {
          this.animate();
        }, 16); // 约 60fps (1000ms/60 ≈ 16ms)

        this.setData({ animationId });
      });
  }
});