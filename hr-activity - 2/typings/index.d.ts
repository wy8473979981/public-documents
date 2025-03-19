/// <reference path="./types/index.d.ts" />

interface IAppOption {
  globalData: {
    userInfo?: WechatMiniprogram.UserInfo,
    isVersionLow: boolean; // 用于标识版本过低
    envVersion: string; // 当前环境
    platform: string // 当前系统
  }
  userInfoReadyCallback?: WechatMiniprogram.GetUserInfoSuccessCallback,
  onLoadFont: () => void,
  checkWeChatVersion: (minVersion: string) => void,
  getEnvironmentVersion: () => void,
  checkForUpdates: () => void,
}