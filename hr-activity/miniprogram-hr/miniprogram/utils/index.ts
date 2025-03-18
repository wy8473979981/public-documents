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
export function createFragmentArr(key: string | number) {
  const baseArray = [
    {
      key: 'aiacn_a1',
      get: false,
      title: '以客为先',
      fragmentUrl: '/images/aiacn_a1.png',
      defaultUrl: '/images/box.png',
    },
    {
      key: 'aiacn_i',
      get: false,
      title: '诚实守信',
      fragmentUrl: '/images/aiacn_i.png',
      defaultUrl: '/images/box.png',
    },
    {
      key: 'aiacn_a2',
      get: false,
      title: '追求卓越',
      fragmentUrl: '/images/aiacn_a2.png',
      defaultUrl: '/images/box.png',
    },
    {
      key: 'aia_c',
      get: false,
      title: '以人为本',
      fragmentUrl: '/images/aia_c.png',
      defaultUrl: '/images/box.png',
    },
    {
      key: 'aia_n',
      get: false,
      title: '勇于创新',
      fragmentUrl: '/images/aia_n.png',
      defaultUrl: '/images/box.png',
    },
  ];
  const fragmentMap: Record<string | number, number[]> = {
    0: [4, 3, 2, 1, 0],
    1: [0, 3, 1, 4, 2],
    2: [3, 2, 0, 1, 4],
    3: [4, 0, 2, 1, 3],
    4: [4, 1, 0, 2, 3],
    5: [3, 2, 4, 0, 1],
    6: [0, 2, 1, 3, 4],
    7: [2, 3, 1, 4, 0],
    8: [2, 1, 4, 3, 0],
    9: [3, 2, 4, 1, 0],
    a: [0, 4, 1, 3, 2],
    b: [0, 1, 4, 2, 3],
    c: [2, 1, 0, 3, 4],
    d: [4, 3, 1, 0, 2],
    e: [1, 3, 2, 4, 0],
    f: [1, 2, 4, 0, 3],
    g: [3, 0, 2, 4, 1],
    h: [1, 0, 3, 4, 2],
    i: [4, 2, 1, 0, 3],
    j: [2, 4, 0, 1, 3],
    k: [3, 2, 0, 4, 1],
    l: [0, 1, 3, 2, 4],
    m: [2, 4, 1, 0, 3],
    n: [2, 3, 4, 1, 0],
    o: [1, 2, 0, 4, 3],
    p: [0, 1, 2, 4, 3],
    q: [4, 2, 3, 1, 0],
    r: [0, 1, 2, 3, 4],
    s: [4, 0, 2, 3, 1],
    t: [0, 3, 4, 2, 1],
    u: [2, 0, 4, 1, 3],
    v: [3, 0, 1, 2, 4],
    w: [0, 4, 2, 1, 3],
    x: [0, 3, 4, 1, 2],
    y: [2, 4, 3, 0, 1],
    z: [2, 0, 4, 3, 1],
  };
  const arr = fragmentMap[key];
  return arr ? arr.map(index => baseArray[index]) : [0, 1, 2, 3, 4];
}
export const tips: Record<string, string> = {
  'aiacn_a1': '该内核能够让我们精确定位、时刻把握客户需求，在浩瀚征途中不迷失方向。',
  'aiacn_i': '该内核能够像宇航服一样，帮助宇航员守住底线，在复杂的环境中抵御风险，确保任务达成。',
  'aiacn_a2': '该内核能够引领我们追寻宇宙般浩瀚无垠的场域，象征对“卓越”的追求永无止境。',
  'aia_c': '该内核能够引领我们在漫漫长途中互相信任、依赖，通过集体作战克服未知困难。',
  'aia_n': '该内核如火箭助推器，需科学家持续挑战动力极限，勇于探索未知，试错迭代，不断赋予火箭向上动力，探索更高远。'
};

export const lineText = [
  {
    color: false,
    text: '2013年，友邦中国作为国内首家',
  },
  {
    color: false,
    text: '参与杰出雇主调研的保险企业',
  },
  {
    color: false,
    text: '通过了由总部位于荷兰阿姆斯特丹的',
  },
  {
    color: false,
    text: '杰出雇主调研机构发布的全球统一标准',
  },
  {
    color: false,
    text: '首次获得“中国杰出雇主”认证',
  },
  {
    color: false,
    text: '2025年，友邦人寿连续13年',
  },
  {
    color: false,
    text: '获得“中国杰出雇主”认证',
  },
  {
    color: false,
    text: '并首次进入区域排名TOP25% 范围',
  },
  {
    color: false,
    text: '是什么样的能量构筑起AIACN上下一致的杰出内核',
  },
  {
    color: false,
    text: '保持企业发展的与时俱进？',
  },
  {
    color: false,
    text: '现在，就让我们一起在友邦职场',
  },
  {
    color: false,
    text: '开启一场“寻找杰出能量”的探寻之旅吧！',
  },
]

export const imageList = [
  {
    url: '/images/circle-1.png',
  },
  {
    url: '/images/circle-2.png',
  },
  {
    url: '/images/circle-3.png',
  },
  {
    url: '/images/circle-4.png',
  },
  {
    url: '/images/circle-5.png',
  },
]

export function getServerUrl(envVersion: string) {
  type MyObjectType = {
    [key: string]: {
      result: string;
      verify: string;
    };
  };
  const serverMap: MyObjectType = {
    // develop:开发版；trial：体验版；release：正式版
    develop: {
      result: 'https://tdauat.aia.com.cn/uat/fan-sail/treasure/result',
      verify: 'https://tdauat.aia.com.cn/uat/fan-sail/treasure/verify'
    },
    trial: {
      result: 'https://tdauat.aia.com.cn/uat/fan-sail/treasure/result',
      verify: 'https://tdauat.aia.com.cn/uat/fan-sail/treasure/verify'
    },
    release: {
      result: 'https://tda.aia.com.cn/p/fan-sail/treasure/result',
      verify: 'https://tda.aia.com.cn/p/fan-sail/treasure/verify'
    }
  }
  return serverMap[envVersion];
}

export function printVersion() {
  console.log(`当前应用版本号: ${config.version}`);
}
