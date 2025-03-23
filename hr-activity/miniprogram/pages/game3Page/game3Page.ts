// pages/game3Page/game3Page.ts

// 定义接口
interface ImgItem {
  index: number;
  name: number;
}

interface TabItem {
  index: number;
  name: string;
  imgList: ImgItem[];
}

import { promptCameraAuthorization } from '../../utils/index';


Page({
  /**
   * 页面的初始数据
   */
  data: {
    currentStep: 0,
    activeTabIndex: 0,
    activeImgIndex: 0,
    currentPhoto: '',
    tabList: [
      {
        index: 0,
        name: '原图',
        imgList: [
          { index: 0, name: 0 },
          { index: 1, name: 1 },
          { index: 2, name: 2 },
        ],
      },
      {
        index: 1,
        name: '国画风',
        imgList: [
          { index: 0, name: 3 },
          { index: 1, name: 4 },
          { index: 2, name: 5 },
        ],
      },
      {
        index: 2,
        name: '动画3D',
        imgList: [
          { index: 0, name: 0 },
          { index: 1, name: 1 },
          { index: 2, name: 2 },
        ],
      },
      {
        index: 3,
        name: '手绘',
        imgList: [
          { index: 0, name: 0 },
          { index: 1, name: 1 },
          { index: 2, name: 2 },
        ],
      },
      {
        index: 4,
        name: '日漫',
        imgList: [
          { index: 0, name: 0 },
          { index: 1, name: 1 },
          { index: 2, name: 2 },
        ],
      },
    ] as TabItem[], // 明确类型
    currentImgList: [] as ImgItem[], // 明确类型

    cameraReady: false, // 相机是否渲染
    cameraContext: null as WechatMiniprogram.CameraContext | null,
    resultantPictureUrl: 'https://nav-uat.aia.com.cn/fan/sail/resource/hrActivity/images/photograph.png',
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    const { tabList, activeTabIndex } = this.data;
    this.setData({ currentImgList: tabList[activeTabIndex].imgList });
  },
  onTabItemTap(e: any) {
    const { tab } = e.currentTarget.dataset;
    const { tabList } = this.data;
    this.setData({
      activeTabIndex: tab.index,
      currentImgList: tabList[tab.index].imgList, // 同步更新 currentImgList
    });
  },
  onImgItemTap(e: any) {
    const { img } = e.currentTarget.dataset;
    console.log(img);
    this.setData({
      activeImgIndex: img.index
    });
  },
  onReselectImg() {
    // 重新选择图片
    this.setData({ currentStep: 0, currentPhoto: '' });
  },
  onToMake() {
    // 去制作
    this.setData({ currentStep: 1 });
  },
  onToGenerate() {
    // 去生成
    this.setData({ currentStep: 2 });
  },
  onMakeOver() {
    // 重新制作
    this.setData({ currentStep: 0, currentPhoto: '' });
  },
  onBackHome() {
    // 返回首页
    wx.redirectTo({ url: '/pages/homePage/homePage' });
  },
  onDownload() {
    const { resultantPictureUrl } = this.data;
    wx.downloadFile({
      url: resultantPictureUrl,
      success: (res) => {
        if (res.statusCode === 200) {
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: () => {
              wx.showToast({
                title: '保存成功',
                icon: 'success',
                duration: 2000,
              });
            },
            fail: (err) => {
              console.error('保存图片失败', err);
              if (err.errMsg.includes('auth denied')) {
                wx.showToast({
                  title: '请授权保存图片到相册',
                  icon: 'none',
                  duration: 2000,
                });
              }
            },
          });
        } else {
          console.error('下载图片失败', res);
          wx.showToast({
            title: '下载失败',
            icon: 'none',
            duration: 2000,
          });
        }
      },
      fail: (err) => {
        console.error('下载图片失败', err);
        wx.showToast({
          title: '下载失败',
          icon: 'none',
          duration: 2000,
        });
      },
    });
  },
  chooseImage() {
    console.log('chooseImage');
    wx.chooseMedia({
      count: 1, // 最多可以选择的图片张数，默认9
      mediaType: ['image'], // 可以指定是图片还是视频，默认二者都有
      sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有
      success: (res) => {
        console.log(res);

        const tempFilePaths = res.tempFiles.map(file => file.tempFilePath);
        this.setData({ currentPhoto: tempFilePaths[0] });
        // this.onImageFileFormat(tempFilePaths[0]);
      },
      fail: (err) => {
        console.error('选择图片失败', err);
      }
    });
  },
  onClickPhoto() {
    const { cameraContext } = this.data;
    if (cameraContext) {
      cameraContext.takePhoto({
        quality: 'low',
        success: (res) => {
          console.log(res.tempImagePath);
          this.setData({
            currentPhoto: res.tempImagePath
          });
        },
        fail: (err) => {
          console.log('takePhoto--拍照失败', err);
        },
      });
    }
  },
  // onImageFileFormat(file: any, type: number) {
  //   const maxSize = type === 1 ? 15 * 1024 * 1024 : 3 * 1024 * 1024; // 设置文件大小限制
  //   if (file.size > maxSize) {
  //     console.error(`文件大小超过限制，最大${maxSize / (1024 * 1024)}MB`);
  //     return false;
  //   }
  // },
  onCameraInitDone() {
    console.log('Camera initialized');
    this.setDataAsync({ cameraReady: true }).then(() => {
      console.log('cameraReady set to true');
      this.checkCameraPermission();
    });
  },
  onCameraStop(e: any) {
    console.log('onCameraStop', e.detail);
  },
  onCameraError(e: any) {
    const errMsg = e.detail?.errMsg;
    const errMsgArr = ['insertCamera:fail auth deny', 'insertXWebCamera:fail auth deny']
    let title = ''; errMsg
    if (errMsgArr.includes(errMsg)) {
      title = '请开启摄像头权限';
      this.checkCameraPermission();
    } else {
      title = '摄像机异常';
    }
    wx.showToast({
      title: title,
      icon: 'error',
      duration: 5000,
    });
  },
  // 检查并请求相机权限
  checkCameraPermission() {
    wx.getSetting({
      success: (res) => {
        if (!res.authSetting['scope.camera']) {
          // 用户之前拒绝了相机权限
          promptCameraAuthorization();
        } else {
          // 用户已授权相机
          this.initPhoto();
        }
      },
    });
  },
  initPhoto() {
    const cameraContext = wx.createCameraContext();
    this.setData({ cameraContext: cameraContext })
  },
  setDataAsync(data: any) {
    return new Promise((resolve: any) => {
      this.setData(data, resolve); // 利用 setData 的回调
    });
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