/// <reference path="./types/index.d.ts" />
interface IAppOption {
  globalData: {
    isVersionLow: boolean; // 用于标识版本过低
  };
  checkWeChatVersion: (minVersion: string) => void;
  checkForUpdates: () => void;
  preloadSource: () => void;
}