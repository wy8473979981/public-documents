// pages/demo/demo.ts
import { getElementPosition, delayFn } from '../../utils/index';

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
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

    this.loaderFn();

  },
  async loaderFn() {
    await delayFn(1000);
    this.setData({
      loading: false
    })
    this.cartBottomAnimation();
  },
  // 自定义指示点点击事件
  onIndicatorTap(e: any) {
    const index = e.currentTarget.dataset.index;
    console.log('onIndicatorTap', index);
    this.setData({
      current: index,
    }, () => {
      console.log('Swiper current updated to', this.data.current);
    });
  },
  onSwiperChange(e: any) {
    const current = e.detail.current;
    console.log('onSwiperChange', current);
    this.setData({
      current: current,
    });
    if (current === 0) {
      this.cartBottomAnimation();
    } else if (current === 2) {
      this.discussBg2Animation();
    }
  },
  cartBottomAnimation() {
    this.animate('.cart-bottom', [
      { opacity: 0, transformOrigin: 'center', translateX: '-50%', scale: [0], ease: 'ease-in-out', offset: 0 },
      { opacity: 1, transformOrigin: 'center', translateX: '-50%', scale: [1], ease: 'ease-in-out', offset: 1 },
    ], 1500, () => {
      this.shopGirlAnimation();
    });
  },
  async shopGirlAnimation() {
    this.animate('.shop-girl', [
      { opacity: 0, transformOrigin: 'left bottom', bottom: '-200rpx', scale: [0], ease: 'ease-in-out', offset: 0 },
      { opacity: 1, transformOrigin: 'left bottom', bottom: '0rpx', scale: [0.1], ease: 'ease-in-out', offset: 0.6 },
      { opacity: 1, transformOrigin: 'left bottom', bottom: '0rpx', scale: [1], ease: 'ease-in-out', offset: 1 },
    ], 1500, () => {
      this.animate('.shop-girl', [
        { transformOrigin: 'center', bottom: '0rpx', rotateZ: 0, ease: 'ease-in-out', offset: 0 },
        { transformOrigin: 'center', bottom: '25rpx', rotateZ: 1, ease: 'ease-in-out', offset: 0.1 },
        { transformOrigin: 'center', bottom: '-20rpx', rotateZ: -0.8, ease: 'ease-in-out', offset: 0.2 },
        { transformOrigin: 'center', bottom: '20rpx', rotateZ: 0.8, ease: 'ease-in-out', offset: 0.3 },
        { transformOrigin: 'center', bottom: '-15rpx', rotateZ: -0.6, ease: 'ease-in-out', offset: 0.4 },
        { transformOrigin: 'center', bottom: '15rpx', rotateZ: 0.6, ease: 'ease-in-out', offset: 0.5 },
        { transformOrigin: 'center', bottom: '-10rpx', rotateZ: -0.4, ease: 'ease-in-out', offset: 0.6 },
        { transformOrigin: 'center', bottom: '10rpx', rotateZ: 0.4, ease: 'ease-in-out', offset: 0.7 },
        { transformOrigin: 'center', bottom: '-5rpx', rotateZ: -0.2, ease: 'ease-in-out', offset: 0.8 },
        { transformOrigin: 'center', bottom: '5rpx', rotateZ: 0.2, ease: 'ease-in-out', offset: 0.9 },
        { transformOrigin: 'center', bottom: '0rpx', rotateZ: 0, ease: 'ease-in-out', offset: 1 },
      ], 4000, () => { });
    });
    await delayFn(1000);
    this.shopManAnimation();
  },
  shopManAnimation() {
    this.animate('.shop-man', [
      { opacity: 0, transformOrigin: 'left bottom', bottom: '-200rpx', scale: [0], ease: 'ease-in-out', offset: 0 },
      { opacity: 1, transformOrigin: 'left bottom', bottom: '0rpx', scale: [0.1], ease: 'ease-in-out', offset: 0.6 },
      { opacity: 1, transformOrigin: 'left bottom', bottom: '0rpx', scale: [1], ease: 'ease-in-out', offset: 1 },
    ], 1500, () => {
      this.goodsAnimation();
      this.animate('.shop-man', [
        { transformOrigin: 'center', bottom: '0rpx', rotateZ: 0, ease: 'ease-in-out', offset: 0 },
        { transformOrigin: 'center', bottom: '25rpx', rotateZ: 1, ease: 'ease-in-out', offset: 0.1 },
        { transformOrigin: 'center', bottom: '-20rpx', rotateZ: -0.8, ease: 'ease-in-out', offset: 0.2 },
        { transformOrigin: 'center', bottom: '20rpx', rotateZ: 0.8, ease: 'ease-in-out', offset: 0.3 },
        { transformOrigin: 'center', bottom: '-15rpx', rotateZ: -0.6, ease: 'ease-in-out', offset: 0.4 },
        { transformOrigin: 'center', bottom: '15rpx', rotateZ: 0.6, ease: 'ease-in-out', offset: 0.5 },
        { transformOrigin: 'center', bottom: '-10rpx', rotateZ: -0.4, ease: 'ease-in-out', offset: 0.6 },
        { transformOrigin: 'center', bottom: '10rpx', rotateZ: 0.4, ease: 'ease-in-out', offset: 0.7 },
        { transformOrigin: 'center', bottom: '-5rpx', rotateZ: -0.2, ease: 'ease-in-out', offset: 0.8 },
        { transformOrigin: 'center', bottom: '5rpx', rotateZ: 0.2, ease: 'ease-in-out', offset: 0.9 },
        { transformOrigin: 'center', bottom: '0rpx', rotateZ: 0, ease: 'ease-in-out', offset: 1 },
      ], 4000, () => { })
    })
  },
  goodsAnimation() {
    this.animate('.goods', [
      { opacity: 0, transformOrigin: 'right bottom', scale: [0], ease: 'ease-in-out', offset: 0 },
      { opacity: 1, transformOrigin: 'right bottom', scale: [1], ease: 'ease-in-out', offset: 1 },
    ], 1500, () => {
      this.cartAnimation();
      this.animate('.goods', [
        { transformOrigin: 'center', rotateZ: 0, ease: 'ease-in-out', offset: 0 },
        { transformOrigin: 'center', rotateZ: 1, ease: 'ease-in-out', offset: 0.1 },
        { transformOrigin: 'center', rotateZ: -0.8, ease: 'ease-in-out', offset: 0.2 },
        { transformOrigin: 'center', rotateZ: 0.8, ease: 'ease-in-out', offset: 0.3 },
        { transformOrigin: 'center', rotateZ: -0.6, ease: 'ease-in-out', offset: 0.4 },
        { transformOrigin: 'center', rotateZ: 0.6, ease: 'ease-in-out', offset: 0.5 },
        { transformOrigin: 'center', rotateZ: -0.4, ease: 'ease-in-out', offset: 0.6 },
        { transformOrigin: 'center', rotateZ: 0.4, ease: 'ease-in-out', offset: 0.7 },
        { transformOrigin: 'center', rotateZ: -0.2, ease: 'ease-in-out', offset: 0.8 },
        { transformOrigin: 'center', rotateZ: 0.2, ease: 'ease-in-out', offset: 0.9 },
        { transformOrigin: 'center', rotateZ: 0, ease: 'ease-in-out', offset: 1 },
      ], 4000, () => { });
    });
  },
  cartAnimation() {
    this.animate('.cart', [
      { opacity: 0, transformOrigin: 'right bottom', scale: [0], ease: 'ease-in-out', offset: 0 },
      { opacity: 1, transformOrigin: 'right bottom', scale: [1], ease: 'ease-in-out', offset: 1 },
    ], 1500, () => { });
  },
  async discussBg2Animation() {
    this.animate('.discuss-bg-2', [
      { opacity: 0, transformOrigin: 'bottom center', scale: [0], ease: 'ease-in-out', offset: 0 },
      { opacity: 1, transformOrigin: 'bottom center', scale: [1], ease: 'ease-in-out', offset: 1 },
    ], 1000, () => {
      this.discussBg1Animation();
      this.animate('.discuss-bg-2', [
        { transformOrigin: 'bottom center', scale: [1, 1], ease: 'ease-in-out', offset: 0 },
        { transformOrigin: 'bottom center', scale: [1.06, 1], ease: 'ease-in-out', offset: 0.25 },
        { transformOrigin: 'bottom center', scale: [1, 1], ease: 'ease-in-out', offset: 0.5 },
        { transformOrigin: 'bottom center', scale: [1.03, 1], ease: 'ease-in-out', offset: 0.75 },
        { transformOrigin: 'bottom center', scale: [1, 1], ease: 'ease-in-out', offset: 1 },
      ], 3000, () => { });
    });
  },
  discussBg1Animation() {
    this.animate('.discuss-bg-1', [
      { opacity: 0, scale: [0], ease: 'ease-in-out', offset: 0 },
      { opacity: 1, scale: [1], ease: 'ease-in-out', offset: 1 },
    ], 1500, () => {
      this.discussBg3Animation();
      this.animate('.discuss-bg-1', [
        { scale: [1], ease: 'ease-in-out', offset: 0 },
        { scale: [1.03], ease: 'ease-in-out', offset: 0.2 },
        { scale: [0.97], ease: 'ease-in-out', offset: 0.4 },
        { scale: [1.02], ease: 'ease-in-out', offset: 0.6 },
        { scale: [0.98], ease: 'ease-in-out', offset: 0.8 },
        { scale: [1], ease: 'ease-in-out', offset: 1 },
      ], 2000, () => { });
    })
  },
  discussBg3Animation() {
    this.animate('.discuss-bg-3', [
      { transformOrigin: 'bottom center', opacity: 0, scale: [0], ease: 'ease-in-out', offset: 0 },
      { transformOrigin: 'bottom center', opacity: 1, scale: [1], ease: 'ease-in-out', offset: 1 },
    ], 1500, () => {
      this.discussBg4Animation();
      this.animate('.discuss-bg-3', [
        { transformOrigin: 'center', scale: [1, 1], ease: 'ease-in-out', offset: 0 },
        { transformOrigin: 'center', scale: [1.02, 1], ease: 'ease-in-out', offset: 0.25 },
        { transformOrigin: 'center', scale: [1, 1], ease: 'ease-in-out', offset: 0.5 },
        { transformOrigin: 'center', scale: [1.01, 1], ease: 'ease-in-out', offset: 0.75 },
        { transformOrigin: 'center', scale: [1, 1], ease: 'ease-in-out', offset: 1 },
      ], 2000, () => { });
    })
  },
  discussBg4Animation() {
    this.animate('.discuss-bg-4', [
      { opacity: 0, scale: [0], ease: 'ease-in-out', offset: 0 },
      { opacity: 1, scale: [1], ease: 'ease-in-out', offset: 1 },
    ], 1500, () => {
      this.discussManAnimation();
      this.animate('.discuss-bg-4', [
        { scale: [1], ease: 'ease-in-out', offset: 0 },
        { scale: [1.03], ease: 'ease-in-out', offset: 0.2 },
        { scale: [0.97], ease: 'ease-in-out', offset: 0.4 },
        { scale: [1.02], ease: 'ease-in-out', offset: 0.6 },
        { scale: [0.98], ease: 'ease-in-out', offset: 0.8 },
        { scale: [1], ease: 'ease-in-out', offset: 1 },
      ], 2000, () => { });
    })
  },
  discussManAnimation() {
    this.animate('.discuss-man', [
      { opacity: 0, scale: [0], ease: 'ease-in-out', offset: 0 },
      { opacity: 1, scale: [1], ease: 'ease-in-out', offset: 1 },
    ], 1500, () => {
      this.discussGirl1Animation();
      this.animate('.discuss-man', [
        { transformOrigin: 'bottom center', scale: [1, 1], ease: 'ease-in-out', offset: 0 },
        { transformOrigin: 'bottom center', scale: [1, 1.08], ease: 'ease-in-out', offset: 0.2 },
        { transformOrigin: 'bottom center', scale: [1, 0.92], ease: 'ease-in-out', offset: 0.4 },
        { transformOrigin: 'bottom center', scale: [1, 1.04], ease: 'ease-in-out', offset: 0.6 },
        { transformOrigin: 'bottom center', scale: [1, 0.96], ease: 'ease-in-out', offset: 0.8 },
        { transformOrigin: 'bottom center', scale: [1, 1], ease: 'ease-in-out', offset: 1 },
      ], 2000, () => { });
    })
  },
  discussGirl1Animation() {
    this.animate('.discuss-girl-1', [
      { opacity: 0, scale: [0], ease: 'ease-in-out', offset: 0 },
      { opacity: 1, scale: [1], ease: 'ease-in-out', offset: 1 },
    ], 1500, () => {
      this.discussGirl2Animation();
      this.animate('.discuss-girl-1', [
        { transformOrigin: 'bottom center', scale: [1, 1], ease: 'ease-in-out', offset: 0 },
        { transformOrigin: 'bottom center', scale: [1, 1.08], ease: 'ease-in-out', offset: 0.2 },
        { transformOrigin: 'bottom center', scale: [1, 0.92], ease: 'ease-in-out', offset: 0.4 },
        { transformOrigin: 'bottom center', scale: [1, 1.04], ease: 'ease-in-out', offset: 0.6 },
        { transformOrigin: 'bottom center', scale: [1, 0.96], ease: 'ease-in-out', offset: 0.8 },
        { transformOrigin: 'bottom center', scale: [1, 1], ease: 'ease-in-out', offset: 1 },
      ], 2000, () => { });
    })
  },
  discussGirl2Animation() {
    this.animate('.discuss-girl-2', [
      { opacity: 0, scale: [0], ease: 'ease-in-out', offset: 0 },
      { opacity: 1, scale: [1], ease: 'ease-in-out', offset: 1 },
    ], 1500, () => {
      this.animate('.discuss-girl-2', [
        { transformOrigin: 'bottom center', scale: [1, 1], ease: 'ease-in-out', offset: 0 },
        { transformOrigin: 'bottom center', scale: [1, 1.08], ease: 'ease-in-out', offset: 0.2 },
        { transformOrigin: 'bottom center', scale: [1, 0.98], ease: 'ease-in-out', offset: 0.4 },
        { transformOrigin: 'bottom center', scale: [1, 1.04], ease: 'ease-in-out', offset: 0.6 },
        { transformOrigin: 'bottom center', scale: [1, 0.98], ease: 'ease-in-out', offset: 0.8 },
        { transformOrigin: 'bottom center', scale: [1, 1], ease: 'ease-in-out', offset: 1 },
      ], 2000, () => {
        this.startBtnAnimation();
      });
    })
  },
  startBtnAnimation() {
    this.animate('.start-btn', [
      { opacity: 0, ease: 'ease-in-out', offset: 0 },
      { opacity: 1, ease: 'ease-in-out', offset: 1 },
    ], 1500, () => {

    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})