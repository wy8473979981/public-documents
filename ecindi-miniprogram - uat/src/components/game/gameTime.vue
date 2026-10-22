<template>
  <div class="game-time">
    <div class="game-time-box">
      <div class="game-time-tips" v-if="gameStatus === 'NotStarted'">
        赛事未开始
      </div>
      <template v-if="gameStatus === 'InProgress'">
        <div class="game-time-title">榜单截止倒计时</div>
        <div class="game-time-right">
          <div class="game-time-right-num">{{ showDay }}</div>
          <div class="game-time-right-text">天</div>
          <div class="game-time-right-num">{{ showHour }}</div>
          <div class="game-time-right-text">时</div>
          <div class="game-time-right-num">{{ showMinute }}</div>
          <div class="game-time-right-text">分</div>
          <div class="game-time-right-num">{{ showSecond }}</div>
          <div class="game-time-right-text">秒</div>
        </div>
      </template>
      <div class="game-time-tips" v-if="gameStatus === 'Completed'">
        赛事已结束
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    gameStatus: {
      type: String,
      default: ''
    },
    showDay: {
      type: String,
      default: ''
    },
    showHour: {
      type: String,
      default: ''
    },
    showMinute: {
      type: String,
      default: ''
    },
    showSecond: {
      type: String,
      default: ''
    }
  },
  watch: {
    showDay(newVal, oldVal) {
      this.showDay = newVal
    },
    showHour(newVal, oldVal) {
      this.showHour = newVal
    },
    showMinute(newVal, oldVal) {
      this.showMinute = newVal
    },
    showSecond(newVal, oldVal) {
      this.showSecond = newVal
    }
  }
}
</script>

<style scoped>
.game-time {
  width: 100%;
  display: flex;
  justify-content: center;
  margin: 40rpx 0;
}
.game-time-box {
  width: calc(100% - 60rpx);
  height: 96rpx;
  border-radius: 20rpx;
  background-color: rgba(0, 0, 0, 0.2);
  border: 1rpx solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20rpx;
  box-sizing: border-box;
}
.game-time-title {
  color: #fff;
  font-size: 30rpx;
}
.game-time-right {
  display: flex;
  align-items: center;
}
.game-time-right-num {
  padding: 4rpx 10rpx;
  background-color: #f32159;
  border-radius: 8rpx;
  font-weight: bold;
  font-size: 30rpx;
  color: #fff;
  margin-left: 8rpx;
}
.game-time-right-text {
  color: #fff;
  font-size: 30rpx;
  margin-left: 8rpx;
}

.game-time-tips {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 30rpx;
}
</style>
