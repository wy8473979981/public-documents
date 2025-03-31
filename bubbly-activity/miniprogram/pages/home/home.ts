// import { postRequest } from '../../utils/request.js';
import { delayFn } from '../../utils/index';

interface Bubble {
  x: number;
  y: number;
  radius: number;
  speed: number;
  drift: number;
  img: number;
}

Page({
  data: {
    bubbles: [] as Bubble[],
    bubbleImg1:
      'https://nav-uat.aia.com.cn/fan/sail/resource/bubblyActivity/images/bubbly-1.png',
    bubbleImg2:
      'https://nav-uat.aia.com.cn/fan/sail/resource/bubblyActivity/images/bubbly-2.png',
  },
  touchTimer: 0,
  drawBubblesTimer: 0,
  createBubbleTimer: 0,
  pollingTimer: 0,

  onLoad() {
    this.initCanvas();
    this.pollingInterface();
  },
  onUnload() {
    clearTimeout(this.touchTimer);
    clearTimeout(this.drawBubblesTimer);
    clearInterval(this.createBubbleTimer);
    clearInterval(this.pollingTimer);
  },
  pollingInterface() {
    const poll = async () => {
      try {
        await delayFn(1000);
        console.log(111);
        
        // 实际业务逻辑
      } catch (error) {
        console.error('Polling error:', error);
      }
    };

    poll();
    this.pollingTimer = setInterval(poll, 4000);
  },

  initCanvas() {
    const query = wx.createSelectorQuery();
    query
      .select('#beerCanvas')
      .fields({ node: true, size: true })
      .exec((res) => {
        if (!res[0] || !res[0].node) return;

        const { bubbleImg1, bubbleImg2 } = this.data;
        const canvas = res[0].node;
        const ctx = canvas.getContext('2d');

        canvas.width = res[0]?.width;
        canvas.height = res[0]?.height;

        const bubbleImage1 = canvas.createImage();
        const bubbleImage2 = canvas.createImage();
        bubbleImage1.src = bubbleImg1;
        bubbleImage2.src = bubbleImg2;

        const createBubble = () => {
          const { bubbles } = this.data;
          const newBubble: Bubble = {
            x: Math.random() * (canvas.width - 20),
            y: canvas.height,
            radius: 4 + Math.random() * 7.5,
            speed: 0.8 + Math.random() * 1.2,
            drift: Math.random() * 2 - 1,
            img: 1,
          };
          this.setData({
            bubbles: [...bubbles, newBubble],
          });
        };

        const drawBubbles = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          const { bubbles } = this.data;

          bubbles.forEach((bubble) => {
            bubble.y -= bubble.speed;
            bubble.x += Math.sin(bubble.y * 0.03) * bubble.drift;
            bubble.x = Math.max(
              0,
              Math.min(canvas.width - bubble.radius, bubble.x)
            );
          });

          const newBubbles = bubbles.filter(
            (bubble) => bubble.y + bubble.radius > 0
          );
          this.setData({ bubbles: newBubbles });

          newBubbles.forEach((bubble) => {
            const bubbleImage = bubble.img === 1 ? bubbleImage1 : bubbleImage2;
            ctx.drawImage(
              bubbleImage,
              bubble.x,
              bubble.y,
              bubble.radius,
              bubble.radius
            );
          });

          if (bubbles.length <= 0) {
            clearTimeout(this.drawBubblesTimer);
          }

          this.drawBubblesTimer = setTimeout(drawBubbles, 16);
        };

        bubbleImage1.onload = () => {
          this.createBubbleTimer = setInterval(() => createBubble(), 100);
          drawBubbles();
        };
      });
  },

  /** 处理触摸开始 */
  onTouchStart(event: any) {
    const { pageX, pageY } = event.touches[0];

    // 先生成一个泡泡
    this.createBubble(pageX, pageY);

    // 启动定时器，持续生成气泡
    this.touchTimer = setInterval(() => {
      this.createBubble(pageX, pageY);
    }, 50); // 每 100ms 生成一个气泡
  },

  /** 处理触摸结束 */
  onTouchEnd() {
    if (this.touchTimer) {
      clearInterval(this.touchTimer);
    }
  },

  /** 创建气泡 */
  createBubble(x: number, y: number) {
    const { bubbles } = this.data;
    const newBubble: Bubble = {
      x,
      y,
      radius: 4 + Math.random() * 7.5,
      speed: 0.8 + Math.random() * 1.2,
      drift: Math.random() * 2 - 1,
      img: 2, // 随机使用两种泡泡图片
    };

    this.setData({
      bubbles: [...bubbles, newBubble],
    });
  },
});
