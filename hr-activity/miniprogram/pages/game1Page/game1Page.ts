// pages/game1Page/game1Page.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    uploadStatus: false,// false:上传失败或者没有上传，true：上传成功
    loading: false,// false:没有上传，true：上传中
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
  onClickShow() {
    this.setData({ show: true });
  },
  onClickHide() {
    this.setData({ show: false });
  },
  onUpload() {
    // this.chooseImage();
  },

  chooseImage() {
    console.log('chooseImage');

    wx.chooseMedia({
      count: 1, // 最多可以选择的图片张数，默认9
      mediaType: ['image'], // 可以指定是图片还是视频，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: (res) => {
        console.log(res);

        // const tempFilePaths = res.tempFiles.map(file => file.tempFilePath);
        // this.uploadImage(tempFilePaths[0]);
      },
      fail: (err) => {
        console.error('选择图片失败', err);
      }
    });
  },

  uploadImage(filePath: string) {
    wx.uploadFile({
      url: 'https://example.com/upload', // 上传的服务器地址
      filePath: filePath,
      name: 'file',
      formData: {
        'user': 'test'
      },
      success: (res) => {
        const data = res.data;
        console.log('上传成功', data);
        this.setData({ uploadStatus: true, loading: false });
      },
      fail: (err) => {
        console.error('上传失败', err);
        this.setData({ loading: false });
      }
    });
  },
  goHome() {
    wx.redirectTo({ url: '/pages/homePage/homePage' });
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