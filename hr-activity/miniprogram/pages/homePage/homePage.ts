// pages/homePage/homePage.ts
import { postRequest } from '../../utils/request.js';
import { showToast } from '../../utils/index';
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
    show: false,
    currentStep: 1,
    x: 5, // rpx
    y: 1000, // rpx
    startX: 0, // px
    startY: 0, // px
    screenWidth: 0, // px
    screenHeight: 0, // px
    elementWidth: 100, // rpx
    elementHeight: 100, // rpx
    rpxRatio: 1, // px到rpx的转换比例
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
    wx.getSystemInfo({
      success: (res) => {
        // 750rpx = res.windowWidth px
        const rpxRatio = 750 / res.windowWidth;
        this.setData({
          screenWidth: res.windowWidth,
          screenHeight: res.windowHeight,
          rpxRatio: rpxRatio
        });
      }
    });
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
              //   { "code": "200", "msg": "成功", "data": { "id": "1904440241939288066", "appUserId": null, "openId": "oeY5s7Rf4NGQFhfPW-xZBPokFVH8", "templateId": 79, "status": 0, "taskId": "tJhSyXcwRcpZQ0i34ClR", "type": 2, "srcImage": "https://nav-uat.aia.com.cn/fan/sail/resource/poster/20250325/4e16cf76-94a0-4128-86d2-4c51e056411c.png", "tarImage": null, "msg": null, "algoType": "original", "createdAt": "2025-03-25T07:48:31.000+00:00", "updatedAt": "2025-03-25T07:48:31.000+00:00" } },
              // ];
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
    const { currentStep } = this.data;

    const redirectToGamePage = (params?: {
      status?: string;
      tarImage?: string;
      id?: string;
      taskId?: string;
    }) => {
      const query = params
        ? `?status=${params.status}&tarImage=${params.tarImage}&id=${params.id}&taskId=${params.taskId}`
        : '';
      const url = `/pages/game${game.count}Page/game${game.count}Page${query}`;
      wx.redirectTo({ url });
    };

    if (game.isPassed && game.count !== 3) {
      return showToast('本关已通过');
    }

    if (game.count !== currentStep) {
      if (game.count !== 3 || !game.isPassed) {
        return showToast('本关未解锁');
      }
    }

    if (game.count === 3 && game.originalData) {
      const { status, tarImage, id, taskId } = game.originalData;
      redirectToGamePage({ status, tarImage, id, taskId });
    } else {
      redirectToGamePage();
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
  onClickShow() {
    this.setData({ show: true });
  },
  onClickHide() {
    this.setData({ show: false });
  },
  onTouchStart(e: any) {
    this.setData({
      startX: e.touches[0].clientX, // px
      startY: e.touches[0].clientY  // px
    });
  },

  onTouchMove(e: any) {
    const { startX, startY, x, y, screenHeight, elementWidth, elementHeight, rpxRatio } = this.data;

    const currentX = e.touches[0].clientX; // px
    const currentY = e.touches[0].clientY; // px

    // 计算px移动距离
    const offsetXPx = currentX - startX;
    const offsetYPx = currentY - startY;

    // 将px移动距离转换为rpx
    const offsetXRpx = offsetXPx * rpxRatio;
    const offsetYRpx = offsetYPx * rpxRatio;

    // 计算新位置(rpx)
    let newX = x + offsetXRpx;
    let newY = y + offsetYRpx;

    // 边界检查(全部使用rpx单位)
    const maxXRpx = 750 - elementWidth;  // 750rpx是屏幕宽度
    const maxYRpx = (screenHeight * rpxRatio) - elementHeight;

    newX = Math.max(0, Math.min(newX, maxXRpx));
    newY = Math.max(0, Math.min(newY, maxYRpx));
    console.log(newX, newY, currentX, currentY);

    this.setData({
      x: newX,
      y: newY,
      startX: currentX,
      startY: currentY
    });
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
