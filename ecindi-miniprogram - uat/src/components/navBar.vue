<template>
  <!-- 自定义导航栏 -->
  <view>
    <view
      class="nav-bar-page"
      :style="{
        backgroundColor: params.backgroundColor
          ? params.backgroundColor
          : 'transparent'
      }"
    >
      <view :style="{ height: statusBarHeight + 'px' }"></view>
      <view
        class="nav-bar-custom-bar"
        :style="{ height: navigationHeight - statusBarHeight + 'px' }"
      >
        <view class="nav-bar-custom-bar-back">
          <image
            v-if="params.showBackTip"
            src="../static/icons/back.png"
            mode=""
            class="nav-bar-custom-bar-back-img"
            @click="navigateBack"
          ></image>
        </view>
        <view class="nav-bar-custom-bar-title">
          <view
            class="nav-bar-custom-bar-title-text"
            :style="{ color: params.color }"
            >{{ params.navTitle }}</view
          >
        </view>
        <view class="nav-bar-custom-right">
          <view class="nav-bar-custom-bar-text"></view>
        </view>
      </view>
    </view>
    <view
      v-if="params.hasPlaceholder"
      class="nav-zhanwei"
      :style="{
        height: navigationHeight + 'px'
      }"
    ></view>
  </view>
</template>
<script>
export default {
  name: 'customNav',
  data() {
    return {
      statusBarHeight: '', //状态栏高度
      navigationHeight: '' //导航栏高度
    }
  },
  props: {
    navOption: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  computed: {
    params() {
      return Object.assign(
        {
          navTitle: '',
          backgroundColor: '',
          hasPlaceholder: true,
          showBackTip: true,
          color: '#000000'
        },
        this.navOption
      )
    }
  },
  mounted() {
    this.getSystemInfo()
  },
  methods: {
    navigateBack() {
      this.$emit('navigateBack')
    },
    getSystemInfo() {
      const app = getApp()
      this.statusBarHeight = app.globalData.statusBar
      this.navigationHeight = app.globalData.customBar
    }
  }
}
</script>
<style>
.nav-zhanwei {
  z-index: 1;
}
.nav-bar-page {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 99;
  overflow: hidden;
}
.nav-bar-custom-bar {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 25rpx;
  box-sizing: border-box;
}
.nav-bar-custom-bar-back {
  width: 30rpx;
  height: 60rpx;
}
.nav-bar-custom-bar-back-img {
  width: 100%;
  height: 100%;
}
.nav-bar-custom-bar-title-text {
  font-size: 32rpx;
  color: #ffffff;
}
.nav-bar-custom-right {
  min-width: 40rpx;
  min-height: 40rpx;
}
</style>
