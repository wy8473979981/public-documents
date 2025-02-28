// pages/gyroscope/gyroscope.ts
Page({
  /**
   * 页面的初始数据
   */
  data: {
    red: '#ff0000', // 定义 red 变量
    current: 0 // 当前 swiper 的索引
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {},

  // 自定义指示点点击事件
  onIndicatorTap(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      current: index
    });
  }
});