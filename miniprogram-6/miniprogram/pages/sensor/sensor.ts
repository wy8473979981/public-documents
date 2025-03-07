Page({
  data: {
    rotateX: 0,
    rotateY: 0,
    liquidRotation: 0,
    lastUpdate: 0
  },

  onLoad() {
    this.initSensors()
  },

  initSensors() {
    // 加速度计监听
    wx.startAccelerometer({ interval: 'game' })
    wx.onAccelerometerChange(res => {
      console.log(res);
      
      this.handleSensorData({
        x: res.x * 45,  // 映射到-45°~45°
        y: res.y * 45
      })
    })

    // 陀螺仪备用监听
    // wx.startGyroscope({ interval: 'game' })
    // wx.onGyroscopeChange(res => {
    //   this.handleSensorData({
    //     x: res.x * 30,  // 角速度增强
    //     y: res.y * 30
    //   }, true)
    // })
  },

  handleSensorData: function({x, y}, isGyro = false) {
    const now = Date.now()
    
    // 节流处理：40ms间隔
    if (now - this.data.lastUpdate < 40) return
    
    this.setData({
      rotateX: this.smoothValue(y * 0.6 + this.data.rotateX * 0.4),
      rotateY: this.smoothValue(x * 0.6 + this.data.rotateY * 0.4),
      liquidRotation: isGyro ? x * 60 : x * 1.8,
      lastUpdate: now
    })
  },

  smoothValue: function(value) {
    // 限制最大旋转角度
    return Math.min(45, Math.max(-45, value))
  },

  onUnload() {
    wx.stopAccelerometer()
  }
})