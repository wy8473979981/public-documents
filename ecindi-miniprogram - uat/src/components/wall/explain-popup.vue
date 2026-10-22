<template>
  <div class="explain-popup-box" v-if="show">
    <div class="explain-popup-title">最高达成成绩</div>
    <div class="explain-popup-text">
      已解锁客户的最高邀约成功概率对应星星的获取数量，不同客户的训练难度不同，因此不同客户的最高邀约成功概率所对应的星星数量不同，每个客户最多可获取5颗星星。
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      show: false,
      timer: null,
      timeSecond: 5000
    }
  },
  methods: {
    open() {
      if (this.show) return
      this.show = true
      this.openTimer()
    },
    close() {
      this.show = false
      this.closeTimer()
    },
    openTimer() {
      this.closeTimer()
      setTimeout(() => {
        this.close()
      }, this.timeSecond)
    },
    closeTimer() {
      if (this.timer) clearTime
    }
  }
}
</script>

<style scoped>
.explain-popup-box {
  position: fixed;
  z-index: 222;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 482rpx;
  height: 280rpx;
  background-color: rgba(0, 0, 0, 0.9);
  border-radius: 32rpx;
  padding: 0 32rpx;
}
.explain-popup-title {
  color: #ffffff;
  font-size: 26rpx;
  line-height: 38rpx;
  margin-top: 40rpx;
  margin-bottom: 16rpx;
}
.explain-popup-text {
  color: rgba(255, 255, 255, 0.8);
  font-size: 22rpx;
  line-height: 34rpx;
  margin-bottom: 48rpx;
  text-align: center;
}
</style>
