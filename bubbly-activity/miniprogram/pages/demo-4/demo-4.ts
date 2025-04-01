Page({
  data: {
    elementPosition: 0,    // 元素当前位置
    sensitivity: 30,      // 移动灵敏度
    maxOffset: 200,       // 最大移动范围
    filterStrength: 20,    // 滤波强度
    filteredY: 0,         // 滤波后的Y值
    isMoving: false,      // 是否正在移动
    debugInfo: {          // 调试信息
      position: '0.00',
      acceleration: {
        x: '0.0000',
        y: '0.0000',
        z: '0.0000'
      },
      filtered: '0.0000'
    }
  },

  onLoad() {
    // 检查设备是否支持加速度计
    wx.getSystemInfo({
      success: (res) => {
        if (res.platform === 'devtools') {
          wx.showToast({
            title: '请在真机上体验',
            icon: 'none'
          });
        }
      }
    });

    // 开启加速度计监听
    this.startAccelerometer();
  },

  onUnload() {
    this.stopAccelerometer();
  },

  startAccelerometer() {
    wx.startAccelerometer({
      interval: 'game',
      success: () => {
        console.log('加速度计已开启');
        this.setData({ isMoving: true });
        wx.onAccelerometerChange(this.handleAccelerometerChange.bind(this));
      },
      fail: (err) => {
        console.error('开启加速度计失败:', err);
        wx.showToast({
          title: '设备不支持加速度计',
          icon: 'none'
        });
      }
    });
  },

  stopAccelerometer() {
    wx.stopAccelerometer();
    wx.offAccelerometerChange();
    this.setData({ isMoving: false });
    console.log('加速度计已关闭');
  },

  toggleMovement() {
    if (this.data.isMoving) {
      this.stopAccelerometer();
    } else {
      this.startAccelerometer();
    }
  },

  handleAccelerometerChange(res) {
    // 确保加速度值是有效的数字
    const x = typeof res.x === 'number' ? res.x : 0;
    const y = typeof res.y === 'number' ? res.y : 0;
    const z = typeof res.z === 'number' ? res.z : 0;
    
    // 低通滤波处理，减少抖动（仅对Y轴）
    const filteredY = this.data.filteredY * (1 - 1/this.data.filterStrength) + 
                     y * (1/this.data.filterStrength);
    
    // 计算新位置
    let newPosition = this.data.elementPosition + filteredY * this.data.sensitivity;
    
    // 限制移动范围
    newPosition = Math.max(-this.data.maxOffset, Math.min(this.data.maxOffset, newPosition));
    
    // 更新数据
    this.setData({
      elementPosition: newPosition,
      filteredY: filteredY,
      debugInfo: {
        position: newPosition.toFixed(2),
        acceleration: {
          x: x.toFixed(4),
          y: y.toFixed(4),
          z: z.toFixed(4)
        },
        filtered: filteredY.toFixed(4)
      }
    });
    console.log(this.data.debugInfo);
  },

  resetPosition() {
    this.setData({
      elementPosition: 0,
      filteredY: 0,
      debugInfo: {
        position: '0.00',
        acceleration: {
          x: '0.0000',
          y: '0.0000',
          z: '0.0000'
        },
        filtered: '0.0000'
      }
    });
  }
});