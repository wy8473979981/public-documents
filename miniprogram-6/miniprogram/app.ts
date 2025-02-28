// app.ts
import { compareVersion, printVersion } from './utils/index';

App<IAppOption>({
  globalData: {
    isVersionLow: false, // 初始化为 false
    envVersion: '',
    platform: ''
  },
  onLaunch() {
    // this.checkForUpdates();
    // this.checkWeChatVersion("3.7.3");
    // this.onLoadFont();
    // this.getEnvironmentVersion();
    // printVersion();
  },
  onLoadFont: function () {
    // 加载字体
    const fonts = [
      {
        family: 'DingTalk',
        scopes: ['webview', 'native'],
        source: 'url("https://tda-static.aia.com.cn/fan/sail/ar-treasure/font/DingTalkJinBuTi.ttf")'
      },
      {
        family: 'HYQiHei',
        scopes: ['webview', 'native'],
        source: 'url("https://tda-static.aia.com.cn/fan/sail/ar-treasure/font/HYQiHei-60J.ttf")'
      },
    ];
    const loadFont = (font: { family: any; source: any; scopes: any; }) =>
      new Promise((resolve, reject) => {
        wx.loadFontFace({
          family: font.family,
          source: font.source,
          scopes: font.scopes,
          global: true,
          success: resolve,
          fail: reject
        });
      });

    Promise.all(fonts.map(loadFont))
      .then((results) => {
        console.log('All fonts loaded successfully:', results);
      })
      .catch((err) => {
        console.error('Some fonts failed to load:', err);
      });
  },
  checkWeChatVersion(minVersion) {
    try {
      const systemInfo = wx.getSystemInfoSync();
      const currentVersion = systemInfo.SDKVersion;
      if (compareVersion(currentVersion, minVersion) < 0) {
        // 版本过低，设置 globalData.isVersionLow 为 true
        this.globalData.isVersionLow = true;
        wx.showModal({
          title: '微信版本过低',
          content: `当前微信版本为 ${currentVersion}，部分功能需要微信版本不低于 ${minVersion}，请升级微信。`,
          showCancel: false,
          confirmText: '我知道了',
        });
      } else {
        console.log(`当前微信版本 ${currentVersion} 满足最低版本要求 ${minVersion}`);
      }

      const platform = systemInfo.platform; // 获取平台信息
      this.globalData.platform = platform;
      if (platform === 'ios') {
        console.log('这是 iOS 设备');
      } else if (platform === 'android') {
        console.log('这是 Android 设备');
      } else {
        console.log('其他设备：', platform);
      }
    } catch (error) {
      console.error('获取微信版本信息失败:', error);
    }
  },
  getEnvironmentVersion() {
    // 获取当前是什么版本；develop:开发版；trial：体验版；release：正式版
    const accountInfo = wx.getAccountInfoSync();
    this.globalData.envVersion = accountInfo.miniProgram.envVersion;
  },
  checkForUpdates() {
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager();

      // 检测是否有新版本
      updateManager.onCheckForUpdate((res) => {
        console.log('是否有新版本：', res.hasUpdate);
        if (!res.hasUpdate) {
          console.log('当前已经是最新版本');
        }
      });

      // 新版本准备好
      updateManager.onUpdateReady(() => {
        wx.showModal({
          title: '更新提示',
          content: '新版本已经准备好，是否重启应用？',
          showCancel: false, // 如果必须更新，则强制重启
          success: (res) => {
            if (res.confirm) {
              updateManager.applyUpdate();
            }
          },
        });
      });

      // 新版本下载失败
      updateManager.onUpdateFailed(() => {
        wx.showModal({
          title: '更新失败',
          content: '新版本下载失败，请检查网络后重试。',
          showCancel: false,
        });
      });
    }
  }
})