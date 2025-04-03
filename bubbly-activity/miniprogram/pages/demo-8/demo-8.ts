Page({
  data: {
    bubbles: [],
    time: 0,
    animationId: null, // 用于存储动画ID，方便清除
    count: 0, // 新增count变量，控制绘制高度
  },

  onReady() {
    this.initCanvas();
    setInterval(()=>{
      this.setCount(this.data.count+1)
    },1000)
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

  // 新增方法：设置count值
  setCount(count) {
    this.setData({ count });
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
        const count = this.data.count;
        
        ctx.clearRect(0, 0, width, height);

        // 如果count为0，则不绘制任何内容
        if (count === 0) {
          // 使用 setTimeout 模拟 requestAnimationFrame
          const animationId = setTimeout(() => {
            this.animate();
          }, 16);
          this.setData({ animationId });
          return;
        }

        // 计算当前应该绘制的高度比例 (0.05到0.5之间，即5%到50%)
        const maxHeightRatio = 0.5; // 最大高度为画布的一半
        const heightRatio = Math.min(count / 10 * maxHeightRatio, maxHeightRatio);
        const currentHeight = height * heightRatio;

        // 底层波浪（加速版）
        ctx.beginPath();
        for (let x = 0; x <= width; x += 8) {
          // 计算波浪y坐标，从底部向上绘制，限制在currentHeight范围内
          const waveY = height - currentHeight + Math.sin(x * 0.025 + time * 0.9) * 8 + 6;
          const y = Math.min(waveY, height);
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
          // 计算波浪y坐标，从底部向上绘制，限制在currentHeight范围内
          const waveY = height - currentHeight + Math.sin(x * 0.03 + time) * 10;
          const y = Math.min(waveY, height);
          ctx.lineTo(x, y);
        }
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();

        // 调整渐变的起始和结束位置，使其与当前高度匹配
        const waveGradient = ctx.createLinearGradient(0, height - currentHeight, 0, height);
        waveGradient.addColorStop(0, 'rgba(255,240,180,0.7)');
        waveGradient.addColorStop(1, 'rgba(230,210,140,0.9)');
        ctx.fillStyle = waveGradient;
        ctx.fill();

        // 高光（同步加速）
        ctx.beginPath();
        for (let x = 0; x <= width; x += 5) {
          // 计算波浪y坐标，从底部向上绘制，限制在currentHeight范围内
          const waveY = height - currentHeight + Math.sin(x * 0.03 + time) * 10 - 2;
          const y = Math.min(waveY, height);
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