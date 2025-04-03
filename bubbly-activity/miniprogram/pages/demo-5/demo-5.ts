Page({
  data: {
    progressText: "填充中: 0%",
    step: 0,
  },

  onReady() {
    this.initCanvas();
  },

  initCanvas() {
    const query = wx.createSelectorQuery();
    const selector = '#liquidCanvas';
    query.select(selector)
      .node()
      .exec((res) => {
        this.setupCanvas(res[0].node);
      });
  },

  setupCanvas(canvas) {
    // 设置Canvas尺寸
    canvas.width = 300;
    canvas.height = 500;

    // 获取绘图上下文
    const ctx = canvas.getContext('2d');

    // 初始化配置
    this.config = {
      color: '#FFE082',
      maxHeight: 450,
      currentHeight: 0,
      fillSpeed: 0.5,
      waveHeight: 15,
      waveSpeed: 0.005,
      waveLength: 0.02,
      fillComplete: false,
    };

    this.canvas = canvas;
    this.ctx = ctx;

    // 开始动画循环
    this.lastTime = Date.now();
    this.animate();
  },

  animate(step) {
    console.log('step', step);
    
    if (this.stopAnimation) return;

    const now = Date.now();
    const deltaTime = now - this.lastTime;
    this.lastTime = now;

    const { ctx, canvas } = this;

    // 清除画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 绘制黑色背景
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 更新液体高度
    if (!this.config.fillComplete) {
      // 基于时间差的速度控制

      this.config.currentHeight += this.config.fillSpeed * (deltaTime / 16);
      console.log('this.config.currentHeight', this.config.currentHeight);


      if (this.config.currentHeight >= this.config.maxHeight) {
        this.config.currentHeight = this.config.maxHeight;
        this.config.fillComplete = true;
      }

      // 更新进度文本
      const progress = Math.min(
        100,
        Math.floor((this.config.currentHeight / this.config.maxHeight) * 100)
      );
      this.setData({ progressText: `填充中: ${progress}%` });
    } else {
      this.setData({ progressText: `填充完成: 100%` });
    }

    // 绘制液体
    this.drawLiquid();

    // 继续动画循环（使用setTimeout兼容所有版本）
    this.animationTimer = setTimeout(() => {
      this.animate();
    }, 16); // 约60fps
  },



  drawLiquid() {
    const { ctx, canvas, config } = this;
    const time = Date.now() * config.waveSpeed;

    // 绘制液体主体
    ctx.fillStyle = config.color;
    ctx.beginPath();
    ctx.moveTo(0, canvas.height);

    // 创建波浪路径
    for (let x = 0; x <= canvas.width; x += 10) {
      const waveY = canvas.height - config.currentHeight +
        Math.sin(x * config.waveLength + time) * config.waveHeight;
      ctx.lineTo(x, Math.min(waveY, canvas.height));
    }

    ctx.lineTo(canvas.width, canvas.height);
    ctx.closePath();
    ctx.fill();

    // 添加光泽效果
    const gradient = ctx.createLinearGradient(
      0, canvas.height - config.currentHeight - 50,
      0, canvas.height - config.currentHeight
    );
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = gradient;
    ctx.fill();

    // 添加高光边缘
    ctx.beginPath();
    for (let x = 0; x <= canvas.width; x += 10) {
      const waveY = canvas.height - config.currentHeight +
        Math.sin(x * config.waveLength + time) * config.waveHeight;
      if (x === 0) ctx.moveTo(x, waveY);
      else ctx.lineTo(x, waveY);
    }
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 2;
    ctx.stroke();
  },
  onUnload() {
    this.stopAnimation = true;
    if (this.animationTimer) {
      clearTimeout(this.animationTimer);
    }
  }
});