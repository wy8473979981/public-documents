
import { postRequest } from '../../utils/request.js';
import { showToast } from '../../utils/index';
Page({
  data: {
    animationFlag: false,
    animationCount: 0,
    autoplay: false,
    videoSrc: '',
    recordId: '',

    bubbles: [] as { x: number; y: number; radius: number; speed: number }[],
    time: 0,
    animationId: 0,
    count: 0,
    progressText: '填充中: 0%',
    targetHeight: 0, // 新增目标高度
    currentHeight: 0, // 当前实际高度
    lastTime: 0, // 用于计算deltaTime
    maxHeight: 0,
    canvasWidth: 0,
    canvasHeight: 0,
    fillSpeed: 0,
  },

  async onLoad() {
    const videoSrc = wx.getStorageSync('videoSrc');
    this.setData({ videoSrc: videoSrc });
    this.startShakeListener();
  },
  onReady() {
    this.initCanvas();
    const lastTime = Date.now();
    this.setData({ lastTime: lastTime });
  },

  async animation() {
    console.log('animation', this.data.animationCount);
    this.setData({ animationCount: this.data.animationCount + 1 });
    this.setCount(this.data.animationCount + 1);
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
      }
    );
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
        score: 0,
        createdAt: new Date(),
      },
    };
    const result = await postRequest('/activity/record', params);
    const { code, msg, data } = result;
    if (code === '200') {
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
        score: 10,
        id: this.data.recordId,
        updatedAt: new Date(),
      },
    };
    const result = await postRequest('/activity/record', params);
    const { code, msg, data } = result;
    if (code === '200') {
      console.log(data);
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
          maxHeight: res[0].height * 0.5, // 最大高度为画布一半
          fillSpeed: 1.5, // 填充速度
        });

        // 初始化气泡
        // const bubbles = Array.from({ length: 8 }, () => ({
        //   x: Math.random() * res[0].width,
        //   y: res[0].height + Math.random() * 50,
        //   radius: Math.random() * 4 + 3,
        //   speed: Math.random() * 0.3 + 0.2,
        // }));

        // this.setData({ bubbles }, () => {
        //   this.liquidCanvasAnimate();
        // });

        this.liquidCanvasAnimate();
      });
  },

  // 设置count值，每次+1都会触发高度变化
  setCount(count: any) {
    const maxHeight = this.data.maxHeight;
    const targetHeight = Math.min((count / 10) * maxHeight, maxHeight);

    this.setData(
      {
        count,
        targetHeight,
      },
      () => {
        // 更新进度文本
        const progress = Math.min(
          100,
          Math.floor((targetHeight / maxHeight) * 100)
        );
        this.setData({
          progressText: count >= 10 ? `填充完成: 100%` : `填充中: ${progress}%`,
        });
      }
    );
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
        // const bubbles = this.data.bubbles;

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

  onUnload() {
    wx.stopAccelerometer(); // 退出页面时停止监听
    if (this.data.animationId) {
      clearTimeout(this.data.animationId);
    }
  },
});
