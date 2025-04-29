// pages/cheersPage/cheersPage.ts
import { postRequest } from '../../utils/request.js';
import { showToast } from '../../utils/index';
interface PageOptions {
  status?: number;
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showVideo: false,
    showCheers: true,
    cheersAudioSrc: '',
    glassImgSrc: '',
    cheersLastImgSrc: ''
  },
  videoContext: null as WechatMiniprogram.VideoContext | null,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options: PageOptions) {
    this.preloadSource();
    if (options?.status == 1) {
      // 播放过cheers视频显示最后一个画面
      this.setData({ showCheers: false });
    }
  },
  onReady() {
    this.videoContext = wx.createVideoContext('myVideo');
  },
  preloadSource() {
    const timer = setInterval(() => {
      const cheersAudio = wx.getStorageSync('cheersAudio');
      const glassImg = wx.getStorageSync('glassImg');
      const cheersLastImg = wx.getStorageSync('cheersLastImg');
      let cheersAudioSrc = '';
      let glassImgSrc = '';
      let cheersLastImgSrc = '';

      if (cheersAudio) {
        cheersAudioSrc = cheersAudio.path;
      }
      if (glassImg) {
        glassImgSrc = glassImg.path;
      }
      if (cheersLastImg) {
        cheersLastImgSrc = cheersLastImg.path;
      }

      if (cheersAudioSrc && glassImgSrc && cheersLastImgSrc) {
        clearInterval(timer);
      }
      console.log('cheersAudioSrc', cheersAudioSrc, glassImgSrc, cheersLastImgSrc);
      this.setData({ cheersAudioSrc: cheersAudioSrc, glassImgSrc: glassImgSrc, cheersLastImgSrc: cheersLastImgSrc });
    }, 40);
  },
  cheersPlay() {
    this.setData({ showVideo: true, showCheers: false }, () => {
      console.log('播放视频');
      wx.vibrateLong();
      this.videoContext?.play(); // 用户点击后再播放
    });
    this.updateRecord();
  },
  async updateRecord() {
    const loginCache = wx.getStorageSync('loginCache');
    const params = {
      data: {
        openId: loginCache.openId,
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