<template>
  <div>
    <nav-bar :navOption="navOption" @navigateBack="navBack"></nav-bar>
    <bg-image src="/static/icons/bg.jpeg"></bg-image>
    <div class="card-box">
      <div class="avatar-box" @click="clickAvatar">
        <image
          class="avatar"
          src="@/static/icons/default-avatar.png"
          mode="aspectFill"
        ></image>
      </div>
      <div>
        <div class="name">
          {{ userName || '-' }}
        </div>
        <div class="my-medal" @click="goWallPage(0)">
          <div v-if="wearings.length">
            <div
              class="my-medal-item"
              v-for="(item, index) in wearings"
              :key="index"
            >
              <img
                :src="item.icon"
                class="my-medal-item-icon"
                v-if="item && item.icon"
              />
              <span style="scale: 0.75">{{ item.medalName || '' }}</span>
            </div>
          </div>

          <template v-if="totalMedal">
            <div class="me-medal-total">{{ totalMedal }}枚勋章</div>
          </template>
          <template v-else>
            <div class="me-medal-total">暂无勋章</div>
          </template>
          <div class="me-medal-right">></div>
        </div>
        <div class="my-page-star" @click="goWallPage(1)">
          <div>已登录</div>
          <div class="login-count">{{ loginCount }}</div>
          <div>次，</div>
          <div>当前累计星星</div>
          <img
            src="https://cdn.edesoft.com/cindi/upload/202405/27/288544.png"
            alt=""
            class="my-page-star-img"
          />
          <div class="my-page-star-num">{{ stars }}</div>
        </div>
        <div class="tips">
          {{ orgName }}
        </div>
      </div>
      <div v-if="false" class="logout" @click="logoutClick">退出登录</div>
    </div>
    <!-- 统计 -->
    <div class="statistics" v-if="arcBarTitle">
      <div class="statistics-title">
        <div class="statistics-title-left">训练总次(近30天)</div>
        <div class="statistics-title-right">近30天数据</div>
      </div>
      <div class="statistics-content">
        <div class="arcBar-title">
          <div class="arcBar-title-count">{{ arcBarTitle }}</div>
          <div class="arcBar-subtitle">
            网点均
            <span class="arcBar-subtitle-count">{{ arcBarSubTitle }}</span>
          </div>
        </div>

        <div class="statistics-content-arcbar">
          <qiun-data-charts
            type="arcbar"
            :opts="optsArcbar"
            :chartData="arcbarData"
          />
        </div>
      </div>
      <div class="statistics-title">
        <div class="statistics-title-left">综合能力分别</div>
        <div class="statistics-title-right">近30天数据</div>
      </div>
      <div class="statistics-content">
        <div class="statistics-content-radar">
          <qiun-data-charts
            type="radar"
            :opts="optsRadar"
            :chartData="radarData"
          />
        </div>
      </div>
    </div>

    <div class="history flex-jus">
      <div class="flex-align">
        <image
          class="history-icon"
          src="@/static/icons/histroy.png"
          mode="aspectFit"
        ></image>
        <span>历史训练</span>
      </div>
      <div class="flex-align" @click="clickRecords">
        <span>查看全部</span>
        <image
          class="history-arrow"
          src="@/static/icons/card-right.png"
          mode="aspectFit"
        ></image>
      </div>
    </div>
    <training-list :list="trainingList"></training-list>

    <div class="new-logout" @click="logoutClick">退出登录</div>

    <public-logo></public-logo>
    <div style="height: 120rpx"></div>
  </div>
</template>

<script>
import pageCommon from '@/mixins/page.common.js'
import TrainingList from '@/components/trainingList.vue'
import qiunDataCharts from '@/components/qiun-data-charts/qiun-data-charts.vue'
import { version } from '@/utils/baseconfig.js'

export default {
  name: 'MyProfile',
  mixins: [pageCommon],
  components: { TrainingList, qiunDataCharts },
  data() {
    return {
      navOption: {
        navTitle: '个人档案',
        backgroundColor: '',
        hasPlaceholder: true,
        showBackTip: true,
        color: '#ffffff'
      },
      avatarClickCount: 0,
      trainingList: [],
      totalMedal: 0,
      loginCount: 0,
      stars: 0,
      wearings: [],
      userName: '',
      orgName: '',
      // 圆环
      arcbarData: {},
      optsArcbar: {},
      // 雷达图
      radarData: {},
      optsRadar: {},
      arcBarTitle: '',
      arcBarSubTitle: '',
      radarXData: [],
      radarYUserData: [],
      radarYOrgData: [],
      arcBarValue: 0
    }
  },
  async onReady() {
    await this.waitingUserLoaded()
    await this.fetchData()
  },
  methods: {
    async fetchData() {
      await this.getSummaryForMedal()
      await this.getMySummary30daysData()
      await this.getServerDataForArcbar()
      await this.getServerDataForRadar()
      await this.getSearchTraining()
    },
    async getMySummary30daysData() {
      const res = await this.$api.getMySummary30days()

      this.arcBarTitle = res.userData.trainingCount
        ? res.userData.trainingCount
        : 0
      this.arcBarSubTitle = res.orgData.avgCount ? res.orgData.avgCount : 0
      // 限制在0-1之间
      this.arcBarValue = Math.min(
        1,
        Math.max(0, res.userData.trainingCount / res.orgData.avgCount)
      )

      this.radarXData = res.userData.avgAbilities.map(
        (obj) => obj.title + ': ' + obj.value + '.0⭐'
      )
      this.radarYUserData = res.userData.avgAbilities.map((obj) => obj.value)
      this.radarYOrgData = res.orgData.avgAbilities.map((obj) => obj.value)
    },
    // 圆环
    getServerDataForArcbar() {
      this.optsArcbar = {
        color: ['#ed171f', '#FF8433'],
        title: {
          name: ''
        },
        subtitle: {
          name: ''
        },
        extra: {
          arcbar: {
            type: 'circle',
            width: 8,
            backgroundColor: '#513A31',
            startAngle: 1.5,
            endAngle: 0.25,
            gap: 2,
            linearType: 'custom',
            customColor: ['#ed171f', '#FF8433']
          }
        }
      }
      this.arcbarData = {
        series: [
          {
            data: this.arcBarValue
          }
        ]
      }
    },
    // 雷达图
    getServerDataForRadar() {
      this.optsRadar = {
        timing: 'easeOut',
        duration: 1000,
        rotate: false,
        rotateLock: false,
        color: ['#FF8433', '#ED171F'],
        padding: [18, 0, 24, 0],
        dataLabel: false,
        dataPointShape: false,
        fontSize: 14,
        legend: {
          position: 'bottom', // 定位在底部
          data: ['网点评价', '个人评价'],
          itemGap: 24,
          textStyle: {
            color: '#fff',
            fontSize: 14
          },
          selectedMode: 'single'
        },
        extra: {
          radar: {
            gridType: 'radar',
            gridColor: '#454545',
            gridCount: 5,
            gridEval: 1,
            radius: 0,
            axisLabel: false,
            labelShow: true,
            labelColor: '#ffffff',
            labelPointShow: true,
            labelPointRadius: 3,
            labelPointColor: '#ED171F',
            opacity: 0.3,
            border: true,
            borderWidth: 1,
            max: 5,
            axisLabelTofix: 0,
            linearType: 'none'
          },
          tooltip: {
            showBox: false
          }
        }
      }
      this.radarData = {
        categories: this.radarXData,
        series: [
          {
            name: '网点评价',
            data: this.radarYOrgData
          },
          {
            name: '个人评价',
            data: this.radarYUserData
          }
        ]
      }
    },
    // 勋章统计
    async getSummaryForMedal() {
      const res = await this.$api.getMySummary()
      this.userName = res.nickName || res.userName || ''
      this.orgName = res.org ? res.org.name : ''
      this.totalMedal = res.medal ? res.medal.total : 0
      this.loginCount = res.loginCount || 0
      this.stars = res.star ? res.star.total : 0
      this.wearings = res.medal && res.medal.wearings ? res.medal.wearings : []
    },
    // 历史训练-5条
    async getSearchTraining() {
      let res = await this.$api.getSearchTraining({ pageSize: 5 })
      this.trainingList = res.data || []
    },
    async clickRecords() {
      return uni.navigateTo({
        url: '/pages/training/records'
      })
    },
    async clickAvatar() {
      this.avatarClickCount++
      if (this.avatarClickCount >= 10) {
        this.avatarClickCount = 0
        const userID = this.user && this.user.id
        const userName = this.user && this.user.userName
        uni.showModal({
          title: `用户[${userID}]: ${userName}`,
          content: `版本号：${version}`,
          showCancel: false
        })
      }
    },
    async goWallPage(tabIndex) {
      return uni.navigateTo({
        url: `/pages/wall/index?tabIndex=${tabIndex}`
      })
    },
    // 退出登录
    async logoutClick() {
      uni.showModal({
        title: '提示',
        content: '确认退出登录吗？',
        success: async (res) => {
          if (res.confirm) {
            console.log('用户点击确定')
            let res = await this.$api.logoutUserInfo()
            await this.$store.dispatch('root/set_user', res)
            uni.reLaunch({
              url: '/pages/welcome/index'
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
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
.history {
  padding: 0 40rpx;
  font-size: 22rpx;
  font-family: SourceHanSansCN, SourceHanSansCN;
  font-weight: 400;
  color: #cfcfcf;
}

.history-arrow {
  width: 20rpx;
  height: 20rpx;
  margin-left: 6rpx;
}

.history-icon {
  width: 30rpx;
  height: 30rpx;
  margin-right: 12rpx;
}

.history-icon + span {
  font-size: 30rpx;
  font-family: SourceHanSansCN, SourceHanSansCN;
  font-weight: 500;
  color: #ffffff;
}

.card-box .logout {
  width: 148rpx;
  height: 50rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 26rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.5);
  position: absolute;
  top: 40rpx;
  right: 32rpx;
  color: rgba(255, 255, 255, 0.5);
  font-size: 22rpx;
}

.card-box .tips {
  font-size: 22rpx;
  font-family: SourceHanSansCN, SourceHanSansCN;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.8);
  line-height: 34rpx;
}

.card-box .level {
  margin-bottom: 6rpx;
  font-size: 22rpx;
  font-family: SourceHanSansCN, SourceHanSansCN;
  font-weight: 400;
  color: #ed171f;
  line-height: 34rpx;
}

.card-box .name {
  margin-top: 6rpx;
  font-size: 34rpx;
  font-family: SourceHanSansCN, SourceHanSansCN;
  font-weight: 500;
  color: #ffffff;
  line-height: 50rpx;
}

.avatar-box .avatar {
  width: 100%;
  height: 100%;
}
.card-box .avatar-box {
  width: 128rpx;
  height: 128rpx;
  border-radius: 50%;
  margin-right: 32rpx;
  background: rgba(243, 33, 89, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.card-box {
  display: flex;
  width: 690rpx;
  min-height: 208rpx;
  margin: 30rpx 30rpx 24rpx;
  padding: 40rpx 32rpx;
  box-sizing: border-box;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 20rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(16px);
  position: relative;
}

.flex-jus {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.flex-align {
  display: flex;
  align-items: center;
}

/* 勋章 */
.my-medal {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 10rpx;
  margin-top: 18rpx;
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

.me-medal-total {
  color: #ff8433;
  font-size: 22rpx;
  line-height: 34rpx;
}
.me-medal-right {
  color: #ff8433;
  font-size: 22rpx;
  margin-left: 8rpx;
  height: 38rpx;
}

.login-count {
  color: #f99129;
  font-size: 26rpx;
  margin: 0 8rpx;
}

.my-page-star {
  display: flex;
  align-items: center;
  color: #ffffff;
  font-size: 22rpx;
  margin-top: 14rpx;
  margin-bottom: 16rpx;
}
.my-page-star-img {
  width: 28rpx;
  height: 28rpx;
  margin-left: 16rpx;
  margin-right: 8rpx;
}
.my-page-star-num {
  color: #f99129;
  font-size: 26rpx;
}

/* 中间统计 */
.statistics {
  width: 690rpx;
  padding: 0 30rpx;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 20rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(16px);
  box-sizing: border-box;
  margin: 30rpx 30rpx 24rpx;
}
.statistics-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 32rpx 0;
  box-sizing: border-box;
  width: 100%;
}
.statistics-title-left {
  color: #cfcfcf;
  font-size: 26rpx;
  line-height: 38rpx;
}
.statistics-title-right {
  color: #787878;
  font-size: 22rpx;
  line-height: 34rpx;
}
.statistics-content {
  border-bottom: 2rpx dashed rgba(255, 255, 255, 0.2);
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 40rpx;
}
.statistics-content-arcbar {
  width: 200rpx;
  height: 200rpx;
}
.statistics-content-radar {
  width: 100%;
  height: 480rpx;
}
.statistics-content:nth-last-child(1) {
  border-bottom: none;
}
.arcBar-title {
  position: absolute;
  text-align: center;
}

.arcBar-title-count {
  height: 56rpx;
  font-weight: bold;
  font-size: 56rpx;
  color: #ed171f;
  line-height: 56rpx;
}

.arcBar-subtitle {
  height: 34rpx;
  font-weight: 400;
  font-size: 22rpx;
  color: #ffffff;
  line-height: 34rpx;
}

.arcBar-subtitle-count {
  height: 34rpx;
  font-weight: bold;
  font-size: 22rpx;
  color: #ff8433;
  line-height: 34rpx;
  padding-left: 2rpx;
}

.new-logout {
  width: 264rpx;
  height: 80rpx;
  border-radius: 40rpx;
  border: 2rpx solid rgba(237, 23, 31, 0.8);
  margin: 80rpx auto 120rpx;
  font-family: SourceHanSansCN, SourceHanSansCN;
  font-weight: 400;
  font-size: 26rpx;
  color: rgba(237, 23, 31, 0.8);
  line-height: 80rpx;
  text-align: center;
  font-style: normal;
}
</style>
