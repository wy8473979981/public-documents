


Page({
  data: {
    animationFlag: false,
    autoplay: false,
    animationCount: 0,
    videoSrc: '',
  },

  async onLoad() {
    const videoSrc = wx.getStorageSync('videoSrc');
    this.setData({ videoSrc: videoSrc });
    this.startShakeListener();
  },
  async animation() {
    console.log('animation', this.data.animationCount);

    this.setData({ animationCount: this.data.animationCount + 1 });
    this.animate(
      '.bottle',
      [
        { translateX: '-50%', top: '178px', ease: 'ease-out' },
        { translateX: '-50%', top: '350px', ease: 'ease-out' },
        { translateX: '-50%', top: '178px', ease: 'ease-out' },
      ],
      500,
      () => {
        this.setData({ animationFlag: false });
      });
  },

  startShakeListener() {
    let lastTime = 0;
    const threshold = 1; // 设置阈值
    wx.onAccelerometerChange(async (res) => {
      let curTime = new Date().getTime();
      if (curTime - lastTime > 10) {
        // 限制触发频率
        lastTime = curTime;
        if (res.y < -threshold || res.y > threshold) {
          console.log('y：', res.y);

          if (!this.data.animationFlag) {
            if (this.data.animationCount < 10) {
              this.setData({ animationFlag: true });
              this.animation();
            } else {
              console.log('this.data.animationCount', this.data.animationCount);
              this.setData({ autoplay: true });
              wx.stopAccelerometer(); // 停止监听
            }
          }

        }
      }
    });
  },
  videoPlayed() {
    console.log('播放完毕');
    wx.redirectTo({ url: '/pages/cheersPage/cheersPage' });
  },
  onUnload() {
    wx.stopAccelerometer(); // 退出页面时停止监听
  },
});
