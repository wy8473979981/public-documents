// pages/loginPage/loginPage.ts
import { convertToUpperCase } from '../../utils/index';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {
      userId: '',
      username: '',
    },
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
  loginInput: function (e: any) {
    const value = convertToUpperCase(e.detail.value);
    const userInfo = {
      username: value.length ? value : '',
      userId: value.length ? value : '',
    };
    this.setData({ userInfo: userInfo });
  },
  login() {
    let { userInfo } = this.data;
    if (userInfo.userId) {
      wx.redirectTo({ url: '/pages/homePage/homePage' });
    } else {
      wx.showToast({
        title: '请输入账号',
        icon: 'error',
        duration: 1000,
      });
    }
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