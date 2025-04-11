/*
 * @Description: Description
 * @Author: wangyang
 * @Date: 2025-03-18 13:46:04
 * @LastEditors: wangyang
 * @LastEditTime: 2025-04-11 10:43:57
 */
// app.ts
import { compareVersion, printVersion } from './utils/index';
import { getOpenId, getDict, getToken } from './utils/request';

import { getCachedFile } from './utils/dataCache';

App<IAppOption>({
  globalData: {
    isVersionLow: false, // 初始化为 false
  },
  onShow() {
    console.log('App onShow');
    this.preloadSource();
    this.checkForUpdates();
    this.checkWeChatVersion('3.7.3');

    getOpenId();
    getDict();
    getToken();
    printVersion();
  },
  preloadSource() {
    const preloadSourceList = [
      {
        url: 'https://nav-uat.aia.com.cn/fan/sail/resource/bubblyActivity/images/bubbly.mp4',
        cacheKey: 'bubblyAudio',
        expireDays: 1,
      },
      {
        url: 'https://nav-uat.aia.com.cn/fan/sail/resource/bubblyActivity/images/cheers.mp4',
        cacheKey: 'cheersAudio',
        expireDays: 1,
      },
      {
        url: 'https://nav-uat.aia.com.cn/fan/sail/resource/bubblyActivity/images/bottle.png',
        cacheKey: 'bottleImg',
        expireDays: 1,
      },
      {
        url: 'https://nav-uat.aia.com.cn/fan/sail/resource/bubblyActivity/images/glass.png',
        cacheKey: 'glassImg',
        expireDays: 1,
      },
      {
        url: 'https://nav-uat.aia.com.cn/fan/sail/resource/bubblyActivity/images/cheers-last.jpg',
        cacheKey: 'cheersLastImg',
        expireDays: 1,
      },
      {
        url: 'https://nav-uat.aia.com.cn/fan/sail/resource/hrActivity/images/compound.gif',
        cacheKey: 'compoundGif',
        expireDays: 1,
      },
    ];
    preloadSourceList.forEach((item) => {
      getCachedFile(item.url, item.cacheKey, item.expireDays)
        .then(() => {
          console.log(`${item.cacheKey} 已预加载`);
        })
        .catch((error) => {
          console.error(`预加载 ${item.cacheKey} 失败:`, error);
        });
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
