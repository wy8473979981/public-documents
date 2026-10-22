<template>
  <view v-if="hasLogin && !isFirstLogin">
    <nav-bar :navOption="navOption"></nav-bar>
    <!-- 背景图 -->
    <bg-image src="/static/icons/bg.jpeg"></bg-image>

    <div class="flex_column">
      <!-- 第一行：统计 -->
      <div class="card1" @click="goMyPage">
        <img
          src="https://cdn.edesoft.com/cindi/upload/202501/13/891638.png"
          alt=""
          class="card1-bg"
        />
        <div class="card1-row1">
          <div class="card1-row1-left">
            <img
              src="/static/icons/default-avatar.png"
              alt=""
              class="card1-row1-avatar"
            />
            <div class="card1-row1-user">
              <div class="card1-row1-name">
                Hi,<span class="row1-name">{{ userName }}</span>
              </div>
              <div class="card1-row1-wall">
                <span>{{ orgName }}</span>
              </div>
            </div>
          </div>
          <img src="/static/home/right.png" alt="" class="card1-row1-icon" />
        </div>
        <div class="card1-row2">
          <div
            class="card1-row2-item"
            v-for="(item, index) in summaryNavList"
            :key="index"
          >
            <div
              class="card1-row2-item-label"
              :style="{ color: item.valueColor }"
            >
              {{ item.value
              }}<span
                class="card1-row2-item-unit"
                :style="{ color: item.unitColor }"
                >{{ item.unit }}</span
              >
            </div>
            <div class="card1-row2-item-text">{{ item.label }}</div>
          </div>
        </div>
      </div>

      <!-- 第2行 -->
      <!-- 活动 -->
      <swiper-game :headlines="headlines1"></swiper-game>
      <!-- 资讯 -->
      <swiper-head-line :headlines="headlines2"></swiper-head-line>

      <!-- 改版 -->
      <div class="container">
        <div class="box" @click="goPreCasePage">
          <img
            src="https://cdn.edesoft.com/cindi/upload/202503/03/2482539708.png"
            alt=""
            class="box1"
          />
          <div class="spanText1">案前准备</div>
          <div class="spanText2">自定义AI客户进行有针对性的快速加练吧!</div>
          <div class="_button"><span class="btn-text">立即开始</span></div>
        </div>
        <div class="box" @click="goTargetedPage">
          <img
            src="https://cdn.edesoft.com/cindi/upload/202503/03/185888098.png"
            alt=""
            class="box2"
          />
          <div class="spanText1">定向对练</div>
          <div class="spanText2">
            选择定向训练内容, 立即进行客户邀约,KYC等训练吧!
          </div>
          <div class="_button"><span class="btn-text">立即开始</span></div>
        </div>
      </div>
      <div @click="goTestingPage" class="containerProTest">
        <img
          src="https://cdn.edesoft.com/cindi/upload/202503/03/4017065304.png"
          alt=""
          class="box3"
        />
        <div class="spanTextPro1">产品知识测试</div>
        <div class="spanTextPro2 spanTextProTop1">
          多种类型产品知识, 快来试试吧!
        </div>
        <div class="spanTextPro2 spanTextProTop2">
          查看详情<img
            src="https://cdn.edesoft.com/cindi/upload/202503/03/1414973181.png"
            alt=""
            class="arrRight"
          />
        </div>
      </div>

      <!-- logo-->
      <view class="logo-box">
        <image
          src="../../static/icons/2132975495.png"
          mode=""
          class="logo"
        />
      </view>
    </div>
  </view>
</template>

<script>
import pageCommon from '@/mixins/page.common.js'
import SwiperGame from '@/components/home/SwiperGame.vue'
import SwiperHeadLine from '@/components/home/SwiperHeadLine.vue'
export default {
  name: 'Home',
  mixins: [pageCommon],
  components: {
    SwiperGame,
    SwiperHeadLine
  },
  data() {
    return {
      navOption: {
        navTitle: 'AI对练工具',
        backgroundColor: '',
        hasPlaceholder: true,
        showBackTip: false,
        color: '#fff'
      },
      summaryData: {}, //统计信息
      headlines1: [],
      headlines2: [],
      summaryNavList: [
        {
          label: '训练总次数',
          value: 0,
          valueColor: '#fff',
          unit: '次',
          unitColor: 'rgba(255, 255, 255, 0.75)'
        },
        {
          label: '训练总时长',
          value: 0,
          valueColor: '#fff',
          unit: '分',
          unitColor: 'rgba(255, 255, 255, 0.75)'
        },
        {
          label: '当前累计星星',
          value: 0,
          valueColor: '#ff8433',
          unit: '颗',
          unitColor: 'rgba(255, 132, 51, 0.75)'
        },
        {
          label: '当前获得勋章',
          value: 0,
          valueColor: '#ff8433',
          unit: '枚',
          unitColor: 'rgba(255, 132, 51, 0.75)'
        }
      ], //统计-nav
      targetedList: [], //定向对练
      targetedImgList: [
        {
          bgUrl: 'https://cdn.edesoft.com/cindi/upload/202501/13/335124.png',
          personUrl: 'https://cdn.edesoft.com/cindi/upload/202501/13/542992.png'
        },
        {
          bgUrl: 'https://cdn.edesoft.com/cindi/upload/202501/13/325363.png',
          personUrl: 'https://cdn.edesoft.com/cindi/upload/202501/13/934449.png'
        },
        {
          bgUrl: 'https://cdn.edesoft.com/cindi/upload/202501/13/863532.png',
          personUrl: 'https://cdn.edesoft.com/cindi/upload/202501/13/981208.png'
        },
        {
          bgUrl: 'https://cdn.edesoft.com/cindi/upload/202501/13/450667.png',
          personUrl: 'https://cdn.edesoft.com/cindi/upload/202501/13/408010.png'
        }
      ], //定向对练
      preCaseList: [],
      preCaseImgList: [
        {
          bgUrl: 'https://cdn.edesoft.com/cindi/upload/202501/13/292674.png',
          personUrl: 'https://cdn.edesoft.com/cindi/upload/202501/13/956905.png'
        }
      ], //pre-case
      knowledgeList: [],
      knowledgeImgList: [
        {
          url: 'https://cdn.edesoft.com/cindi/upload/202501/14/551666.png'
        },
        {
          url: 'https://cdn.edesoft.com/cindi/upload/202501/14/136957.png'
        },
        {
          url: 'https://cdn.edesoft.com/cindi/upload/202501/14/097567.png'
        },
        {
          url: 'https://cdn.edesoft.com/cindi/upload/202501/14/092748.png'
        },
        {
          url: 'https://cdn.edesoft.com/cindi/upload/202501/14/059560.png'
        }
      ]
    }
  },
  computed: {
    userName() {
      return this.summaryData.nickName || this.summaryData.userName || ''
    },
    orgName() {
      return this.summaryData.org ? this.summaryData.org.name : ''
    },
    wearings() {
      return this.summaryData.medal && this.summaryData.medal.wearings
        ? this.summaryData.medal.wearings
        : []
    }
  },
  async onShow() {
    await this.waitingUserLoaded()
    await this.checkLoginForOtherPage()
    await this.fetchData()
  },
  methods: {
    async fetchData() {
      await this.getMySummaryData()
      await this.getBannerData()
      await this.getAiHumanTypeData()
      await this.getPreCaseData()
      await this.getAiKnowledgeForList()
    },
    // 我的统计信息
    async getMySummaryData() {
      const res = await this.$api.getMySummary()
      this.summaryData = res || {}
      this.summaryNavList[0].value = res.training ? res.training.total : 0
      this.summaryNavList[1].value = res.training
        ? parseInt(res.training.minutes)
        : 0
      this.summaryNavList[2].value = res.star ? res.star.total : 0
      this.summaryNavList[3].value = res.medal ? res.medal.total : 0
    },
    // 轮播图
    async getBannerData() {
      const res1 = await this.$api.getBannerGameForHome()
      this.headlines1 = res1 || []
      if (this.headlines1.length === 0) {
        const res2 = await this.$api.getAllHeadlines()
        this.headlines2 = res2.data || []
      }
    },
    // 人设类别
    async getAiHumanTypeData() {
      const res = await this.$api.getTargetedTraining()
      this.targetedList = res.data || []
    },
    // PreCase
    async getPreCaseData() {
      const res = await this.$api.getPreCaseForList()
      this.preCaseList = res.data || []
    },
    // 产品知识测试
    async getAiKnowledgeForList() {
      let res = await this.$api.getAiKnowledgeForList({ pageSize: 5 })
      this.knowledgeList = res.data || []
    },
    goMyPage() {
      uni.navigateTo({
        url: `/pages/my/index`
      })
    },
    goTargetedPage(index = 0) {
      uni.navigateTo({
        url: `/pages/training/targeted?typeIndex=${index}`
      })
    },
    goPreCasePage() {
      uni.navigateTo({
        url: `/subpages/precase/index`
      })
    },
    goTestingPage() {
      uni.navigateTo({
        url: `/pages/training/testing`
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
.flex_column {
  padding: 0 30rpx;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* 第一card */
.card1 {
  width: 100%;
  min-height: 306rpx;
  display: flex;
  flex-direction: column;
  border-radius: 32rpx;
  border: 2rpx solid rgba(255, 255, 255, 0.2);
  background-image: linear-gradient(
    to right,
    rgba(255, 255, 255, 0.2),
    rgba(255, 255, 255, 0.1),
    rgba(71, 71, 71, 0.15)
  );
  /* background-image: url('https://cdn.edesoft.com/cindi/upload/202501/13/520276.png'); */
  background-size: 100% 100%;
  background-repeat: no-repeat;
  margin: 24rpx 0;
  padding: 32rpx;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
}
.card1-bg {
  width: 320rpx;
  height: 368rpx;
  position: absolute;
  right: -60rpx;
  top: 38rpx;
  z-index: 1;
}
.card1-row1 {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}

.card1-row1-left {
  display: flex;
  align-items: center;
  flex: 1;
}

.card1-row1-avatar {
  width: 128rpx;
  height: 128rpx;
  margin-right: 32rpx;
}
.card1-row1-user {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.card1-row1-name {
  margin-bottom: 8rpx;
  color: rgba(255, 255, 255, 0.75);
  font-size: 34rpx;
  line-height: 42rpx;
}
.row1-name {
  color: #ffffff;
  padding-left: 10rpx;
}
.card1-row1-wall {
  display: flex;
  align-items: center;
  font-size: 22rpx;
  line-height: 34rpx;
  color: rgba(255, 255, 255, 0.8);
}
.card1-row1-wall-column {
  margin: 0 12rpx;
}

.my-medal-item {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 30rpx;
  border-radius: 16rpx;
  padding: 0 16rpx;
  background-image: linear-gradient(to right, rgba(0, 134, 255, 0), #1558ff);
  font-size: 24rpx;
  color: #ffffff;
  margin-left: 30rpx;
  margin-right: 16rpx;
}
.my-medal-item-icon {
  position: absolute;
  top: 0;
  bottom: 0;
  margin: auto;
  left: -30rpx;
  width: 40rpx;
  height: 40rpx;
}

.card1-row1-icon {
  width: 24rpx;
  height: 24rpx;
}

.card1-row2 {
  width: 100%;
  display: flex;
  align-items: center;
}
.card1-row2-item {
  width: 25%;
  display: flex;
  flex-direction: column;
}

.card1-row2-item-label {
  display: flex;
  align-items: baseline;
  font-size: 46rpx;
  line-height: 58rpx;
  font-weight: 700;
}
.card1-row2-item-unit {
  font-weight: 500;
  font-size: 22rpx;
  line-height: 34rpx;
  margin-left: 4rpx;
}

.card1-row2-item-text {
  font-size: 20rpx;
  line-height: 28rpx;
  color: rgba(255, 255, 255, 0.75);
  margin-top: 8rpx;
}

/* logo */
.logo-box {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-bottom: 122rpx;
  margin-top: 80rpx;
}

.logo {
  width: 158rpx;
  height: 32rpx;
}

.container {
  display: flex; /* 弹性布局 */
  gap: 22rpx; /* 元素间距 */
  padding-top: 24rpx;
  height: 432rpx;
}

.containerProTest {
  position: relative;
  height: 206rpx;
  padding-top: 24rpx;
}

.box {
  flex: 1; /* 等分容器 */
  background-size: cover; /* 背景图适配方式 */
  background-position: center; /* 图片居中显示 */
  border-radius: 32rpx; /* 圆角效果 */
  overflow: hidden; /* 溢出隐藏 */
  position: relative; /* 定位基准 */
}

/* 背景图设置 */
.box1 {
  width: 100%;
}

.box2 {
  width: 100%;
}

.box3 {
  width: 100%;
  position: relative;
  height: 100%;
}

._button {
  width: 286rpx;
  height: 72rpx;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 40rpx;
  backdrop-filter: blur(8rpx);
  position: absolute;
  bottom: 32rpx;
  left: 24rpx;
  text-align: center;
  line-height: 72rpx;
}

.btn-text {
  width: 120rpx;
  height: 42rpx;
  font-weight: 500;
  font-size: 30rpx;
  color: #ffffff;
  line-height: 42rpx;
}

.spanTextPro1 {
  height: 50rpx;
  font-weight: 500;
  font-size: 38rpx;
  color: #ffffff;
  line-height: 50rpx;
  text-align: left;
  font-style: normal;
  position: absolute;
  top: 60rpx;
  left: 32rpx;
}

.spanTextPro2 {
  position: absolute;
  height: 34rpx;
  font-weight: 400;
  font-size: 22rpx;
  color: #ffffff;
  line-height: 34rpx;
  text-align: left;
  padding-top: 8rpx;
  left: 32rpx;
  opacity: 0.75;
}

.spanTextProTop1 {
  top: 115rpx;
}

.spanTextProTop2 {
  top: 150rpx;
}

.spanText1 {
  height: 50rpx;
  font-weight: 500;
  font-size: 38rpx;
  color: #ffffff;
  line-height: 50rpx;
  position: absolute;
  top: 172rpx;
  left: 32rpx;
}

.spanText2 {
  width: 270rpx;
  height: 68rpx;
  font-weight: 400;
  font-size: 22rpx;
  color: #ffffff;
  line-height: 34rpx;
  position: absolute;
  top: 230rpx;
  left: 32rpx;
  opacity: 0.75;
}

.arrRight {
  width: 16rpx;
  height: 16rpx;
  margin-left: 8rpx;
}
</style>
