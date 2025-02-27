/*
 * @Description: Description
 * @Author: wangyang
 * @Date: 2025-02-27 11:30:02
 * @LastEditors: wangyang
 * @LastEditTime: 2025-02-27 13:43:22
 */
// pages/gyroscope/gyroscope.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    // 启动陀螺仪
    wx.startGyroscope({
      	interval:'normal',
      success: (res) => {
        console.log('陀螺仪启动成功', res);
        // 监听陀螺仪数据变化
        wx.onGyroscopeChange((res) => {
          console.log('陀螺仪数据变化', res);
          // res 包含 x, y, z 三个方向的旋转速度
        });
      },
      fail: (err) => {
        console.error('陀螺仪启动失败', err);
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    // 停止陀螺仪
    wx.stopGyroscope({
      success: (res) => {
        console.log('陀螺仪停止成功', res);
      },
      fail: (err) => {
        console.error('陀螺仪停止失败', err);
      }
    });
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})