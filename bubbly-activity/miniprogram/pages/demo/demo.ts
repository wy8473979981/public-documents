Page({
  data: {
    translateY: 0,
    speed: 0,
    lastY: 0,
    damping: 0.92,
    sensitivity: 12,
    maxSpeed: 30,
    boundary: 300,
    animationId: null
  },

  onLoad() {
    this.startAccelerometer();
    this.startAnimation();
  },

  onUnload() {
    this.stopAccelerometer();
    this.stopAnimation();
  },

  startAccelerometer() {
    wx.getSystemInfo({
      success: (res) => {
        if (res.platform === 'devtools') {
          wx.showToast({
            title: '请在真机上测试',
            icon: 'none'
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
              icon: 'none'
            });
          }
        });
      }
    });
  },

  stopAccelerometer() {
    wx.offAccelerometerChange();
    wx.stopAccelerometer();
  },

  handleAccelerometerChange(res) {
    const currentY = res.y;
    const delta = currentY - this.data.lastY;
    
    if (Math.abs(delta) > 0.15) {
      let newSpeed = this.data.speed + delta * this.data.sensitivity;
      newSpeed = Math.max(Math.min(newSpeed, this.data.maxSpeed), -this.data.maxSpeed);
      
      this.setData({
        speed: newSpeed,
        lastY: currentY
      });
      
      // 如果有新速度但动画没运行，则启动动画
      if (newSpeed !== 0 && !this.data.animationId) {
        this.startAnimation();
      }
    }
  },

  startAnimation() {
    if (this.data.animationId) return;
    
    const animate = () => {
      this.updateAnimationFrame();
      
      // 如果还有速度，继续动画
      if (Math.abs(this.data.speed) >= 0.1) {
        this.setData({
          animationId: setTimeout(animate, 16)
        });
      } else {
        this.setData({ animationId: null });
      }
    };
    
    animate();
  },

  stopAnimation() {
    if (this.data.animationId) {
      clearTimeout(this.data.animationId);
      this.setData({ animationId: null });
    }
  },
  
  updateAnimationFrame() {
    let newY = this.data.translateY + this.data.speed;
    
    if (Math.abs(newY) > this.data.boundary) {
      newY = newY > 0 ? this.data.boundary : -this.data.boundary;
      this.setData({ speed: -this.data.speed * 0.3 }); // 碰到边界反弹
    }
    
    this.setData({
      translateY: newY,
      speed: this.data.speed * this.data.damping
    });
  },
  
  resetPosition() {
    this.stopAnimation();
    this.setData({
      translateY: 0,
      speed: 0
    });
  }
});