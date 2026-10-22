<template>
  <div class="training-kyc">
    <nav-bar :navOption="navOption" @navigateBack="navBack"></nav-bar>
    <bg-image src="/static/icons/bg.jpeg"></bg-image>
    <div class="page-title">选择客户开始训练</div>
    <div class="page-tips">选择您的客户, AI对练工具为您立即开启邀约训练</div>
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
            总聊天次数<span class="item-total-red">{{ item.usedTimes }}</span>
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
                <div class="item-lock-person-item-name">{{ byItem.name }}</div>
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
import { enableLoading, disableLoading } from '@/utils/loading'
import ExplainPopup from '@/components/wall/explain-popup.vue'
import UnlockPopup from '@/components/wall/unlock-popup.vue'
export default {
  name: 'TrainingKyc',
  mixins: [pageCommon],
  components: { ExplainPopup, UnlockPopup },
  data() {
    return {
      navOption: {
        navTitle: '客户邀约训练',
        backgroundColor: '',
        hasPlaceholder: true,
        showBackTip: true,
        color: '#ffffff'
      },
      aiHumanList: [],
      shouldRestoreLoading: true, // 是否需要恢复loading转圈圈
      timer: null // 定时器，刷新人设状态
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
      const res = await getAllAiHuman({ trainingTypeID: 10 }) // TODO: 临时方案，后续要去掉
      if (res && res.data) {
        this.aiHumanList = res.data
      }

      // 每5秒钟刷新一次
      if (this.timer) {
        clearTimeout(this.timer)
        this.timer = null
      }
      this.timer = setTimeout(() => this.fetchData(), 5000)
    },
    async goTrain(ai) {
      if (!ai || ai.isBusy) return

      return wx.navigateTo({
        url: `/pages/training/connect?ai=${ai.id}&type=invite`
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
    }
  }
}
</script>

<style scoped>
.page-title {
  padding: 0 40rpx;
  margin-top: 40rpx;
  box-sizing: border-box;
  font-size: 34rpx;
  font-family: SourceHanSansCN, SourceHanSansCN;
  font-weight: 500;
  color: #ffffff;
  line-height: 46rpx;
}

.page-tips {
  margin: 16rpx 40rpx 40rpx;
  font-size: 26rpx;
  font-family: SourceHanSansCN, SourceHanSansCN;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.8);
  line-height: 38rpx;
}

.card-box {
  width: 100%;
  padding: 0 30rpx;
  white-space: nowrap;
  overflow-x: auto;
  box-sizing: border-box;
}

.item-box {
  position: relative;
  display: inline-block;
  width: 526rpx;
  height: 800rpx;
  margin-right: 32rpx;
  border-radius: 20rpx;
  background-image: linear-gradient(
    180deg,
    rgba(76, 0, 20, 0) 0%,
    rgba(76, 0, 20, 0.15) 63%,
    rgba(121, 0, 32, 0.6) 100%
  );
  overflow: hidden;
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
  height: 560rpx;
  opacity: 0.75;
  background: no-repeat center;
  background-size: cover;
  background-image: url('https://cdn.edesoft.com/cindi/upload/202405/27/599224.png');
}
.item-box-exclusive {
  background-image: linear-gradient(to right, #f0cb96, #ecaf73);
  height: 56rpx;
  border-radius: 0rpx 20rpx 0rpx 20rpx;
  position: absolute;
  top: 0;
  right: 0;
  z-index: 1;
  padding: 0 32rpx;
  color: #663c00;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30rpx;
}
.item-busy-status {
  position: absolute;
  top: 30rpx;
  left: 40rpx;
  font-size: 26rpx;
  color: #ffffff;
  background: rgba(0, 0, 0, 0.5);
  height: 50rpx;
  line-height: 50rpx;
  padding: 0 20rpx;
  border-radius: 25rpx;
  border: 2rpx solid var(--busy-status-bg-color);
}

.item-busy-status-text::before {
  content: '';
  display: inline-block;
  width: 14rpx;
  height: 14rpx;
  background: var(--busy-status-color);
  border-radius: 50%;
  margin: 0 10rpx 2rpx 0;
}

.item-waiting-lock {
  position: absolute;
  top: 30rpx;
  left: 40rpx;
  height: 50rpx;
  padding: 0 20rpx;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 25rpx;
  border: 2rpx solid rgba(186, 186, 186, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26rpx;
  color: rgba(186, 186, 186, 0.8);
}
.item-waiting-lock-icon {
  width: 28rpx;
  height: 28rpx;
  margin-right: 10rpx;
}
.item-waiting-can-lock {
  position: absolute;
  top: 30rpx;
  left: 40rpx;
  height: 50rpx;
  padding: 0 20rpx;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 25rpx;
  border: 2rpx solid rgba(255, 255, 255, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.8);
}

.item-content {
  position: absolute;
  width: 100%;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 40rpx;
  box-sizing: border-box;
}
.item-name {
  font-size: 38rpx;
  font-family: SourceHanSansCN, SourceHanSansCN;
  font-weight: 500;
  color: #ffffff;
  width: 100%;
}
.item-red {
  font-size: 26rpx;
  font-family: SourceHanSansCN, SourceHanSansCN;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.8);
  width: 100%;
  margin-top: 8rpx;
}
.item-total {
  font-size: 22rpx;
  font-family: SourceHanSansCN, SourceHanSansCN;
  color: rgba(255, 255, 255, 0.8);
  width: 100%;
  margin-top: 14rpx;
}
.item-total-red {
  color: #ed171f;
  font-weight: 600;
  margin-left: 4rpx;
  margin-right: 32rpx;
  font-size: 26rpx;
}

.item-star-box {
  display: flex;
  align-items: center;
  color: #fff;
  font-size: 22rpx;
  width: 100%;
  margin-top: 18rpx;
}
.item-star-tips {
  width: 20rpx;
  height: 20rpx;
  margin-left: 8rpx;
  margin-right: 16rpx;
}
.item-star-icon {
  width: 32rpx;
  height: 32rpx;
  margin-right: 10rpx;
}
.item-play {
  margin-top: 40rpx;
  width: 366rpx;
  height: 92rpx;
  background: linear-gradient(270deg, #ff8433 0%, #ed171f 100%);
  border-radius: 46rpx;
  font-size: 38rpx;
  font-family: SourceHanSansCN, SourceHanSansCN;
  font-weight: 400;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  filter: brightness(var(--brightness-val));
  margin-bottom: 40rpx;
}

.item-lock-text {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #fff;
  font-size: 22rpx;
  margin-top: 42rpx;
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
  margin-bottom: 48rpx;
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
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.8);
  line-height: 34rpx;
  width: 50%;
}
.item-lock-person-item-icon {
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.item-lock-butt {
  width: 366rpx;
  height: 92rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 46rpx;
  background-color: #ed171f;
  color: #fff;
  font-size: 38rpx;
  margin-bottom: 48rpx;
}
.item-lock-butt-icon {
  width: 36rpx;
  height: 36rpx;
  margin-right: 16rpx;
}
</style>
