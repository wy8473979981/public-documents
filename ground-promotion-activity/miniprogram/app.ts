/*
 * @Description: Description
 * @Author: wangyang
 * @Date: 2025-03-18 13:46:04
 * @LastEditors: wangyang
 * @LastEditTime: 2025-03-31 17:15:49
 */
// app.ts
import { compareVersion, printVersion } from './utils/index';
import { getOpenId, getDict, getToken, getCompoundGif, preloadBubblyAudio, preloadBottleSrc, preloadCheersAudio, preloadGlassSrc,preloadCheersLastSrc } from './utils/request'

App<IAppOption>({
  globalData: {
    isVersionLow: false, // 初始化为 false
  },
  onShow() {
    console.log('App onShow');
    this.checkForUpdates();
    this.checkWeChatVersion('3.7.3');

    preloadBubblyAudio();
    preloadCheersAudio();
    preloadBottleSrc();
    preloadGlassSrc();
    preloadCheersLastSrc();

    getCompoundGif();
    getOpenId();
    getDict();
    getToken();
    printVersion();
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
        console.log(
          `当前微信版本 ${currentVersion} 满足最低版本要求 ${minVersion}`
        );
      }
    } catch (error) {
      console.error('获取微信版本信息失败:', error);
    }
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
  },
});