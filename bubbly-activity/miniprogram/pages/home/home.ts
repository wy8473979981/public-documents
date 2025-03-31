interface Bubble {
  x: number;
  y: number;
  radius: number;
  speed: number;
  drift: number;
}
Page({
  data: {
    bubbles: [] as Bubble[], // 明确指定类型
    bubbleImg1:
      'https://nav-uat.aia.com.cn/fan/sail/resource/bubblyActivity/images/bubble-1.png',
    bubbleImg2:
      'https://nav-uat.aia.com.cn/fan/sail/resource/bubblyActivity/images/bubble-2.png',
  },
  onLoad() {
    this.initCanvas();
  },
  initCanvas() {
    const query = wx.createSelectorQuery();
    query
      .select('#beerCanvas')
      .fields({ node: true, size: true })
      .exec((res) => {
        if (!res[0] || !res[0].node) return;

        const { bubbleImg1 } = this.data;
        const canvas = res[0].node;
        const ctx = canvas.getContext('2d');
        // 设置 Canvas 尺寸为手机屏幕的宽高
        canvas.width = res[0]?.width;
        canvas.height = res[0]?.height;

        const bubbleImg = canvas.createImage();
        bubbleImg.src = bubbleImg1;

        let bubbles: Bubble[] = []; // 明确指定类型

        const createBubble = () => {
          bubbles.push({
            x: Math.random() * (canvas.width - 20),
            y: canvas.height,
            radius: 4 + Math.random() * 7.5,
            speed: 0.8 + Math.random() * 1.2,
            drift: Math.random() * 2 - 1,
          });
        }

        const drawBubbles = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          bubbles.forEach((bubble) => {
            bubble.y -= bubble.speed;
            bubble.x += Math.sin(bubble.y * 0.03) * bubble.drift;
            bubble.x = Math.max(
              0,
              Math.min(canvas.width - bubble.radius, bubble.x)
            );
          });
          bubbles = bubbles.filter((bubble) => bubble.y + bubble.radius > 0);
          bubbles.forEach((bubble) => {
            ctx.drawImage(
              bubbleImg,
              bubble.x,
              bubble.y,
              bubble.radius,
              bubble.radius
            );
          });
          setTimeout(drawBubbles, 16);
        }

        bubbleImg.onload = () => {
          setInterval(() => createBubble(), 100);
          drawBubbles();
        };
      });
  },
});
