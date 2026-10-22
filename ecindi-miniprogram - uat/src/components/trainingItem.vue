<template>
  <div
    class="item"
    :key="index"
    @click.stop="clickRecord(item)"
    :style="styleVariable"
  >
    <div class="flex-align">
      <div class="label">
        {{ item.trainingType.name }}
      </div>
      <span class="name">{{
        item.aiHuman && item.aiHuman.name ? item.aiHuman.name : ''
      }}</span>
      <!-- <span class="hold">了解客户的家庭结构及收入层次</span> -->
    </div>
    <div class="flex-align" style="margin: 22rpx 0 18rpx">
      <div class="grade-text">
        <span>{{ gradeText }}</span>
      </div>
      <div class="percent-txt">{{ handleRatio(item.successRate) }}</div>
      <div class="step-line">
        <div
          class="line"
          :style="{ width: `${handleRatio(item.successRate)}%` }"
        ></div>
      </div>
      <img
        v-if="grade === 2"
        src="../static/icons/perfect.png"
        class="perfect-img"
      />
    </div>
    <div class="flex-align training-item-star" v-if="item.trainingType !== 2">
      <div>本次训练达成星级:</div>
      <img
        src="https://cdn.edesoft.com/cindi/upload/202405/27/871804.png"
        alt=""
        class="training-item-star-tips"
        @click.stop="openExplain"
      />
      <template v-if="item.stars">
        <img
          src="https://cdn.edesoft.com/cindi/upload/202405/27/288544.png"
          alt=""
          v-for="indx in item.stars"
          :key="indx"
          class="training-item-star-icon"
        />
      </template>
      <img
        src="https://cdn.edesoft.com/cindi/upload/202405/27/453429.png"
        alt=""
        v-for="indx in 5 - item.stars"
        :key="indx"
        class="training-item-star-icon"
      />
    </div>
    <div class="flex-jus">
      <div class="time">{{ handleDate(item.createdAt) }}</div>
      <div class="flex-align">
        <div class="border" @click.stop="tryAgainRecords(item)">再测一次</div>
        <div class="border" @click.stop="clickReturn(item)">回放训练</div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getGradeBySuccessRate,
  getGradeTextByGrade,
  getStyleVariableByGrade
} from '@/common/training'
export default {
  props: {
    item: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      // trainingTypeList: []
    }
  },
  computed: {
    grade() {
      return getGradeBySuccessRate(this.item && this.item.successRate)
    },
    gradeText() {
      return getGradeTextByGrade(this.grade)
    },
    styleVariable() {
      return getStyleVariableByGrade(this.grade)
    }
  },
  methods: {
    handleRatio(successRate) {
      let ratio = 0
      if (successRate) {
        ratio = parseInt(successRate * 100)
      }
      return ratio
    },
    handleDate(date) {
      if (date) {
        return this.$dayjs(date).format('YYYY-MM-DD HH:mm')
      }
      return ''
    },
    // 再试一次
    async tryAgainRecords(item) {
      const ai = item.aiHumanID || 0
      const preCaseID = item.preCaseID || 0
      if (item.trainingType.isPreCase) {
        return uni.navigateTo({
          url: `/pages/training/connect?ai=${ai}&type=precase&precaseid=${preCaseID}&difEntry=1`
        })
      } else {
        return uni.navigateTo({
          url: `/pages/training/connect?ai=${ai}&type=invite`
        })
      }
    },
    async clickRecord(item) {
      const preCaseID = item.preCaseID || 0
      if (item.trainingType.isPreCase) {
        return uni.navigateTo({
          url: `/pages/training/result?id=${item.id}&precaseid=${preCaseID}&difEntry=1&type=precase`
        })
      } else {
        if (item.trainingType.name === 'KYC') {
          return uni.navigateTo({
            url: '/pages/training/result?id=' + item.id + '&type=kyc'
          })
        } else {
          return uni.navigateTo({
            url: '/pages/training/result?id=' + item.id
          })
        }
      }
    },
    async clickReturn(item) {
      const preCaseID = item.preCaseID || 0
      if (item.trainingType.isPreCase) {
        return uni.navigateTo({
          url: `/pages/training/return?id=${item.id}&precaseid=${preCaseID}&difEntry=1`
        })
      } else {
        return uni.navigateTo({
          url: '/pages/training/return?id=' + item.id
        })
      }
    },
    openExplain() {
      this.$emit('openExplain')
    }
  }
}
</script>

<style scoped>
.border {
  width: 148rpx;
  height: 50rpx;
  margin-left: 22rpx;
  text-align: center;
  border-radius: 26rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.5);
  font-size: 22rpx;
  font-family: SourceHanSansCN, SourceHanSansCN;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.5);
  line-height: 50rpx;
}

.time {
  font-size: 22rpx;
  font-family: SourceHanSansCN, SourceHanSansCN;
  font-weight: 400;
  color: #787878;
}

.line {
  height: 14rpx;
  background: var(--box-line-bg-color);
  border-radius: 8rpx;
  border: 1rpx solid var(--box-line-border-color);
}

.step-line {
  margin-left: 20rpx;
  width: 340rpx;
  height: 16rpx;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.2);
}

.perfect-img {
  width: 42rpx;
  height: 36rpx;
  margin-left: 20rpx;
}

.grade-text {
  font-size: 26rpx;
  font-weight: 400;
  margin-right: 30rpx;
  color: var(--box-text-color);
}

.percent-txt {
  font-size: 26rpx;
  font-family: SourceHanSansCN, SourceHanSansCN;
  font-weight: bold;
  color: var(--box-text-color);
}

.percent-txt::after {
  content: '%';
  font-size: 22rpx;
  font-family: SourceHanSansCN, SourceHanSansCN;
  font-weight: 500;
  color: var(--box-text-color);
}

.hold {
  max-width: 400rpx;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  font-size: 26rpx;
  font-family: SourceHanSansCN, SourceHanSansCN;
  font-weight: 400;
  color: #cfcfcf;
}

.name {
  font-size: 26rpx;
  font-family: SourceHanSansCN, SourceHanSansCN;
  font-weight: 400;
  color: #ffffff;
  flex-shrink: 0;
}

.label {
  min-width: 112rpx;
  padding: 0 10rpx;
  box-sizing: border-box;
  height: 36rpx;
  margin-right: 16rpx;
  background: rgba(255, 132, 51, 0.12);
  border-radius: 8rpx;
  border: 1rpx solid #ff8433;
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22rpx;
  font-family: SourceHanSansCN, SourceHanSansCN;
  font-weight: 500;
  color: #ff8433;
  line-height: 36rpx;
  flex-shrink: 0;
}

.item {
  width: 690rpx;
  /* height: 306rpx; */
  margin-bottom: 16rpx;
  padding: 40rpx 32rpx;
  box-sizing: border-box;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 20rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(16px);
}

.card-list {
  margin-top: 24rpx;
  padding: 0 30rpx;
  min-height: 50vh;
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

.training-item-star {
  margin-bottom: 32rpx;
  color: #fff;
  font-size: 26rpx;
}
.training-item-star-tips {
  width: 26rpx;
  height: 26rpx;
  margin-left: 8rpx;
  margin-right: 16rpx;
}
.training-item-star-icon {
  width: 32rpx;
  height: 32rpx;
  margin-right: 10rpx;
}
</style>
