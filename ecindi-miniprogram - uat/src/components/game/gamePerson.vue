<template>
  <!-- 比赛：个人排名 -->
  <div class="game-person">
    <div class="game-person-header">
      <div class="game-person-header-text one-width">排名</div>
      <div
        class="game-person-header-text two-width"
        style="justify-content: flex-start"
      >
        个人昵称
      </div>
      <div class="game-person-header-text three-width">训练次数</div>
      <div class="game-person-header-text four-width" @click="goRulePage">
        <span>个人分</span>
        <img
          src="https://cdn.edesoft.com/cindi/upload/202405/27/871804.png"
          alt=""
          class="game-person-header-icon"
        />
      </div>
    </div>
    <div class="game-person-list">
      <div
        class="game-person-list-item"
        :class="[
          getRankTeamClass(item),
          item.rankNo === 1 && gameType === 0
            ? 'game-person-list-item-one'
            : '',
          getRankPersonClass(item)
        ]"
        v-for="(item, index) in personList"
        :key="index"
      >
        <img
          :src="getRankNoIcon(item.rankNo)"
          alt=""
          srcset=""
          class="game-person-list-item-default-icon one-width"
        />
        <div class="game-person-list-item-default-text one-width">
          <div class="game-person-list-item-default-text-num">
            {{ item.rankNo }}
          </div>
        </div>
        <div class="one-width"></div>
        <div class="two-width">
          <div class="game-person-list-item-text1">
            {{ item.nickName || item.userName }}
          </div>
          <div class="game-person-list-item-text4">{{ item.orgName }}</div>
        </div>
        <div class="game-person-list-item-text2 three-width">
          {{ item.times }}
        </div>
        <div
          class="game-person-list-item-text3 four-width"
          :style="{
            justifyContent:
              gameType === 0 && medalsList.length > 0 ? 'flex-end' : 'center'
          }"
        >
          <span>{{ item.userScore }}</span>
          <div
            class="game-person-list-item-icon-box"
            v-if="gameType === 0 && medalsList.length > 0"
          >
            <img
              :src="getShowMedalIcon(item)"
              alt=""
              srcset=""
              class="game-person-list-item-icon"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    personList: {
      type: Array,
      default: () => []
    },
    rankNo: {
      type: Number,
      default: 0
    },
    gameType: {
      type: Number,
      default: 0
    },
    userID: {
      type: Number,
      default: 0
    },
    medalsList: {
      type: Array,
      default: () => []
    },
    isGrantCalculated: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    topX() {
      const ok = this.medalsList && this.medalsList.length
      if (!ok) return 0

      return parseInt(this.medalsList[0].x) || 0
    }
  },
  methods: {
    goRulePage() {
      this.$emit('goRulePage')
    },
    getRankTeamClass(item) {
      // 网点赛的个人排行榜
      if (
        this.gameType === 1 &&
        item.rankNo === this.rankNo &&
        this.userID === item.userID
      ) {
        return 'game-person-list-item-active'
      }
      return ''
    },
    getRankPersonClass(item) {
      // 个人赛的个人排行榜
      // if (this.gameType !== 0) return ''

      if (
        this.gameType === 0 &&
        item.rankNo === 1 &&
        item.rankNo === this.rankNo &&
        item.userID === this.userID
      ) {
        return 'game-person-list-item-one'
      }

      if (
        this.gameType === 0 &&
        item.rankNo <= this.topX &&
        item.rankNo === this.rankNo &&
        item.userID === this.userID
      ) {
        return 'game-person-list-item-active'
      }
      if (
        this.gameType === 0 &&
        item.rankNo > this.topX &&
        item.rankNo <= 20 &&
        item.rankNo === this.rankNo &&
        item.userID === this.userID
      ) {
        return 'game-person-list-item-active-2'
      }
      if (
        this.gameType === 0 &&
        item.rankNo > 20 &&
        item.rankNo === this.rankNo &&
        item.userID === this.userID
      ) {
        return 'game-person-list-item-active-2 game-person-list-item-mar-top'
      }
      return ''
    },
    getRankNoIcon(rankNo) {
      // 网点赛的个人排行榜
      if (this.gameType === 1) {
        return 'https://cdn.edesoft.com/cindi/upload/202405/27/115187.png'
      }

      // 个人赛的个人排行榜

      if (rankNo === 1) {
        return 'https://cdn.edesoft.com/cindi/upload/202405/27/397023.png'
      }

      if (rankNo <= this.topX) {
        return 'https://cdn.edesoft.com/cindi/upload/202405/27/115187.png'
      }

      return 'https://cdn.edesoft.com/cindi/upload/202405/27/893185.png'
    },
    getShowMedalIcon(item) {
      let iconUrl = ''
      this.medalsList.forEach((utem) => {
        if (item.rankNo <= Number(utem.x)) {
          if (this.isGrantCalculated) {
            iconUrl = utem.medal.icon
          } else {
            iconUrl = utem.medal.grayIcon
          }
        }
      })
      return iconUrl
    }
  }
}
</script>

<style scoped>
.game-person {
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
  width: 19%;
}
.four-width {
  width: 24%;
}

/* 标题 */
.game-person-header {
  width: 100%;
  height: 56rpx;
  display: flex;
  align-items: center;
  border-radius: 32rpx;
  background-image: linear-gradient(to right, #f32159, #f15116);
  margin-bottom: 16rpx;
  padding-right: 16rpx;
  box-sizing: border-box;
}

.game-person-header-text {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 22rpx;
}
.game-person-header-icon {
  width: 24rpx;
  height: 24rpx;
  margin-left: 8rpx;
}

/* 列表 */
.game-person-list {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.game-person-list-item {
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
  padding-right: 16rpx;
  position: relative;
  box-sizing: border-box;
}
.game-person-list-item-active {
  border: 4rpx solid #f32159;
}
/* 个人是第一名 */
.game-person-list-item-one {
  background-image: linear-gradient(
    to right,
    rgba(255, 132, 51, 0.5),
    rgba(255, 132, 51, 0.5)
  );
}
/* 第一名 */
.game-person-list-item-active-one {
  border: 4rpx solid #ff8433;
}
/* 2~10名 */
.game-person-list-item-active {
  border: 4rpx solid #f32159;
}
/* 10名之后 */
.game-person-list-item-active-2 {
  border: 4rpx solid #727272;
}
/* 20名之后 */
.game-person-list-item-mar-top {
  margin-top: 32rpx;
}

/* 左边序号 */
.game-person-list-item-default-icon {
  position: absolute;
  top: 0;
  left: 0;
  height: 52rpx;
  z-index: 1;
}
.game-person-list-item-default-text {
  position: absolute;
  top: 0;
  left: 0;
  height: 52rpx;
  z-index: 2;
  color: #ffffff;
  font-size: 34rpx;
  font-weight: bold;
}
.game-person-list-item-default-text-num {
  display: flex;
  align-items: center;
  justify-content: center;
}
/* 右边分数 */
.game-person-list-item-text1 {
  color: #ffffff;
  font-size: 30rpx;
  line-height: 42rpx;
  font-weight: bold;
}
.game-person-list-item-text2 {
  color: rgba(255, 255, 255, 0.75);
  font-size: 34rpx;
  display: flex;
  justify-content: center;
}
.game-person-list-item-text3 {
  color: #ffffff;
  font-size: 34rpx;
  font-weight: bold;
  display: flex;
  /* justify-content: flex-end; */
  align-items: center;
}
.game-person-list-item-text4 {
  margin-top: 4rpx;
  line-height: 36rpx;
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.8);
}
.game-person-list-item-icon-box {
  margin-left: 12rpx;
  width: 64rpx;
  height: 64rpx;
}
.game-person-list-item-icon {
  width: 64rpx;
  height: 64rpx;
}
</style>
