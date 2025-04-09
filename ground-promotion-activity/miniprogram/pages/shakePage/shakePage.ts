
import { postRequest } from '../../utils/request.js';
import { showToast, delayFn } from '../../utils/index';
Page({
  data: {
    showVideo: false,
    videoSrc: 'https://nav-uat.aia.com.cn/fan/sail/resource/bubblyActivity/images/video.mp4',
    recordId: '',

    bubbles: [] as { x: number; y: number; radius: number; speed: number }[],
    time: 0,
    animationId: 0,
    count: 0,
    targetHeight: 0, // 新增目标高度
    currentHeight: 0, // 当前实际高度
    lastTime: 0, // 用于计算deltaTime
    maxHeight: 0,
    canvasWidth: 0,
    canvasHeight: 0,
    fillSpeed: 0,

    shakeCount: 0,
    shakeThreshold: 4, // 摇晃阈值（敏感度）
    lastX: 0,
    lastY: 0,
    lastZ: 0,

    firstReady: true,
    bottleAnimationFlag: false,
    bottleStopAnimationFlag: false,

    progressNum: 0,
  },
  handleShakeAnimationTimer:0,
  videoContext: null as WechatMiniprogram.VideoContext | null,

  async onLoad(options: any) {
    console.log('香槟摇一摇！', options);
    if (options?.recordId) {
      this.setData({ recordId: options?.recordId })
    }
  },
  onReady() {
    this.startShakeListener();

    this.initCanvas();
    const lastTime = Date.now();
    this.setData({ lastTime: lastTime });

    this.videoContext = wx.createVideoContext('myVideo');
    this.handleShakeAnimation();
  },
  startShakeListener() {
    // 监听加速度计数据
    wx.onAccelerometerChange(async (res) => {
      const { x, y, z } = res;

      // 计算加速度差值
      const deltaX = Math.abs(x - this.data.lastX);
      const deltaY = Math.abs(y - this.data.lastY);
      const deltaZ = Math.abs(z - this.data.lastZ);

      // 判断是否达到摇晃阈值
      if (deltaX + deltaY + deltaZ > this.data.shakeThreshold) {
        wx.vibrateLong();
        this.bottleAnimation();
      }
      // 记录当前加速度值
      this.setData({
        lastX: x,
        lastY: y,
        lastZ: z,
      });
    });
  },
  bottleAnimation() {
    const { bottleAnimationFlag } = this.data;
    if (!bottleAnimationFlag) {
      this.triggerShake();
      this.setData({ bottleAnimationFlag: true });
      this.animate(
        '.bottle',
        [
          { translateX: '-50%', top: '178px', rotateZ: 10, ease: 'ease-out' },
          { translateX: '-50%', top: '168px', rotateZ: 10, ease: 'ease-out' },
          { translateX: '-50%', top: '186px', rotateZ: 10, ease: 'ease-out' },
          { translateX: '-50%', top: '168px', rotateZ: 10, ease: 'ease-out' },
          { translateX: '-50%', top: '186px', rotateZ: 10, ease: 'ease-out' },
          { translateX: '-50%', top: '168px', rotateZ: 10, ease: 'ease-out' },
          { translateX: '-50%', top: '186px', rotateZ: 10, ease: 'ease-out' },
          { translateX: '-50%', top: '168px', rotateZ: 10, ease: 'ease-out' },
          { translateX: '-50%', top: '186px', rotateZ: 10, ease: 'ease-out' },
          { translateX: '-50%', top: '168px', rotateZ: 10, ease: 'ease-out' },
          { translateX: '-50%', top: '186px', rotateZ: 10, ease: 'ease-out' },
          { translateX: '-50%', top: '186px', rotateZ: 10, ease: 'ease-out' },
          { translateX: '-50%', top: '168px', rotateZ: 10, ease: 'ease-out' },
          { translateX: '-50%', top: '186px', rotateZ: 10, ease: 'ease-out' },
          { translateX: '-50%', top: '168px', rotateZ: 10, ease: 'ease-out' },
          { translateX: '-50%', top: '186px', rotateZ: 10, ease: 'ease-out' },
          { translateX: '-50%', top: '168px', rotateZ: 10, ease: 'ease-out' },
          { translateX: '-50%', top: '186px', rotateZ: 10, ease: 'ease-out' },
          { translateX: '-50%', top: '186px', rotateZ: 10, ease: 'ease-out' },
          { translateX: '-50%', top: '168px', rotateZ: 10, ease: 'ease-out' },
          { translateX: '-50%', top: '186px', rotateZ: 10, ease: 'ease-out' },
          { translateX: '-50%', top: '168px', rotateZ: 10, ease: 'ease-out' },
          { translateX: '-50%', top: '186px', rotateZ: 10, ease: 'ease-out' },
          { translateX: '-50%', top: '178px', rotateZ: 10, ease: 'ease-out' },
        ],
        100,
        () => {
          this.setData({ bottleAnimationFlag: false });
          this.bottleStopAnimation();
        }
      );
    }
  },
  bottleStopAnimation() {
    this.animate(
      '.bottle',
      [
        { translateX: '-50%', top: '178px', rotateZ: 10, ease: 'ease-out' },
        { translateX: '-50%', top: '178px', rotateZ: 0, ease: 'ease-out' },
      ],
      200,
      () => { }
    );
  },
  async triggerShake() {
    const { shakeCount, recordId } = this.data;
    const newCount = shakeCount + 1;
    this.setCount(newCount);

    if (newCount === 1 && !recordId) {
      this.createRecord();
    } else if (newCount >= 10) {

      await delayFn(1000);
      // 播放视频
      this.setData({ showVideo: true });
      this.videoContext?.play();

      // 调接口保存
      this.updateRecord();

      // 退出页面时停止监听
      wx.stopAccelerometer();
    }
    console.log('triggerShake', newCount);
    this.setData({ shakeCount: newCount });
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
        score: 0,
        createdAt: new Date(),
      },
    };
    const result = await postRequest('/activity/record', params);
    const { code, msg, data } = result;
    if (code === '200') {
      console.log('createRecord', data);
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
        score: 10,
        id: this.data.recordId,
        updatedAt: new Date(),
      },
    };
    const result = await postRequest('/activity/record', params);
    const { code, msg, data } = result;
    if (code === '200') {
      console.log('updateRecord', data);
    } else {
      showToast(msg);
    }
  },
  initCanvas() {
    const query = wx.createSelectorQuery();
    query
      .select('#liquidCanvas')
      .fields({ node: true, size: true })
      .exec((res) => {
        if (!res[0]) return;

        const canvas = res[0].node;
        const ctx = canvas.getContext('2d');
        const dpr = wx.getSystemInfoSync().pixelRatio;

        canvas.width = res[0].width * dpr;
        canvas.height = res[0].height * dpr;
        ctx.scale(dpr, dpr);

        // 初始化配置
        this.setData({
          canvasWidth: res[0].width,
          canvasHeight: res[0].height,
          maxHeight: res[0].height, // 最大高度为画布的高度
          fillSpeed: 1.5, // 填充速度
        });
        this.liquidCanvasAnimate();
      });
  },

  // 设置count值，每次+1都会触发高度变化
  setCount(count: any) {

    const maxHeight = this.data.maxHeight;
    const targetHeight = Math.min((count / 10) * maxHeight, maxHeight);
    console.log(targetHeight, 'targetHeight');

    this.setData({
      count,
      targetHeight,
      progressNum: count * 10
    });
  },

  liquidCanvasAnimate() {
    const now = Date.now();
    const deltaTime = now - this.data.lastTime;
    this.setData({ lastTime: now });

    const query = wx.createSelectorQuery();
    query
      .select('#liquidCanvas')
      .fields({ node: true, size: true })
      .exec((res) => {
        if (!res[0]) return;

        const canvas = res[0].node;
        const ctx = canvas.getContext('2d');
        const width = this.data.canvasWidth;
        const height = this.data.canvasHeight;
        let time = this.data.time;

        // 平滑过渡到目标高度
        let currentHeight = this.data.currentHeight;
        const targetHeight = this.data.targetHeight;
        const fillSpeed = this.data.fillSpeed * (deltaTime / 16);

        if (currentHeight < targetHeight) {
          currentHeight = Math.min(currentHeight + fillSpeed, targetHeight);
          this.setData({ currentHeight });
        } else if (currentHeight > targetHeight) {
          currentHeight = Math.max(currentHeight - fillSpeed, targetHeight);
          this.setData({ currentHeight });
        }

        ctx.clearRect(0, 0, width, height);

        // 如果count为0，则不绘制任何内容
        if (this.data.count === 0) {
          const animationId = setTimeout(() => {
            this.liquidCanvasAnimate();
          }, 16);
          this.setData({ animationId });
          return;
        }

        // 底层波浪
        ctx.beginPath();
        for (let x = 0; x <= width; x += 8) {
          const waveY =
            height - currentHeight + Math.sin(x * 0.025 + time * 0.9) * 8 + 6;
          const y = Math.min(waveY, height);
          ctx.lineTo(x, y);
        }
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        ctx.fillStyle = 'rgba(180, 160, 100, 0.4)';
        ctx.fill();

        // 主波浪
        ctx.beginPath();
        for (let x = 0; x <= width; x += 5) {
          const waveY = height - currentHeight + Math.sin(x * 0.03 + time) * 10;
          const y = Math.min(waveY, height);
          ctx.lineTo(x, y);
        }
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();

        const waveGradient = ctx.createLinearGradient(
          0,
          height - currentHeight,
          0,
          height
        );
        waveGradient.addColorStop(0, 'rgba(255,240,180,0.7)');
        waveGradient.addColorStop(1, 'rgba(230,210,140,0.9)');
        ctx.fillStyle = waveGradient;
        ctx.fill();

        time += 0.08;
        this.setData({ time });

        const animationId = setTimeout(() => {
          this.liquidCanvasAnimate();
        }, 16);

        this.setData({ animationId });
      });
  },
  handleShakeAnimation() {
    this.animate(
      '.handle-shake',
      [
        { scale: [0], ease: 'ease', offset: 0 },
        { scale3d: [0.9, 0.9, 0.9], rotate: -3, ease: 'ease', offset: 0.1 },
        { scale3d: [0.9, 0.9, 0.9], rotate: -3, ease: 'ease', offset: 0.2 },
        { scale3d: [1.1, 1.1, 1.1], rotate: 3, ease: 'ease', offset: 0.3 },
        { scale3d: [1.1, 1.1, 1.1], rotate: -3, ease: 'ease', offset: 0.4 },
        { scale3d: [1.1, 1.1, 1.1], rotate: 3, ease: 'ease', offset: 0.5 },
        { scale3d: [1.1, 1.1, 1.1], rotate: -3, ease: 'ease', offset: 0.6 },
        { scale3d: [1.1, 1.1, 1.1], rotate: 3, ease: 'ease', offset: 0.7 },
        { scale3d: [1.1, 1.1, 1.1], rotate: -3, ease: 'ease', offset: 0.8 },
        { scale3d: [1.1, 1.1, 1.1], rotate: 3, ease: 'ease', offset: 0.9 },
        { scaleX: 1, ease: 'ease', offset: 1 },
      ],
      500,
      () => {
        this.handleShakeAnimationTimer = setTimeout(() => {
          this.handleShakeAnimation();
          clearTimeout(this.handleShakeAnimationTimer);
        }, 1000)
      }
    );
  },

  onUnload() {
    wx.stopAccelerometer(); // 退出页面时停止监听
    if (this.data.animationId) {
      clearTimeout(this.data.animationId);
    }
  },
});
