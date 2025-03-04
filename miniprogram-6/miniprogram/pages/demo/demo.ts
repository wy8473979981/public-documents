// pages/demo/demo.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    // this.animate('#container', [
    //   { opacity: 1.0, rotate: 0, backgroundColor: '#FF0000' },
    //   { opacity: 0.5, rotate: 45, backgroundColor: '#00FF00' },
    //   { opacity: 0.0, rotate: 90, backgroundColor: '#FF0000' },
    // ], 5000,  ()=> {
    //   // this.clearAnimation('#container', { opacity: true, rotate: true }, function () {
    //   //   console.log("清除了#container上的opacity和rotate属性")
    //   // })
    // })

    // this.animate('.block', [
    //   { scale: [1, 1], rotate: 0, ease: 'ease-out' },
    //   { scale: [1.5, 1.5], rotate: 45, ease: 'ease-in', offset: 0.9 },
    //   { scale: [2, 2], rotate: 90 },
    // ], 5000,  () =>{
    //   // this.clearAnimation('.block', function () {
    //   //   console.log("清除了.block上的所有动画属性")
    //   // })
    // })
    // return;
    this.animate('.shop-girl', [
      { opacity: 0, transformOrigin: 'bottom', bottom: '-160rpx', scale: [0], ease: 'ease-out', offset: 0 },
      { opacity: 1, transformOrigin: 'bottom', bottom: '0rpx', scale: [0.2], ease: 'ease-in', offset: 0.6 },
      { opacity: 1, transformOrigin: 'bottom', bottom: '0rpx', scale: [1], offset: 1 },
    ], 1000, () => {
      this.animate('.shop-girl', [
        { transformOrigin: 'center', bottom: '20rpx', ease: 'linear', offset: 0 },
        { transformOrigin: 'center', bottom: '0rpx', ease: 'linear', offset: 0.2 },
        { transformOrigin: 'center', bottom: '20rpx', ease: 'linear', offset: 0.4 },
        { transformOrigin: 'center', bottom: '0rpx', ease: 'linear', offset: 0.6 },
        { transformOrigin: 'center', bottom: '20rpx', ease: 'linear', offset: 0.8 },
        { transformOrigin: 'center', bottom: '0rpx', ease: 'linear', offset: 1 },
      ], 1000, () => {

      })
    })
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