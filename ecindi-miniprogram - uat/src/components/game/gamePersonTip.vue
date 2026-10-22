<template>
  <div class="game-tip">
    <!-- 个人赛：有排名 -->
    <template v-if="personRankNo">
      <!-- 活动：已完成 -->
      <template v-if="gameStatus === 'Completed'">
        <!-- 活动已完成，并获得勋章 -->
        <div class="game-tip-two" v-if="showMedal.medalName">
          <img
            :src="showMedal.icon"
            alt=""
            class="game-tip-two-icon"
            v-if="showMedal.icon"
          />
          <div class="game-tip-two-box">
            <div class="game-tip-team-2">
              恭喜您在本期赛事排名第{{ personRankNo }}!
            </div>
            <div class="game-tip-my-2">
              勋章【{{ showMedal.medalName }}】已发至你的勋章墙
            </div>
          </div>
        </div>
        <!-- 活动已完成，未获得勋章 -->
        <div class="game-tip-one" v-else>
          <div class="game-tip-team">
            您在本期赛事中排名第{{ personRankNo }}
          </div>
          <div class="game-tip-my">您在本期未取得勋章，下次再接再厉哦~</div>
        </div>
      </template>
      <!-- 活动：进行中/未开始 -->
      <div class="game-tip-one" v-else>
        <div class="game-tip-team">您在当前赛事中排名第{{ personRankNo }}</div>
        <div class="game-tip-my">
          再接再厉，完成更多训练提升名次领专属活动勋章!
        </div>
      </div>
    </template>
    <div v-else class="game-tip-my">您未参与本期赛事</div>
  </div>
</template>

<script>
export default {
  props: {
    personRankNo: {
      type: Number,
      default: 0
    },
    gameStatus: {
      type: String,
      default: ''
    },
    showMedal: {
      type: Object,
      default: () => {}
    }
  }
}
</script>

<style scoped>
.game-tip {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  /* position: fixed;
  bottom: 248rpx;
  z-index: 11; */
  margin-bottom: 44rpx;
}
/* 第一种情况：未结束比赛/比赛结束未或第一 */
.game-tip-one {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.game-tip-team {
  color: #ffffff;
  font-size: 34rpx;
  line-height: 46rpx;
  font-weight: bold;
  margin-bottom: 16rpx;
}
.game-tip-my {
  color: rgba(255, 255, 255, 0.8);
  font-size: 26rpx;
  line-height: 38rpx;
}

/* 第二种情况：获第一 */
.game-tip-two {
  width: calc(100% - 60rpx);
  height: 148rpx;
  display: flex;
  align-items: center;
  border-radius: 74rpx;
  background-image: linear-gradient(
    to right,
    rgba(255, 132, 51, 0.5),
    rgba(255, 132, 51, 0.1)
  );
  position: relative;
  padding-left: 156rpx;
  box-sizing: border-box;
  border: 2rpx solid #ff8433;
  backdrop-filter: blur(20rpx);
}
.game-tip-two-icon {
  width: 156rpx;
  height: 156rpx;
  position: absolute;
  top: 0;
  bottom: 0;
  left: -2rpx;
  margin: auto;
}
.game-tip-two-box {
  display: flex;
  flex-direction: column;
  margin-left: 20rpx;
}
.game-tip-team-2 {
  color: #ffffff;
  font-size: 30rpx;
  line-height: 42rpx;
  font-weight: bold;
  margin-bottom: 8rpx;
}
.game-tip-my-2 {
  color: rgba(255, 255, 255, 0.8);
  font-size: 26rpx;
  line-height: 38rpx;
}
</style>
