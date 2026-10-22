<template>
  <div class="game-medal">
    <nav-bar
      :navOption="{
        navTitle:
          newUserMedal.game && newUserMedal.game.gameName
            ? newUserMedal.game.gameName
            : '',
        backgroundColor: '',
        hasPlaceholder: false,
        showBackTip: false,
        color: '#fff'
      }"
    ></nav-bar>
    <div
      :style="{
        height: navigationHeight + 'px'
      }"
    ></div>
    <div class="game-medal-content">
      <div class="game-medal-title">恭喜你</div>
      <div class="game-medal-title">获得一枚新的勋章</div>
      <div class="game-medal-box">
        <img
          src="https://cdn.edesoft.com/cindi/upload/202405/27/046427.png"
          alt=""
          srcset=""
          class="game-medal-celebrate"
        />
        <img
          :src="newUserMedal.medal.icon"
          alt=""
          srcset=""
          class="game-medal-icon"
          v-if="newUserMedal && newUserMedal.medal && newUserMedal.medal.icon"
        />
      </div>
      <div
        class="game-medal-name"
        v-if="
          newUserMedal && newUserMedal.medal && newUserMedal.medal.medalName
        "
      >
        【{{ newUserMedal.medal.medalName }}】
      </div>
      <div class="game-medal-text" v-if="newUserMedal.game">
        您因于{{ mapDate(newUserMedal.game.openDate) }}至{{
          mapDate(newUserMedal.game.closeDate, 'MM月DD日')
        }}的【{{ newUserMedal.game.gameName || '' }}】中，{{
          newUserMedal.reason || ''
        }}！
      </div>
      <div class="game-medal-butt" @click="knowForMedal">知道了</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    newUserMedal: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      navigationHeight: '' //导航栏高度
    }
  },
  mounted() {
    this.getSystemInfo()
  },
  methods: {
    getSystemInfo() {
      const app = getApp()
      this.navigationHeight = app.globalData.customBar
    },
    knowForMedal() {
      this.$emit('knowForMedal', this.newUserMedal.id)
    },
    mapDate(date, format = 'YYYY年MM月DD日') {
      if (!date) return ''
      return this.$dayjs(date).format(format)
    }
  }
}
</script>

<style scoped>
.game-medal {
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.95);
  position: fixed;
  z-index: 99;
  top: 0;
  left: 0;
  overflow-y: auto;
}
.game-medal-content {
  width: 100%;
  padding-top: 80rpx;
  padding-bottom: 96rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.game-medal-title {
  color: #fff;
  font-size: 52rpx;
  line-height: 80rpx;
}
.game-medal-box {
  position: relative;
  width: calc(100% - 40rpx);
  height: 480rpx;
  margin: 80rpx 0;
}
.game-medal-celebrate {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  z-index: 1;
}
.game-medal-icon {
  width: 400rpx;
  height: 400rpx;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  z-index: 2;
}
.game-medal-name {
  color: #ffffff;
  font-size: 38rpx;
  margin-bottom: 24rpx;
}
.game-medal-text {
  width: 100%;
  padding: 0 48rpx;
  box-sizing: border-box;
  opacity: 0.8;
  color: #ffffff;
  font-size: 30rpx;
  line-height: 42rpx;
  margin-bottom: 160rpx;
  text-align: center;
}
.game-medal-butt {
  width: calc(100% - 96rpx);
  height: 112rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 56rpx;
  background-color: #ed171f;
  color: #ffffff;
  font-size: 38rpx;
  position: fixed;
  bottom: 96rpx;
  left: 48rpx;
}
</style>
