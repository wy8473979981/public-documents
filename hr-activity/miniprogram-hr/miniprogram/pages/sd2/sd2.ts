Page({
  data: {
    left: 150, // 初始位置
    top: 300,
    speed: 10 // 速度系数
  },

  onLoad() {
    const that = this;
    
    wx.startGyroscope({
      interval: 'game', // 监听频率，可选 'game'（最快）, 'normal', 'ui'
      success() {
        console.log('陀螺仪监听开启');
      }
    });

    wx.onGyroscopeChange((res) => {
      let newLeft = that.data.left + res.y * that.data.speed;
      let newTop = that.data.top - res.x * that.data.speed;

      // 限制范围，防止超出视图
      newLeft = Math.max(0, Math.min(wx.getSystemInfoSync().windowWidth - 50, newLeft));
      newTop = Math.max(0, Math.min(wx.getSystemInfoSync().windowHeight - 50, newTop));

      that.setData({
        left: newLeft,
        top: newTop
      });
    });
  },

  onUnload() {
    wx.stopGyroscope(); // 页面卸载时停止监听
  }
});
