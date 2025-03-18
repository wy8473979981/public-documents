Page({
  data: {
    waterAnimation: {} // 存储动画数据
  },

  onReady() {
    this.initAnimation();
    this.startAccelerometer();
  },

  // 初始化动画实例
  initAnimation() {
    this.animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease-out'
    });
  },

  // 启动加速度监听
  startAccelerometer() {
    wx.startAccelerometer({ interval: 'game' });
    wx.onAccelerometerChange((res) => {
      const { x } = res; // x轴加速度（左右晃动）
      if (Math.abs(x) > 0.5) { // 灵敏度阈值
        this.triggerWaterShake(x);
      }
    });
  },

  // 触发水面晃动
  triggerWaterShake(accelerationX) {
    const tilt = accelerationX * 20; // 根据加速度计算倾斜角度
    this.animation.rotate(tilt).translateX(tilt).step();
    this.setData({
      waterAnimation: this.animation.export()
    });

    // 添加惯性回弹效果
    setTimeout(() => {
      this.animation.rotate(0).translateX(0).step();
      this.setData({ waterAnimation: this.animation.export() });
    }, 300);
  },

  onUnload() {
    wx.stopAccelerometer(); // 关闭传感器
  }
});