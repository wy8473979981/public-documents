// pages/game3Page/game3Page.ts
import { postRequest, uploadFile } from '../../utils/request.js';
import { delayFn, showToast } from '../../utils/index';

// 定义接口
interface ImgItem {
  index: number;
  templateId: string; // 添加 templateId 属性
  src: string; // 添加 src 属性
}

interface TabItem {
  index: number;
  name: string;
  label: string;
  imgList: ImgItem[]; // 确保 imgList 符合 ImgItem[]
}

// 定义 BuAlgoTypeItem 接口，添加 label 属性
interface BuAlgoTypeItem {
  remark: string;
  enumvalue: ''; // 修改 enumvalue 的结构以匹配实际数据
  label: keyof typeof names; // 确保 label 是 names 对象的合法键
}

// 定义 names 对象
const names = {
  original: '原图',
  claborate: '国画风',
  animation3d: '动画3D',
  handdrawn: '手绘',
  anime: '日漫',
} as const; // 使用 as const 确保 names 的键和值是固定的

interface PageOptions {
  id?: string;
  status?: string;
  tarImage?: string;
  taskId?: string;
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
    activeTabIndex: 0, // 当前选中的 tab
    activeImgIndex: 0, // 当前选中的图片索引
    currentPhoto: '', // 当前选择的图片或拍照的图片
    tabList: [] as TabItem[], // 明确类型
    currentImgList: [] as ImgItem[], // 明确类型
    cameraReady: false, // 相机是否渲染
    cameraContext: null as WechatMiniprogram.CameraContext | null,
    resultantPictureUrl: '', // 合成图片的地址
    token: '',
    openId: '',
    templId: '', // 模板编码
    algoType: '', // 漫画类型
    taskCode: '', // 海报合成任务编码
    countDownText: '60秒',
    showCountDownText: true,
    createPosterId: '',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options: PageOptions) {
    const { id, status, tarImage, taskId } = options;
    const token = wx.getStorageSync('token');
    const openId = wx.getStorageSync('openId');
    this.setData({ token, openId });
    this.init();

    if (status === '1') {
      // 闯关成功，再次进入页面时，直接展示海报图片
      this.setData({ currentStep: 3, resultantPictureUrl: tarImage });
    } else if (status === '0' && id && taskId) {
      // 再次进入第三关 查询图片合成进度
      this.setDataAsync({
        currentStep: 2,
        createPosterId: id,
        taskCode: taskId,
      })
        .then(async () => {
          await this.updateProgress();
        })
        .catch((err) => {
          console.error('Failed to set data or update progress:', err);
          showToast('初始化失败，请重试');
        });
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() { },
  init() {
    wx.getStorage({
      key: 'dict',
      success: (res) => {
        let dict: any;

        try {
          dict = JSON.parse(res.data);
        } catch (error) {
          showToast('数据解析失败');
          return;
        }

        const bu_algo_type: BuAlgoTypeItem[] = dict.bu_algo_type || [];

        const namesKeys = Object.keys(names);
        const tabList = bu_algo_type
          .map((item: BuAlgoTypeItem, index: number) => {
            let enumvalueArray: any[] = [];
            try {
              enumvalueArray = JSON.parse(item.enumvalue);
            } catch (error) {
              console.error('enumvalue 解析失败', error);
            }

            return {
              index,
              name: names[item.label],
              label: item.label,
              imgList: enumvalueArray.map((imgItem: any, imgIndex: number) => ({
                index: imgIndex,
                templateId: imgItem.templateId,
                src: imgItem.src,
              })),
            } as TabItem;
          })
          .sort(
            (a, b) => namesKeys.indexOf(a.label) - namesKeys.indexOf(b.label)
          )
          .map((tab, i) => ({ ...tab, index: i }));

        const currentImgList = tabList[0]?.imgList || [];
        this.setData({
          tabList,
          algoType: tabList[0]?.label || '',
          templId: currentImgList[0]?.templateId || '',
          currentImgList,
        });
      },
      fail: (err) => {
        showToast(`获取存储失败:${err}`);
      },
    });
  },
  onTabItemTap(e: any) {
    // 处理 tab 切换逻辑
    const { tab } = e.currentTarget.dataset;
    const { tabList } = this.data;
    const currentImgList = tabList[tab.index].imgList;

    this.setData({
      activeTabIndex: tab.index,
      activeImgIndex: 0,
      algoType: tab.label,
      templId: currentImgList[0]?.templateId,
      currentImgList: currentImgList, // 同步更新 currentImgList
    });
  },
  onImgItemTap(e: any) {
    // 处理图片点击逻辑
    const { img } = e.currentTarget.dataset;
    this.setData({
      activeImgIndex: img.index,
      templId: img.templateId,
    });
  },
  onReselectImg() {
    // 重新选择图片
    this.setData({
      currentStep: 0,
      currentPhoto: '',
      activeTabIndex: 0,
      activeImgIndex: 0,
      showCountDownText: true,
    });
  },
  onToGenerate() {
    // 去生成
    const { currentPhoto, algoType, templId, token } = this.data;
    if (currentPhoto) {
      // 使用 wx.getImageInfo 获取图片信息，然后进行裁剪并转换为 base64
      wx.getImageInfo({
        src: currentPhoto,
        success: async (imgInfo) => {
          // 裁剪图片
          const croppedImagePath = await this.cropImage(
            currentPhoto,
            imgInfo.width,
            imgInfo.height
          );

          // 验证图片大小
          const maxSizeInMB = algoType === 'original' ? 15 : 3;
          const isValidSize = await this.validateImageSize(
            croppedImagePath,
            maxSizeInMB
          );
          if (!isValidSize) {
            showToast(`图片大小超过限制，最大允许 ${maxSizeInMB}MB`);
            return;
          }

          // 转成 base64 字符串
          const base64Data = await this.readFileAsBase64(croppedImagePath);

          // 调用海报合成接口
          const params = {
            data: {
              imageBase64: base64Data,
              algoType: algoType === 'original' ? undefined : algoType,
              templId: templId,
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
        },
      });
    }
  },
  onBackHome() {
    // 返回首页
    wx.redirectTo({ url: '/pages/homePage/homePage' });
  },
  chooseImage() {
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
    if (cameraContext) {
      cameraContext.takePhoto({
        quality: 'low',
        success: (res) => {
          this.setData({ currentPhoto: res.tempImagePath, currentStep: 1 });
        },
        fail: (err) => {
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
      this.setData({
        showCountDownText: false,
        currentStep: 3,
        resultantPictureUrl: result?.posterPath,
      });
      this.updatePosterImageF(result?.posterPath, '');
    } else if (status === 3) {
      const failMsg = result?.failMsg;
      this.setData({ compoundProgress: { progress: 0, text: '倒计时' } });
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

      countdown--;

      if (countdown <= 0) {
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
  /**
   * 裁剪图片
   * @param imagePath 图片路径 (string)
   * @param imgWidth 原始图片宽度 (number)
   * @param imgHeight 原始图片高度 (number)
   */
  cropImage(
    imagePath: string,
    imgWidth: number,
    imgHeight: number
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const targetWidth = 1242;
      const targetHeight = 2208;
      const query = wx.createSelectorQuery();
      query
        .select('#cropCanvas')
        .node()
        .exec((res) => {
          // 检查 res[0] 是否存在并且包含 node 属性
          if (res[0] && res[0].node) {
            const canvas = res[0].node;
            const ctx = canvas.getContext('2d');

            // 设置 Canvas 尺寸
            canvas.width = targetWidth;
            canvas.height = targetHeight;

            // 绘制图片到 Canvas
            const img = canvas.createImage();
            img.src = imagePath;
            img.onload = () => {
              ctx.drawImage(
                img,
                0,
                0,
                imgWidth,
                imgHeight,
                0,
                0,
                targetWidth,
                targetHeight
              );

              // 将 Canvas 转为图片
              wx.canvasToTempFilePath({
                canvas: canvas,
                fileType: 'jpg',
                quality: 1,
                success: (res) => {
                  return resolve(res.tempFilePath);
                },
                fail(err) {
                  showToast(`裁剪失败：${err}`);
                  return reject(err);
                },
              });
            };
          } else {
            console.error('Canvas node not found');
            return reject(new Error('Canvas node not found'));
          }
        });
    });
  },
  validateImageSize(filePath: string, maxSizeInMB: number): Promise<boolean> {
    // 验证图片大小
    return new Promise((resolve, reject) => {
      const fs = wx.getFileSystemManager();
      fs.getFileInfo({
        filePath: filePath,
        success: (res) => {
          const fileSizeInMB = res.size / (1024 * 1024);
          return resolve(fileSizeInMB <= maxSizeInMB);
        },
        fail: (err) => {
          return reject(err);
        },
      });
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
  // 封装文件读取逻辑到一个返回 Promise 的函数
  readFileAsBase64(filePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const fs = wx.getFileSystemManager();
      fs.readFile({
        filePath: filePath,
        encoding: 'base64', // 明确指定编码为 base64，确保返回值为字符串
        success: (res) => {
          if (typeof res.data === 'string') {
            const base64 = `data:image/jpeg;base64,${res.data}`;
            return resolve(base64); // 确保传递给 resolve 的是字符串
          } else {
            return reject(new Error('读取的数据不是字符串类型')); // 如果数据类型不符合预期，抛出错误
          }
        },
        fail: (err) => {
          return reject(err); // 捕获并传递错误
        },
      });
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
