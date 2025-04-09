import { config } from "./config.js";
// 比较版本号函数
export function compareVersion(v1: string, v2: string) {
  const v1Parts = v1.split('.').map(Number);
  const v2Parts = v2.split('.').map(Number);
  for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
    const num1 = v1Parts[i] || 0;
    const num2 = v2Parts[i] || 0;
    if (num1 > num2) return 1;
    if (num1 < num2) return -1;
  }
  return 0;
}
export function convertToUpperCase(str: string): string {
  // 去除空字符
  const removeAllSpaces = str.replace(/\s+/g, '');
  return removeAllSpaces.toUpperCase();
}

export function validateInput(input: string): boolean {
  const regex = /^[a-zA-Z0-9@.\-]+$/;
  return regex.test(input);
}

export function delayFn(ms: number | undefined) {
  // 延迟方法
  return new Promise((resolve) => setTimeout(resolve, ms));
}
export function getElementPosition(id: string) {
  // 根据元素 id 获取元素 在屏幕中的位置信息
  return new Promise((resolve, reject) => {
    const query = wx.createSelectorQuery();
    query.select(`#${id}`).boundingClientRect(function (rect) {
      if (rect) {
        resolve(rect);
      } else {
        reject(new Error(`Failed to get element position#${id}`));
      }
    }).exec();
  });
}
export function promptAuthorization() {
  // 引导用户授权保存图片权限
  wx.showModal({
    title: "权限提示",
    content: "保存图片到相册需要授权，请前往设置中开启权限。",
    confirmText: "去设置",
    showCancel: false, // 禁用取消按钮
    success: (res) => {
      if (res.confirm) {
        // 打开设置界面
        wx.openSetting({
          success: (settingRes) => {
            if (settingRes.authSetting["scope.writePhotosAlbum"]) {
              wx.showToast({
                title: "授权成功，请重试",
                icon: "success"
              });
            } else {
              wx.showToast({
                title: "未授权，无法保存",
                icon: "none"
              });
            }
          },
          fail: (err) => {
            console.error("打开设置界面失败", err);
          }
        });
      } else {
        wx.showToast({
          title: "操作已取消",
          icon: "none"
        });
      }
    }
  });
}
export function exitMiniProgram(msg: any) {
  // 退出小程序
  wx.showModal({
    title: '提示',
    content: msg,
    showCancel: false, // 禁用取消按钮
    confirmText: '确定',
    success(res) {
      if (res.confirm) {
        // 用户点击确定，退出小程序
        wx.exitMiniProgram({
          success() {
            console.log('已成功退出小程序');
          },
          fail() {
            console.log('退出小程序失败');
          }
        });
      } else if (res.cancel) {
        console.log('用户取消了退出');
      }
    }
  });
}

export function promptCameraAuthorization() {
  wx.showModal({
    title: "权限提示",
    content: "使用相机需要授权，请前往设置中开启相机权限。",
    confirmText: "去设置",
    showCancel: false, // 显示取消按钮
    success: (res) => {
      if (res.confirm) {
        // 打开设置界面
        wx.openSetting({
          success: (settingRes) => {
            if (settingRes.authSetting["scope.camera"]) {
              wx.showToast({
                title: "授权成功，请重试",
                icon: "success"
              });
              refreshPage();
            } else {
              wx.showToast({
                title: "未授权，无法使用相机",
                icon: "none"
              });
            }
          },
          fail: (err) => {
            console.error("打开设置界面失败", err);
          }
        });
      } else {
        wx.showToast({
          title: "操作已取消",
          icon: "none"
        });
      }
    }
  });
}
export function refreshPage() {
  // 手动刷新页面
  const currentPage = getCurrentPages().pop(); // 获取当前页面实例
  const url = currentPage?.route ? '/' + currentPage.route : '/';
  console.log(url, 'url');

  wx.reLaunch({
    url,
    success: () => {
      console.log('页面已重新加载');
    },
  });
}

export function printVersion() {
  console.log(`当前应用版本号: ${config.version}`);
}

type ToastIconType = 'error' | 'success' | 'loading' | 'none';
export function showToast(msg: string, icon: ToastIconType = 'none', duration = 2000) {
  wx.showToast({
    title: msg,
    icon: icon,
    duration: duration,
  });
}

// 下载裁剪后的图片
export function saveImage(url: any) {
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
}

export function readFileAsBase64(filePath: string): Promise<string> {
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
}

export function getFileSize(filePath: string) {
  const fs = wx.getFileSystemManager();
  fs.stat({
    path: filePath,
    success: (res: any) => {
      const fileSizeInBytes = res.stats.size; // 文件大小，单位字节
      const fileSizeInKB = (fileSizeInBytes / 1024); // 转换为 KB 并保留两位小数
      const fileSizeInMB = (fileSizeInKB / 1024).toFixed(2); // 转换为 MB 并保留两位小数
      console.log(`文件大小：${fileSizeInBytes}字节，${fileSizeInKB.toFixed(2)}KB，${fileSizeInMB}MB`);
    },
    fail: (err) => {
      console.error('获取文件大小失败：', err);
    }
  });
}

// 将在线地址转为文件
export function savePosterToServer(posterPath: string): Promise<string> {
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
}

export function onDownload(imgUrl: string) {
  wx.showLoading({
    title: '下载中...',
    mask: true // 添加遮罩层，防止触摸穿透
  });
  wx.downloadFile({
    url: imgUrl,
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
    complete: () => {
      wx.hideLoading();
    },
  });
}