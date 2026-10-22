<template>
  <div class="wall-page">
    <nav-bar :navOption="navOption" @navigateBack="navBack"></nav-bar>
    <bg-image src="/static/icons/bg.jpeg"></bg-image>
    <!-- 统计 -->
    <div class="wall-card">
      <!-- <img
        src="@/static/icons/default-avatar.png"
        alt=""
        class="wall-card-logo"
      />
      <div class="wall-card-name">
        {{ wallUser.userName || wallUser.nickName || '-' }}的成就
      </div> -->
      <div class="wall-card-text">记录我的进步</div>
      <div class="wall-card-total">
        <!-- <img
          src="https://cdn.edesoft.com/cindi/upload/202405/27/877499.png"
          alt=""
          class="wall-card-total-img"
        /> -->
        <div class="wall-card-total-num">{{ wallUser.medals || 0 }}</div>
      </div>
      <div class="wall-card-tips">已拥有枚勋章</div>
      <div class="wall-card-content">
        <div class="wall-card-content-text">当前累计星星</div>
        <img
          src="https://cdn.edesoft.com/cindi/upload/202405/27/288544.png"
          alt=""
          class="wall-card-content-img"
        />
        <div class="wall-card-content-num">{{ wallUser.stars || 0 }}</div>
      </div>
    </div>
    <!-- tab -->
    <div
      class="wall-tab"
      :style="{ top: navigationHeight + 'px', backgroundColor: tabBgColor }"
      id="wall-tab"
    >
      <div
        class="wall-tab-item"
        v-for="(item, index) in tabList"
        :key="index"
        @click="changeTab(index)"
      >
        <div
          :class="[
            'wall-tab-item-name',
            index === tabIndex ? 'wall-tab-item-name-active' : ''
          ]"
        >
          {{ item }}
        </div>
        <img
          src="/static/wall/tips-default.png"
          alt=""
          srcset=""
          class="wall-tab-item-img"
          @click.stop="openExplain"
          v-if="index === 1"
        />
        <div class="wall-tab-item-div" v-if="index === tabIndex"></div>
      </div>
    </div>
    <!-- 我的勋章 -->
    <wall-medal
      v-if="tabIndex === 0"
      :userMedals="userMedals"
      @clickWearing="clickWearing"
    ></wall-medal>
    <!-- 我的星星 -->
    <wall-star v-if="tabIndex === 1" :userAiHumans="userAiHumans"></wall-star>
    <public-logo></public-logo>
    <explain-popup ref="explainRef"></explain-popup>
  </div>
</template>

<script>
import pageCommon from '@/mixins/page.common.js'
import WallMedal from '@/components/wall/wall-medal.vue'
import WallStar from '@/components/wall/wall-star.vue'
import ExplainPopup from '@/components/wall/explain-popup.vue'
export default {
  name: 'Wall',
  mixins: [pageCommon],
  components: { WallMedal, WallStar, ExplainPopup },
  data() {
    return {
      navOption: {
        navTitle: '的成就',
        backgroundColor: '',
        hasPlaceholder: true,
        showBackTip: true,
        color: '#ffffff'
      },
      tabList: ['我的勋章', '我的星星'],
      tabIndex: 0,
      optionTabIndex: 0,
      wallUser: {},
      userAiHumans: [],
      userMedals: [],
      navigationHeight: '',
      scrollTop: 0,
      tabOffsetTop: 0,
      tabBgColor: 'transparent'
    }
  },
  computed: {
    showUserName() {
      return this.wallUser.userName || this.wallUser.nickName || '-'
    }
  },
  onReady() {
    this.getTabOffsetTop()
  },
  onPageScroll(e) {
    this.scrollTop = e.scrollTop
    // 当滚动超过 tab 的位置时，设置导航栏背景色
    if (this.scrollTop >= this.tabOffsetTop) {
      this.navOption.backgroundColor = '#353440'
      this.tabBgColor = '#353440'
    } else {
      this.navOption.backgroundColor = 'transparent'
      this.tabBgColor = 'transparent'
    }
  },
  onLoad(options) {
    this.optionTabIndex = options.tabIndex ? Number(options.tabIndex) : 0
  },
  async onShow() {
    this.getNavigationHeight()
    await this.waitingUserLoaded()
    await this.fetchData()
    this.tabIndex = this.optionTabIndex
  },
  methods: {
    getTabOffsetTop() {
      const query = uni.createSelectorQuery()
      query
        .select('#wall-tab')
        .boundingClientRect((data) => {
          if (data) {
            this.tabOffsetTop = data.top
          }
        })
        .exec()
    },
    async fetchData() {
      const res = await this.$api.getWallForData()
      this.wallUser = res.user
      this.userAiHumans = res.userAiHumans || []
      let userMedals = res.userMedals || []
      this.getMedalGroup(userMedals)
      this.navOption.navTitle = `${this.showUserName}的成就`
    },
    // 勋章分组
    getMedalGroup(userMedals) {
      const group = []
      userMedals.forEach((item) => {
        const index = group.findIndex((i) => i.medalCateID === item.medalCateID)
        if (index === -1) {
          group.push({
            medalCateName: item.medalCateName,
            medalCateID: item.medalCateID,
            list: [item]
          })
        } else {
          group[index].list.push(item)
        }
      })
      this.userMedals = group
    },
    getNavigationHeight() {
      const app = getApp()
      this.navigationHeight = app.globalData.customBar
    },
    async clickWearing(id) {
      await this.$api.wearUserForMedal(id)
      await this.fetchData()
    },
    changeTab(index) {
      this.tabIndex = index
    },
    openExplain() {
      this.$refs.explainRef.open()
    }
  },
  async onPullDownRefresh() {
    await this.fetchData()
    uni.stopPullDownRefresh()
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
.wall-page {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.wall-card {
  /* position: relative; */
  width: calc(100% - 60rpx);
  /* height: 434rpx; */
  margin-top: 48rpx;
  margin-bottom: 32rpx;
  /* border-radius: 32rpx; */
  display: flex;
  flex-direction: column;
  align-items: center;
  /* padding-top: 88rpx; */
  box-sizing: border-box;
  /* background-image: url('/static/wall/wall.png');
  background-size: 100% 100%; */
}
/* .wall-card-logo {
  position: absolute;
  width: 128rpx;
  height: 128rpx;
  top: -64rpx;
  right: 0;
  left: 0;
  margin: auto;
  z-index: 1;
} */
/* .wall-card-name {
  font-size: 38rpx;
  color: #fff;
  font-weight: 600;
  line-height: 50rpx;
} */
.wall-card-text {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.8);
  line-height: 38rpx;
}
.wall-card-total {
  width: 466rpx;
  display: flex;
  align-items: baseline;
  justify-content: center;
  background-image: url('https://cdn.edesoft.com/cindi/upload/202405/27/877499.png');
  background-size: 466rpx 128rpx;
  background-repeat: no-repeat;
}
/* .wall-card-total-img {
  width: 466rpx;
  height: 128rpx;
  position: absolute;
  right: 0;
  margin: auto;
} */
.wall-card-total-num {
  font-weight: bold;
  color: #fff;
  font-size: 104rpx;
  line-height: 104rpx;
  margin-top: 24rpx;
}
.wall-card-tips {
  font-size: 26rpx;
  color: #fff;
  line-height: 38rpx;
  margin-top: 8rpx;
}
.wall-card-content {
  height: 56rpx;
  min-width: 292rpx;
  border-radius: 28rpx;
  background-color: rgba(249, 145, 41, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 16rpx;
}
.wall-card-content-text {
  font-size: 26rpx;
  color: #fff;
  line-height: 38rpx;
}
.wall-card-content-img {
  width: 24rpx;
  height: 24rpx;
  margin-left: 18rpx;
  margin-right: 10rpx;
}
.wall-card-content-num {
  font-weight: bold;
  color: #f99129;
  font-size: 30rpx;
  line-height: 30rpx;
}

/* tab */
.wall-tab {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;
  border-bottom: 2rpx solid #444751;
  position: sticky;
  left: 0;
  z-index: 10; /* 确保 tab 在其他内容之上 */
}
.wall-tab-item {
  height: 86rpx;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
.wall-tab-item-name {
  color: rgba(255, 255, 255, 0.8);
  font-size: 34rpx;
}
.wall-tab-item-name-active {
  color: #fff;
  font-weight: 600;
}
.wall-tab-item-img {
  width: 28rpx;
  height: 28rpx;
  margin-left: 8rpx;
}
.wall-tab-item-div {
  height: 8rpx;
  border-radius: 4rpx;
  width: 100%;
  background-color: #ed171f;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
}
</style>
