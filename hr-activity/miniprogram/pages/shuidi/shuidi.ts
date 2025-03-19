/*
 * @Description: Description
 * @Author: wangyang
 * @Date: 2025-03-07 09:42:16
 * @LastEditors: wangyang
 * @LastEditTime: 2025-03-07 10:10:38
 */
Page({
  data:{
    tiltX: 0,
    tiltY: 0,
    sensitivityX: 15,
    sensitivityY :10
  },
  onReady() {
    this.initCanvas();
    this.startAccelerometer();
  },
  initCanvas() {
    this.ctx = wx.createCanvasContext('liquidCanvas');
    this.drawLiquid();
  },

  startAccelerometer() {
    wx.startAccelerometer({
      interval: 'game'
    });
    wx.onAccelerometerChange(this.onAccelerometerChange.bind(this));
  },

  onAccelerometerChange(res) {
    console.log('onAccelerometerChange', res);
    
    const threshold = 0.1; // 设置一个阈值来判断是否移动
    if (Math.abs(res.x) > threshold || Math.abs(res.y) > threshold) {
      this.setData({
        tiltX: res.x * this.data.sensitivityX,
        tiltY: res.y * this.data.sensitivityY
      }, () => {
        this.drawLiquid(); // 添加回调以确保在数据更新后绘制液体
      });
    }
  },

  drawLiquid() {
    const ctx = this.ctx;
    const canvasWidth = 300;
    const canvasHeight = 500;
    const liquidHeight = 300;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    ctx.beginPath();
    ctx.moveTo(0, liquidHeight + this.data.tiltY);
    for(let x = 0; x <= canvasWidth; x += 10) {
      const y = liquidHeight + Math.sin(x / 50 + Date.now() / 300) * 20 + this.data.tiltY;
      ctx.lineTo(x, y);
    }

    ctx.lineTo(canvasWidth, canvasHeight);
    ctx.lineTo(0, canvasHeight);
    ctx.closePath();

    ctx.setFillStyle('#87ceeb');
    ctx.fill();

     ctx.draw(() => {
       setTimeout(this.drawLiquid.bind(this), 1000 / 60); // 模拟每秒60帧
     });
  }
})