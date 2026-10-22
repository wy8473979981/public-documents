<template>
  <div>
    <nav-bar :navOption="navOption"></nav-bar>
    <!-- 背景图 -->
    <bg-image src="/static/icons/bg.jpeg"></bg-image>
    <div class="login-fixed">
      <div class="login-content">
        <img
          src="../../static/icons/2132975495.png"
          alt=""
          class="login-logo"
        />
        <div class="login-name">您口袋里的训练帮手</div>
        <div class="feature-list">
          <div class="feature-item">
            <div class="dot"></div>
            <span>多种客户类型</span>
          </div>
          <div class="feature-item">
            <div class="dot"></div>
            <span>覆盖多种业务场景</span>
          </div>
          <div class="feature-item">
            <div class="dot"></div>
            <span>随时随地即可开展训练</span>
          </div>
        </div>
      </div>
    </div>
    <img
      src="https://cdn.edesoft.com/cindi/upload/202405/27/999826.png"
      alt=""
      srcset=""
      class="login-img"
    />
  </div>
</template>

<script>
import pageCommon from '@/mixins/page.common.js'
export default {
  mixins: [pageCommon],
  data() {
    return {
      navOption: {
        navTitle: 'AI对练工具',
        backgroundColor: '',
        hasPlaceholder: true,
        showBackTip: false,
        color: '#fff'
      },
      timeSecond: 3000
    }
  },
  async onShow() {
    let timer = setTimeout(async () => {
      await this.$store.dispatch('root/setInitWelcome', true)
      await this.checkLoginForWelcome()
      if (timer) clearTimeout(timer)
    }, this.timeSecond)
  }
}
</script>

<style scoped>
.login-fixed {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  margin: auto;
  z-index: 1;
  width: 100vw;
  height: calc(100vh - 288rpx);
}
.login-content {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.login-logo {
  width: 474rpx;
  height: 96rpx;
  margin-bottom: 38rpx;
}

.login-name {
  color: #ffffff;
  font-weight: 500;
  font-size: 44rpx;
  font-family: 'SourceHanSansCN';
}

.feature-list {
  margin-top: 64rpx;
  display: flex;
  flex-direction: column;
  align-content: center;
}

.feature-item {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12rpx;
}

.dot {
  width: 16rpx;
  height: 16rpx;
  background-color: #ed171f;
  border-radius: 50%;
  margin-right: 12rpx;
}

.feature-item span {
  color: rgba(207, 207, 207, 0.85);
  font-size: 28rpx;
  line-height: 40rpx;
}

.login-img {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 288rpx;
  z-index: 10;
}
</style>
