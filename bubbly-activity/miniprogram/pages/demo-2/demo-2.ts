Page({
  data: {
    ball: {
      x: 150, // 初始 x 位置
      y: 300, // 初始 y 位置
      vx: 0,  // x 轴速度
      vy: 0,  // y 轴速度
      radius: 20 // 小球半径
    },
    screenWidth: 0,
    screenHeight: 0
  },

  onLoad() {
    // 获取屏幕宽高
    const res = wx.getSystemInfoSync();
    this.setData({
      screenWidth: res.windowWidth,
      screenHeight: res.windowHeight
    });

    // 监听加速度传感器
    wx.onAccelerometerChange(this.handleAccelerometer);
  },

  handleAccelerometer(acc) {
    let { ball, screenWidth, screenHeight } = this.data;
    let { x, y, vx, vy, radius } = ball;

    // 物理模拟参数
    const friction = 0.98;  // 摩擦力，减少速度
    const accelerationFactor = 3; // 加速度因子

    // 根据加速度更新速度
    vx += -acc.x * accelerationFactor;
    vy += acc.y * accelerationFactor;

    // 更新小球位置
    x += vx;
    y += vy;

    // 碰撞检测（边界反弹）
    if (x <= radius || x >= screenWidth - radius) {
      vx = -vx * friction; // 反弹并减少速度
      x = x <= radius ? radius : screenWidth - radius; // 防止超出边界
    }

    if (y <= radius || y >= screenHeight - radius) {
      vy = -vy * friction;
      y = y <= radius ? radius : screenHeight - radius;
    }

    // 更新数据
    this.setData({
      ball: { x, y, vx: vx * friction, vy: vy * friction, radius }
    });
  },

  onUnload() {
    // 取消监听加速度传感器
    wx.offAccelerometerChange();
  }
});
