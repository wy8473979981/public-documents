/*
 * @Description: Description
 * @Author: wangyang
 * @Date: 2025-02-27 15:01:26
 * @LastEditors: wangyang
 * @LastEditTime: 2025-02-28 16:41:09
 */
// pages/gyroscope/gyroscope.ts

import { getElementPosition } from '../../utils/index';

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
  onLoad: function () {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    this.loaderTimerFn();
  },
  loaderTimerFn() {
    const loaderTimer = setTimeout(() => {
      this.setData({
        loading: false
      })
      this.shopGirlAnimation();
      clearTimeout(loaderTimer);
    }, 500);
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
    this.setData({
      current: e.detail.current,
    });
  },
  shopGirlAnimation: async function () {
    // this.animate('#shop-girl', [
    //   { offset: 0, scale: [0], translateY: '0rpx', ease: 'ease-in' },
    //   { offset: 0.2, scale: [0.2], translateY: '-200rpx', ease: 'ease-in' },
    //   { opacity: 1, scale: [1], translateY: '-300rpx', ease: 'ease-in' },
    // ], 2000, async () => {
    //   const rect: any = await getElementPosition('shop-girl');
    //   console.log(rect)
    // });

    // this.animate('#shop-girl', [
    //   { offset: 0, scale: [0], ease: 'ease-in' },
    //   { offset: 1, scale: [1], top: '0%', ease: 'ease-in' },
    // ], 2000, async () => {
    //   const rect: any = await getElementPosition('shop-girl');
    //   console.log(rect)
    // });

    // this.animate(
    //   '#shop-girl',
    //   [
    //     { transform: 'scale(0)' },
    //     { transform: 'scale(1)' },
    //     { transform: 'scale(1) translateY(50rpx)' }
    //   ],
    //   1000,
    //   () => {
    //     console.log('动画完成');
    //   }
    // );



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