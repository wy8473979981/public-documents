// pages/cheersPage/cheersPage.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    autoplay: false,
    videoCheersSrc: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    const videoCheersSrc = wx.getStorageSync('videoCheersSrc');
    this.setData({ videoCheersSrc: videoCheersSrc });
  },
  cheersPlay() {
    this.setData({ autoplay: true }); // 播放视频
  },
  videoPlayed() {
    console.log('播放完毕');
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
  onUnload() {

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