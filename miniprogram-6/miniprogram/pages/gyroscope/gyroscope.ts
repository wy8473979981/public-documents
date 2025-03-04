/*
 * @Description: Description
 * @Author: wangyang
 * @Date: 2025-02-27 15:01:26
 * @LastEditors: wangyang
 * @LastEditTime: 2025-02-28 16:41:09
 */
// pages/gyroscope/gyroscope.ts

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
  onLoad: function () {

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
    this.shopGirlAnimation();
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
    //   { transformOrigin: '0, 0', scale: [0], offset: 0 },
    //   { transformOrigin: '0, 0', scale: [0.03], offset: 0.6 },
    //   { transformOrigin: '0, 0', bottom: '0rpx', scale: [1], offset: 1 }
    // ], 2000, () => {
    //   console.log('shop-girl-appear 动画完成');
    //   // 回弹动画
    //   this.animate('#shop-girl', [
    //     { translateY: '0rpx', },
    //     { translateY: '14rpx', offset: 0.125 },
    //     { translateY: '0rpx', offset: 0.25 },
    //     { translateY: '10rpx', offset: 0.375 },
    //     { translateY: '0rpx', offset: 0.5 },
    //     { translateY: '6rpx', offset: 0.625 },
    //     { translateY: '0rpx', offset: 0.75 },
    //     { translateY: '2rpx', offset: 0.875 },
    //     { translateY: '0rpx', }
    //   ], 4000);
    // });
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