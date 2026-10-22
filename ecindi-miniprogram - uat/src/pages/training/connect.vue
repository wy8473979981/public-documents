<!--随机训练-->
<template>
  <view class="connect-page">
    <!-- <splash /> -->
    <nav-bar :navOption="navOption" @navigateBack="customNavBack"></nav-bar>
    <!-- 背景图 -->
    <image class="bg-img" mode="aspectFill" :src="bgURL"></image>

    <template v-if="isBusy">
      <div class="connect-content">
        <!-- 背景图 -->
        <image
          class="connect-content-img"
          mode="aspectFill"
          :src="bgURL"
        ></image>
        <div
          :class="[
            isPreCase ? 'connect-content-name-1' : 'connect-content-name-0'
          ]"
        >
          <div v-if="isPreCase">案前准备客户</div>
          <div v-else>{{ aiHuman && aiHuman.name ? aiHuman.name : '' }}</div>
        </div>
        <template v-if="isOrient">
          <div class="connect-content-info">
            {{ aiHumanInfo }}
          </div>
          <div class="connect-content-tags" v-if="tags && tags.length > 0">
            <div class="connect-content-tags-box">
              <div
                v-for="(item, index) in tags"
                :key="index"
                class="connect-content-tags-item"
              >
                {{ item }}
              </div>
            </div>
          </div>
        </template>
      </div>
      <div class="connect-page-call">
        <span>忙线中，请稍后再试</span>
      </div>
      <div class="connect-page-hang-up-box" @click="hangUp">
        <div class="connect-page-hang-up">
          <img
            src="../../static/icons/hang-up.png"
            alt=""
            srcset=""
            class="connect-page-hang-up-img"
          />
        </div>
        <div class="connect-page-hang-up-text">结束通话</div>
      </div>
    </template>

    <template v-else-if="loadingPage">
      <div class="connect-content">
        <!-- 背景图 -->
        <image
          class="connect-content-img"
          mode="aspectFill"
          :src="bgURL"
        ></image>
        <div
          :class="[
            isPreCase ? 'connect-content-name-1' : 'connect-content-name-0'
          ]"
        >
          <div v-if="isPreCase">案前准备客户</div>
          <div v-else>{{ aiHumanName }}</div>
        </div>
        <template v-if="isOrient">
          <div class="connect-content-info">
            {{ aiHumanInfo }}
          </div>
          <div class="connect-content-tags" v-if="tags && tags.length > 0">
            <div class="connect-content-tags-box">
              <div
                v-for="(item, index) in tags"
                :key="index"
                class="connect-content-tags-item"
              >
                {{ item }}
              </div>
            </div>
          </div>
        </template>
      </div>

      <!-- 定向训练 -->
      <template v-if="isOrient">
        <!-- kyc -->
        <div v-if="isKyc">
          <div class="kyc_connect">
            <div>您的客户正在贵宾室等您，</div>
            <div>请立即前往沟通...</div>
          </div>

          <div class="connect-page-hang-up-box" @click="hangUp">
            <div class="connect-page-hang-up">
              <img
                src="../../static/icons/hand.png"
                alt=""
                srcset=""
                class="connect-page-hang-up-img-kyc"
              />
            </div>
            <div class="connect-page-hang-up-text">暂不沟通</div>
          </div>
        </div>

        <!-- 非KYC的定向训练 -->
        <div class="list-container" v-else>
          <div class="invite_connect">对话中，您可以:</div>
          <ul>
            <li class="list-item">确认客户身份。</li>
            <li class="list-item">做简单的自我介绍。</li>
            <li class="list-item">
              进一步沟通{{ trainingTypeNameSimple }}的相关信息。
            </li>
          </ul>
        </div>
      </template>

      <!-- 非定向训练 -->
      <div v-else>
        <div class="connect-page-call">
          <span>正在呼叫</span>
          <public-ellipsis />
        </div>
        <div class="connect-page-hang-up-box" @click="hangUp">
          <div class="connect-page-hang-up">
            <img
              src="../../static/icons/hang-up.png"
              alt=""
              srcset=""
              class="connect-page-hang-up-img"
            />
          </div>
          <div class="connect-page-hang-up-text">结束通话</div>
        </div>
      </div>
    </template>
  </view>
</template>

<script>
import pageCommon from '@/mixins/page.common.js'
import PublicEllipsis from '@/components/PublicEllipsis.vue'
export default {
  name: 'Random',
  mixins: [pageCommon],
  components: { PublicEllipsis },
  data() {
    return {
      navOption: {
        navTitle: '',
        backgroundColor: '',
        hasPlaceholder: true,
        showBackTip: true,
        color: '#ffffff'
      },
      aiHuman: {},
      ai: 0,
      preCaseID: 0,
      sessionID: '',
      timer: null,
      loadingPage: false,
      difEntry: 0
    }
  },
  computed: {
    bgURL() {
      // 定向训练
      if (this.isOrient) {
        const url =
          this.aiHuman && (this.aiHuman.bgURL || this.aiHuman.avatarURL)
        return url ? url : '/static/icons/bg.jpeg'
      } else {
        // 其他
        return 'https://cdn.edesoft.com/cindi/upload/202407/30/073070.jpg'
      }
    },
    // 虚拟人物基本信息
    aiHumanInfo() {
      const aihuman = this.aiHuman || {}
      return this.getAihumanInfo(aihuman)
    },
    tags() {
      const str = this.aiHuman.tags || ''
      if (!str) return []
      // split str by multiple separators
      return str.split(/[-_ ，,;；]+/)
    },
    isBusy() {
      return this.aiHuman && this.aiHuman.isBusy
    },
    aiHumanName() {
      return this.aiHuman && this.aiHuman.name ? this.aiHuman.name : '虚拟人物'
    },
    trainingType() {
      return (this.aiHuman && this.aiHuman.trainingType) || {}
    },
    trainingTypeName() {
      return this.trainingType.name || '训练'
    },
    // 是否KYC
    isKyc() {
      return this.trainingType.name === 'KYC'
    },
    // 是否定向训练
    isOrient() {
      return this.trainingType.isOrient
    },
    // 是否产品知识测试
    isKnowledge() {
      return this.trainingType.hasPdf
    },
    // 是否PreCase
    isPreCase() {
      return this.trainingType.isPreCase
    },
    // 简化训练类型名称
    trainingTypeNameSimple() {
      return this.trainingTypeName.replace(/客户/g, '')
    }
  },
  async onLoad(options) {
    this.loadingPage = false
    this.ai = parseInt(options.ai) || 0
    this.preCaseID = parseInt(options.precaseid) || 0
    this.difEntry = parseInt(options.difEntry) || 0

    // 获取数据
    await this.fetchData()
  },
  methods: {
    async fetchData() {
      // 加载人设
      await this.loadAiHuman()
      // 设置标题
      this.setPageTitle()
      // this.aiHuman.isBusy = true // 调试用

      if (this.isBusy) {
        // 忙线中，自动返回
        this.setGoBackTimer()
      } else {
        // 非忙线中，准备聊天
        const ok = await this.prepareChat()
        if (!ok) return
        this.loadingPage = true
        await this.setTrainingTimer()
      }
    },
    // 获取ai人信息
    async loadAiHuman() {
      if (!this.ai) return
      const res = await this.$api.getAiHuman(this.ai)
      if (res) {
        this.aiHuman = res
      }
    },
    // 准备聊天（是否在线总人数超过10人）
    async prepareChat() {
      const res = await this.$api.prepareChat(this.ai)
      if (res.result === false) {
        await wx.showModal({
          title: '提示',
          content: res.error || '同时在线人数过多，请稍后再试',
          showCancel: false,
          confirmText: '知道了'
        })

        this.navBack()
        return false
      } else {
        this.sessionID = res.sessionID
        return true
      }
    },
    setPageTitle() {
      // 设置标题
      let title = ''
      if (this.isPreCase) {
        title = '案前准备'
      } else if (this.isKnowledge) {
        title = '产品知识测试'
      } else if (this.isKyc) {
        title = 'KYC训练'
      } else {
        title = this.trainingType.name || ''
      }
      // 设置页面标题
      if (title) {
        this.navOption.navTitle = title
      }
    },
    async setTrainingTimer() {
      this.closeTimer()

      let _time = 3000
      if (this.isOrient) {
        _time = 5000
      }

      this.timer = setTimeout(async () => {
        await this.goTrainingChat()
      }, _time)
    },
    async setGoBackTimer() {
      this.closeTimer()
      this.timer = setTimeout(async () => {
        await this.customNavBack()
      }, 2000)
    },
    closeTimer() {
      if (this.timer) clearTimeout(this.timer)
    },
    async goTrainingChat() {
      this.closeTimer()
      return uni.redirectTo({
        url: `/pages/training/chat?ai=${this.ai}&sessionID=${this.sessionID}&precaseid=${this.preCaseID}&difEntry=${this.difEntry}`
      })
    },
    async customNavBack() {
      // 取消限流
      if (this.sessionID) {
        await this.$api.releaseLimit({ ai: this.ai, sessionID: this.sessionID })
      }

      if (this.isPreCase && this.difEntry !== 1) {
        uni.navigateBack({
          delta: 2
        })
      } else {
        this.navBack()
      }
    },
    async hangUp() {
      this.closeTimer()
      await this.customNavBack()
    }
  },
  async onPullDownRefresh() {
    uni.stopPullDownRefresh()
  },
  onUnload() {
    console.log('onUnload')
    this.closeTimer()
  },
  async onReachBottom() {}
}
</script>

<style>
page {
  background-color: #100f12;
}
</style>
<style scoped>
.connect-page-hang-up-img-kyc {
  width: 100%;
  height: 100%;
}

.kyc_connect {
  height: 108rpx;
  font-weight: 500;
  font-size: 42rpx;
  color: #ffffff;
  line-height: 54rpx;
  text-align: center;
  padding: 48rpx;
  margin-bottom: 32rpx;
}

.invite_connect {
  height: 38rpx;
  font-weight: 500;
  font-size: 26rpx;
  color: #ffffff;
  line-height: 38rpx;
  margin-bottom: 12rpx;
}

.list-container {
  width: 420rpx;
  padding-top: 32rpx;
}

.list-item {
  height: 38rpx;
  font-weight: 400;
  font-size: 26rpx;
  color: #ffffff;
  line-height: 38rpx;
  opacity: 0.8;
  position: relative;
  padding-left: 32rpx;
}

/* 自定义圆点点 */
.list-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 11rpx;
  width: 16rpx;
  height: 16rpx;
  background: #ff8433;
  border-radius: 50%;
}

.connect-page {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.bg-img {
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
  width: 100vw;
  height: 100vh;
  filter: blur(12px);
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
.connect-content-img {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 40rpx;
  top: 0;
  left: 0;
  z-index: 6;
  /* background: no-repeat center;
  background-size: cover; */
}
.connect-content-name-0 {
  position: absolute;
  left: 40rpx;
  bottom: 152rpx;
  color: #fff;
  font-size: 38rpx;
  z-index: 10;
}
.connect-content-name-1 {
  position: absolute;
  left: 40rpx;
  bottom: 40rpx;
  color: rgba(255, 255, 255, 0.75);
  font-size: 38rpx;
  line-height: 50rpx;
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
.connect-content-tags {
  position: absolute;
  left: 0;
  bottom: 40rpx;
  z-index: 10;
  width: 100%;
  padding-left: 40rpx;
  box-sizing: border-box;
}
.connect-content-tags-box {
  width: 100%;
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  overflow: hidden;
}
.connect-content-tags-item {
  border-radius: 8rpx;
  background-color: rgba(0, 0, 0, 0.2);
  border: 1rpx solid rgba(255, 255, 255, 0.3);
  padding: 10rpx 14rpx;
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.8);
  margin-right: 12rpx;
  flex-shrink: 0;
  max-width: calc(100% - 12rpx);
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  box-sizing: border-box;
}
.connect-page-call {
  margin-top: 48rpx;
  margin-bottom: 80rpx;
  font-size: 42rpx;
  color: #fff;
}
.connect-page-hang-up-box {
  display: flex;
  flex-direction: column;
  align-items: center;
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
