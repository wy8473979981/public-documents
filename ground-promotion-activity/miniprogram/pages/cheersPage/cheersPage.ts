// pages/cheersPage/cheersPage.ts
import { postRequest } from '../../utils/request.js';
import { showToast } from '../../utils/index';
interface PageOptions {
  type?: number;
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showVideo: false,
    videoCheersSrc: 'https://nav-uat.aia.com.cn/fan/sail/resource/bubblyActivity/images/cheers-1.mp4',
    showCheers: true,
  },
  videoContext: null as WechatMiniprogram.VideoContext | null,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options: PageOptions) {
    // const videoCheersSrc = wx.getStorageSync('videoCheersSrc');
    // this.setData({ videoCheersSrc: videoCheersSrc });
    console.log(options, 'options');

    if (options?.type == 4) {
      // 播放过cheers视频显示最后一个画面
      this.setData({ showCheers: false });
    }
  },
  onReady() {
    this.videoContext = wx.createVideoContext('myVideo');
  },
  cheersPlay() {
    this.setData({ showVideo: true }, () => {
      console.log('播放视频');
      wx.vibrateLong();
      this.videoContext?.play(); // 用户点击后再播放
    });
    this.updateRecord();
  },
  async updateRecord() {
    const openId = wx.getStorageSync('openId');
    const params = {
      data: {
        openId: openId,
        type: 4,
        status: 1,
      },
    };
    const result = await postRequest('/activity/record', params);
    const { code, msg, data } = result;
    if (code === '200') {
      console.log(data);
    } else {
      showToast(msg);
    }
  },
  videoPlayed() {
    console.log('播放完毕');
    this.setData({ showVideo: false, showCheers: false });
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