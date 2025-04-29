/// <reference path="./types/index.d.ts" />
interface IAppOption {
  globalData: {
    isVersionLow: boolean; // 用于标识版本过低
    eventBus: {
      listeners: Record<string, Function[]>;
      on(event: string, callback: Function): void;
      emit(event: string, data?: any): void;
    };
  };
  checkWeChatVersion: (minVersion: string) => void;
  checkForUpdates: () => void;
  preloadSource: () => void;
}