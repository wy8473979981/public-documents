/// <reference path="./types/index.d.ts" />

interface IAppOption {
  globalData: {
    isVersionLow: boolean; // 用于标识版本过低
    platform: string // 当前系统
  }
  checkWeChatVersion: (minVersion: string) => void,
  checkForUpdates: () => void,
}