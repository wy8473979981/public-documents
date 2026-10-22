<template>
  <div class="return-page">
    <nav-bar :navOption="navOption" @navigateBack="navBack"></nav-bar>
    <bg-image src="/static/icons/bg.jpeg"></bg-image>
    <image class="bg-img" mode="aspectFill" :src="bgURL"></image>
    <div class="return-content">
      <div
        class="return-content-item"
        v-for="(item, index) in chatJson"
        :key="index"
      >
        <template>
          <img
            src="../../static/icons/write-icon-0.png"
            alt=""
            srcset=""
            class="return-content-item-img"
            v-if="item.speaker === 'ai'"
          />
          <img
            src="../../static/icons/write-icon-1.png"
            alt=""
            srcset=""
            class="return-content-item-img"
            v-if="item.speaker === 'user'"
          />
          <div
            class="return-content-item-text"
            :class="[
              item.speaker === 'ai' ? 'return-content-item-ai' : '',
              item.speaker === 'user' ? 'return-content-item-user' : ''
            ]"
          >
            {{ item.content }}
          </div>
        </template>
      </div>
    </div>
    <div class="footer">
      <div class="button" @click="clickTryAgain">再试一次</div>
      <div class="comment" @click="openMoreInvite">
        <span>开启更多训练</span>
        <image
          src="@/static/icons/card-right.png"
          class="icon-warn"
          mode="aspectFit"
        ></image>
      </div>
    </div>
  </div>
</template>

<script>
import pageCommon from '@/mixins/page.common.js'
import qiunDataCharts from '@/components/qiun-data-charts/qiun-data-charts.vue'
export default {
  name: 'Result',
  mixins: [pageCommon],
  components: { qiunDataCharts },
  data() {
    return {
      navOption: {
        navTitle: '回放训练',
        backgroundColor: '',
        hasPlaceholder: true,
        showBackTip: true,
        color: '#ffffff'
      },
      trainingID: 0,
      aiHumanID: 0,
      aihuman: null,
      chatJson: [],
      trainingType: 0,
      preCaseID: 0,
      difEntry: 0
    }
  },
  computed: {
    bgURL() {
      // 产品知识测试
      if (this.aiType === 1) {
        return 'https://cdn.edesoft.com/cindi/upload/202407/30/073070.jpg'
      }
      const url = this.aihuman && (this.aihuman.bgURL || this.aihuman.avatarURL)
      return url ? url : '/static/icons/bg.jpeg'
    },
    aiType() {
      // return this.aihuman ? this.aihuman.aiType : 0
      if (this.aihuman && this.aihuman.trainingTypeID === 12) {
        // TODO: 临时方案，后续要去掉
        return 1
      }
      return 0
    }
  },
  // 返回
  navBack() {
    uni.navigateBack()
  },
  async onLoad(options) {
    if (options && options.id) {
      this.trainingID = parseInt(options.id) || 0
    }
    if (options && options.precaseid) {
      this.preCaseID = parseInt(options.precaseid) || 0
    }
    if (options && options.difEntry) {
      this.difEntry = parseInt(options.difEntry) || 0
    }
  },
  async mounted() {
    await this.waitingUserLoaded()
    await this.fetchData()
  },
  methods: {
    async fetchData() {
      if (!this.trainingID) return
      const res = await this.$api.getTraining(this.trainingID)
      if (res) {
        this.aihuman = res.aiHuman
        this.trainingType = res.trainingType
      }

      if (res && res.chatJson) {
        this.chatJson = JSON.parse(res.chatJson)
      }
      if (res && res.aiHumanID) {
        this.aiHumanID = res.aiHumanID
      }
    },
    clickTryAgain() {
      if (!this.aiHumanID) return
      let type = ''
      if (this.trainingType.isPreCase) {
        type = 'precase'
        wx.redirectTo({
          url: `/pages/training/connect?ai=${this.aiHumanID}&type=${type}&precaseid=${this.preCaseID}&difEntry=${this.difEntry}`
        })
      } else {
        if (this.trainingType === 0) {
          type = 'invite'
        }
        if (this.trainingType === 2) {
          type = 'testing'
        }
        wx.redirectTo({
          url: `/pages/training/connect?ai=${this.aiHumanID}&type=${type}`
        })
      }
    },
    openMoreInvite() {
      if (this.trainingType === 2) {
        return uni.redirectTo({
          url: '/pages/training/testing'
        })
      }
      uni.redirectTo({
        url: `/pages/training/targeted`
      })
    }
  },
  async onPullDownRefresh() {
    await this.fetchData()
    uni.stopPullDownRefresh()
  }
}
</script>

<style scoped>
.return-page {
  width: 100%;
  padding-bottom: 60rpx;
}
.bg-img {
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
  width: 100vw;
  height: 100vh;
  filter: blur(16rpx);
}
.footer {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 48rpx;
  box-sizing: border-box;
}
.button {
  width: 100%;
  height: 112rpx;
  margin: 0 auto 32rpx;
  background: linear-gradient(270deg, #ff8433 0%, #ed171f 100%);
  border-radius: 56rpx;
  text-align: center;
  font-size: 38rpx;
  font-family: SourceHanSansCN, SourceHanSansCN;
  font-weight: 400;
  color: #ffffff;
  line-height: 112rpx;
}
.comment {
  margin-bottom: 36rpx;
  justify-content: center;
  font-size: 22rpx;
  font-family: SourceHanSansCN, SourceHanSansCN;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.75);
  display: flex;
  align-items: center;
}
.comment .icon-warn {
  width: 16rpx;
  height: 16rpx;
  margin-left: 8rpx;
}

.return-content {
  width: 100%;
  padding: 0 48rpx;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  margin-bottom: 80rpx;
  margin-top: 30rpx;
  min-height: 60vh;
}
.return-content-item {
  width: 100%;
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
}
.return-content-item-img {
  width: 24rpx;
  height: 24rpx;
  flex-shrink: 0;
  margin-top: 8rpx;
}
.return-content-item-text {
  flex-shrink: 0;
  flex: 1;
  margin-bottom: 16rpx;
  font-size: 28rpx;
  line-height: 40rpx;
  padding: 0 8rpx;
  box-sizing: border-box;
}
.return-content-item-ai {
  color: #fff;
}
.return-content-item-user {
  color: rgba(255, 255, 255, 0.8);
}
</style>

<style>
page {
  background-color: rgba(0, 0, 0, 0.3) !important;
  background-repeat: no-repeat;
  background-size: contain;
}
</style>
