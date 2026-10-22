<template>
  <!-- 比赛：网点的tab -->
  <div class="game-tab">
    <div
      v-for="(item, index) in tabList"
      :key="index"
      class="game-tab-item"
      :class="[tabIndex === index ? 'game-tab-item-active' : '']"
      @click.stop="changeTab(index)"
    >
      {{ item }}
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tabList: ['网点排行榜', '队内个人排行榜']
    }
  },
  props: {
    tabIndex: {
      type: Number,
      default: 0
    }
  },
  methods: {
    async changeTab(index) {
      this.$emit('changeTab', index)
    }
  }
}
</script>

<style scoped>
.game-tab {
  width: calc(100% - 32rpx);
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 40rpx;
  box-sizing: border-box;
  background-color: rgba(10, 11, 12, 0.8);
  border: 1rpx solid rgba(255, 255, 255, 0.2);
  margin: 0 auto 40rpx;
}
.game-tab-item {
  width: calc(50% - 8rpx);
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #f32159;
  font-size: 34rpx;
  border-radius: 32rpx;
}
.game-tab-item-active {
  background-image: linear-gradient(to right, #f32159, #f15116, #f15116);
  font-weight: bold;
  color: #fff;
  border-radius: 32rpx;
}
</style>
