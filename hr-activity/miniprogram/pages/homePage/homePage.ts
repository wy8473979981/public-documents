// pages/homePage/homePage.ts
import { postRequest } from '../../utils/request.js';
interface Game {
  count: number;
  gameNum: string;
  gameTitle: string;
  gameExplain: string;
  gameGif: string;
  gameImg: string;
  isPassed: boolean;
}
Page({
  /**
   * 页面的初始数据
   */
  data: {
    currentStep: 1,
    gameList: [
      {
        count: 1,
        gameNum: '第一关',
        gameTitle: '初探弹福星',
        gameExplain: '登录弹福平台并上传截图，一秒解锁弹福星图！',
        gameGif:
          'https://nav-uat.aia.com.cn/fan/sail/resource/hrActivity/images/game-1.gif',
        gameImg:
          'https://nav-uat.aia.com.cn/fan/sail/resource/hrActivity/images/game-1.png',
        isPassed: false,
        className: 'game game-1',
      },
      {
        count: 2,
        gameNum: '第二关',
        gameTitle: '福利破译站',
        gameExplain: '穿越弹福只是迷宫，破译弹福星系运作秘笈！',
        gameGif:
          'https://nav-uat.aia.com.cn/fan/sail/resource/hrActivity/images/game-2.gif',
        gameImg:
          'https://nav-uat.aia.com.cn/fan/sail/resource/hrActivity/images/game-2.png',
        isPassed: false,
        className: 'game game-2',
      },
      {
        count: 3,
        gameNum: '第三关',
        gameTitle: '福气拍立得',
        gameExplain: '拍摄福气相片，AI制作专属海报，许愿转发赢好礼！',
        gameGif:
          'https://nav-uat.aia.com.cn/fan/sail/resource/hrActivity/images/game-3.gif',
        gameImg:
          'https://nav-uat.aia.com.cn/fan/sail/resource/hrActivity/images/game-2.png',
        isPassed: false,
        className: 'game game-3',
      },
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.init();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() { },
  init() {
    wx.showLoading({
      title: '加载中...',
      mask: true, // 是否显示透明蒙层，防止触摸穿透
    });

    wx.getStorage({
      key: 'openId',
      success: (res) => {
        const openId = res.data;
        if (openId) {
          Promise.all([
            this.getGameResult(1, openId),
            this.getGame2Result(2, openId),
            this.getGameResult(2, openId),
          ])
            .then((results) => {
              // results = [
              //   { code: '200', msg: '成功', data: { status: 1 } },
              //   { code: '200', msg: '成功', data: { status: 1 } },
              //   { code: '200', msg: '成功', data: null },
              // ];
              if (results.every((n) => n?.data && n?.data?.status === 1)) {
                this.setData({ currentStep: 4 }); // 如果所有游戏都通过了，设置 currentStep 为 4
              } else {
                // 查找没有过关的 关卡
                const currentStep = results.findIndex(
                  (n) => !n.data || (n?.data && n?.data?.status != 1)
                );
                this.setData({ currentStep: currentStep + 1 });
              }

              const updatedGameList = this.data.gameList.map((game, index) => {
                const result = results[index];
                const data = result.data;
                const isPassed = data && data.status === 1 ? true : false;
                return {
                  ...game,
                  isPassed,
                  className: this.getGameClassName(index, {
                    ...game,
                    isPassed,
                  }),
                  originalData: data,
                };
              });
              this.setData({ gameList: updatedGameList });
              wx.hideLoading();
            })
            .catch((error) => {
              console.error('Error fetching game results:', error);
            });
        }
      },
    });
  },
  async getGameResult(type: number, openId: string) {
    // 第一关和第三关的闯关结果
    try {
      const result = await postRequest('/poster/getFront', {
        data: {
          type: type,
          openId: openId,
        },
      });
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  async getGame2Result(type: number, openId: string) {
    // 第二关的闯关结果
    try {
      const result = await postRequest('/activity/get', {
        data: {
          type: type,
          openId: openId,
        },
      });
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  onClickGame(e: WechatMiniprogram.TouchEvent) {
    const { game } = e.currentTarget.dataset;

    if (this.data.currentStep > 3) {
      if (game.count === 3) {
        const { status, tarImage } = game.originalData;
        const url = `/pages/game${game.count}Page/game${game.count}Page?status=${status}&tarImage=${tarImage}`;
        wx.redirectTo({ url });
      }
      return;
    }

    if (game.count !== this.data.currentStep || game.isPassed) {
      wx.showToast({
        title: `请先闯第${this.data.currentStep}关！`,
        icon: 'none',
        duration: 2000,
      });
    } else {
      const url = `/pages/game${game.count}Page/game${game.count}Page`;
      wx.redirectTo({ url });
    }
  },
  getGameClassName(index: number, game: Game): string {
    const baseClass = `game game-${index + 1}`;
    if (this.data.currentStep === index + 1) {
      return `${baseClass} game-${index + 1}-not-pass`;
    } else if (game.isPassed) {
      return `${baseClass} game-${index + 1}-pass`;
    }
    return baseClass;
  },
  /**
   * 根据 currentStep 和 game.isPassed 返回对应的类名
   */
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() { },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() { },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() { },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() { },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() { },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() { },
});
