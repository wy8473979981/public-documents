// pages/homePage/homePage.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    gameList: [
      {
        count: 1,
        gameNum: '第一关',
        gameTitle: '初探弹福星',
        gameEXplain: '登录弹福平台并上传截图，一秒解锁弹福星图！',
        gameGif: 'https://nav-uat.aia.com.cn/fan/sail/resource/hrActivity/images/game-1.gif'
      },
      {
        count: 2,
        gameNum: '第二关',
        gameTitle: '福利破译站',
        gameEXplain: '穿越弹福只是迷宫，破译弹福星系运作秘笈！',
        gameGif: 'https://nav-uat.aia.com.cn/fan/sail/resource/hrActivity/images/game-2.gif'
      },
      {
        count: 3,
        gameNum: '第三关',
        gameTitle: '福气拍立得',
        gameEXplain: '拍摄福气相片，AI制作专属海报，许愿转发赢好礼！',
        gameGif: 'https://nav-uat.aia.com.cn/fan/sail/resource/hrActivity/images/game-3.gif'
      }
    ]
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

  },
  onClickGame(e: any) {
    const { game } = e.currentTarget.dataset;
    console.log(game);
    const url = `/pages/game${game.count}Page/game${game.count}Page`
    wx.redirectTo({ url: url });
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