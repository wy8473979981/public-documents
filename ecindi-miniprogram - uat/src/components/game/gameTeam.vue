<template>
  <!-- 比赛：网点排名 -->
  <div class="game-team">
    <div class="game-team-header">
      <div class="game-team-header-text one-width">排名</div>
      <div
        class="game-team-header-text two-width"
        style="justify-content: flex-start"
      >
        网点
      </div>
      <div class="game-team-header-text three-width">队内个人最高分</div>
      <div class="game-team-header-text three-width">队内个人最低分</div>
      <div class="game-team-header-text four-width" @click="goRulePage">
        <span class="game-team-header-total">网点总分</span>
        <img
          src="https://cdn.edesoft.com/cindi/upload/202405/27/871804.png"
          alt=""
          class="game-team-header-icon"
        />
      </div>
    </div>
    <div class="game-team-list">
      <div
        class="game-team-list-item"
        :class="[
          item.rankNo === 1 ? 'game-team-list-item-one' : '',
          getAddClass(item)
        ]"
        v-for="(item, index) in teamList"
        :key="index"
      >
        <!-- 活动结束：本网点第一名 -->
        <template v-if="showFirstIcon(item)">
          <img
            src="https://cdn.edesoft.com/cindi/upload/202403/13/185941.png"
            alt=""
            srcset=""
            class="game-team-list-item-first"
          />
        </template>
        <template v-else>
          <img
            :src="getRankNoIcon(item.rankNo)"
            alt=""
            srcset=""
            class="game-team-list-item-default-icon one-width"
          />
          <div class="game-team-list-item-default-text one-width">
            <div class="game-team-list-item-default-text-num">
              {{ item.rankNo }}
            </div>
          </div>
        </template>

        <div class="one-width"></div>
        <div class="game-team-list-item-text1 two-width">
          {{ item.orgName }}
        </div>
        <div class="game-team-list-item-text2 three-width">
          {{ item.maxScore }}
        </div>
        <div class="game-team-list-item-text2 three-width">
          {{ item.minScore }}
        </div>
        <div class="game-team-list-item-text3 four-width">
          {{ item.avgScore }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    teamList: {
      type: Array,
      default: () => []
    },
    orgID: {
      type: Number,
      default: 0
    },
    rankNo: {
      type: Number,
      default: 0
    },
    gameStatus: {
      type: String,
      default: ''
    }
  },
  methods: {
    goRulePage() {
      this.$emit('goRulePage')
    },
    getAddClass(item) {
      if (
        item.rankNo === 1 &&
        item.rankNo === this.rankNo &&
        item.orgID === this.orgID
      ) {
        return 'game-team-list-item-active-one'
      }
      if (item.rankNo === this.rankNo && item.orgID === this.orgID) {
        return 'game-team-list-item-active'
      }
      return ''
    },
    getRankNoIcon(rankNo) {
      if (rankNo === 1) {
        return 'https://cdn.edesoft.com/cindi/upload/202405/27/397023.png'
      }
      return 'https://cdn.edesoft.com/cindi/upload/202405/27/115187.png'
    },
    // 显示冠军奖杯
    showFirstIcon(item) {
      let isOk =
        this.gameStatus === 'Completed' &&
        item.rankNo === 1 &&
        this.rankNo === item.rankNo &&
        this.orgID === item.orgID
      if (isOk) return true
      else return false
    }
  }
}
</script>

<style scoped>
.game-team {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 24rpx;
  box-sizing: border-box;
}
.one-width {
  width: 76rpx;
}
.two-width {
  flex: 1;
}
.three-width {
  width: 24%;
}
.four-width {
  width: 18%;
}

/* 标题 */
.game-team-header {
  width: 100%;
  height: 56rpx;
  display: flex;
  align-items: center;
  border-radius: 32rpx;
  background-image: linear-gradient(to right, #f32159, #f15116);
  margin-bottom: 16rpx;
}

.game-team-header-text {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 22rpx;
}
.game-team-header-icon {
  width: 24rpx;
  height: 24rpx;
  margin: 0 4rpx;
}
.game-team-header-total {
  font-weight: 800;
}

/* 列表 */
.game-team-list {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.game-team-list-item {
  margin-bottom: 16rpx;
  display: flex;
  align-items: center;
  width: 100%;
  border-radius: 20rpx;
  background-image: linear-gradient(
    to right,
    rgba(243, 33, 89, 0.5),
    rgba(243, 33, 89, 0.1)
  );
  /* padding: 30rpx 0; */
  min-height: 144rpx;
  position: relative;
  box-sizing: border-box;
}
.game-team-list-item-first {
  position: absolute;
  top: 10rpx;
  left: -20rpx;
  width: 96rpx;
  height: 96rpx;
  z-index: 11;
}

/* 左边序号 */
.game-team-list-item-default-icon {
  position: absolute;
  top: 0;
  left: 0;
  height: 52rpx;
  z-index: 1;
}
.game-team-list-item-default-text {
  position: absolute;
  top: 0;
  left: 0;
  height: 52rpx;
  z-index: 2;
  color: #ffffff;
  font-size: 34rpx;
  font-weight: bold;
}
.game-team-list-item-default-text-num {
  display: flex;
  align-items: center;
  justify-content: center;
}
/* 右边分数 */
.game-team-list-item-text1 {
  color: #ffffff;
  font-size: 30rpx;
  font-weight: bold;
}
.game-team-list-item-text2 {
  color: rgba(255, 255, 255, 0.75);
  font-size: 34rpx;
  display: flex;
  justify-content: center;
}
.game-team-list-item-text3 {
  color: #ffffff;
  font-size: 34rpx;
  font-weight: bold;
  display: flex;
  justify-content: center;
}

/* 网点是第一名 */
.game-team-list-item-one {
  background-image: linear-gradient(
    to right,
    rgba(255, 132, 51, 0.5),
    rgba(255, 132, 51, 0.5)
  );
}
.game-team-list-item-active-one {
  border: 4rpx solid #ff8433;
}
.game-team-list-item-active {
  border: 4rpx solid #f32159;
}
</style>
