
import { postRequest } from '../../utils/request.js';
import { showToast } from '../../utils/index';
Page({
  data: {
    animationFlag: false,
    animationCount: 0,
    autoplay: false,
    videoSrc: '',
    recordId: ''
  },

  async onLoad() {
    this.createRecord();
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
          const { animationFlag, animationCount } = this.data;
          if (!animationFlag) {
            if (animationCount < 10) {
              if (animationCount === 0) {
                this.createRecord();
              }
              this.setData({ animationFlag: true });
              this.animation();
            } else {
              console.log('animationCount', animationCount);
              this.updateRecord();
              this.setData({ autoplay: true }); // 播放视频
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
  async createRecord() {
    const openId = wx.getStorageSync('openId');
    const params = {
      data: {
        openId: openId,
        type: 1,
        status: 0,
        source: 0,
        createdAt: new Date()
      }
    }
    const result = await postRequest('/activity/record', params);
    const { code, msg, data } = result;
    if (code === "200") {
      console.log(data);
      this.setData({ recordId: data.id });
    } else {
      showToast(msg);
    }
  },
  async updateRecord() {
    const openId = wx.getStorageSync('openId');
    const params = {
      data: {
        openId: openId,
        type: 1,
        status: 1,
        source: 10,
        id: this.data.recordId,
        createdAt: new Date()
      }
    }
    const result = await postRequest('/activity/record', params);
    const { code, msg, data } = result;
    if (code === "200") {
      console.log(data);
    } else {
      showToast(msg);
    }
  },
  onUnload() {
    wx.stopAccelerometer(); // 退出页面时停止监听
  },
});
