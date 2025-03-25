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