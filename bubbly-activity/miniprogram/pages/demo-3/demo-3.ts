// pages/shake/shake.js
Page({
  data: {
    accY: 0,               // 存储Y轴加速度数据
    maxOffset: 150,        // 最大偏移量(px)
    sensitivity: 2,         // 灵敏度调节系数
    lastUpdate: 0,         // 上次更新时间戳
    animationData: {},     // 动画数据
    isAnimating: false     // 动画状态标志
  },

  onLoad() {
    // 初始化动画
    this.animation = wx.createAnimation({
      duration: 16,        // 每帧持续时间(ms)
      timingFunction: 'linear',
      transformOrigin: '50% 50%'
    });

    // 监听加速度计变化（节流处理）
    wx.onAccelerometerChange(this.throttleUpdate.bind(this));
  },

  onUnload() {
    // 页面卸载时停止监听
    wx.stopAccelerometer();
  },

  // 节流函数（控制更新频率）
  throttleUpdate(res) {
    const now = Date.now();
    if (now - this.data.lastUpdate > 16) { // ~60fps
      this.handleAccelerometer(res);
      this.data.lastUpdate = now;
    }
  },

  // 处理加速度计数据
  handleAccelerometer(res) {
    // 计算新位置（带缓动效果）
    const targetY = res.y * this.data.sensitivity * this.data.maxOffset;
    const currentY = this.data.accY;
    const newY = currentY + (targetY - currentY) * 0.3; // 缓动系数
    
    this.setData({
      accY: Math.max(-this.data.maxOffset, Math.min(newY, this.data.maxOffset))
    }, () => {
      this.updateAnimation();
    });
  },

  // 更新动画
  updateAnimation() {
    if (this.data.isAnimating) return;
    
    this.data.isAnimating = true;
    this.animation.translateY(this.data.accY).step();
    
    this.setData({
      animationData: this.animation.export()
    }, () => {
      this.data.isAnimating = false;
    });
  }
});