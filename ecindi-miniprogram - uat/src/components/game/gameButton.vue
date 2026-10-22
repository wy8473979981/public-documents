<template>
  <div class="game-button">
    <div
      class="game-button-one"
      v-if="gameStatus !== 'Completed'"
      @click="goChatInvite"
    >
      立即训练提升排名
    </div>
    <div class="game-button-two" v-if="gameStatus === 'Completed'">
      本期赛事已结束
    </div>
  </div>
</template>

<script>
export default {
  props: {
    gameStatus: {
      type: String,
      default: ''
    }
  },
  methods: {
    goChatInvite() {
      uni.navigateTo({
        url: '/pages/training/targeted'
      })
    }
  }
}
</script>

<style scoped>
.game-button {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  /* position: fixed;
  bottom: 96rpx;
  z-index: 11; */
}
.game-button-one {
  width: calc(100% - 96rpx);
  height: 112rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 38rpx;
  border-radius: 56rpx;
  background-image: linear-gradient(to right, #ed171f, #ff8433);
}
.game-button-two {
  width: calc(100% - 96rpx);
  height: 112rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.5);
  font-size: 38rpx;
  border-radius: 56rpx;
  background-image: linear-gradient(
    to right,
    rgba(237, 23, 31, 0.5),
    rgba(255, 132, 51, 0.5)
  );
}
</style>
