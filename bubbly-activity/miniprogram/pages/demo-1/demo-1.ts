interface DemoPageData {
  animationData: any;
  currentPosition: number;
  currentSpeed: number;
  lastY: number;
  damping: number;
  sensitivity: number;
  maxSpeed: number;
  boundary: number;
  animation: ReturnType<typeof wx.createAnimation> | null;
  animationInterval: number | null;
}

Page({
  data: {
    animationData: {},
    currentPosition: 0,
    currentSpeed: 0,
    lastY: 0,
    damping: 0.92,
    sensitivity: 15,
    maxSpeed: 40,
    boundary: 300,
    animation: null,
    animationInterval: null,
  } as DemoPageData,

  onLoad() {
    this.initAnimation();
    this.startAccelerometer();
    this.startAnimation();
  },

  onUnload() {
    this.stopAccelerometer();
    this.stopAnimation();
  },

  initAnimation() {
    const animation = wx.createAnimation({
      duration: 16,
      timingFunction: 'linear',
      transformOrigin: '50% 50%',
    });
    this.setData({ animation });
  },

  startAccelerometer() {
    wx.getSystemInfo({
      success: (res) => {
        if (res.platform === 'devtools') {
          wx.showToast({
            title: '请在真机上测试',
            icon: 'none',
          });
          return;
        }

        wx.startAccelerometer({
          interval: 'game',
          success: () => {
            wx.onAccelerometerChange(this.handleAccelerometerChange.bind(this));
          },
          fail: (err) => {
            console.error('加速度计启动失败:', err);
            wx.showToast({
              title: '加速度计不可用',
              icon: 'none',
            });
          },
        });
      },
    });
  },

  stopAccelerometer() {
    wx.offAccelerometerChange();
    wx.stopAccelerometer();
  },

  handleAccelerometerChange(res: WechatMiniprogram.OnAccelerometerChangeCallbackResult) {
    const currentY = Number(res.y);
    const lastY = Number(this.data.lastY);
    const delta = currentY - lastY;

    if (Math.abs(delta) > 2) {
      let newSpeed = Number(this.data.currentSpeed) + delta * Number(this.data.sensitivity);
      newSpeed = Math.max(
        Math.min(newSpeed, Number(this.data.maxSpeed)),
        -Number(this.data.maxSpeed)
      );

      this.setData({
        currentSpeed: Number(newSpeed.toFixed(2)),
        lastY: currentY,
      });
    }
  },

  startAnimation() {
    if (this.data.animationInterval) return;

    const animate = () => {
      // 确保所有数值都是Number类型
      const currentSpeed = Number(this.data.currentSpeed);
      let newPosition = Number(this.data.currentPosition) + currentSpeed;
      const boundary = Number(this.data.boundary);

      // 边界检查（图片中显示的重点修复部分）
      if (Math.abs(newPosition) > boundary) {
        newPosition = newPosition > 0 ? boundary : -boundary;
        const reboundSpeed = currentSpeed * 0.3;
        this.setData({
          currentSpeed: -Number(reboundSpeed.toFixed(2))
        });
      }

      // 应用阻尼（图片中显示的计算部分）
      const newSpeed = currentSpeed * Number(this.data.damping);
      this.setData({
        currentSpeed: Number(newSpeed.toFixed(2)),
        currentPosition: newPosition,
      });

      // 应用动画
      if (this.data.animation) {
        this.data.animation.translateY(newPosition).step();
        this.setData({
          animationData: this.data.animation.export(),
        });
      }

      // 当速度很小时停止动画
      if (Math.abs(newSpeed) < 0.1) {
        this.setData({ currentSpeed: 0 });
      }

      // 继续动画循环（图片中显示的定时器设置）
      this.data.animationInterval = setTimeout(animate, 16) as unknown as number;
    };

    animate();
  },

  stopAnimation() {
    if (this.data.animationInterval) {
      clearTimeout(this.data.animationInterval);
      this.setData({ animationInterval: null });
    }
  },

  resetPosition() {
    this.stopAnimation();
    this.setData({
      currentPosition: 0,
      currentSpeed: 0,
    });

    if (this.data.animation) {
      this.data.animation.translateY(0).step({ duration: 300 });
      this.setData({
        animationData: this.data.animation.export(),
      });
    }

    this.startAnimation();
  },
});