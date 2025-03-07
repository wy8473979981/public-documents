Page({
  data: {
    borderRadius: '30% 70% 70% 30% / 30% 35% 65% 70%' // 初始形状
  },

  onLoad() {
    const that = this;

    wx.startGyroscope({
      interval: 'game',
      success() {
        console.log('陀螺仪监听开启');
      }
    });

    wx.onGyroscopeChange((res) => {
      let x = res.x * 20; // X轴影响水平变化
      let y = res.y * 20; // Y轴影响垂直变化

      // 计算新的 border-radius
      let topLeft = Math.min(70, Math.max(20, 30 + x - y));
      let topRight = Math.min(80, Math.max(20, 70 - x - y));
      let bottomRight = Math.min(80, Math.max(20, 70 + x + y));
      let bottomLeft = Math.min(70, Math.max(20, 30 - x + y));

      let borderRadius = `${topLeft}% ${topRight}% ${bottomRight}% ${bottomLeft}% / ${bottomLeft}% ${topRight}% ${topLeft}% ${bottomRight}%`;

      that.setData({
        borderRadius
      });
    });
  },

  onUnload() {
    wx.stopGyroscope(); // 页面卸载时停止监听
  }
});
