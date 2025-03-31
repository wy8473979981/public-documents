// pages/game3Page/game3Page.ts
import { postRequest, uploadFile } from '../../utils/request.js';
import { delayFn, showToast, refreshPage, saveImage, readFileAsBase64, getFileSize } from '../../utils/index';

interface TabItem {
  algoType: string;
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
    taskCode: '', // 海报合成任务编码
    countDownText: '0', // 倒计时
    showCountDownText: false, // 是否显示倒计时
    createPosterId: '',
    compoundGif: '', // 倒计时gif
  },
  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options: PageOptions) {
    const { id, status, tarImage, taskId, algoType, templateId } = options;
    const token = wx.getStorageSync('token');
    const openId = wx.getStorageSync('openId');
    const compoundGif = wx.getStorageSync('compoundGif');
    this.setData({ token, openId, compoundGif });

    this.init();

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
    } else {

    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() { },
  init() {
    try {
      const dict = wx.getStorageSync('dict');
      const parseData = JSON.parse(dict);
      const tabList = parseData.bu_algo_type;
      this.setData({ tabList: tabList });
    } catch (error) {
      showToast(`获取存储失败:${error}`);
    }
  },
  getTemplate(algoType = 'original', templId = '79') {
    const { tabList } = this.data;
    const item: any = tabList.find((n) => {
      return n.algoType === algoType;
    });
    const currentImgList = item?.options || [];
    this.setData({
      algoType: algoType ? algoType : item[0]?.algoType || '',
      templId: templId ? templId : currentImgList[0]?.templateId || '',
      currentImgList: currentImgList,
    });
  },
  onTabItemTap(e: any) {
    // 处理 tab 切换逻辑
    const { tab } = e.currentTarget.dataset;
    const currentImgList = tab?.options;
    this.setData({
      algoType: tab?.algoType,
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
      templId: currentImgList[0]?.templateId || '',
      showCountDownText: false,
    });
    refreshPage();
  },
  onToGenerate() {
    // 去生成
    const { currentPhoto } = this.data;
    if (currentPhoto) {
      this.directionJudgment(currentPhoto);
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
        this.setData({ currentPhoto: tempFilePaths[0], currentStep: 1 });
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
          this.setData({ currentPhoto: res.tempImagePath, currentStep: 1 });
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
  async updateProgress() {
    const { taskCode, token } = this.data;
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
      this.updatePosterImageF(result?.posterPath, '');
    } else if (status === 3) {
      const failMsg = result?.failMsg;
      this.setData({ showCountDownText: false });
      this.updatePosterImageF('', failMsg);
      wx.showModal({
        title: '提示',
        content: failMsg,
        showCancel: false,
        confirmText: '确定',
        success: (res) => {
          if (res.confirm) this.onReselectImg();
        },
      });
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
  async updatePosterImageF(posterPath: string | null, failMsg: string) {
    const { createPosterId } = this.data;
    let params;
    const header = {
      'content-type': 'multipart/form-data',
    };
    if (posterPath) {
      const tempFilePath = await this.savePosterToServer(posterPath);
      params = {
        data: {
          status: 1,
          srcImage: tempFilePath,
          id: createPosterId,
        },
        header: header,
      };
    } else {
      params = {
        data: {
          status: -1,
          srcImage: '',
          id: createPosterId,
          failMsg: failMsg,
        },
        header: header,
      };
    }
    const res = await uploadFile('/poster/updatePosterImageF', params);
    const { code, msg } = JSON.parse(res.data);
    if (code !== '200') {
      showToast(msg);
    }
  },
  // 将在线地址转为文件
  savePosterToServer(posterPath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      wx.downloadFile({
        url: posterPath,
        success: (res) => {
          if (res.statusCode === 200) {
            const tempFilePath = res.tempFilePath;
            return resolve(tempFilePath);
          } else {
            return reject(new Error('下载海报失败'));
          }
        },
        fail: (err) => {
          console.error('下载图片失败', err);
          return reject(new Error('下载图片失败'));
        },
      });
    });
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
              showToast('保存成功', 'success', 2000);
            },
            fail: (err) => {
              if (err.errMsg.includes('auth denied')) {
                showToast('请授权保存图片到相册');
              }
            },
          });
        } else {
          showToast(`下载图片失败：${res}`);
        }
      },
      fail: (err) => {
        showToast(`下载图片失败：${err}`);
      },
    });
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

  async directionJudgment(tempFilePath: string) {
    try {
      // 获取图片信息
      const imgInfo: any = await wx.getImageInfo({ src: tempFilePath });
      const { width, height, orientation } = imgInfo
      const isRotated = !['up', 'up-mirrored'].includes(orientation);
      const realWidth = isRotated ? height : width;
      const realHeight = isRotated ? width : height;
      console.log('图片信息：', imgInfo);
      console.log(`realWidth：${realWidth}, realHeight：${realHeight}`);

      // 判断是否为竖屏
      if (realHeight > realWidth) {
        // 竖屏图片，继续处理
        console.log('竖屏图片，继续处理');

        if (realHeight < 32 || realWidth < 32) {
          showToast('图片尺寸太小，请上传大于32×32像素的图片')
          return
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
  compressImage(src: string, compressedWidth = 1204) {
    wx.compressImage({
      src: src,
      quality: 80, // 质量压缩
      compressedWidth: compressedWidth,
      success: (res) => {
        const url = res.tempFilePath;
        this.compositePoster(url);
        saveImage(url);
        getFileSize(url);
      },
      fail() {
        showToast('压缩失败');
      },
    });
  },
  async compositePoster(imgUrl: string) {
    try {
      const { algoType, templId, token } = this.data;
      // 转成 base64 字符串
      const base64Data = await readFileAsBase64(imgUrl);

      // 调用海报合成接口
      const params = {
        data: {
          imageBase64: base64Data,
          algoType: algoType === 'original' ? undefined : algoType,
          templId: templId,
        },
        header: { Authorization: token, type: 2 },
      };

      const res = await postRequest('/forward/nova-poster/mini-program/composite-poster', params);
      const { code, result, message } = res;
      if (code === '0') {
        const taskCode = result;
        this.setDataAsync({ taskCode: taskCode, currentStep: 2 }).then(
          () => {
            this.createPosterImageF();
            this.updateProgress(); // 调用更新进度函数
          }
        );
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
