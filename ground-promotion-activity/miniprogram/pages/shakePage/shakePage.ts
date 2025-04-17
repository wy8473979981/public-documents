
import { postRequest } from '../../utils/request.js';
import { showToast, delayFn, getPlatform } from '../../utils/index';
Page({
  data: {
    showVideo: false,
    bubblyAudioSrc: '',
    flowAudioSrc: '',
    bottleImgSrc: '',
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
    shakeThreshold: 2, // 摇晃阈值（敏感度）
    curShakeThreshold: 0,
    lastX: 0,
    lastY: 0,
    lastZ: 0,

    firstReady: true,
    bottleAnimationFlag: false,
    lastShakeTime: 0, // 新增：记录上次摇晃的时间戳

    platform: '',
    isPlaying: false,
    initMusicStatus: false,
  },
  shakeResetTimer: 0,
  handleShakeAnimationTimer: 0,
  audioContext: null as WechatMiniprogram.InnerAudioContext | null,
  videoContext: null as WechatMiniprogram.VideoContext | null,

  async onLoad(options: any) {
    console.log('香槟摇一摇！', options);

    this.preloadSource();
    if (options?.recordId) {
      this.setData({ recordId: options?.recordId })
    }
  },
  onReady() {
    const platform = getPlatform();
    const lastTime = Date.now();
    this.setData({ lastTime: lastTime, platform: platform });
    this.videoContext = wx.createVideoContext('myVideo');

    this.startShakeListener();
    this.initCanvas();
    this.handleShakeAnimation();
    // this.initIosAudio();

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // this.initAndroidAudio();
  },
  preloadSource() {
    const timer = setInterval(() => {
      const bubblyAudio = wx.getStorageSync('bubblyAudio');
      const flowAudio = wx.getStorageSync('flowAudio');
      const bottleImg = wx.getStorageSync('bottleImg');
      let bubblyAudioSrc = '';
      let flowAudioSrc = '';
      let bottleImgSrc = '';

      if (bubblyAudio) {
        bubblyAudioSrc = bubblyAudio.path;
      }
      if (flowAudio) {
        flowAudioSrc = flowAudio.path;
        this.initAudio(flowAudioSrc);
      }
      if (bottleImg) {
        bottleImgSrc = bottleImg.path;
      }
      if (bubblyAudioSrc && bottleImgSrc) {
        clearInterval(timer);
      }
      console.log('bubblyAudioSrc', bubblyAudioSrc, flowAudioSrc, bottleImgSrc);
      this.setData({ bubblyAudioSrc: bubblyAudioSrc, flowAudioSrc: flowAudioSrc, bottleImgSrc: bottleImgSrc });
    }, 40);
  },
  startShakeListener() {
    // 监听加速度计数据
    wx.onAccelerometerChange(async (res) => {
      const { x, y, z } = res;

      // 计算加速度差值
      const deltaX = Math.abs(x - this.data.lastX);
      const deltaY = Math.abs(y - this.data.lastY);
      const deltaZ = Math.abs(z - this.data.lastZ);

      const curShakeThreshold = deltaX + deltaY + deltaZ;

      this.setData({ curShakeThreshold: curShakeThreshold });
      // 判断是否达到摇晃阈值
      if (curShakeThreshold > this.data.shakeThreshold) {

        // 更新摇晃时间
        const now = Date.now();
        this.setData({ lastShakeTime: now });
        this.resetShakeState(); // 每次检测到摇晃时重置计时器
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
  // 添加一个方法来重置摇晃状态
  resetShakeState() {
    if (this.shakeResetTimer) {
      clearInterval(this.shakeResetTimer);
    }
    this.shakeResetTimer = setInterval(() => {
      // 如果摇晃状态已经结束，清除定时器并重置摇晃状态 
      if (!this.data.bottleAnimationFlag && this.data.curShakeThreshold < this.data.shakeThreshold) {
        const now = Date.now();
        if (now - this.data.lastShakeTime > 1000) {
          clearInterval(this.shakeResetTimer);
          this.bottleStopAnimation();
        }
      }
    }, 100);
  },
  bottleAnimation() {
    if (!this.data.bottleAnimationFlag) {
      wx.vibrateLong();
      this.triggerShake();
      this.setData({ bottleAnimationFlag: true });
      this.animate(
        '.bottle',
        [
          { translateX: '-50%', top: '469.61rpx', rotateZ: 10, ease: 'ease-out' },
          { translateX: '-50%', top: '449.61rpx', rotateZ: 10, ease: 'ease-out' },
          { translateX: '-50%', top: '489.61rpx', rotateZ: 10, ease: 'ease-out' },
          { translateX: '-50%', top: '449.61rpx', rotateZ: 10, ease: 'ease-out' },
          { translateX: '-50%', top: '489.61rpx', rotateZ: 10, ease: 'ease-out' },
          { translateX: '-50%', top: '449.61rpx', rotateZ: 10, ease: 'ease-out' },
          { translateX: '-50%', top: '489.61rpx', rotateZ: 10, ease: 'ease-out' },
          { translateX: '-50%', top: '449.61rpx', rotateZ: 10, ease: 'ease-out' },
          { translateX: '-50%', top: '489.61rpx', rotateZ: 10, ease: 'ease-out' },
          { translateX: '-50%', top: '449.61rpx', rotateZ: 10, ease: 'ease-out' },
          { translateX: '-50%', top: '489.61rpx', rotateZ: 10, ease: 'ease-out' },
          { translateX: '-50%', top: '489.61rpx', rotateZ: 10, ease: 'ease-out' },
          { translateX: '-50%', top: '449.61rpx', rotateZ: 10, ease: 'ease-out' },
          { translateX: '-50%', top: '489.61rpx', rotateZ: 10, ease: 'ease-out' },
          { translateX: '-50%', top: '449.61rpx', rotateZ: 10, ease: 'ease-out' },
          { translateX: '-50%', top: '489.61rpx', rotateZ: 10, ease: 'ease-out' },
          { translateX: '-50%', top: '449.61rpx', rotateZ: 10, ease: 'ease-out' },
          { translateX: '-50%', top: '489.61rpx', rotateZ: 10, ease: 'ease-out' },
          { translateX: '-50%', top: '489.61rpx', rotateZ: 10, ease: 'ease-out' },
          { translateX: '-50%', top: '449.61rpx', rotateZ: 10, ease: 'ease-out' },
          { translateX: '-50%', top: '489.61rpx', rotateZ: 10, ease: 'ease-out' },
          { translateX: '-50%', top: '449.61rpx', rotateZ: 10, ease: 'ease-out' },
          { translateX: '-50%', top: '489.61rpx', rotateZ: 10, ease: 'ease-out' },
          { translateX: '-50%', top: '469.61rpx', rotateZ: 10, ease: 'ease-out' },
        ],
        100,
        () => {
          this.setData({ bottleAnimationFlag: false });
        }
      );
    }
  },
  bottleStopAnimation() {
    console.log('bottleStopAnimation');
    this.animate(
      '.bottle',
      [
        { translateX: '-50%', top: '469.61rpx', rotateZ: 10, ease: 'ease-out' },
        { translateX: '-50%', top: '469.61rpx', rotateZ: 0, ease: 'ease-out' },
      ],
      200,
      () => { }
    );
  },
  async triggerShake() {
    const { shakeCount, recordId } = this.data;
    if (!this.data.isPlaying) {
      const newCount = shakeCount + 1;
      this.setCount(newCount);

      if (newCount === 1 && !recordId) {
        this.createRecord();
      } else if (newCount >= 10) {

        await delayFn(1000);
        // 播放视频
        this.setData({ showVideo: true }, () => {
          this.videoContext?.play();
        });

        // 调接口保存
        this.updateRecord();

        // 退出页面时停止监听
        wx.stopAccelerometer();
      }
      console.log('triggerShake', newCount);
      this.setData({ shakeCount: newCount });
    }
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
          fillSpeed: 0.8, // 填充速度
        });
        this.liquidCanvasAnimate();
      });
  },
  // 设置count值，每次+1都会触发高度变化
  setCount(count: any) {
    const maxHeight = this.data.maxHeight;
    const targetHeight = Math.min((count / 10) * maxHeight, maxHeight);
    this.setData({
      count,
      targetHeight
    }, () => {
      this.playMusic(); // 播放音频
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
        } else if (currentHeight >= targetHeight) {
          currentHeight = Math.max(currentHeight - fillSpeed, targetHeight);
          this.setData({ currentHeight }, () => {
            this.pauseMusic(); // 停止音频
          });
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
        { transformOrigin: 'center', top: '117.19rpx', left: '133.27rpx', ease: 'ease-in-out' },
        { transformOrigin: 'center', top: '111.19rpx', left: '139.27rpx', ease: 'ease-in-out' },
        { transformOrigin: 'center', top: '123.19rpx', left: '127.27rpx', ease: 'ease-in-out' },
        { transformOrigin: 'center', top: '111.19rpx', left: '139.27rpx', ease: 'ease-in-out' },
        { transformOrigin: 'center', top: '123.19rpx', left: '127.27rpx', ease: 'ease-in-out' },
        { transformOrigin: 'center', top: '111.19rpx', left: '139.27rpx', ease: 'ease-in-out' },
        { transformOrigin: 'center', top: '123.19rpx', left: '127.27rpx', ease: 'ease-in-out' },
        { transformOrigin: 'center', top: '111.19rpx', left: '139.27rpx', ease: 'ease-in-out' },
        { transformOrigin: 'center', top: '123.19rpx', left: '127.27rpx', ease: 'ease-in-out' },
        { transformOrigin: 'center', top: '111.19rpx', left: '139.27rpx', ease: 'ease-in-out' },
        { transformOrigin: 'center', top: '123.19rpx', left: '127.27rpx', ease: 'ease-in-out' },
        { transformOrigin: 'center', top: '111.19rpx', left: '139.27rpx', ease: 'ease-in-out' },
        { transformOrigin: 'center', top: '123.19rpx', left: '127.27rpx', ease: 'ease-in-out' },
        { transformOrigin: 'center', top: '111.19rpx', left: '139.27rpx', ease: 'ease-in-out' },
        { transformOrigin: 'center', top: '123.19rpx', left: '127.27rpx', ease: 'ease-in-out' },
        { transformOrigin: 'center', top: '117.19rpx', left: '133.27rpx', ease: 'ease-in-out' },
      ],
      300,
      () => {
        this.clearAnimation('.handle-shake', function () {
          // console.log("清除了.handle-shake上的所有动画属性")
        })
        this.handleShakeAnimationTimer = setTimeout(() => {
          this.handleShakeAnimation();
          clearTimeout(this.handleShakeAnimationTimer);
        }, 1000)
      }
    );
  },
  // initIosAudio() {
  //   if (this.data.platform === 'ios') {
  //     this.initAudio();
  //   }
  // },
  // initAndroidAudio() {
  //   if (this.data.platform !== 'ios') {
  //     // 安卓系统小程序重新进入前台时，检查音频状态
  //     if (!this.audioContext || this.audioContext.paused) {
  //       console.log(`当前应用环境：${this.data.platform}，初始化音频`)
  //       this.initAudio();
  //     }
  //   }
  // },
  initAudio(flowAudioSrc: string) {
    if (!this.data.initMusicStatus) {
      this.setData({ initMusicStatus: true });
      // 创建音频上下文对象
      this.audioContext = wx.createInnerAudioContext();
      this.audioContext.src = flowAudioSrc; // 音乐资源的路径
      this.audioContext.loop = true; // 设置循环播放

      // 设置音频播放选项
      wx.setInnerAudioOption({
        mixWithOther: false, // 不允许与其他音频混合播放
        obeyMuteSwitch: false, // （仅在 iOS 生效）是否遵循静音开关，设置为 false 之后，即使是在静音模式下，也能播放声音
        success: function () {
          console.log("音频播放选项设置成功");
        },
        fail: function () {
          console.log("音频播放选项设置失败");
        }
      });

      // 音乐加载完毕后
      this.audioContext.onCanplay(() => {
        this.audioContext?.offCanplay(); // 防止多次触发
      });

      // 监听音频播放结束
      this.audioContext.onEnded(() => {
        console.log('音频播放结束');
      });

      // 监听音频播放错误
      this.audioContext.onError((res) => {
        console.error('音频播放错误:', res);
      });
    }
  },
  playMusic() {
    // 播放音乐
    if (this.audioContext && !this.data.isPlaying) {
      console.log('playMusic');
      this.audioContext?.play();
      // 更新播放状态
      this.setData({
        isPlaying: true,
      });
    }
  },
  pauseMusic() {
    // 暂停音乐
    if (this.audioContext && this.data.isPlaying) {
      console.log('pauseMusic');
      this.audioContext?.stop() // 停止
      // 更新播放状态
      this.setData({
        isPlaying: false,
      });
    }
  },
  destroyMusic() {
    if (this.audioContext) {
      this.audioContext.stop();
      this.audioContext.destroy(); // 销毁音频上下文，释放资源
      this.setData({ isPlaying: false });
    }
  },
  onUnload() {
    wx.stopAccelerometer(); // 退出页面时停止监听
    if (this.data.animationId) {
      clearTimeout(this.data.animationId);
    }
    if (this.shakeResetTimer) {
      clearInterval(this.shakeResetTimer);
    }
    // 页面卸载时销毁音频对象
    this.destroyMusic();
  },
});
