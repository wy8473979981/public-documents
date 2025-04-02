Page({
  data: {
    progressText: "填充中: 0%",
    currentStep: 0  // 新增的步骤变量，范围0-10
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
    canvas.width = 300;
    canvas.height = 500;
    const ctx = canvas.getContext('2d');

    this.config = {
      color: '#FFE082',
      maxHeight: 450,  // 最大高度
      currentHeight: 0,
      fillSpeed: 0.5,
      waveHeight: 15,
      waveSpeed: 0.005,
      waveLength: 0.02,
      fillComplete: false,
      stepHeight: 45,  // 每份高度 = maxHeight / 10
      targetHeight: 0  // 当前步骤的目标高度
    };

    this.canvas = canvas;
    this.ctx = ctx;
    this.lastTime = Date.now();
    this.animate();
  },

  // 新增方法：设置当前步骤
  setCurrentStep(step) {
    if (step >= 0 && step <= 10) {
      this.setData({ currentStep: step });
      this.config.targetHeight = step * this.config.stepHeight;
      this.config.fillComplete = (step === 10);
    }
  },

  // 增加一步
  increaseStep() {
    this.setCurrentStep(this.data.currentStep + 1);
  },

  // 减少一步
  decreaseStep() {
    this.setCurrentStep(this.data.currentStep - 1);
  },

  animate() {
    if (this.stopAnimation) return;

    const now = Date.now();
    const deltaTime = now - this.lastTime;
    this.lastTime = now;

    const { ctx, canvas, config } = this;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 更新液体高度（向目标高度靠近）
    if (Math.abs(config.currentHeight - config.targetHeight) > 1) {
      const direction = config.currentHeight < config.targetHeight ? 1 : -1;
      config.currentHeight += direction * config.fillSpeed * (deltaTime / 16);
      
      // 确保不超过目标高度
      if ((direction > 0 && config.currentHeight > config.targetHeight) || 
          (direction < 0 && config.currentHeight < config.targetHeight)) {
        config.currentHeight = config.targetHeight;
      }
    }

    // 更新进度文本
    const progress = Math.min(
      100,
      Math.floor((config.currentHeight / config.maxHeight) * 100)
    );
    this.setData({ 
      progressText: config.fillComplete ? 
        `填充完成: 100%` : 
        `填充中: ${progress}% (步骤 ${this.data.currentStep}/10)`
    });

    // 绘制液体
    this.drawLiquid();

    this.animationTimer = setTimeout(() => {
      this.animate();
    }, 16);
  },

  drawLiquid() {
    // ...保持原有的drawLiquid方法不变...
  },

  onUnload() {
    this.stopAnimation = true;
    if (this.animationTimer) {
      clearTimeout(this.animationTimer);
    }
  }
});