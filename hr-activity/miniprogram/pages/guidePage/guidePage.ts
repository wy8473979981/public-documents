// pages/guidePage/guidePage.ts
import { showToast, delayFn } from '../../utils/index';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    infinite: 'https://nav-uat.aia.com.cn/fan/sail/resource/hrActivity/images/infinite.gif',
    current: 0, // 当前 swiper 的索引
    animateMap: [false, false, false],
    loading: true,
    noSliding: true,
    shopGirl: '',
    shopMan: '',
    goods: '',
    cart: '',
    guideTitle: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.loaderFn();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() { },
  // 自定义指示点点击事件
  onIndicatorTap(e: any) {
    const index = e.currentTarget.dataset.index;
    this.setData({ current: index });
  },
  onSwiperChange(e: any) {
    const { animateMap } = this.data;
    const { current } = e.detail;
    if (typeof current === 'number' && current in animateMap) {
      this.setData({
        current: e.detail.current,
      });

      if (current === 0 && !animateMap[current]) {
        this.shopGirlAnimate();
      } else if (current === 1 && !animateMap[current]) {
        this.pharmacistManAnimate();
      } else if (current === 2 && !animateMap[current]) {
        this.discussBg2Animate();
      }
    }
  },
  async loaderFn() {
    const imageUrls = [
      'https://nav-uat.aia.com.cn/fan/sail/resource/hrActivity/images/shop-girl.png',
      'https://nav-uat.aia.com.cn/fan/sail/resource/hrActivity/images/shop-man.png',
      'https://nav-uat.aia.com.cn/fan/sail/resource/hrActivity/images/goods.png',
      'https://nav-uat.aia.com.cn/fan/sail/resource/hrActivity/images/cart.png',
      'https://nav-uat.aia.com.cn/fan/sail/resource/hrActivity/images/guide-title.png'
    ];

    try {
      const images = await this.loadImages(imageUrls);
      await this.setDataAsync({
        shopGirl: images[0].path,
        shopMan: images[1].path,
        goods: images[2].path,
        cart: images[3].path,
        guideTitle: images[4].path,
        loading: false,
      });
      this.guideTitleAnmate();
      this.swiper1Animation();
    } catch (error) {
      console.error('Failed to load images:', error);
      showToast('图片加载失败，请重试');
    }
  },
  async swiper1Animation() {
    this.setData({ animateMap: [true, false, false] });
    this.swiperTextAnimate('swiper-text-1');
    this.shopGirlAnimate();
    // await delayFn(100);
    this.shopManAnimate();
    this.shopGoodsAnimate();
    this.shopCartAnimate();
  },
  swiper2Animation() {

  },
  swiper3Animation() {

  },
  guideTitleAnmate() {
    this.animate(
      '.guide-title',
      [
        { transformOrigin: 'center', opacity: 0, translate: ['-50%', '-150rpx'], scale: [0], ease: 'ease-in-out', offset: 0 },
        { transformOrigin: 'center', opacity: 1, translate: ['-50%', '254rpx'], scale: [1], ease: 'ease-in-out', offset: 1 },
      ],
      250,
      () => { }
    );
  },
  shopGirlAnimate() {
    this.animate(
      '.shop-girl',
      [
        { transformOrigin: 'bottom left', opacity: 0, translateY: '140rpx', scale: [0], ease: 'ease-in-out', offset: 0 },
        { transformOrigin: 'bottom left', opacity: 1, translateY: '10rpx', scale: [1], ease: 'ease-in-out', offset: 1 }
      ],
      1000,
      () => {
        this.animate(
          '.shop-girl',
          [
            { transformOrigin: 'center', translateY: '10rpx', rotateZ: 0, ease: 'ease-in-out' },
            { transformOrigin: 'center', translateY: '60rpx', rotateZ: 0.8, ease: 'ease-in-out' },
            { transformOrigin: 'center', translateY: '17.5rpx', rotateZ: -0.6, ease: 'ease-in-out' },
            { transformOrigin: 'center', translateY: '56.67rpx', rotateZ: 0.6, ease: 'ease-in-out' },
            { transformOrigin: 'center', translateY: '25rpx', rotateZ: -0.4, ease: 'ease-in-out' },
            { transformOrigin: 'center', translateY: '53.34rpx', rotateZ: 0.4, ease: 'ease-in-out' },
            { transformOrigin: 'center', translateY: '32.5rpx', rotateZ: -0.2, ease: 'ease-in-out' },
            { transformOrigin: 'center', translateY: '50rpx', rotateZ: 0.2, ease: 'ease-in-out' },
            { transformOrigin: 'center', translateY: '40rpx', rotateZ: 0, ease: 'ease-in-out' },
          ],
          3500,
          () => { }
        );
      }
    );
  },
  shopManAnimate() {
    this.animate(
      '.shop-man',
      [
        { transformOrigin: 'bottom left', opacity: 0, translateY: '120rpx', scale: [0], ease: 'ease-in-out', offset: 0 },
        { transformOrigin: 'bottom left', opacity: 0, translateY: '120rpx', scale: [0], ease: 'ease-in-out', offset: 0.8 },
        { transformOrigin: 'bottom left', opacity: 1, translateY: '-20rpx', scale: [1], ease: 'ease-in-out', offset: 1 },
      ],
      1000,
      () => {
        this.animate(
          '.shop-man',
          [
            { transformOrigin: 'center', translateY: '-20rpx', rotateZ: 0, ease: 'ease-in-out' },
            { transformOrigin: 'center', translateY: '20rpx', rotateZ: 0.8, ease: 'ease-in-out' },
            { transformOrigin: 'center', translateY: '0rpx', rotateZ: -0.6, ease: 'ease-in-out' },
            { transformOrigin: 'center', translateY: '12rpx', rotateZ: 0.6, ease: 'ease-in-out' },
            { transformOrigin: 'center', translateY: '0rpx', rotateZ: -0.4, ease: 'ease-in-out' },
            { transformOrigin: 'center', translateY: '8rpx', rotateZ: 0.4, ease: 'ease-in-out' },
            { transformOrigin: 'center', translateY: '0rpx', rotateZ: -0.2, ease: 'ease-in-out' },
            { transformOrigin: 'center', translateY: '4rpx', rotateZ: 0.2, ease: 'ease-in-out' },
            { transformOrigin: 'center', translateY: '0rpx', rotateZ: 0, ease: 'ease-in-out' },
          ],
          3500,
          () => { }
        );
      }
    );
  },
  shopGoodsAnimate() {
    this.animate(
      '.goods',
      [
        { transformOrigin: 'right bottom', opacity: 0, scale: [0], ease: 'ease-in-out', offset: 0 },
        { transformOrigin: 'right bottom', opacity: 1, scale: [1], ease: 'ease-in-out', offset: 1 },
      ],
      500,
      () => { }
    );
  },
  shopCartAnimate() {
    this.animate(
      '.cart',
      [
        { transformOrigin: 'right bottom', opacity: 0, scale: [0], ease: 'ease-in-out', offset: 0 },
        { transformOrigin: 'right bottom', opacity: 1, scale: [1], ease: 'ease-in-out', offset: 1 },
      ],
      500,
      () => { }
    );
  },
  pharmacistManAnimate() {
    this.setData({
      animateMap: [true, true, false],
    });
    this.swiperTextAnimate('swiper-text-2');
    this.animate(
      '.pharmacist-man',
      [
        { opacity: 0, translateY: '-100%', ease: 'ease-in-out', offset: 0 },
        { opacity: 1, translateY: '0%', ease: 'ease-in-out', offset: 1 },
      ],
      500,
      () => {
        this.pharmacistGirlAnimate();
      }
    );
  },
  pharmacistGirlAnimate() {
    this.animate(
      '.pharmacist-girl',
      [
        { opacity: 0, translateX: '100%', ease: 'ease-in-out', offset: 0 },
        { opacity: 1, translateX: '0%', ease: 'ease-in-out', offset: 1 },
      ],
      500,
      () => {
        this.pharmacistPotAnimate();
      }
    );
  },
  pharmacistPotAnimate() {
    this.animate(
      '.pharmacist-pot',
      [
        { opacity: 0, translateY: '100%', ease: 'ease-in-out', offset: 0 },
        { opacity: 1, translateY: '0%', ease: 'ease-in-out', offset: 1 },
      ],
      500,
      () => {
        this.pill2Animate();
      }
    );
  },
  pill2Animate() {
    this.animate(
      '.pill-2',
      [
        { opacity: 0, scale: [0], ease: 'ease-in-out', offset: 0 },
        { opacity: 1, scale: [1], ease: 'ease-in-out', offset: 1 },
      ],
      250,
      () => {
        this.pill1Animate();
      }
    );
  },
  pill1Animate() {
    this.animate(
      '.pill-1',
      [
        { opacity: 0, scale: [0], ease: 'ease-in-out', offset: 0 },
        { opacity: 1, scale: [1], ease: 'ease-in-out', offset: 1 },
      ],
      250,
      () => {
        this.swiperLabelAnimate('swiper-label-2');
      }
    );
  },
  discussBg2Animate() {
    this.setData({
      animateMap: [true, true, true],
      noSliding: false,
    });
    this.swiperTextAnimate('swiper-text-3');
    this.animate(
      '.discuss-bg-2',
      [
        { transformOrigin: 'center bottom', opacity: 0, scale: [0], ease: 'ease-in-out', offset: 0 },
        { transformOrigin: 'center bottom', opacity: 1, scale: [1], ease: 'ease-in-out', offset: 1 },
      ],
      500,
      () => {
        this.discussBg1Animate();
        this.animate(
          '.discuss-bg-2',
          [
            { transformOrigin: 'center', scaleX: 1, ease: 'ease-in-out' },
            { transformOrigin: 'center', scaleX: 1.06, ease: 'ease-in-out' },
            { transformOrigin: 'center', scaleX: 1, ease: 'ease-in-out' },
            { transformOrigin: 'center', scaleX: 1.02, ease: 'ease-in-out' },
            { transformOrigin: 'center', scaleX: 1, ease: 'ease-in-out' },
          ],
          1000,
          () => { }
        );
      }
    );
  },
  discussBg1Animate() {
    this.animate(
      '.discuss-bg-1',
      [
        { transformOrigin: 'center bottom', opacity: 0, translateX: '-50%', scale: [0], ease: 'ease-in-out', offset: 0 },
        { transformOrigin: 'center bottom', opacity: 1, translateX: '-50%', scale: [1], ease: 'ease-in-out', offset: 1 },
      ],
      500,
      () => {
        this.discussBg3Animate();
        this.animate(
          '.discuss-bg-1',
          [
            { transformOrigin: 'center', translateX: '-50%', scaleX: 1, ease: 'ease-in-out' },
            { transformOrigin: 'center', translateX: '-50%', scaleX: 1.06, ease: 'ease-in-out' },
            { transformOrigin: 'center', translateX: '-50%', scaleX: 1, ease: 'ease-in-out' },
            { transformOrigin: 'center', translateX: '-50%', scaleX: 1.02, ease: 'ease-in-out' },
            { transformOrigin: 'center', translateX: '-50%', scaleX: 1, ease: 'ease-in-out' },
          ],
          1000,
          () => { }
        );
      }
    );
  },
  discussBg3Animate() {
    this.animate(
      '.discuss-bg-3',
      [
        { transformOrigin: 'center bottom', opacity: 0, scale: [0], ease: 'ease-in-out', offset: 0 },
        { transformOrigin: 'center bottom', opacity: 1, scale: [1], ease: 'ease-in-out', offset: 1 },
      ],
      500,
      () => {
        this.discussBg4Animate();
        this.animate(
          '.discuss-bg-3',
          [
            { transformOrigin: 'center', scaleX: 1, ease: 'ease-in-out' },
            { transformOrigin: 'center', scaleX: 1.06, ease: 'ease-in-out' },
            { transformOrigin: 'center', scaleX: 1, ease: 'ease-in-out' },
            { transformOrigin: 'center', scaleX: 1.02, ease: 'ease-in-out' },
            { transformOrigin: 'center', scaleX: 1, ease: 'ease-in-out' },
          ],
          1000,
          () => { }
        );
      }
    );
  },
  discussBg4Animate() {
    this.animate(
      '.discuss-bg-4',
      [
        { transformOrigin: 'center top', opacity: 0, scale: [0], ease: 'ease-in-out', offset: 0 },
        { transformOrigin: 'center top', opacity: 1, scale: [1], ease: 'ease-in-out', offset: 1 },
      ],
      500,
      () => {
        this.discussManAnimate();
        this.animate(
          '.discuss-bg-4',
          [
            { transformOrigin: 'center', scaleX: 1, ease: 'ease-in-out' },
            { transformOrigin: 'center', scaleX: 1.06, ease: 'ease-in-out' },
            { transformOrigin: 'center', scaleX: 1, ease: 'ease-in-out' },
            { transformOrigin: 'center', scaleX: 1.02, ease: 'ease-in-out' },
            { transformOrigin: 'center', scaleX: 1, ease: 'ease-in-out' },
          ],
          1000,
          () => { }
        );
      }
    );
  },
  discussManAnimate() {
    this.animate(
      '.discuss-man',
      [
        { transformOrigin: 'center bottom', opacity: 0, scale: [0], ease: 'ease-in-out', offset: 0 },
        { transformOrigin: 'center bottom', opacity: 1, scale: [1], ease: 'ease-in-out', offset: 1 },
      ],
      500,
      () => {
        this.discussGirl1Animate();
        this.animate(
          '.discuss-man',
          [
            { transformOrigin: 'center', scaleY: 1, ease: 'ease-in-out' },
            { transformOrigin: 'center', scaleY: 1.1, ease: 'ease-in-out' },
            { transformOrigin: 'center', scaleY: 1, ease: 'ease-in-out' },
            { transformOrigin: 'center', scaleY: 1.05, ease: 'ease-in-out' },
            { transformOrigin: 'center', scaleY: 1, ease: 'ease-in-out' },
          ],
          1000,
          () => { }
        );
      }
    );
  },
  discussGirl1Animate() {
    this.animate(
      '.discuss-girl-1',
      [
        { transformOrigin: 'center bottom', opacity: 0, scale: [0], ease: 'ease-in-out', offset: 0 },
        { transformOrigin: 'center bottom', opacity: 1, scale: [1], ease: 'ease-in-out', offset: 1 },
      ],
      500,
      () => {
        this.discussGirl2Animate();
        this.animate(
          '.discuss-girl-1',
          [
            { transformOrigin: 'center', scaleY: 1, ease: 'ease-in-out' },
            { transformOrigin: 'center', scaleY: 1.1, ease: 'ease-in-out' },
            { transformOrigin: 'center', scaleY: 1, ease: 'ease-in-out' },
            { transformOrigin: 'center', scaleY: 1.05, ease: 'ease-in-out' },
            { transformOrigin: 'center', scaleY: 1, ease: 'ease-in-out' },
          ],
          1000,
          () => { }
        );
      }
    );
  },
  discussGirl2Animate() {
    this.animate(
      '.discuss-girl-2',
      [
        { transformOrigin: 'center bottom', opacity: 0, scale: [0], ease: 'ease-in-out', offset: 0 },
        { transformOrigin: 'center bottom', opacity: 1, scale: [1], ease: 'ease-in-out', offset: 1 },
      ],
      500,
      () => {
        this.swiperLabelAnimate('swiper-label-3');
        this.animate(
          '.discuss-girl-2',
          [
            { transformOrigin: 'center', scaleY: 1, ease: 'ease-in-out' },
            { transformOrigin: 'center', scaleY: 1.15, ease: 'ease-in-out' },
            { transformOrigin: 'center', scaleY: 1, ease: 'ease-in-out' },
            { transformOrigin: 'center', scaleY: 1.07, ease: 'ease-in-out' },
            { transformOrigin: 'center', scaleY: 1, ease: 'ease-in-out' },
          ],
          1000,
          () => {
            this.startBtnAnimate();
          }
        );
      }
    );
  },
  startBtnAnimate() {
    this.animate(
      '.start-btn',
      [
        { translateX: '-50%', opacity: 0, scale: [0], ease: 'ease-in-out', offset: 0 },
        { translateX: '-50%', opacity: 1, scale: [1], ease: 'ease-in-out', offset: 1 },
      ],
      500,
      () => {
        this.animate(
          '.swiper-text-3',
          [
            { opacity: 1, scale: [1], ease: 'ease-in-out', offset: 0 },
            { opacity: 0, scale: [0], ease: 'ease-in-out', offset: 1 },
          ],
          500,
          () => { }
        );
        this.animate(
          '.custom-indicator',
          [
            { opacity: 1, scale: [1], ease: 'ease-in-out', offset: 0 },
            { opacity: 0, scale: [0], ease: 'ease-in-out', offset: 1 },
          ],
          500,
          () => {
            this.setData({
              noSliding: false,
            });
          }
        );
      }
    );
  },
  swiperLabelAnimate(className: string) {
    this.animate(
      `.${className}`,
      [
        { transformOrigin: 'bottom right', opacity: 0, scale: [0], ease: 'ease-in-out', offset: 0 },
        { transformOrigin: 'bottom right', opacity: 1, scale: [1], ease: 'ease-in-out', offset: 1 },
      ],
      1000,
      () => {
        this.animate(
          `.${className}`,
          [
            { transformOrigin: 'bottom right', rotateZ: 0, ease: 'ease-in-out' },
            { transformOrigin: 'bottom right', rotateZ: 0.8, ease: 'ease-in-out' },
            { transformOrigin: 'bottom right', rotateZ: -0.6, ease: 'ease-in-out' },
            { transformOrigin: 'bottom right', rotateZ: 0.6, ease: 'ease-in-out' },
            { transformOrigin: 'bottom right', rotateZ: -0.4, ease: 'ease-in-out' },
            { transformOrigin: 'bottom right', rotateZ: 0.4, ease: 'ease-in-out' },
            { transformOrigin: 'bottom right', rotateZ: -0.2, ease: 'ease-in-out' },
            { transformOrigin: 'bottom right', rotateZ: 0.2, ease: 'ease-in-out' },
            { transformOrigin: 'bottom right', rotateZ: 0, ease: 'ease-in-out' },
          ],
          1000,
          () => { }
        );
      }
    );
  },
  swiperTextAnimate(className: string) {
    console.log(className);

    this.animate(
      `.${className}`,
      [
        { transformOrigin: 'center', opacity: 0, scale: [0], ease: 'ease-in-out', offset: 0 },
        { transformOrigin: 'center', opacity: 1, scale: [1], ease: 'ease-in-out', offset: 1 },
      ],
      1000,
      () => { }
    );
  },
  goLogin() {
    const openId = wx.getStorageSync('openId');
    const ntCode = wx.getStorageSync('ntCode');

    if (openId && ntCode) {
      wx.redirectTo({ url: '/pages/homePage/homePage' });
    } else {
      wx.redirectTo({ url: '/pages/loginPage/loginPage' });
    }
  },
  loadImages(urls: string[]): Promise<any[]> {
    return Promise.all(
      urls.map(
        (url) =>
          new Promise((resolve, reject) => {
            wx.getImageInfo({
              src: url,
              success: (res) => resolve(res),
              fail: (err) =>
                reject(
                  new Error(
                    `Failed to load image: ${url}, Error: ${err.errMsg}`
                  )
                ),
            });
          })
      )
    );
  },
  setDataAsync(data: any) {
    return new Promise((resolve: any) => {
      this.setData(data, resolve); // 利用 setData 的回调
    });
  },
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
  onUnload: function () { },

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
