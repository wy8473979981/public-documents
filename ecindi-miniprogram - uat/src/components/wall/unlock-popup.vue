<template>
  <div class="unlock-popup-box" v-if="show">
    <img
      src="/static/wall/tips.png"
      alt=""
      srcset=""
      class="unlock-popup-img"
    />
    <div class="unlock-popup-text">已解锁新客户</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      show: false,
      timer: null,
      timeSecond: 3000
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
.unlock-popup-box {
  position: fixed;
  z-index: 222;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 358rpx;
  height: 112rpx;
  background-color: rgba(0, 0, 0, 0.9);
  border-radius: 32rpx;
  padding: 0 32rpx;
}
.unlock-popup-img {
  width: 32rpx;
  height: 32rpx;
  margin-right: 16rpx;
}
.unlock-popup-text {
  color: #fff;
  font-size: 30rpx;
}
</style>
