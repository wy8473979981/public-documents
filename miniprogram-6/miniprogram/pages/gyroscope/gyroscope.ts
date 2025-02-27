/*
 * @Description: Description
 * @Author: wangyang
 * @Date: 2025-02-27 11:30:02
 * @LastEditors: wangyang
 * @LastEditTime: 2025-02-27 15:09:43
 */
// pages/gyroscope/gyroscope.ts
Page({
  /**
   * 页面的初始数据
   */
  data: {
    x: 0,
    y: 0,
    z: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    wx.startGyroscope({
      interval: 'game',
    });
    wx.onGyroscopeChange((res) => {
      this.setData({
        x: res.x,
        y: res.y,
        z: res.z,
      });
    });
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
    // 停止陀螺仪
    wx.stopGyroscope();
    wx.offGyroscopeChange();
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
});
