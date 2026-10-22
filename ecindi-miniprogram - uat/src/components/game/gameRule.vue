<template>
  <div class="rule-page" v-if="showPopup">
    <nav-bar
      :navOption="{
        navTitle: navTitle,
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
    <div class="rule-page-box">
      <div class="rule-page-title">记分规则</div>
      <div class="rule-page-sub-title">分值公式:</div>
      <div class="rule-page-text" v-if="gameType === 1">网点分=Avg(个人分)</div>
      <div class="rule-page-text">
        个人分=Sum(邀约成功率对应分值*邀约成功率)
      </div>
      <div class="rule-page-sub-title">邀约成功率对应分值为:</div>
      <div class="rule-page-item-box">
        <div
          class="rule-page-item"
          v-for="(item, index) in ruleList"
          :key="index"
        >
          <div class="rule-page-item-label">{{ item.label }}</div>
          <div class="rule-page-item-value">{{ item.value }}</div>
        </div>
      </div>
      <div class="rule-page-butt" @click="close">知道了</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    navTitle: {
      type: String,
      default: ''
    },
    gameType: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      navigationHeight: '', //导航栏高度
      showPopup: false,
      ruleList: [
        {
          label: '80%及以上',
          value: '+10分'
        },
        {
          label: '60%（包含）~ 80%',
          value: '+6分'
        },
        {
          label: '20% ~ 60%',
          value: '+3分'
        },
        {
          label: '20%及以下',
          value: '+1分'
        }
      ]
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
    open() {
      this.showPopup = true
    },
    close() {
      this.showPopup = false
    }
  }
}
</script>
<style scoped>
.rule-page {
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.95);
  position: fixed;
  z-index: 99;
  top: 0;
  left: 0;
  overflow-y: auto;
}
.rule-page-box {
  width: 100%;
  padding-bottom: 210rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.rule-page-title {
  margin-top: 80rpx;
  color: #ffffff;
  font-size: 52rpx;
  line-height: 80rpx;
}
.rule-page-sub-title {
  color: #ffffff;
  font-size: 28rpx;
  line-height: 40rpx;
  margin-bottom: 40rpx;
  margin-top: 80rpx;
}
.rule-page-text {
  font-size: 28rpx;
  line-height: 48rpx;
  color: rgba(255, 255, 255, 0.8);
}

.rule-page-item-box {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0 30rpx;
  box-sizing: border-box;
}
.rule-page-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 74rpx;
  border-radius: 40rpx;
  background-image: linear-gradient(
    to right,
    rgba(255, 132, 51, 0.2),
    rgba(255, 132, 51, 0)
  );
  padding: 0 40rpx;
  box-sizing: border-box;
  margin-bottom: 16rpx;
}
.rule-page-item-label {
  color: #ffffff;
  font-size: 28rpx;
  line-height: 40rpx;
}
.rule-page-item-value {
  color: #ff8433;
  font-size: 28rpx;
  line-height: 40rpx;
}

.rule-page-butt {
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
