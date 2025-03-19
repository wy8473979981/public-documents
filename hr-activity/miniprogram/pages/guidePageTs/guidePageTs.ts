// pages/guidePage/guidePage.ts
import { delayFn } from '../../utils/index';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    infinite: 'https://nav-uat.aia.com.cn/fan/sail/resource/hrActivity/images/infinite.gif',
    guideTitle: 'https://nav-uat.aia.com.cn/fan/sail/resource/hrActivity/images/guide-title.png',
    loading: true,
    red: '#ff0000', // 定义 red 变量
    current: 0, // 当前 swiper 的索引
    animateMap: [false, false, false],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    this.loaderFn();
  },
  // 自定义指示点点击事件
  onIndicatorTap(e: any) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      current: index,
    }, () => {
      console.log('Swiper current updated to', this.data.current);
    });
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

      }
    }
  },
  async loaderFn() {
    await delayFn(2000);
    this.setData({ loading: false });
    this.shopGirlAnimate();
  },
  shopGirlAnimate() {
    this.setData({
      animateMap: [true, false, false]
    });
    this.guideTitleAnmate();
    this.swiperTextAnimate();
    this.animate('.shop-girl', [
      { transformOrigin: 'bottom left', opacity: 0, translateY: '140rpx', scale: [0], ease: 'ease-in-out', offset: 0 },
      { transformOrigin: 'bottom left', opacity: 1, translateY: '140rpx', scale: [0.02], ease: 'ease-in-out', offset: 0.5 },
      { transformOrigin: 'bottom left', opacity: 1, translateY: '10rpx', scale: [1], ease: 'ease-in-out', offset: 1 },
    ], 1000, () => {
      this.shopManAnimate();
      this.animate('.shop-girl', [
        { transformOrigin: 'center', translateY: '10rpx', rotateZ: 0, ease: 'ease-in-out' },
        { transformOrigin: 'center', translateY: '60rpx', rotateZ: 0.8, ease: 'ease-in-out' },
        { transformOrigin: 'center', translateY: '17.5rpx', rotateZ: -0.6, ease: 'ease-in-out', },
        { transformOrigin: 'center', translateY: '56.67rpx', rotateZ: 0.6, ease: 'ease-in-out', },
        { transformOrigin: 'center', translateY: '25rpx', rotateZ: -0.4, ease: 'ease-in-out', },
        { transformOrigin: 'center', translateY: '53.34rpx', rotateZ: 0.4, ease: 'ease-in-out', },
        { transformOrigin: 'center', translateY: '32.5rpx', rotateZ: -0.2, ease: 'ease-in-out', },
        { transformOrigin: 'center', translateY: '50rpx', rotateZ: 0.2, ease: 'ease-in-out', },
        { transformOrigin: 'center', translateY: '40rpx', rotateZ: 0, ease: 'ease-in-out', },
      ], 3500, () => {

      });
    });
  },
  shopManAnimate() {
    this.animate('.shop-man', [
      { transformOrigin: 'bottom left', opacity: 0, translateY: '120rpx', scale: [0], ease: 'ease-in-out', offset: 0 },
      { transformOrigin: 'bottom left', opacity: 1, translateY: '120rpx', scale: [0.02], ease: 'ease-in-out', offset: 0.5 },
      { transformOrigin: 'bottom left', opacity: 1, translateY: '-20rpx', scale: [1], ease: 'ease-in-out', offset: 1 },
    ], 1000, () => {
      this.shopGoodsAnimate();
      this.animate('.shop-man', [
        { transformOrigin: 'center', translateY: '-20rpx', rotateZ: 0, ease: 'ease-in-out' },
        { transformOrigin: 'center', translateY: '20rpx', rotateZ: 0.8, ease: 'ease-in-out' },
        { transformOrigin: 'center', translateY: '0rpx', rotateZ: -0.6, ease: 'ease-in-out', },
        { transformOrigin: 'center', translateY: '12rpx', rotateZ: 0.6, ease: 'ease-in-out', },
        { transformOrigin: 'center', translateY: '0rpx', rotateZ: -0.4, ease: 'ease-in-out', },
        { transformOrigin: 'center', translateY: '8rpx', rotateZ: 0.4, ease: 'ease-in-out', },
        { transformOrigin: 'center', translateY: '0rpx', rotateZ: -0.2, ease: 'ease-in-out', },
        { transformOrigin: 'center', translateY: '4rpx', rotateZ: 0.2, ease: 'ease-in-out', },
        { transformOrigin: 'center', translateY: '0rpx', rotateZ: 0, ease: 'ease-in-out', },
      ], 3500, () => {

      });
    });
  },
  shopGoodsAnimate() {
    this.animate('.goods', [
      { transformOrigin: 'right bottom', opacity: 0, scale: [0], ease: 'ease-in-out', offset: 0 },
      { transformOrigin: 'right bottom', opacity: 1, scale: [1], ease: 'ease-in-out', offset: 1 },
    ], 500, () => {
      this.shopCartAnimate();
    });
  },
  guideTitleAnmate() {
    this.animate('.guide-title', [
      { transformOrigin: 'center', opacity: 0, translate: ['-50%', '-150rpx'], scale: [0], ease: 'ease-in-out', offset: 0 },
      { transformOrigin: 'center', opacity: 1, translate: ['-50%', '254rpx'], scale: [1], ease: 'ease-in-out', offset: 1 },
    ], 500, () => {

    });
  },
  shopCartAnimate() {
    this.animate('.cart', [
      { transformOrigin: 'right bottom', opacity: 0, scale: [0], ease: 'ease-in-out', offset: 0 },
      { transformOrigin: 'right bottom', opacity: 1, scale: [1], ease: 'ease-in-out', offset: 1 },
    ], 500, () => {
      this.swiperLabelAnimate('swiper-label-1');
    });
  },
  pharmacistManAnimate() {
    this.setData({
      animateMap: [true, true, false]
    });
    this.swiperTextAnimate();
    this.animate('.pharmacist-man', [
      { opacity: 0, translateY: '-100%', ease: 'ease-in-out', offset: 0 },
      { opacity: 1, translateY: '0%', ease: 'ease-in-out', offset: 1 },
    ], 1000, () => {
      this.pharmacistGirlAnimate();
    });
  },
  pharmacistGirlAnimate() {
    this.animate('.pharmacist-girl', [
      { opacity: 0, translateX: '100%', ease: 'ease-in-out', offset: 0 },
      { opacity: 1, translateX: '0%', ease: 'ease-in-out', offset: 1 },
    ], 1000, () => {
      this.pharmacistPotAnimate();
    });
  },
  pharmacistPotAnimate() {
    this.animate('.pharmacist-pot', [
      { opacity: 0, translateY: '100%', ease: 'ease-in-out', offset: 0 },
      { opacity: 1, translateY: '0%', ease: 'ease-in-out', offset: 1 },
    ], 1000, () => {
      this.pill2Animate();
    });
  },
  pill2Animate() {
    this.animate('.pill-2', [
      { opacity: 0, scale: [0], ease: 'ease-in-out', offset: 0 },
      { opacity: 1, scale: [1], ease: 'ease-in-out', offset: 1 },
    ], 500, () => {
      this.pill1Animate();
    });
  },
  pill1Animate() {
    this.animate('.pill-1', [
      { opacity: 0, scale: [0], ease: 'ease-in-out', offset: 0 },
      { opacity: 1, scale: [1], ease: 'ease-in-out', offset: 1 },
    ], 1000, () => {
      this.swiperLabelAnimate('swiper-label-2');
    });
  },
  swiperLabelAnimate(className: string) {
    this.animate(`.${className}`, [
      { transformOrigin: 'bottom right', opacity: 0, scale: [0], ease: 'ease-in-out', offset: 0 },
      { transformOrigin: 'bottom right', opacity: 1, scale: [1], ease: 'ease-in-out', offset: 1 },
    ], 1000, () => {
      this.animate(`.${className}`, [
        { transformOrigin: 'bottom right', rotateZ: 0, ease: 'ease-in-out' },
        { transformOrigin: 'bottom right', rotateZ: 0.8, ease: 'ease-in-out' },
        { transformOrigin: 'bottom right', rotateZ: -0.6, ease: 'ease-in-out', },
        { transformOrigin: 'bottom right', rotateZ: 0.6, ease: 'ease-in-out', },
        { transformOrigin: 'bottom right', rotateZ: -0.4, ease: 'ease-in-out', },
        { transformOrigin: 'bottom right', rotateZ: 0.4, ease: 'ease-in-out', },
        { transformOrigin: 'bottom right', rotateZ: -0.2, ease: 'ease-in-out', },
        { transformOrigin: 'bottom right', rotateZ: 0.2, ease: 'ease-in-out', },
        { transformOrigin: 'bottom right', rotateZ: 0, ease: 'ease-in-out', },
      ], 1000, () => {

      });
    });
  },
  swiperTextAnimate() {
    this.animate('.swiper-text', [
      { transformOrigin: 'center', opacity: 0, scale: [0], ease: 'ease-in-out', offset: 0 },
      { transformOrigin: 'center', opacity: 1, scale: [1], ease: 'ease-in-out', offset: 1 },
    ], 1000, () => {

    });
  },
  goLogin() {
    wx.redirectTo({ url: '/pages/loginPage/loginPage' });
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