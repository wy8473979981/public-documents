<template>
  <div class="training-knowledge">
    <nav-bar :navOption="navOption" @navigateBack="navBack"></nav-bar>
    <bg-image src="/static/icons/bg.jpeg"></bg-image>
    <div class="training-knowledge-header">
      <div class="training-knowledge-title">训练前产品知识预习</div>
      <div class="training-knowledge-sub-title">
        请先认真阅读产品知识，点击底部“准备好了，开始测试”按钮开始产品知识测试
      </div>
    </div>
    <div v-if="contentImages && contentImages.length > 0">
      <image
        :src="item.url"
        mode="widthFix"
        v-for="(item, index) in contentImages"
        :key="index"
        class="training-knowledge-img"
        @click="lookImage(index)"
      />
    </div>

    <div class="training-knowledge-butt" @click="goTrain">
      准备好了 开始测试
    </div>
  </div>
</template>

<script>
import pageCommon from '@/mixins/page.common.js'
import { getAiKnowledge } from '@/api/index'
export default {
  name: 'TrainingKnowledge',
  mixins: [pageCommon],
  data() {
    return {
      navOption: {
        navTitle: '产品知识测试',
        backgroundColor: '',
        hasPlaceholder: true,
        showBackTip: true,
        color: '#ffffff'
      },
      aiHumanID: 0,
      type: '',
      aiHuman: {},
      contentImages: []
    }
  },
  async onLoad(options) {
    this.aiHumanID = Number(options.aiHumanID || 0)
    this.type = options.type || 'invite'
    await this.waitingUserLoaded()
    await this.fetchData()
  },
  async onPullDownRefresh() {
    await this.fetchData()
    uni.stopPullDownRefresh()
  },
  methods: {
    async fetchData() {
      await this.getAiHumanDetail()
    },
    async getAiHumanDetail() {
      if (!this.aiHumanID) return
      const res = await getAiKnowledge(this.aiHumanID)
      this.aiHuman = res || {}
      this.contentImages = res.contentImages || []
    },
    lookImage(index) {
      let urls = this.contentImages.map((item) => item.url)
      uni.previewImage({
        current: index,
        urls
      })
    },
    async goTrain() {
      if (this.aiHuman && this.aiHuman.isBusy)
        return uni.showToast({
          title: `${this.aiHuman.name}忙线中，请稍后再试`,
          duration: 2000
        })
      return uni.navigateTo({
        url: `/pages/training/connect?ai=${this.aiHumanID}&type=${this.type}`
      })
    }
  }
}
</script>

<style scoped>
.training-knowledge {
  width: 100%;
  padding-bottom: 326rpx;
}
.training-knowledge-header {
  width: 100%;
  padding: 0 40rpx;
  box-sizing: border-box;
  background-color: rgba(0, 0, 0, 0.5);
}
.training-knowledge-title {
  padding-top: 48rpx;
  padding-bottom: 16rpx;
  font-size: 34rpx;
  line-height: 46rpx;
  color: #ffffff;
  font-weight: bold;
}
.training-knowledge-sub-title {
  color: rgba(255, 255, 255, 0.8);
  font-size: 26rpx;
  line-height: 38rpx;
  padding-bottom: 28rpx;
}
.training-knowledge-img {
  width: 100%;
}

.training-knowledge-butt {
  position: fixed;
  bottom: 96rpx;
  left: 0;
  right: 0;
  margin: auto;
  width: calc(100% - 96rpx);
  height: 112rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ed171f;
  border-radius: 56rpx;
  color: #ffffff;
  font-size: 38rpx;
}
</style>
