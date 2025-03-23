// pages/game3Page/game3Page.ts
import { getRequest, postRequest } from '../../utils/request.js';
// 定义接口
interface ImgItem {
  index: number;
  templateId: string; // 添加 templateId 属性
  src: string; // 添加 src 属性
}

interface TabItem {
  index: number;
  name: string;
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

import { promptCameraAuthorization } from '../../utils/index';

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
    resultantPictureUrl:
      'https://nav-uat.aia.com.cn/fan/sail/resource/hrActivity/images/photograph.png', // 合成图片的地址
    token: '',
    algoType: '',
    templId: '',
    taskCode: '', // 海报合成任务编码
    progress: 0, // 合成进度
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.init();
    wx.getStorage({
      key: 'token',
      success: (res) => {
        this.setData({ token: res.data });
      },
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},
  init() {
    wx.getStorage({
      key: 'dict',
      success: (res) => {
        const dict = JSON.parse(res.data);
        const bu_algo_type: BuAlgoTypeItem[] = dict.bu_algo_type || []; // 明确类型并提供默认值
        // 构造 tabList
        const tabList = bu_algo_type
          .map((item: BuAlgoTypeItem, index: number) => {
            if (!(item.label in names)) {
              console.warn(`未知的 label: ${item.label}`);
              return undefined; // 返回 undefined 而非 null
            }
            const enumvalueArray = JSON.parse(item.enumvalue);
            return {
              index,
              name: names[item.label], // 安全访问 names[item.label]
              label: item.label, // 添加 label 属性
              imgList: enumvalueArray.map((imgItem: any, imgIndex: number) => ({
                index: imgIndex,
                templateId: imgItem.templateId,
                src: imgItem.src, // 添加 src 属性
              })),
            } as TabItem; // 显式断言为 TabItem
          })
          .filter((tab): tab is TabItem => Boolean(tab)); // 使用类型守卫过滤掉 undefined

        console.log('tabList', tabList);

        const currentImgList = tabList[0]?.imgList;
        this.setData({
          tabList,
          templId: currentImgList[0].templateId,
          currentImgList: currentImgList || [],
        });
      },
      fail: (err) => {
        console.error('获取存储失败', err);
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
      templId: currentImgList[0].templateId,
      currentImgList: currentImgList, // 同步更新 currentImgList
    });
    console.log('currentImgList', currentImgList);
  },
  onImgItemTap(e: any) {
    // 处理图片点击逻辑
    const { img } = e.currentTarget.dataset;
    console.log(img);
    this.setData({
      activeImgIndex: img.index,
      templId: img.templateId,
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
    try {
      const { currentPhoto, algoType, templId, token } = this.data;
      if (currentPhoto) {
        // 使用 wx.getImageInfo 获取图片信息，然后进行裁剪并转换为 base64
        wx.getImageInfo({
          src: currentPhoto,
          success: async (imgInfo) => {
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
              console.error(`图片大小超过限制，最大允许 ${maxSizeInMB}MB`);
              wx.showToast({
                title: `图片大小超过限制，最大允许 ${maxSizeInMB}MB`,
                icon: 'none',
                duration: 2000,
              });
              return;
            }
            this.setData({ currentStep: 2 });
            this.updateProgress(); // 调用更新进度函数
            const base64Data = await this.readFileAsBase64(croppedImagePath);
            const params = {
              data: {
                imageBase64: base64Data,
                algoType: algoType === 'original' ? null : algoType,
                templId: templId,
              },
              header: {
                Authorization: token,
              },
            };
            console.log('params', params);
            // 调用海报合成接口
            const result = await postRequest(
              '/forward/nova-poster/mini-program/composite-poster',
              params
            );

            if (result.code === '1') {
              wx.showToast({
                title: result.message,
                icon: 'none',
                duration: 2000,
              });
              this.setData({ taskCode: result.result });
              this.setData({ currentStep: 2 });
              this.updateProgress(); // 调用更新进度函数
            } else {
              wx.showToast({
                title: result.message,
                icon: 'none',
                duration: 2000,
              });
            }
            console.log('result', result);
          },
        });
      } else {
        console.error('currentPhoto 为空');
      }
    } catch (error) {
      console.log('onToGenerate', error);
    }
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
                  console.log('裁剪完成', res);
                  // this.saveImage(res.tempFilePath);
                  return resolve(res.tempFilePath);
                },
                fail(err) {
                  console.error('裁剪失败：', err);
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
  // 下载裁剪后的图片
  saveImage(url: any) {
    wx.saveImageToPhotosAlbum({
      filePath: url,
      success() {
        wx.showToast({ title: '保存成功', icon: 'success' });
      },
      fail(err) {
        console.error('保存失败：', err);
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
            resolve(res.data); // 确保传递给 resolve 的是字符串
          } else {
            reject(new Error('读取的数据不是字符串类型')); // 如果数据类型不符合预期，抛出错误
          }
        },
        fail: (err) => {
          reject(err); // 捕获并传递错误
        },
      });
    });
  },
  onMakeOver() {
    // 重新制作
    this.setData({ currentStep: 0, currentPhoto: '' });
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
        this.setData({ currentPhoto: tempFilePaths[0] });
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
          this.setData({ currentPhoto: res.tempImagePath });
        },
        fail: (err) => {
          console.log('takePhoto--拍照失败', err);
        },
      });
    } else {
      console.error('cameraContext 未初始化');
    }
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
    this.setData({ cameraContext: cameraContext });
  },
  setDataAsync(data: any) {
    return new Promise((resolve: any) => {
      this.setData(data, resolve); // 利用 setData 的回调
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
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {},

  // 新增函数：验证图片大小
  validateImageSize(filePath: string, maxSizeInMB: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const fs = wx.getFileSystemManager();
      fs.getFileInfo({
        filePath: filePath,
        success: (res) => {
          const fileSizeInMB = res.size / (1024 * 1024);
          resolve(fileSizeInMB <= maxSizeInMB);
        },
        fail: (err) => {
          reject(err);
        },
      });
    });
  },
  async updateProgress() {
    try {
      const { taskCode, token } = this.data;
      if (!taskCode) {
        console.error('taskCode 为空，无法查询进度');
        return;
      }

      const result = await postRequest(
        '/forward/nova-poster/mini-program/composite-poster-result',
        {
          data: {
            taskCode: taskCode,
          },
          header: {
            Authorization: token,
          },
        }
      );

      if (result.code === '0') {
        const status = result.result.status;

        if (status === 1) {
          // 图片未合成，继续查询进度
          const progress = result.result.currentIndex;
          this.setData({ progress });
          this.updateProgress(); // 递归调用，继续查询进度
        } else if (status === 2) {
          // 图片已合成，停止查询进度
          wx.showToast({
            title: '合成成功',
            icon: 'none',
            duration: 2000,
          });
          this.setData({
            currentStep: 3,
            resultantPictureUrl: result.result.posterPath,
          });
          // 调用保存海报到服务器的函数
          this.savePosterToServer(result.result.posterPath);
        } else if (status === 3) {
          // 合成失败，停止查询进度
          console.error('合成失败', result.result.failMsg);
          wx.showToast({
            title: '合成失败，请检查样例图片是否符合规范',
            icon: 'none',
            duration: 2000,
          });
        }
      } else {
        console.error('获取进度失败', result.message);
      }
    } catch (error) {
      console.error('获取进度时发生错误', error);
    }
  },

  // 新建函数：将在线地址转为文件并保存到服务器
  async savePosterToServer(posterPath: string) {
    wx.downloadFile({
      url: posterPath,
      success: async (res) => {
        if (res.statusCode === 200) {
          const tempFilePath = res.tempFilePath;
          const fs = wx.getFileSystemManager();
          const fileBuffer = fs.readFileSync(tempFilePath);

          // 请求接口将文件保存到服务器
          const uploadResult = await postRequest(
            '/your-server-endpoint/save-poster',
            {
              data: {
                file: fileBuffer,
              },
              header: {
                Authorization: this.data.token,
                'Content-Type': 'application/octet-stream',
              },
            }
          );

          if (uploadResult.code === '1') {
            wx.showToast({
              title: '海报保存成功',
              icon: 'success',
              duration: 2000,
            });
          } else {
            wx.showToast({
              title: '海报保存失败',
              icon: 'none',
              duration: 2000,
            });
          }
        } else {
          console.error('下载海报失败', res);
          wx.showToast({
            title: '下载海报失败',
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
});
