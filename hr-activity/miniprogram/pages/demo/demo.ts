// pages/demo/demo.ts
// 定义图片信息的类型

Page({
  /**
   * 页面的初始数据
   */
  data: {
    algoType: 'original',
  },

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
      const { width, height, orientation } = imgInfo
      const isRotated = !['up', 'up-mirrored'].includes(orientation);
      const realWidth = isRotated ? height : width;
      const realHeight = isRotated ? width : height;

      console.log(`realWidth：${realWidth}, realHeight：${realHeight}`);

      this.handleImageByAlgoType(tempFilePath, imgInfo);
      // // 判断是否为竖屏
      // if (realHeight > realWidth) {
      //   // 竖屏图片，继续处理
      //   console.log('竖屏图片，继续处理');
      //   this.handleImageByAlgoType(tempFilePath, imgInfo);
      // } else {
      //   // 横屏图片，不处理或提示
      //   wx.showToast({ title: '请上传竖屏图片', icon: 'none' })
      // }

    } catch (err) {
      console.error('处理图片失败', err);
      wx.showToast({ title: '处理图片失败', icon: 'none' });
    }
  },
  // 根据算法类型处理图片
  async handleImageByAlgoType(tempFilePath: any, imgInfo: any) {
    // 检查像素尺寸
    if (imgInfo.width < 32 || imgInfo.height < 32) {
      wx.showToast({ title: '图片尺寸太小，请上传大于32×32像素的图片', icon: 'none' })
      return
    }
    this.compressImage(tempFilePath);
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
      success: (res) => {
        const url = res.tempFilePath;
        this.saveImage(url);
        this.getFileSize(url);
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
  getFileSize: function (filePath: string) {
    const fs = wx.getFileSystemManager();
    fs.stat({
      path: filePath,
      success: (res: any) => {
        const fileSizeInBytes = res.stats.size; // 文件大小，单位字节
        const fileSizeInKB = (fileSizeInBytes / 1024); // 转换为 KB 并保留两位小数
        const fileSizeInMB = (fileSizeInKB / 1024).toFixed(2); // 转换为 MB 并保留两位小数
        console.log('文件大小：', fileSizeInBytes, '字节，', fileSizeInKB, 'KB');
        console.log(`文件大小：${fileSizeInBytes}字节，${fileSizeInKB.toFixed(2)}KB，${fileSizeInMB}MB`);
      },
      fail: (err) => {
        console.error('获取文件大小失败：', err);
      }
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
