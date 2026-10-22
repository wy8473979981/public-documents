<template>
  <div class="game-tip">
    <!-- 网点赛：网点有排名 -->
    <template v-if="teamRankNo">
      <!-- 活动：已完成 -->
      <template v-if="gameStatus === 'Completed'">
        <!-- 网点排名第一 -->
        <div class="game-tip-two" v-if="teamRankNo === 1">
          <img
            src="https://cdn.edesoft.com/cindi/upload/202403/13/825948.png"
            alt=""
            class="game-tip-two-icon"
          />
          <div class="game-tip-two-box">
            <div class="game-tip-team-2">
              恭喜您所在网点本期赛事排名第{{ teamRankNo }}!
            </div>
            <div v-if="personRankNo" class="game-tip-my-2">
              您在网点内当前个人排名第{{ personRankNo }}哦~
            </div>
            <div v-else class="game-tip-my-2">您未参与本期赛事</div>
          </div>
        </div>
        <!-- 网点其他排名 -->
        <div class="game-tip-one" v-else>
          <div class="game-tip-team">
            您所在网点本期赛事排名第{{ teamRankNo }}
          </div>
          <div v-if="personRankNo" class="game-tip-my">
            您在网点内本期个人排名第{{ personRankNo }} ，下期继续加油哦~
          </div>
          <div v-else class="game-tip-my">您未参与本期赛事</div>
        </div>
      </template>
      <!-- 活动：未开始/进行中 -->
      <div class="game-tip-one" v-else>
        <div class="game-tip-team">您所在的网点当前排名第{{ teamRankNo }}</div>
        <div v-if="personRankNo" class="game-tip-my">
          您在网点内当前个人排名第{{ personRankNo }} ，继续加油哦~
        </div>
        <div v-else class="game-tip-my">您未参与本期赛事</div>
      </div>
    </template>
    <div v-else class="game-tip-team-2">您所在的网点未参与本期赛事</div>
  </div>
</template>

<script>
export default {
  props: {
    teamRankNo: {
      type: Number,
      default: 0
    },
    personRankNo: {
      type: Number,
      default: 0
    },
    gameStatus: {
      type: String,
      default: ''
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
