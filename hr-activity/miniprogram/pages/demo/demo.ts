// pages/demo/demo.ts
// 定义图片信息的类型

Page({
  /**
   * 页面的初始数据
   */
  data: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() { },
  chooseMedia() {
    wx.chooseMedia({
      count: 1, // 最多可以选择的图片张数，默认9
      mediaType: ['image'], // 可以指定是图片还是视频，默认二者都有
      sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有
      success: (res) => {
        const tempFilePaths = res.tempFiles.map((file) => file.tempFilePath);
        this.directionJudgment(tempFilePaths[0]);
      },
      fail: (err) => {
        console.error('选择图片失败', err);
      },
    });
  },
  async directionJudgment(tempFilePath: string) {
    try {
      // 获取图片信息
      const imgInfo: any = await this.getImageInfo(tempFilePath);
      console.log('图片信息', imgInfo);
      // 判断是否为竖屏
      if (imgInfo.height > imgInfo.width) {
        // 竖屏图片，继续处理
        this.compressImage(tempFilePath); // 选择图片成功后，调用压缩函数
      } else {
        // 横屏图片，不处理或提示
        wx.showToast({ title: '请上传竖屏图片', icon: 'none' });
      }
    } catch (err) {
      console.error('处理图片失败', err);
      wx.showToast({ title: '处理图片失败', icon: 'none' });
    }
  },

  // 获取图片信息
  getImageInfo(tempFilePath: string) {
    return new Promise((resolve, reject) => {
      wx.getImageInfo({
        src: tempFilePath,
        success: (res) => resolve(res),
        fail: (err) => reject(err),
      });
    });
  },
  //  压缩图片
  compressImage(src: string, compressedWidth = 1204) {
    wx.compressImage({
      src: src,
      quality: 80, // 质量压缩
      compressedWidth: compressedWidth,
      // compressedHeight: 2208,
      success: (res) => {
        const url = res.tempFilePath;
        this.saveImage(url);
      },
      fail() {
        wx.showToast({ title: '压缩失败', icon: 'none' });
      },
    });
  },
  // 下载裁剪后的图片
  saveImage(url: any) {
    wx.saveImageToPhotosAlbum({
      filePath: url,
      success() {
        wx.showToast({ title: '保存成功', icon: 'success' });
      },
      fail(err) {
        if (
          err.errMsg.includes('auth deny') ||
          err.errMsg.includes('auth denied')
        ) {
          wx.showModal({
            title: '提示',
            content: '请授权微信访问相册，以便保存图片。',
            showCancel: false,
            success() {
              wx.openSetting(); // 打开设置引导用户授权
            },
          });
        }
      },
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() { },

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
  onUnload() { },

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
