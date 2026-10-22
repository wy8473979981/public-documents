<template>
  <div class="training-targeted" :style="{ height: showPopup ? '100vh' : '' }">
    <nav-bar :navOption="navOption" @navigateBack="navBack"></nav-bar>
    <bg-image src="/static/icons/bg.jpeg"></bg-image>
    <!-- 顶部类型 -->

    <div class="set-center">
      <div class="training-targeted-swiper">
        <div
          class="training-targeted-swiper-item"
          v-for="(item, index) in aiTypeList"
          :key="index"
          @click="changeSwiperIndex(index)"
        >
          <div
            :class="[
              typeIndex === index ? 'training-targeted-swiper-item-active' : ''
            ]"
          >
            {{ item.name }}
          </div>
        </div>
      </div>
    </div>

    <FeatureOnePopup
      ref="featureRef1"
      v-if="nowFeatures.length === 1"
      :showPopup="showPopup"
      :pickerHeight="pickerHeight"
      :features="nowFeatures"
      :selectFeatures="selectFeatures"
      @submitFeature="submitFeature"
      @openPopup="openPopup"
      @closePopup="closePopup"
    ></FeatureOnePopup>
    <FeatureTwoPopup
      ref="featureRef2"
      v-if="nowFeatures.length > 1"
      :showPopup="showPopup"
      :pickerHeight="pickerHeight"
      :trainingTypeName="nowTrainingTypeName"
      :features="nowFeatures"
      :selectFeatures="selectFeatures"
      @submitFeature="submitFeature"
      @openPopup="openPopup"
      @closePopup="closePopup"
    ></FeatureTwoPopup>

    <div class="card-box">
      <div class="item-box" v-for="(item, index) in aiHumanList" :key="index">
        <!-- 当图片宽高与盒子不对称时，要么上下不能居中，要么左右不能居中
            换成背景图写法可以避开居中问题 -->
        <!-- <image class="item-img" src="@/static/icons/bg.jpeg" mode="aspectFill"></image> -->

        <!-- item.unlockType ===0 不锁定 -->
        <!-- item.unlockType ===1 不指定人设解锁 -->
        <!-- item.unlockType ===2 指定人设解锁 -->

        <!-- item.unlockInfo.status===0 待解锁 -->
        <!-- item.unlockInfo.status===1 可解锁 -->
        <!-- item.unlockInfo.status===2 已解锁 -->

        <!-- 1、 虚拟人设的头像 -->
        <div
          class="item-img"
          :style="{
            backgroundImage: `url(${item.avatarURL})`
          }"
          v-if="
            item.unlockType === 0 ||
            (item.unlockType !== 0 && item.unlockInfo.status === 2)
          "
        ></div>
        <template v-else>
          <div class="item-img-lock"></div>
          <div class="item-img-lock-space"></div>
        </template>

        <!--2、 母语为粤语显示 -->
        <div
          class="item-box-exclusive"
          v-if="
            item.language === 1 &&
            (item.unlockType === 0 ||
              (item.unlockType !== 0 && item.unlockInfo.status === 2))
          "
        >
          大湾区专属
        </div>
        <!-- 3、忙线/在线 -->
        <div
          class="item-busy-status"
          :style="
            item.isBusy
              ? '--busy-status-bg-color: rgba(237, 23, 31, 0.50); --busy-status-color: #ed171f;'
              : '--busy-status-bg-color: rgba(145, 217, 79, 0.50); --busy-status-color: #91d94f;'
          "
          v-if="
            item.unlockType === 0 ||
            (item.unlockType !== 0 && item.unlockInfo.status === 2)
          "
        >
          <span class="item-busy-status-text">{{
            item.isBusy ? '忙线' : '在线'
          }}</span>
        </div>
        <!-- 4、待解锁 -->
        <div
          class="item-waiting-lock"
          v-if="item.unlockType !== 0 && item.unlockInfo.status === 0"
        >
          <img
            src="/static/wall/unlock-waiting.png"
            alt=""
            class="item-waiting-lock-icon"
          />
          <div>待解锁</div>
        </div>
        <!-- 5、可解锁 -->
        <div
          class="item-waiting-can-lock"
          v-if="item.unlockType !== 0 && item.unlockInfo.status === 1"
        >
          <img
            src="/static/wall/unlock-checked.png"
            alt=""
            class="item-waiting-lock-icon"
          />
          <div>可解锁</div>
        </div>

        <!-- 下方正文 -->
        <div class="item-content">
          <div class="item-name">{{ item.name }}</div>
          <div class="item-red">{{ getAihumanInfo(item) }}</div>
          <div class="item-total">
            总聊天次数<span
              class="item-total-red"
              style="margin-right: 16rpx"
              >{{ item.usedTimes }}</span
            >
            平均成功率<span class="item-total-red"
              >{{ (100 * item.avgRate).toFixed(0) }}%</span
            >
          </div>
          <div
            v-if="
              item.unlockType === 0 ||
              (item.unlockType !== 0 && item.unlockInfo.status === 2)
            "
            class="item-star-box"
          >
            <div>最高达成成绩</div>
            <img
              src="/static/wall/tips-default.png"
              alt=""
              class="item-star-tips"
              @click.stop="openExplain"
            />
            <template v-if="item.unlockInfo.maxStars">
              <img
                src="https://cdn.edesoft.com/cindi/upload/202405/27/288544.png"
                alt=""
                class="item-star-icon"
                v-for="indx in item.unlockInfo.maxStars"
                :key="indx"
              />
            </template>
            <img
              src="https://cdn.edesoft.com/cindi/upload/202405/27/453429.png"
              alt=""
              class="item-star-icon"
              v-for="indx in 5 - item.unlockInfo.maxStars"
              :key="indx"
            />
          </div>
          <div
            class="item-play"
            @click="goTrain(item)"
            :style="
              item.isBusy ? '--brightness-val: 0.6;' : '--brightness-val: 1;'
            "
            v-if="
              item.unlockType === 0 ||
              (item.unlockType !== 0 && item.unlockInfo.status === 2)
            "
          >
            立即开始
          </div>
          <div
            class="item-lock-text"
            v-if="item.unlockType !== 0 && item.unlockInfo.status !== 2"
          >
            <div v-if="item.unlockType === 1">
              累计{{ item.unlockInfo.targetStars }}颗星即可解锁
            </div>
            <div v-if="item.unlockType === 2">
              指定客户训练累计{{ item.unlockInfo.targetStars }}颗星即可解锁
            </div>
            <div>
              ({{ item.unlockInfo.currentStars }}/{{
                item.unlockInfo.targetStars
              }})
            </div>
          </div>
          <div
            class="item-lock-step"
            v-if="item.unlockType !== 0 && item.unlockInfo.status !== 2"
          >
            <div
              class="item-lock-step-son"
              :style="{
                width: `${setStep(item)}%`
              }"
            ></div>
          </div>
          <div
            class="item-lock-person"
            v-if="item.unlockType === 2 && item.unlockInfo.status === 0"
          >
            <template
              v-if="
                item.unlockInfo.byAiHumans &&
                item.unlockInfo.byAiHumans.length > 0
              "
            >
              <div
                class="item-lock-person-item"
                v-for="(byItem, byIndex) in item.unlockInfo.byAiHumans"
                :key="byIndex"
              >
                <div class="item-lock-person-item-name">
                  {{ byItem.name }}
                </div>
                <div class="item-lock-person-item-icon">
                  <template v-if="byItem.maxStars">
                    <img
                      src="https://cdn.edesoft.com/cindi/upload/202405/27/288544.png"
                      alt=""
                      class="item-lock-star"
                      v-for="indx in byItem.maxStars"
                      :key="indx"
                    />
                  </template>
                  <img
                    src="https://cdn.edesoft.com/cindi/upload/202405/27/453429.png"
                    alt=""
                    class="item-lock-star"
                    v-for="indx in 5 - byItem.maxStars"
                    :key="indx"
                  />
                </div>
              </div>
            </template>
          </div>
          <div
            class="item-lock-butt"
            v-if="item.unlockType !== 0 && item.unlockInfo.status === 1"
            @click.stop="clickOpenLock(item)"
          >
            <img
              src="/static/wall/unlock-white.png"
              alt=""
              class="item-lock-butt-icon"
            />
            <div>点击解锁</div>
          </div>
        </div>
      </div>
    </div>

    <public-logo></public-logo>
    <!-- 最高成绩解释 -->
    <explain-popup ref="explainRef"></explain-popup>
    <!-- 解锁成功提示 -->
    <unlock-popup ref="unlockRef"></unlock-popup>
  </div>
</template>

<script>
import { getAllAiHuman } from '@/api/index'
import pageCommon from '@/mixins/page.common.js'
import ExplainPopup from '@/components/wall/explain-popup.vue'
import UnlockPopup from '@/components/wall/unlock-popup.vue'
import FeatureOnePopup from '@/components/targeted/FeatureOnePopup.vue'
import FeatureTwoPopup from '@/components/targeted/FeatureTwoPopup.vue'
export default {
  name: 'TrainingKyc',
  mixins: [pageCommon],
  components: { ExplainPopup, UnlockPopup, FeatureOnePopup, FeatureTwoPopup },
  data() {
    return {
      navOption: {
        navTitle: '定向对练',
        backgroundColor: '',
        hasPlaceholder: true,
        showBackTip: true,
        color: '#ffffff'
      },
      aiHumanList: [],
      typeIndex: 0,
      aiTypeList: [],
      navigationHeight: 84,
      showPopup: false,
      // selectFeatures: [] //选中的特征
      selectFeaturesByTrainingType: [] //选中的特征列表
    }
  },
  computed: {
    selectFeatures() {
      const selectedItem = this.selectFeaturesByTrainingType.find((item) => {
        if (item.trainingTypeID === this.nowTrainingTypeID) {
          return item.features || []
        }
      })

      return (selectedItem && selectedItem.features) || []
    },
    pickerHeight() {
      return `calc(100vh - ${this.navigationHeight}px - 86rpx - 80rpx)`
    },
    nowTrainingTypeID() {
      if (this.aiTypeList && this.aiTypeList.length > 0) {
        return this.aiTypeList[this.typeIndex].id
      }
      return 0
    },
    nowFeatures() {
      let list = []
      if (this.aiTypeList && this.aiTypeList.length > 0) {
        list = JSON.parse(
          JSON.stringify(this.aiTypeList[this.typeIndex].features || [])
        )
      }
      if (list.length === 1) {
        let oneFeature = { label: `全部${list[0].label}`, value: 0 }
        list[0].children.unshift(oneFeature)
      }
      return list
    },
    nowTrainingTypeName() {
      if (this.aiTypeList && this.aiTypeList.length > 0) {
        return this.aiTypeList[this.typeIndex].name
      }
      return ''
    }
  },
  created() {
    const app = getApp()
    this.navigationHeight = app.globalData.customBar
  },
  async onLoad(options) {
    this.typeIndex = 0
    this.typeIndex = Number(options.typeIndex) || 0
    await this.waitingUserLoaded()
    await this.fetchData()
  },
  async onPullDownRefresh() {
    this.typeIndex = 0
    this.closePopup()
    await this.fetchData()
    uni.stopPullDownRefresh()
  },
  methods: {
    async fetchData() {
      this.closePopup()
      await this.getAiHumanTypeData()
      await this.getAiHumanData()
    },
    // 人设类别
    async getAiHumanTypeData() {
      const res = await this.$api.getTargetedTraining()
      this.aiTypeList = res.data || []
      // 初始化选中特征
      this.selectFeaturesByTrainingType = []
      this.aiTypeList.forEach((item) => {
        const newItem = {
          trainingTypeID: item.id,
          features: []
        }
        this.selectFeaturesByTrainingType.push(newItem)
      })
    },
    async getAiHumanData() {
      let query = {}
      if (this.nowTrainingTypeID) {
        query.trainingTypeID = this.nowTrainingTypeID
      }
      if (this.selectFeatures && this.selectFeatures.length > 0) {
        query.features = this.selectFeatures
          .filter((item) => item > 0)
          .map((item) => item)
          .join(',')
      }
      const res = await getAllAiHuman(query)
      this.aiHumanList = res.data || []
    },
    async submitFeature(ids) {
      this.selectFeaturesByTrainingType.forEach((item) => {
        if (item.trainingTypeID === this.nowTrainingTypeID) {
          item.features = ids
        }
      })
      await this.getAiHumanData()
    },
    async goTrain(ai) {
      let type = 'invite'
      if (this.typeIndex === 1) {
        type = 'kyc'
      }

      if (!ai || ai.isBusy) return
      if (ai.trainingType && ai.trainingType.hasPdf) {
        return uni.navigateTo({
          url: `/pages/training/knowledge?aiHumanID=${ai.id}&type=${type}`
        })
      }

      return wx.navigateTo({
        url: `/pages/training/connect?ai=${ai.id}&type=${type}`
      })
    },
    openExplain() {
      this.$refs.explainRef.open()
    },
    openUnlockSuccess() {
      this.$refs.unlockRef.open()
    },
    // 点击解锁
    async clickOpenLock(item) {
      await this.$api.unlockForAiHuman(item.id)
      await this.fetchData()
      this.openUnlockSuccess()
    },
    setStep(item) {
      if (!item.unlockInfo.currentStars && !item.unlockInfo.targetStars) return
      let num =
        (item.unlockInfo.currentStars / item.unlockInfo.targetStars) * 100
      if (num > 100) return 100
      return num
    },
    async changeSwiperIndex(index) {
      this.typeIndex = index
      this.closePopup()
      await this.getAiHumanData()
    },
    openPopup() {
      this.showPopup = !this.showPopup
    },
    closePopup() {
      this.showPopup = false
    }
  }
}
</script>

<style scoped>
.set-center {
  text-align: center;
}

.training-targeted {
  width: 100%;
  overflow: hidden;
}
.training-targeted-swiper {
  margin: 16rpx auto;
  padding: 12rpx 32rpx;
  flex-wrap: nowrap;
  align-items: center;
  box-sizing: border-box;
  overflow-x: auto;
  display: inline-flex;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 36rpx;
  height: 64rpx;
}
.training-targeted-swiper-item {
  width: 184rpx;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative !important;
  color: rgba(255, 255, 255, 0.75);
  flex-shrink: 0;
  font-weight: 500;
  font-size: 30rpx;
}
.training-targeted-swiper-item-active {
  color: #fff;
  background: #ed171f;
  border-radius: 36rpx;
  height: 64rpx;
  line-height: 64rpx;
  padding: 0 32rpx;
  width: 184rpx;
  text-align: center;
}

.training-targeted-swiper-item:first-child {
  margin-left: -30rpx;
}

.training-targeted-swiper-item:last-child {
  margin-right: -30rpx;
}

/* 列表 */
.card-box {
  width: 100%;
  padding: 0 30rpx;
  box-sizing: border-box;
  margin-top: 30rpx;
}

.item-box {
  position: relative;
  display: inline-block;
  width: 334rpx;
  height: 504rpx;
  border-radius: 20rpx;
  background-image: linear-gradient(
    180deg,
    rgba(76, 0, 20, 0) 0%,
    rgba(76, 0, 20, 0.15) 63%,
    rgba(121, 0, 32, 0.6) 100%
  );
  overflow: hidden;
  margin-bottom: 24rpx;
}
.item-box:nth-child(2n + 1) {
  margin-right: 20rpx;
}

.item-img {
  position: absolute;
  inset: 0 0 0 0;
  z-index: -1;
  height: 100%;
  opacity: 0.75;
  background: no-repeat center;
  background-size: cover;
}
.item-img-lock {
  position: absolute;
  inset: 0 0 0 0;
  z-index: -1;
  height: 100%;
  opacity: 0.75;
  background: no-repeat center;
  background-size: cover;
  background-image: url('https://cdn.edesoft.com/cindi/upload/202405/27/416113.jpg');
}
.item-img-lock-space {
  position: absolute;
  width: 100%;
  bottom: 0;
  left: 0;
  z-index: 0;
  height: 352rpx;
  opacity: 0.75;
  background: no-repeat center;
  background-size: cover;
  background-image: url('https://cdn.edesoft.com/cindi/upload/202405/27/599224.png');
}
.item-box-exclusive {
  background-image: linear-gradient(to right, #f0cb96, #ecaf73);
  height: 40rpx;
  border-radius: 0rpx 8rpx 0rpx 8rpx;
  position: absolute;
  top: 0;
  right: 0;
  z-index: 1;
  padding: 0 12rpx;
  color: #663c00;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
}
.item-busy-status {
  position: absolute;
  top: 0;
  left: 32rpx;
  font-size: 24rpx;
  color: #ffffff;
  /* background: rgba(0, 0, 0, 0.5); */
  height: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 12rpx;
  border-radius: 0pt 0pt 8rpx 8rpx;
  background-color: var(--busy-status-color);
}

/* .item-busy-status-text::before {
  content: '';
  display: inline-block;
  width: 14rpx;
  height: 14rpx;
  background: var(--busy-status-color);
  border-radius: 50%;
  margin: 0 10rpx 2rpx 0;
} */

.item-waiting-lock {
  position: absolute;
  top: 10rpx;
  left: 32rpx;
  height: 40rpx;
  padding: 0 12rpx;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 20rpx;
  border: 2rpx solid rgba(186, 186, 186, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  color: rgba(186, 186, 186, 0.8);
}
.item-waiting-lock-icon {
  width: 18rpx;
  height: 18rpx;
  margin-right: 6rpx;
}
.item-waiting-can-lock {
  position: absolute;
  top: 10rpx;
  left: 32rpx;
  height: 40rpx;
  padding: 0 12rpx;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 20rpx;
  border: 2rpx solid rgba(255, 255, 255, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.8);
}

.item-content {
  position: absolute;
  width: 100%;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 24rpx;
  box-sizing: border-box;
}
.item-name {
  font-size: 28rpx;
  font-family: SourceHanSansCN, SourceHanSansCN;
  font-weight: 500;
  color: #ffffff;
  width: 100%;
}
.item-red {
  font-size: 20rpx;
  font-family: SourceHanSansCN, SourceHanSansCN;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.8);
  width: 100%;
  margin-top: 12rpx;
}
.item-total {
  font-size: 18rpx;
  font-family: SourceHanSansCN, SourceHanSansCN;
  color: rgba(255, 255, 255, 0.8);
  width: 100%;
  margin-top: 12rpx;
}
.item-total-red {
  color: #ed171f;
  font-weight: 600;
  margin-left: 4rpx;
  font-size: 18rpx;
}

.item-star-box {
  display: flex;
  align-items: center;
  color: rgba(255, 255, 255, 0.8);
  font-size: 18rpx;
  width: 100%;
  margin-top: 4rpx;
}
.item-star-tips {
  width: 16rpx;
  height: 16rpx;
  margin-left: 6rpx;
  /* margin-right: 10rpx; */
}
.item-star-icon {
  width: 24rpx;
  height: 24rpx;
  margin-left: 6rpx;
}
.item-play {
  margin-top: 24rpx;
  width: 286rpx;
  height: 72rpx;
  background: linear-gradient(270deg, #ff8433 0%, #ed171f 100%);
  border-radius: 36rpx;
  font-size: 30rpx;
  font-family: SourceHanSansCN, SourceHanSansCN;
  font-weight: 400;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  filter: brightness(var(--brightness-val));
  margin-bottom: 24rpx;
}

.item-lock-text {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #fff;
  font-size: 18rpx;
  margin-top: 32rpx;
}
.item-lock-star {
  width: 20rpx;
  height: 20rpx;
  margin-right: 6rpx;
}
.item-lock-step {
  position: relative;
  width: 100%;
  margin-top: 16rpx;
  margin-bottom: 40rpx;
  border-radius: 8rpx;
  height: 16rpx;
  background-color: rgba(255, 255, 255, 0.5);
}
.item-lock-step-son {
  height: 16rpx;
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 8rpx;
  background-image: linear-gradient(to right, #ed171f, #ff8433);
}
.item-lock-person {
  margin-bottom: 40rpx;
  display: flex;
  flex-wrap: wrap;
  width: 100%;
}
.item-lock-person-item {
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 4rpx;
}
.item-lock-person-item-name {
  font-size: 18rpx;
  color: rgba(255, 255, 255, 0.8);
  width: 50%;
}
.item-lock-person-item-icon {
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.item-lock-butt {
  width: 286rpx;
  height: 72rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 36rpx;
  background-color: #ed171f;
  color: #fff;
  font-size: 30rpx;
  margin-bottom: 24rpx;
}
.item-lock-butt-icon {
  width: 24rpx;
  height: 24rpx;
  margin-right: 16rpx;
}
</style>
