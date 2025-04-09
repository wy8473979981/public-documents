// pages/game1Page/game1Page.ts
import { uploadFile } from '../../utils/request.js';
import { showToast } from '../../utils/index';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    uploadStatus: false,
    loading: false, // false:没有上传，true：上传中
    openId: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    const openId = wx.getStorageSync('openId');
    this.setData({ openId: openId });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },
  onClickShow() {
    this.setData({ show: true });
  },
  onClickHide() {
    this.setData({ show: false });
  },
  chooseImage() {
    wx.chooseMedia({
      count: 1, // 最多可以选择的图片张数，默认9
      mediaType: ['image'], // 可以指定是图片还是视频，默认二者都有
      sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有
      success: (res) => {
        const tempFilePaths = res.tempFiles.map(file => file.tempFilePath);
        this.setDataAsync({ loading: true }).then(() => {
          this.uploadImage(tempFilePaths[0]);
        });
      },
      fail: (err) => {
        console.error('选择图片失败', err);
        showToast('选择图片失败');
      }
    });
  },
  async uploadImage(filePath: string) {
    try {
      const { openId } = this.data;
      const params = {
        data: {
          status: 1,
          type: 1,
          openId: openId,
          srcImage: filePath,
        },
        header: {
          'content-type': 'multipart/form-data', // 默认值
        },
      };
      console.log('uploadImage', params);

      const res = await uploadFile('/poster/createPosterImageF', params);
      const { code, data, msg } = JSON.parse(res.data);
      console.log(code, data, msg);
      if (code === '200' && data?.status === 1) {
        this.setData({ loading: false, uploadStatus: true });
      } else {
        wx.showModal({
          title: '提示',
          content: '弹福平台登陆截图不正确',
          showCancel: false, // 禁用取消按钮
          confirmText: '确定',
          success: (res) => {
            if (res.confirm) {
              this.setData({ loading: false, uploadStatus: false });
            }
          },
        });
      }
    } catch (error) {
      console.error(error);
      const text = error?.errMsg === 'uploadFile:fail timeout' ? '超时请重新上传！' : error?.errMsg;
      wx.showModal({
        title: '提示',
        content: text,
        showCancel: false, // 禁用取消按钮
        confirmText: '确定',
        success: (res) => {
          if (res.confirm) {
            this.setData({ loading: false, uploadStatus: false });
          }
        },
      });
    }
  },
  goHome() {
    wx.redirectTo({ url: '/pages/homePage/homePage' });
  },
  setDataAsync(data: any) {
    return new Promise((resolve: any) => {
      this.setData(data, resolve); // 利用 setData 的回调
    });
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