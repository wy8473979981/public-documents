// pages/guidePage/guidePage.ts
import { delayFn } from '../../utils/index';
import { preloadImages } from '../../utils/load-image';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    infinite: 'https://nav-uat.aia.com.cn/fan/sail/resource/hrActivity/images/infinite.gif',
    guideTitle: 'https://nav-uat.aia.com.cn/fan/sail/resource/hrActivity/images/guide-title.png',
    loading: true,
    red: '#ff0000', // 定义 red 变量
    current: 0, // 当前 swiper 的索引
    preloadImages: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    this.loaderFn();
    this.getWxCode();
  },
  getWxCode() {
    wx.login({
      success(res) {
        console.log(res);
        if (res.code) {
          //发起网络请求
          // wx.request({
          //   url: 'https://example.com/onLogin',
          //   data: {
          //     code: res.code
          //   }
          // })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  },
  getUserInfo() {
    console.log(111);
    wx.getUserInfo({
      desc: '用于完善会员资料', // 必须填写
      success: (res) => {
        console.log('用户信息:', res, res.userInfo);
        this.setData({
          userInfo: res.userInfo,
        });
      },
      fail: (err) => {
        console.log('用户拒绝授权:', err);
        wx.showModal({
          title: '提示',
          content:
            '您拒绝了授权，部分功能可能无法正常使用，请前往设置页开启授权。',
          success(res) {
            if (res.confirm) {
              wx.openSetting();
            }
          },
        });
      },
    });
  },
  async loaderFn() {
    const result = await preloadImages();
    console.log(result);
    this.setData({ preloadImages: result, loading: false });
  },
  // 自定义指示点点击事件
  onIndicatorTap(e: any) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      current: index,
    }, () => {
      console.log('Swiper current updated to', this.data.current);
    });
  },
  onSwiperChange(e: any) {
    this.setData({
      current: e.detail.current,
    });
  },
  goLogin() {
    wx.redirectTo({ url: '/pages/loginPage/loginPage' });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() { },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() { },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () { },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() { },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() { },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() { },


});