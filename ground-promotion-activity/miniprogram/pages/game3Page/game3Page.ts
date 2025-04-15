// pages/game3Page/game3Page.ts
import { postRequest, uploadFile } from '../../utils/request.js';
import {
  delayFn,
  showToast,
  refreshPage,
  readFileAsBase64,
  getFileSize,
  saveImage,
  onDownload,
  savePosterToServer,
} from '../../utils/index';

interface TabItem {
  algoType: string;
  modelType: string;
  options: ImgItem[]; // 明确 options 是 ImgItem 数组
}

interface ImgItem {
  templateId: string;
  src: string;
}

interface PageOptions {
  id?: string;
  status?: string;
  tarImage?: string;
  taskId?: string;
  algoType?: string;
  modelType?: string;
  templateId?: string;
}

import { promptCameraAuthorization } from '../../utils/index';

let countdownInterval = 0;
let updateProgressTimer = 0;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    currentStep: 0,
    currentPhoto: '', // 当前选择的图片或拍照的图片
    tabList: [] as TabItem[],
    currentImgList: [] as ImgItem[],
    cameraReady: false, // 相机是否渲染
    cameraContext: null as WechatMiniprogram.CameraContext | null,
    resultantPictureUrl: '', // 合成图片的地址
    token: '',
    openId: '',
    templId: '', // 模板编码
    algoType: '', // 漫画类型
    modelType: '', // 模型类型
    taskCode: '', // 海报合成任务编码
    countDownText: '0', // 倒计时
    showCountDownText: false, // 是否显示倒计时
    createPosterId: '',
    compoundGif: '', // 倒计时gif
    errorImg: 'https://nav-uat.aia.com.cn/fan/sail/resource/bubblyActivity/images/bubbly-1.png',
    matting: 3,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options: PageOptions) {
    const { id, status, tarImage, taskId, algoType, templateId } = options;
    this.initPageData();

    if (status === '1') {
      // 闯关成功，再次进入页面时，直接展示海报图片
      this.setData({ currentStep: 3, resultantPictureUrl: tarImage });
    } else if (status === '0' && id && taskId) {
      // 没有通过闯关，再次进入页面时，查询图片合成进度
      this.getTemplate(algoType, templateId);
      this.setDataAsync({
        currentStep: 2,
        createPosterId: id,
        taskCode: taskId,
        algoType: algoType, // 漫画类型
        templId: templateId, // 模板编码
      })
        .then(async () => {
          await delayFn(2000);
          await this.updateProgress();
        })
        .catch((err) => {
          console.error('Failed to set data or update progress:', err);
          showToast(err);
        });
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() { },
  initPageData() {
    try {
      const { matting } = this.data;
      const dict = wx.getStorageSync('dict');
      const token = wx.getStorageSync('token');
      const openId = wx.getStorageSync('openId');
      const compoundGif = wx.getStorageSync('compoundGif');
      const { buAlgoType0, buAlgoType1, buAlgoType2, buAlgoType3 } = dict;
      let tabList = []

      if (matting === 0) {
        tabList = buAlgoType0;
      } else if (matting === 1) {
        tabList = buAlgoType1;
      } else if (matting === 2) {
        tabList = buAlgoType2;
      } else if (matting === 3) {
        tabList = buAlgoType3;
      }

      this.setData({ tabList: tabList, token, openId, compoundGif: compoundGif?.path });
    } catch (error) {
      showToast(`获取存储失败:${error}`);
    }
  },
  getTemplate(algoType: string = 'original', templId: string = '') {
    const { tabList } = this.data;
    const item = tabList.find((n) => n.algoType === algoType);
    const currentImgList = item?.options || [];
    this.setData({
      algoType: algoType || item?.algoType || 'original',
      modelType: item?.modelType,
      templId: templId || currentImgList[0]?.templateId || '',
      currentImgList: currentImgList,
    });
  },
  onTabItemTap(e: any) {
    // 处理 tab 切换逻辑
    const { tab } = e.currentTarget.dataset;
    const currentImgList = tab?.options;
    this.setData({
      algoType: tab?.algoType,
      modelType: tab?.modelType,
      templId: currentImgList[0]?.templateId,
      currentImgList: currentImgList, // 同步更新 currentImgList
    });
  },
  onImgItemTap(e: any) {
    // 处理图片点击逻辑
    const { img } = e.currentTarget.dataset;
    this.setData({ templId: img.templateId });
  },
  onReselectImg() {
    // 重新选择图片
    const { tabList } = this.data;
    const currentImgList = tabList[0]?.options || [];
    this.setData({
      currentStep: 0,
      currentPhoto: '',
      currentImgList: currentImgList,
      algoType: tabList[0]?.algoType || '',
      modelType: tabList[0]?.modelType || '',
      templId: currentImgList[0]?.templateId || '',
      showCountDownText: false,
    });
    refreshPage();
  },
  async onToGenerate() {
    // 去生成
    const { currentPhoto } = this.data;
    if (currentPhoto) {
      wx.showLoading({
        title: '加载中...',
        mask: true // 添加遮罩层，防止触摸穿透
      });
      this.verifyResizeFunc(currentPhoto);
      // const base64 = await readFileAsBase64(currentPhoto);
      // this.compositePoster(base64);
    } else {
      showToast('请选择图片');
    }
  },
  onBackHome() {
    // 返回首页
    wx.redirectTo({ url: '/pages/homePage/homePage' });
  },
  chooseImage() {
    this.getTemplate();
    wx.chooseMedia({
      count: 1, // 最多可以选择的图片张数，默认9
      mediaType: ['image'], // 可以指定是图片还是视频，默认二者都有
      sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有
      success: (res) => {
        const tempFilePaths = res.tempFiles.map((file) => file.tempFilePath);
        this.compressImage(tempFilePaths[0]);
      },
      fail: (err) => {
        console.error('选择图片失败', err);
      },
    });
  },
  onClickPhoto() {
    const { cameraContext } = this.data;
    this.getTemplate();
    if (cameraContext) {
      cameraContext.takePhoto({
        quality: 'original',
        success: (res) => {
          this.compressImage(res.tempImagePath);
        },
        fail: (err) => {
          console.error('拍照失败：', err);
          showToast(`拍照失败：${err}`);
        },
      });
    } else {
      showToast('cameraContext 未初始化');
    }
  },
  startCountdown(currentIndex: any) {
    clearInterval(countdownInterval);
    const timePerTask = 60 / 100; // 60秒内完成100个任务
    let countdown = Math.ceil(timePerTask * currentIndex); // 计算倒计时时间

    if (currentIndex < 0) {
      countdown = 10;
    } else {
      // 限制 countdown 最大值为 180 秒
      countdown = countdown > 180 ? 180 : countdown;
    }

    countdownInterval = setInterval(() => {
      const minutes = Math.floor(countdown / 60);
      const seconds = countdown % 60;

      if (countdown > 60) {
        this.setData({ countDownText: `${minutes}分${seconds}秒` });
      } else {
        this.setData({ countDownText: `${countdown}秒` });
      }
      this.setData({ showCountDownText: true });
      countdown--;

      if (countdown <= 0) {
        this.setData({ showCountDownText: false });
        clearInterval(countdownInterval);
      }
    }, 1000);
  },
  async verifyResizeFunc(currentPhoto: string) {
    try {
      const { openId } = this.data;
      const params = {
        data: {
          type: 5,
          openId: openId,
          srcImage: currentPhoto,
        },
        header: {
          'content-type': 'multipart/form-data', // 默认值
        },
      };
      const res = await uploadFile('/poster/verifyResize', params);
      const { code, data, msg } = JSON.parse(res.data);
      if (code === '200') {
        if (data?.predict && data?.imageBase64) {
          const base64Data = `data:image/jpeg;base64,${data.imageBase64}`;
          this.compositePoster(base64Data);
        } else {
          wx.showModal({
            title: '提示',
            content: '照片未包含人物，请重新选择图片',
            showCancel: false, // 禁用取消按钮
            confirmText: '确定',
            success: (res) => {
              if (res.confirm) {
                this.onReselectImg();
              }
            },
          });
        }
      } else {
        showToast(msg);
      }
    } catch (error) {
      console.error(error);
    }
  },
  async compositePoster(base64Data: string) {
    try {
      const { algoType, templId, token, modelType } = this.data;

      // 调用海报合成接口
      const params = {
        data: {
          imageBase64: base64Data,
          algoType: algoType === 'original' ? null : algoType,
          modelType: modelType,
          templId: templId,
          isMtting: false, // 使用了verifyResize 接口，这个参数要传false
        },
        header: { Authorization: token, type: 2 },
      };

      const res = await postRequest(
        '/forward/nova-poster/mini-program/composite-poster',
        params
      );
      const { code, result, message } = res;
      if (code === '0') {
        const taskCode = result;
        wx.hideLoading();
        this.setDataAsync({ taskCode: taskCode, currentStep: 2 }).then(() => {
          this.createPosterImageF();
          this.updateProgress(); // 调用更新进度函数
        });
      } else {
        wx.showModal({
          title: '提示',
          content: message,
          showCancel: false, // 禁用取消按钮
          confirmText: '确定',
          success: (res) => {
            if (res.confirm) {
              this.onReselectImg();
            }
          },
        });
      }
    } catch (error) {
      console.error(error);
    }
  },
  async updateProgress() {
    const { taskCode, token, errorImg } = this.data;
    if (!taskCode) {
      showToast('taskCode 为空，无法查询进度');
      return;
    }

    // 清除之前的定时器
    clearTimeout(updateProgressTimer);

    const params = {
      data: { taskCode },
      header: { Authorization: token, type: 2 },
    };

    const res = await postRequest(
      '/forward/nova-poster/mini-program/composite-poster-result',
      params
    );
    const { code, result } = res;
    if (code !== '0') {
      wx.showModal({
        title: '提示',
        content: '合成失败，请重新制作！',
        showCancel: false,
        confirmText: '确定',
        success: (res) => {
          if (res.confirm) this.onReselectImg();
        },
      });
      return;
    }

    const status = result?.status;
    if (status === 1) {
      this.startCountdown(result?.currentIndex);
      updateProgressTimer = setTimeout(() => this.updateProgress(), 10000);
    } else if (status === 2) {
      showToast('合成成功');
      await delayFn(1000);
      this.setData({
        showCountDownText: false,
        currentStep: 3,
        resultantPictureUrl: result?.posterPath,
      });
      this.updatePosterImageF(result?.posterPath, '', 2);
    } else if (status === 3) {
      const failMsg = result?.failMsg;
      this.setData({ showCountDownText: false });
      wx.showModal({
        title: '提示',
        content: failMsg,
        showCancel: false,
        confirmText: '确定',
        success: (res) => {
          if (res.confirm) {
            this.updatePosterImageF(errorImg, failMsg, 3);
            this.onReselectImg();
          }
        },
      });
    }
  },
  async createPosterImageF() {
    const { algoType, templId, currentPhoto, openId, taskCode } = this.data;
    const params = {
      data: {
        status: 0,
        type: 2,
        openId: openId,
        algoType: algoType,
        templateId: templId,
        srcImage: currentPhoto,
        taskId: taskCode,
      },
      header: {
        'content-type': 'multipart/form-data', // 默认值
      },
    };
    const res = await uploadFile('/poster/createPosterImageF', params);
    const { code, data, msg } = JSON.parse(res.data);
    if (code === '200') {
      this.setData({ createPosterId: data.id });
    } else {
      showToast(msg);
    }
  },
  async updatePosterImageF(posterPath: string, failMsg: string, status: number) {
    const { createPosterId } = this.data;
    const tempFilePath = await savePosterToServer(posterPath); // 将路径转为文件
    const params = {
      data: {
        status: status === 2 ? 1 : -1,
        srcImage: tempFilePath,
        id: createPosterId,
        failMsg: failMsg
      },
      header: {
        'content-type': 'multipart/form-data',
      },
    };
    const res = await uploadFile('/poster/updatePosterImageF', params);
    const { code, msg } = JSON.parse(res.data);
    if (code !== '200') {
      showToast(msg);
    }
  },
  setDataAsync(data: any) {
    return new Promise((resolve: any) => {
      this.setData(data, resolve); // 利用 setData 的回调
    });
  },
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
    const errMsgArr = [
      'insertCamera:fail auth deny',
      'insertXWebCamera:fail auth deny',
    ];
    let title = '';
    errMsg;
    if (errMsgArr.includes(errMsg)) {
      title = '请开启摄像头权限';
      this.checkCameraPermission();
    } else {
      title = '摄像机异常';
    }
    showToast(title, 'error', 5000);
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
    this.setData({ cameraContext: cameraContext });
  },
  onDownloadImg() {
    const { resultantPictureUrl } = this.data;
    if (resultantPictureUrl) {
      onDownload(resultantPictureUrl);
    }
  },
  async directionJudgment(tempFilePath: string) {
    try {
      // 获取图片信息
      const imgInfo: any = await wx.getImageInfo({ src: tempFilePath });
      const { width, height, orientation } = imgInfo;
      const isRotated = !['up', 'up-mirrored'].includes(orientation);
      const realWidth = isRotated ? height : width;
      const realHeight = isRotated ? width : height;
      // console.log('图片信息：', imgInfo);
      // console.log(`realWidth：${realWidth}, realHeight：${realHeight}`);

      // 判断是否为竖屏
      if (realHeight >= realWidth) {
        // 竖屏图片，继续处理
        // console.log('竖屏图片，继续处理');

        if (realHeight < 32 || realWidth < 32) {
          showToast('图片尺寸太小，请上传大于32×32像素的图片');
          return;
        }

        this.compressImage(tempFilePath);
      } else {
        // 横屏图片，不处理或提示
        showToast('请上传竖屏图片');
      }
    } catch (err) {
      console.error('处理图片失败', err);
      showToast('处理图片失败');
    }
  },
  //  压缩图片
  async compressImage(currentPhoto: string, compressedWidth = 1204) {
    const sizeInfo = await getFileSize(currentPhoto);
    const { bytes, kb, mb } = sizeInfo;
    console.log(`处理前文件大小：${bytes}字节，${kb}KB，${mb}MB`);
    if (sizeInfo?.kb > 200) {
      wx.compressImage({
        src: currentPhoto,
        quality: 80, // 质量压缩
        compressedWidth: compressedWidth,
        success: async (res) => {
          const tempFilePath = res.tempFilePath;
          this.setData({ currentPhoto: tempFilePath, currentStep: 1 });


          saveImage(tempFilePath);
          const imgInfo: any = await wx.getImageInfo({ src: tempFilePath });
          console.log('imgInfo', imgInfo);
          const sizeInfo = await getFileSize(tempFilePath);
          const { bytes, kb, mb } = sizeInfo;
          console.log(`处理后文件大小：${bytes}字节，${kb}KB，${mb}MB`);
        },
        fail() {
          showToast('压缩失败');
        },
      });
    } else {
      console.log('小于200kb,不处理');
      this.setData({ currentPhoto: currentPhoto, currentStep: 1 });
    }
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
  onUnload() {
    // 清除定时器
    clearInterval(countdownInterval);
    clearInterval(updateProgressTimer);
  },

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
