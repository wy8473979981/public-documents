<template>
  <div>
    <nav-bar :navOption="navOption" @navigateBack="navBack"></nav-bar>
    <bg-image src="/static/icons/bg.jpeg"></bg-image>
    <div class="testing-title">选择不同的产品知识类型开始训练</div>
    <div class="testing-sub-title">请针对自己的需求进行选择</div>
    <template v-if="list.length > 0">
      <div
        class="testing-card"
        v-for="(item, index) in list"
        :key="index"
        @click.stop="goKnowledgePage(item)"
      >
        <div class="testing-card-icon">
          <image
            :src="item.avatarURL"
            mode=""
            class="testing-card-icon"
            v-if="item.avatarURL"
          />
        </div>
        <div class="testing-card-content">
          <div class="testing-card-title">
            {{ item.name }}
          </div>
          <div class="testing-card-text">
            <span>总训练次数</span>
            <span class="testing-card-sub-text">{{ item.usedTimes }}</span>
          </div>
          <div class="testing-card-text">
            <span>平均正确率</span>
            <span class="testing-card-sub-text"
              >{{ (100 * item.avgRate).toFixed(0) }}%</span
            >
          </div>
        </div>
        <div
          class="testing-card-status"
          :style="{ background: item.isBusy ? '#ED171F' : '#67B71E' }"
        >
          {{ item.isBusy ? '忙线' : '在线' }}
        </div>
        <div
          class="testing-card-btn"
          :style="{ opacity: item.isBusy ? 0.5 : 1 }"
          @click.stop="goConnectPage(item)"
        >
          {{ item.isBusy ? '排队中' : '立即开始' }}
        </div>
      </div>
    </template>
    <div class="testing-card-no" v-else>暂无产品知识测试</div>
    <public-logo></public-logo>
  </div>
</template>

<script>
import pageCommon from '@/mixins/page.common.js'
import { enableLoading, disableLoading } from '@/utils/loading'
export default {
  name: 'ProdKnowTesting',
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
      list: [],
      shouldRestoreLoading: true, // 是否需要恢复loading转圈圈
      timer: null // 定时器，刷新产品知识测试状态
    }
  },
  created() {
    this.shouldRestoreLoading = disableLoading()
  },
  async onShow() {
    await this.waitingUserLoaded()
    await this.fetchData()
  },
  async onHide() {
    // 隐藏之后（或者跳转到下一页），清除定时器
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }
  },
  async onPullDownRefresh() {
    await this.fetchData()
    uni.stopPullDownRefresh()
  },
  async onUnload() {
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }
    // 恢复loading转圈圈
    if (this.shouldRestoreLoading) {
      enableLoading()
    }
  },
  methods: {
    async fetchData() {
      await this.getAiKnowledgeForList()
    },
    // 产品知识测试
    async getAiKnowledgeForList() {
      let res = await this.$api.getAiKnowledgeForList()
      if (res && res.data) {
        this.list = res.data
      }
      // 每5秒钟刷新一次
      if (this.timer) {
        clearTimeout(this.timer)
        this.timer = null
      }
      this.timer = setTimeout(() => this.fetchData(), 5000)
    },
    goKnowledgePage(item) {
      uni.navigateTo({
        url: `/pages/training/knowledge?aiHumanID=${item.id}&type=testing`
      })
    },
    goConnectPage(item) {
      if (item.isBusy)
        return uni.showToast({
          title: `${item.name}忙线中，请稍后再试`,
          duration: 2000
        })
      uni.navigateTo({
        url: `/pages/training/connect?ai=${item.id}&type=testing`
      })
    }
  }
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
.testing-title {
  color: #ffffff;
  font-size: 34rpx;
  font-family: SourceHanSansCN-Medium, SourceHanSansCN;
  padding: 48rpx 40rpx 16rpx;
  box-sizing: border-box;
  width: 100%;
}
.testing-sub-title {
  color: rgba(255, 255, 255, 0.8);
  font-size: 26rpx;
  font-family: SourceHanSansCN-Regular, SourceHanSansCN;
  padding: 0 40rpx 28rpx;
  box-sizing: border-box;
  width: 100%;
}
.testing-card {
  margin: 24rpx auto 0;
  width: calc(100% - 60rpx);
  border-radius: 24rpx;
  background-color: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.5);
  position: relative;
  padding: 40rpx;
  box-sizing: border-box;
  display: flex;
}
.testing-card-icon {
  width: 128rpx;
  height: 128rpx;
  border-radius: 16rpx;
}
.testing-card-content {
  width: calc(100% - 128rpx);
  padding-left: 32rpx;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}
.testing-card-title {
  font-family: SourceHanSansCN-Medium, SourceHanSansCN;
  color: #ffffff;
  font-size: 30rpx;
  line-height: 40rpx;
}
.testing-card-text {
  display: flex;
  align-items: center;
  margin-top: 12rpx;
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.8);
  font-family: SourceHanSansCN-Regular, SourceHanSansCN;
}
.testing-card-sub-text {
  font-family: SourceHanSansCN-Bold, SourceHanSansCN;
  font-weight: bold;
  color: #ed171f;
  font-size: 26rpx;
  margin-left: 8rpx;
}
.testing-card-btn {
  position: absolute;
  right: 40rpx;
  bottom: 40rpx;
  z-index: 1;
  width: 168rpx;
  height: 58rpx;
  border-radius: 36rpx;
  background-image: linear-gradient(to right, #ed171f, #ff8433);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 26rpx;
  font-family: SourceHanSansCN-Regular, SourceHanSansCN;
}

.testing-card-status {
  position: absolute;
  top: 0;
  left: 40rpx;
  font-family: SourceHanSansCN-Medium, SourceHanSansCN;
  color: #ffffff;
  font-size: 24rpx;
  width: 72rpx;
  height: 40rpx;
  border-radius: 0 0 8rpx 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.testing-card-no {
  width: 100%;
  height: 50vh;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #888;
  font-size: 32rpx;
}
</style>
