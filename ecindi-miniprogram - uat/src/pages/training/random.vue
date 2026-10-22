<!--随机训练-->
<template>
  <view class="random-page">
    <!-- <splash /> -->
    <nav-bar :navOption="navOption" @navigateBack="navBack"></nav-bar>
    <!-- 背景图 -->
    <image class="bg-img" mode="aspectFill" :src="bgURL"></image>

    <template v-if="isAllBusy">
      <img
        src="../../static/icons/bg-img.png"
        alt=""
        srcset=""
        class="chat-page-butt-fixed-bg"
      />
      <div class="connect-content">
        <div class="connect-content-name"></div>
        <div class="connect-content-info"></div>
      </div>
      <div class="connect-page-call">
        <span class="connect-page-call-text">暂无可接通的客户...</span>
      </div>
      <div class="connect-page-hang-up-box">
        <div class="connect-page-hang-up">
          <img
            src="../../static/icons/hang-up.png"
            class="connect-page-hang-up-img"
          />
        </div>
        <div class="connect-page-hang-up-text">暂时无法接通，请稍后再试</div>
      </div>
    </template>

    <template v-else-if="loadingPage">
      <div class="flex_column">
        <div class="card1">
          <div class="card1_item">
            <div class="card1_key">本次训练目的：</div>
            <div class="card1_value">邀请客户到店</div>
          </div>
          <div class="card1_item">
            <div class="card1_key">本次训练类别：</div>
            <div class="card1_value">客户邀约训练</div>
          </div>
        </div>
      </div>
      <div class="fixed_bottom">
        <div class="card2">
          <div class="card2_text">{{ aihuman.name }}</div>
          <div class="card2_gender">
            {{ aiHumanInfo }}
          </div>
          <div class="card2_tags">
            <div v-for="(tag, index) in tags" :key="index" class="card2_tag">
              {{ tag }}
            </div>
          </div>
        </div>
        <button class="card3" @click="clickStart">准备好了 开始训练</button>
      </div>
    </template>
  </view>
</template>

<script>
import pageCommon from '@/mixins/page.common.js'
import { getRandomAiHuman } from '@/api/index'
export default {
  name: 'Random',
  mixins: [pageCommon],
  data() {
    return {
      navOption: {
        navTitle: '每日随机训练',
        backgroundColor: '',
        hasPlaceholder: true,
        showBackTip: true,
        color: '#ffffff'
      },
      aihuman: {},
      loadingPage: false
    }
  },

  computed: {
    bgURL() {
      if (this.isAllBusy) {
        return 'https://cdn.edesoft.com/cindi/upload/static/all-busy.jpg'
      }

      const url = this.aihuman && (this.aihuman.bgURL || this.aihuman.avatarURL)
      return url ? url : '/static/icons/bg.jpeg'
    },
    isAllBusy() {
      const ok = this.aihuman && this.aihuman.id > 0
      return !ok
    },
    // 虚拟人物基本信息
    aiHumanInfo() {
      const aihuman = this.aihuman || {}
      return this.getAihumanInfo(aihuman)
    },
    tags() {
      const str = this.aihuman.tags || ''
      if (!str) return []
      // split str by multiple separators
      return str.split(/[-_ ，,;；]+/)
    }
  },
  async onShow() {
    await this.waitingUserLoaded()
    await this.fetchData()
  },
  methods: {
    async fetchData() {
      this.loadingPage = false
      const res = await getRandomAiHuman()
      if (res) {
        this.aihuman = res
      } else {
        this.aihuman = {} // 没有数据
      }
      this.loadingPage = true

      // this.aihuman = {} // 调试用

      if (this.isAllBusy) {
        // 2秒钟后返回
        setTimeout(() => {
          this.navBack()
        }, 2000)
      }
    },
    async clickStart() {
      const ai = this.aihuman.id || 0
      return uni.redirectTo({
        url: `/pages/training/connect?ai=${ai}&type=random`
      })
    }
  },

  async onPullDownRefresh() {
    await this.fetchData()
    uni.stopPullDownRefresh()
  },

  async onReachBottom() {}
}
</script>

<style>
page {
  background-color: #100f12;
  background-repeat: no-repeat;
  background-size: contain;
}
</style>

<style scoped>
.random-page {
  width: 100vw;
  height: 100vh;
  /* background-color: #100f12; */
  background-repeat: no-repeat;
  background-size: contain;
}

.bg-img {
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
  width: 100vw;
  height: 100vh;
}

.flex_column {
  /* height: 994rpx; */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-top: 30rpx;
  margin-left: 48rpx;
}

.card1 {
  display: flex;
  flex-direction: column;
  width: 560rpx;
  /* min-height: 288rpx; */
  border-radius: 20rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.2);
  background-color: rgba(0, 0, 0, 0.2);
  padding: 40rpx;
  box-sizing: border-box;
}

.card1_item {
  display: flex;
  flex-direction: column;
  row-gap: 8rpx;
  margin-bottom: 32rpx;
}

.card1_key {
  display: flex;
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.8);
  line-height: 38rpx;
}

.card1_value {
  display: flex;
  font-size: 30rpx;
  line-height: 42rpx;
  color: #fff;
  font-weight: 500;
}

.fixed_bottom {
  display: flex;
  flex-direction: column;
  position: fixed;
  width: 100%;
  bottom: 0;
  padding: 0 48rpx;
  box-sizing: border-box;
}

.card2 {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.card2_text {
  display: flex;
  font-size: 42rpx;
  font-weight: 500;
  color: #fff;
}
.card2_gender {
  margin-top: 12rpx;
  color: rgba(255, 255, 255, 0.8);
  font-size: 30rpx;
  display: flex;
}

.card2_tags {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: 32rpx;
  column-gap: 16rpx;
  row-gap: 16rpx;
}

.card2_tag {
  display: flex;
  padding: 12rpx 16rpx;
  border-radius: 8rpx;
  align-items: center;
  border: 1rpx solid rgba(255, 255, 255, 0.3);
  background-color: rgba(0, 0, 0, 0.2);
  color: rgba(255, 255, 255, 0.8);
  font-size: 26rpx;
}

.card3 {
  display: flex;
  justify-content: center;
  align-items: center;
  border: 0;
  border-radius: 56rpx;
  height: 112rpx;
  background-color: #ed171f;
  font-size: 38rpx;
  color: white;
  margin-top: 80rpx;
  margin-bottom: 96rpx;
  width: 100%;
}

.chat-page-butt-fixed-bg {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100vw;
  height: 960rpx;
  z-index: -1;
}

.connect-content {
  width: 384rpx;
  height: 584rpx;
  margin-top: 176rpx;
  border-radius: 40rpx;
  position: relative;
  overflow: hidden;
  /* background-color: #000002; */
  background-color: rgba(0, 0, 0, 0);
}

.connect-content-name {
  position: absolute;
  left: 40rpx;
  bottom: 152rpx;
  color: #fff;
  font-size: 38rpx;
  z-index: 10;
}
.connect-content-info {
  position: absolute;
  left: 40rpx;
  bottom: 106rpx;
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.8);
  z-index: 10;
}
.connect-page-call {
  margin-top: 48rpx;
  margin-bottom: 92rpx;
  font-size: 42rpx;
  color: #fff;
  display: flex;
  justify-content: center;
}
.connect-page-call-text {
  display: flex;
  font-size: 42rpx;
}
.connect-page-hang-up-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  filter: brightness(0.5);
}
.connect-page-hang-up {
  width: 128rpx;
  height: 128rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ed171f;
}
.connect-page-hang-up-img {
  width: 66rpx;
  height: 64rpx;
}
.connect-page-hang-up-text {
  margin: 16rpx 0;
  color: #cfcfcf;
  font-size: 26rpx;
}
</style>
