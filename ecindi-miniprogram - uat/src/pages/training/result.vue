<template>
  <div class="training-result">
    <nav-bar :navOption="navOption" @navigateBack="navBack"></nav-bar>
    <bg-image src="/static/icons/bg.jpeg"></bg-image>
    <!-- 训练目标 -->

    <div v-if="Object.keys(this.training).length > 0">
      <div class="page-title">训练目标</div>
      <div class="card-box">
        <div class="top-info">
          <div class="top-info-box">
            <image
              :src="
                training.aiHuman.avatarURL
                  ? training.aiHuman.avatarURL
                  : '/static/icons/default-avatar.png'
              "
              class="avatar"
              mode="aspectFill"
              v-if="training.aiHuman"
            ></image>
            <div class="top-info-right">
              <div class="name">
                {{ training.aiHuman ? training.aiHuman.name : '' }}
              </div>
              <template v-if="!isKnowledgeTraining">
                <div class="red-text">
                  {{ aiHumanInfo }}
                </div>
                <div
                  class="top-info-tags"
                  v-if="training.aiHuman && training.aiHuman.tags"
                >
                  <div
                    class="label"
                    v-for="(tag, tagIndex) in training.aiHuman.tags.split(' ')"
                    :key="tagIndex"
                  >
                    {{ tag }}
                  </div>
                </div>
              </template>
              <div class="flex-row">
                <div class="top-info-text">
                  总聊天次数<span class="top-info-text-num">{{
                    training.aiHuman && training.aiHuman.usedTimes
                      ? training.aiHuman.usedTimes
                      : 0
                  }}</span>
                </div>
                <div class="top-info-text">
                  平均成功率<span class="top-info-text-num">{{
                    training.aiHuman && training.aiHuman.avgRate
                      ? `${parseInt(training.aiHuman.avgRate * 100)}%`
                      : 0
                  }}</span>
                </div>
              </div>
              <div class="result-page-star-box" v-if="isKnowledgeTraining">
                <div>最高达成成绩</div>
                <img
                  src="/static/wall/tips-default.png"
                  alt=""
                  class="result-page-tips-img"
                  @click.stop="openExplain"
                />
                <template v-if="maxStars">
                  <img
                    src="https://cdn.edesoft.com/cindi/upload/202405/27/288544.png"
                    alt=""
                    class="result-page-star"
                    v-for="item in maxStars"
                    :key="item"
                  />
                </template>
                <img
                  src="https://cdn.edesoft.com/cindi/upload/202405/27/453429.png"
                  alt=""
                  class="result-page-star"
                  v-for="item in 5 - maxStars"
                  :key="item"
                />
              </div>
            </div>
            <div class="top-info-line"></div>
          </div>
        </div>
        <div class="bottom-info">
          <div class="txt1">本次训练目的：</div>
          <div class="txt2">{{ trainingPurpose }}</div>
          <div class="txt1">本次训练类别：</div>
          <div class="txt2">{{ trainingCategory }}</div>
        </div>
        <!-- <div class="tips-img flex-row">
        <image
          src="@/static/icons/return-card.png"
          class="icon"
          mode="aspectFit"
        ></image>
        <span>客户资料</span>
      </div> -->
      </div>
      <!-- 训练评价 -->
      <div class="page-title">训练评价</div>
      <div class="work-box" :style="styleVariable">
        <div class="box-headline">
          <div class="work-title">任务进度</div>
          <img
            v-if="grade === 2"
            src="../../static/icons/perfect.png"
            class="perfect-img"
          />
          <div class="tips-img flex-row" @click="clickReturn">
            <image
              src="@/static/icons/return-play.png"
              class="icon"
              mode="aspectFit"
            ></image>
            <span>回放训练</span>
          </div>
        </div>
        <template v-if="hasTrainingResult">
          <div class="txt1">{{ trainingRateText }}</div>
          <div class="flex-row">
            <div class="txt2">{{ handleRatio(training.successRate) }}</div>
            <!-- 进度条 -->
            <div class="step-line">
              <div
                class="line"
                :style="{ width: `${handleRatio(training.successRate)}%` }"
              ></div>
            </div>
            <div class="result-compare">
              <span>{{ gradeText }}</span>
            </div>
          </div>
          <div class="txt3 pre-wrap">
            {{ training.overview || '' }}
          </div>
          <div class="result-page-now-star" v-if="!isKnowledgeTraining">
            <div class="result-page-now-star-line"></div>
            <div>与该客户在本次训练达成星级:</div>
            <div class="flex-row">
              <template v-if="stars">
                <img
                  src="https://cdn.edesoft.com/cindi/upload/202405/27/288544.png"
                  alt=""
                  class="result-page-star"
                  v-for="item in stars"
                  :key="item"
                />
              </template>
              <img
                src="https://cdn.edesoft.com/cindi/upload/202405/27/453429.png"
                alt=""
                class="result-page-star"
                v-for="item in 5 - stars"
                :key="item"
              />
            </div>
          </div>
        </template>
        <template v-else>
          <div class="txt1">系统正在处理中...</div>
          <div class="txt3">请耐心等待，评价结果将在2分钟内生成</div>
        </template>
      </div>
      <!-- 综合能力 -->
      <div v-if="hasTrainingResult && !isKnowledgeTraining" class="skill-box">
        <div class="flex-jus">
          <div class="skill-title">综合能力评价</div>
          <div class="tips-img flex-row">
            <span>评价规则</span>
            <image
              src="@/static/icons/rule.png"
              class="icon-warn"
              mode="aspectFit"
            ></image>
          </div>
        </div>

        <!-- 当显示星星弹框时，要隐藏canvas，否则会canvas会在最上层显示（即使设置z-index也无效） -->
        <div v-if="!showStarPopup" class="uni-ec-canvas-custom-box">
          <qiun-data-charts type="radar" :opts="opts" :chartData="chartData" />
        </div>

        <div class="solid-line"></div>

        <div v-for="(item, index) in radarList" :key="index">
          <div class="flex-row">
            <div class="spot"></div>
            <div class="txt1">{{ item.title }}：</div>
            <div class="txt2">
              <!-- 显示星星 -->
              <img
                src="https://cdn.edesoft.com/cindi/upload/202405/27/288544.png"
                alt=""
                class="result-page-star"
                v-for="item in item.value"
                :key="item"
              />
              <img
                src="https://cdn.edesoft.com/cindi/upload/202405/27/453429.png"
                alt=""
                class="result-page-star"
                v-for="item in 5 - item.value"
                :key="item"
              />
            </div>
          </div>
          <div class="txt3">
            {{ item.comment ? item.comment : '' }}
          </div>
        </div>
      </div>
      <!-- 问题和建议 -->
      <div v-if="hasTrainingResult" class="skill-box">
        <div class="skill-title">评价与建议</div>
        <template
          v-if="training.suggestions && training.suggestions.length > 0"
        >
          <div
            v-for="(item, index) in training.suggestions"
            :key="index"
            class="skill-item"
          >
            <div class="ask">评价分析</div>
            <div class="ask-txt">
              {{ item.evaluation || item.problem }}
            </div>
            <div class="ask return">反馈建议</div>
            <div class="return-txt">
              <bold-parser :content="item.suggestion" />
            </div>
            <div
              class="skill-item-line"
              v-if="index + 1 < training.suggestions.length"
            ></div>
          </div>
          <div class="upvote-downvote-box">
            <div class="vote-buttons">
              <div 
                class="vote-btn" 
                :class="{ active: voteStatus === 'upvote' }"
                @click="handleVote('upvote')"
              >
                <image
                  :src="voteStatus === 'upvote' ? '/static/images/upvote-active.png' : '/static/images/upvote.png'"
                  class="vote-icon"
                  mode="aspectFit"
                />
                <span>赞</span>
              </div>
              <div 
                class="vote-btn" 
                :class="{ active: voteStatus === 'downvote' }"
                @click="handleVote('downvote')"
              >
                <image
                  :src="voteStatus === 'downvote' ? '/static/images/downvote-active.png' : '/static/images/downvote.png'"
                  class="vote-icon"
                  mode="aspectFit"
                />
                <span>踩</span>
              </div>
            </div>
          </div>
        </template>
      </div>
      <public-logo :customMargin="'48rpx auto 198rpx'"></public-logo>
      <!-- 若需要底部定位，添加类 footer -->
      <!-- <div class="footer">  -->
      <div>
        <div v-if="hasTrainingResult" class="button" @click="clickTryAgain">
          再试一次
        </div>
        <div v-else class="button" @click="goRecords">查看历史训练</div>
        <div class="comment flex-row" @click="openMoreInvite">
          <span>开启更多训练</span>
          <image
            src="@/static/icons/card-right.png"
            class="icon-warn"
            mode="aspectFit"
          ></image>
        </div>
      </div>
      <!-- 成绩说明 -->
      <explain-popup ref="explainRef"></explain-popup>
      <!-- 评价获得星星弹框 -->
      <result-star-popup
        v-if="showStarPopup"
        :aiHumanName="aiHumanName"
        :stars="stars"
        :type="type"
        :trainingType="trainingType"
        @knowTrainingNoticeStar="knowTrainingNoticeStar"
      ></result-star-popup>
    </div>
  </div>
</template>

<script>
import pageCommon from '@/mixins/page.common.js'
import qiunDataCharts from '@/components/qiun-data-charts/qiun-data-charts.vue'

import BoldParser from '@/components/markdown/bold-parser.vue'
import ExplainPopup from '@/components/wall/explain-popup.vue'
import ResultStarPopup from '@/components/wall/result-star-popup.vue'
const Refresh_Interval = 10 * 1000 // 如果未生成评价，每 x 秒刷新一次

import { enableLoading, disableLoading } from '@/utils/loading'

import {
  getGradeBySuccessRate,
  getGradeTextByGrade,
  getStyleVariableByGrade
} from '@/common/training'

export default {
  name: 'Result',
  mixins: [pageCommon],
  components: { qiunDataCharts, BoldParser, ExplainPopup, ResultStarPopup },
  data() {
    return {
      navOption: {
        navTitle: '训练评价',
        backgroundColor: '',
        hasPlaceholder: true,
        showBackTip: true,
        color: '#ffffff'
      },
      shouldRestoreLoading: true, // 是否需要恢复loading转圈圈
      trainingID: 0,
      training: {},
      timer: null,
      ringOption: {},
      radarList: [],
      chartData: {},
      //这里的 opts 是图表类型 type="radar" 的全部配置参数，您可以将此配置复制到 config-ucharts.js 文件中下标为 ['radar'] 的节点中来覆盖全局默认参数。实际应用过程中 opts 只需传入与全局默认参数中不一致的【某一个属性】即可实现同类型的图表显示不同的样式，达到页面简洁的需求。
      opts: {},
      maxStars: 0,
      stars: 0,
      showStarPopup: false, // 显示评价获得星星弹框
      aiHumanName: '',
      difEntry: 0,
      // type: '',
      seriesTitleData: [],
      seriesOrgData: [],
      seriesUserData: [],
      categoriesData: [],
      voteStatus: '', // 点赞状态：'upvote' | 'downvote' | ''
    }
  },
  async onLoad(options) {
    if (options && options.id) {
      this.trainingID = parseInt(options.id) || 0
    }
    if (options && options.difEntry) {
      this.difEntry = parseInt(options.difEntry) || 0
    }
    // this.type = options && options.type ? options.type : ''
    // 禁止loading转圈圈
    this.shouldRestoreLoading = disableLoading()
  },
  computed: {
    grade() {
      return getGradeBySuccessRate(this.training && this.training.successRate)
    },
    gradeText() {
      return getGradeTextByGrade(this.grade)
    },
    styleVariable() {
      return getStyleVariableByGrade(this.grade)
    },

    // 评价结果已生成
    hasTrainingResult() {
      return this.training && this.training.isEvaluating === false
    },
    // 虚拟人物基本信息
    aiHumanInfo() {
      const aihuman = (this.training && this.training.aiHuman) || {}
      return this.getAihumanInfo(aihuman)
    },
    // 训练目的
    trainingPurpose() {
      return (
        (this.training.trainingType && this.training.trainingType.goal) || ''
      )
      // if (this.training.trainingType === 0) return '邀请客户到店'
      // if (this.training.trainingType === 1) return ''
      // if (this.training.trainingType === 2) return '尽可能准确回答产品相关问题'
    },
    // 训练类别
    trainingCategory() {
      return (
        (this.training.trainingType && this.training.trainingType.name) ||
        'Unknown'
      )
    },
    trainingRateText() {
      if (!this.training) {
        return ''
      }

      const result =
        this.training.trainingType &&
        this.training.trainingType.successRateTitle
      if (result) {
        return result
      }

      // 旧的逻辑
      if (this.training.trainingTypeID === 10) return '邀约成功率'
      if (this.training.trainingTypeID === 11) return ''
      if (this.training.trainingTypeID === 12) return '产品知识正确率'
    },
    isKnowledgeTraining() {
      const result =
        this.training &&
        this.training.trainingType &&
        this.training.trainingType.hasPdf
      console.log('isKnowledgeTraining', result)
      return result
    },
    trainingType() {
      return this.training && this.training.trainingType
        ? this.training.trainingType
        : {}
    }
  },
  async onShow() {
    // console.log('onShow')
    await this.waitingUserLoaded()
    await this.fetchData()
  },
  onHide() {
    // console.log('onHide')
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }
  },
  onUnload() {
    // console.log('onUnload')
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }

    // 恢复loading默认值
    if (this.shouldRestoreLoading) {
      enableLoading()
    }
  },

  methods: {
    async fetchData() {
      if (!this.trainingID) {
        return
      }

      const res = await this.$api.getTraining(this.trainingID)
      if (!res) {
        return
      }

      // 点赞、点踩状态
      const map = {
        1: 'upvote',
        2: 'downvote'
      }

      this.voteStatus = map[res.reactionType] || ''

      this.training = res
      if (
        this.training &&
        this.training.aiHuman &&
        this.training.aiHuman.unlockInfo &&
        this.training.aiHuman.unlockInfo.maxStars
      ) {
        this.maxStars = this.training.aiHuman.unlockInfo.maxStars
      }
      if (this.training && this.training.stars) {
        this.stars = this.training.stars
      }
      if (
        this.training &&
        this.training.aiHuman &&
        this.training.aiHuman.name
      ) {
        this.aiHumanName = this.training.aiHuman.name
      }

      // 弹框知晓未确定：排除-产品知识测试
      if (
        !this.training.hasNoticed &&
        this.hasTrainingResult &&
        !this.isKnowledgeTraining
      ) {
        this.openStarPopup()
      }

      if (this.timer) {
        clearTimeout(this.timer)
        this.timer = null
      }
      // 如果评价未生成，每隔x秒刷新一次
      if (res.isEvaluating) {
        this.timer = setTimeout(() => {
          this.fetchData()
        }, Refresh_Interval)
        return
      }
      this.radarList = []
      if (this.training.abilities && this.training.abilities.length > 0) {
        this.seriesOrgData = this.training.avgAbilities.map((obj) => obj.value)
        this.seriesUserData = this.training.abilities.map((obj) => obj.value)
        this.seriesTitleData = this.training.abilities.map(
          (obj) => obj.title + ': ' + obj.value + '.0⭐'
        )
        this.training.abilities.forEach((item) => {
          this.radarList.push({
            title: item.title,
            value: item.value,
            comment: item.comment
          })
        })
      }
      await this.getServerData()
    },
    async getServerData() {
      this.chartData = {
        categories: this.seriesTitleData,
        series: [
          {
            name: '网点评价',
            data: this.seriesOrgData
          },
          {
            name: '个人评价',
            data: this.seriesUserData
          }
        ]
      }
      this.opts = {
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
            color: '#ffffff',
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
            labelPointShow: false,
            labelPointRadius: 0,
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
    },
    handleRatio(successRate) {
      let ratio = 0
      if (successRate) {
        ratio = parseInt(successRate * 100)
      }
      return ratio
    },
    clickTryAgain() {
      if (this.training.aiHumanID) {
        const ai = this.training.aiHumanID
        let type = 'invite' // 默认类型
        if (this.training.trainingType.isPreCase) {
          type = 'precase' // PreCase
          return wx.redirectTo({
            url: `/pages/training/connect?ai=${ai}&type=${type}&precaseid=${this.training.preCaseID}&difEntry=${this.difEntry}`
          })
        } else {
          if (this.training.trainingType.isOrient) {
            type = 'invite' // 定向训练
          }
          if (this.isKnowledgeTraining) {
            type = 'testing' // 产品知识
          }
          return wx.redirectTo({
            url: `/pages/training/connect?ai=${ai}&type=${type}`
          })
        }
      }
    },
    openExplain() {
      this.$refs.explainRef.open()
    },
    openStarPopup() {
      // this.$refs.starRef.open()
      this.showStarPopup = true // 显示评价获得星星弹框
    },
    async knowTrainingNoticeStar() {
      if (!this.trainingID) return
      await this.$api.knowTrainingNoticeStar(this.trainingID)
      this.showStarPopup = false // 关闭弹框
    },
    goRecords() {
      return wx.redirectTo({
        url: '/pages/training/records'
      })
    },
    openMoreInvite() {
      if (this.isKnowledgeTraining) {
        return uni.redirectTo({
          url: '/pages/training/testing'
        })
      }
      uni.redirectTo({
        url: `/pages/training/targeted`
      })
    },
    async clickReturn() {
      return uni.navigateTo({
        url: '/pages/training/return?id=' + this.training.id
      })
    },
    // 返回
    async navBack() {
      if (this.training.trainingType.isPreCase && this.difEntry !== 1) {
        uni.navigateBack({
          delta: 2
        })
      } else {
        uni.navigateBack()
      }
    },
    
    /**
     * 处理训练结果投票操作
     * 
     * @param {string} type - 投票类型，可选值：'upvote'（点赞）、'downvote'（点踩）
     * @returns {Promise<void>} 无返回值
     * 
     * @description
     * 根据投票类型处理用户的点赞/点踩操作，支持切换和取消选择。
     * 发送投票结果到后端API，并根据操作结果显示相应的提示信息。
     */
    async handleVote(type) {
      const map = {
        upvote: 1,
        downvote: 2
      }

      let reaction_type
      const isCanceling = this.voteStatus === type
      reaction_type = isCanceling ? 0 : (map[type] || 0)
      
      try {
        const res = await this.$api.reactTraining(this.trainingID, {"reaction_type": reaction_type })
        if (res) {
          this.voteStatus = isCanceling ? '' : type

          let title
          if (reaction_type === 1) {
            title = '感谢您的反馈！'
          } else if (reaction_type === 2) {
            title = '感谢您的反馈！'
          } else {
            title = '已取消投票'
          }
          
          uni.showToast({
            title: title,
            duration: 2000
          })
        }
      } catch (error) {
        console.log('投票操作失败:', error)
        uni.showToast({
          title: '操作失败，请重试',
          icon: 'none',
          duration: 2000
        })
      }
    }
  },

  async onPullDownRefresh() {
    await this.fetchData()
    uni.stopPullDownRefresh()
  },

  async onReachBottom() {}
}
</script>

<style scoped>
.training-result {
  padding-bottom: 60rpx;
  color: #fff;
}
.footer {
  /* position: fixed; */
  /* bottom: 60rpx; */
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.button {
  width: 654rpx;
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
}
.comment .icon-warn {
  width: 16rpx;
  height: 16rpx;
  margin-left: 8rpx;
}
.ask {
  width: 136rpx;
  height: 50rpx;
  margin-top: 32rpx;
  background: rgba(237, 23, 31, 0.12);
  border-radius: 8rpx;
  border: 1rpx solid #ed171f;
  backdrop-filter: blur(8px);
  text-align: center;
  font-size: 26rpx;
  font-family: SourceHanSansCN, SourceHanSansCN;
  font-weight: 500;
  color: #ed171f;
  line-height: 50rpx;
}
.ask-txt {
  margin: 24rpx 0 28rpx;
  font-size: 28rpx;
  font-family: SourceHanSansCN, SourceHanSansCN;
  font-weight: 500;
  color: #ffffff;
  line-height: 40rpx;
}
.return {
  border-color: #ff8433;
  color: #ff8433;
}
.return-txt {
  margin-top: 24rpx;
  padding-bottom: 38rpx;
  font-size: 28rpx;
  font-family: SourceHanSansCN, SourceHanSansCN;
  font-weight: 400;
  color: #cfcfcf;
  line-height: 40rpx;
  /* border-bottom: 2rpx solid rgba(255, 255, 255, 0.2); */
}
.skill-box {
  width: 690rpx;
  padding: 32rpx;
  margin: 0 auto 24rpx;
  box-sizing: border-box;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 20rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(16px);
}
.skill-title {
  font-size: 30rpx;
  font-family: SourceHanSansCN, SourceHanSansCN;
  font-weight: 500;
  color: #ffffff;
  line-height: 42rpx;
}
.spot {
  width: 12rpx;
  height: 12rpx;
  border-radius: 50%;
  background: #ed171f;
}

.skill-item {
  position: relative;
  width: 100%;
}
.skill-item-line {
  position: absolute;
  width: 100%;
  height: 2rpx;
  bottom: 0;
  left: 0;
  background-image: linear-gradient(
    to right,
    rgba(255, 255, 255, 0.2) 0%,
    rgba(255, 255, 255, 0.2) 50%,
    transparent 0%
  );
  background-size: 16rpx 2rpx;
  background-repeat: repeat-x;
}
.skill-box .txt1 {
  margin-left: 12rpx;
  font-size: 28rpx;
  font-family: SourceHanSansCN, SourceHanSansCN;
  font-weight: 500;
  color: #ed171f;
}
.skill-box .txt2 {
  font-size: 28rpx;
  font-family: SourceHanSansCN, SourceHanSansCN;
  font-weight: bold;
  color: #ed171f;
}
.skill-box .txt3 {
  width: calc(100% - 26rpx);
  margin: 8rpx 0 24rpx 26rpx;
  font-size: 28rpx;
  font-family: SourceHanSansCN, SourceHanSansCN;
  font-weight: 400;
  color: #ffffff;
  line-height: 40rpx;
}
.icon-warn {
  width: 24rpx;
  height: 24rpx;
  margin-left: 12rpx;
}
.work-box {
  width: 690rpx;
  /* height: 444rpx; */
  margin: 0 30rpx 24rpx;
  padding: 32rpx;
  box-sizing: border-box;
  background: var(--box-bg-color);
  border-radius: 20rpx;
  border: 1rpx solid var(--box-border-color);
  backdrop-filter: blur(16px);
}
.box-headline {
  display: flex;
  justify-content: space-between;
}
.work-title {
  font-size: 30rpx;
  font-family: SourceHanSansCN, SourceHanSansCN;
  font-weight: 500;
  color: #ffffff;
  line-height: 46rpx;
}
.work-box .txt1 {
  margin: 32rpx 0 12rpx;
  font-size: 26rpx;
  font-family: SourceHanSansCN, SourceHanSansCN;
  font-weight: 400;
  color: #cfcfcf;
  line-height: 34rpx;
}
.perfect-img {
  width: 168rpx;
  height: 144rpx;
  z-index: 99;
  position: absolute;
  top: -52rpx;
  left: 246rpx;
}
.work-box .txt2 {
  font-size: 46rpx;
  font-family: SourceHanSansCN, SourceHanSansCN;
  font-weight: bold;
  color: var(--box-text-color);
}
.work-box .txt2::after {
  content: '%';
  font-size: 22rpx;
  font-family: PingFangSC, PingFang SC;
  font-weight: 500;
  color: var(--box-text-color);
}
.step-line {
  width: 400rpx;
  height: 16rpx;
  margin-left: 12rpx;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8rpx;
  border: 2rpx solid rgba(255, 255, 255, 0.2);
  overflow: hidden;
}
.step-line .line {
  height: calc(100% - 4rpx);
  background: var(--box-line-bg-color);
  border-radius: 8rpx;
  border: 2rpx solid var(--box-line-border-color);
}
.work-box .txt3 {
  margin-top: 22rpx;
  font-size: 28rpx;
  font-family: SourceHanSansCN, SourceHanSansCN;
  font-weight: 400;
  color: #cfcfcf;
  line-height: 40rpx;
}

/* 保留换行符 */
.pre-wrap {
  white-space: pre-wrap;
}

.page-title {
  margin: 30rpx 40rpx 32rpx;
  font-size: 34rpx;
  font-family: SourceHanSansCN, SourceHanSansCN;
  font-weight: 500;
  color: #ffffff;
}

.result-compare {
  display: flex;
  align-items: center;
  color: var(--box-text-color);
  font-size: 26rpx;
  line-height: 26rpx;
  margin-left: 36rpx;
  white-space: nowrap;
}

.card-box {
  position: relative;
  width: 690rpx;
  /* min-height: 520rpx; */
  margin: 0 30rpx 18rpx;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 20rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(16px);
}
.top-info {
  box-sizing: border-box;
  padding: 32rpx;
  /* border-bottom: 2rpx dotted rgba(255, 255, 255, 0.2); */
  position: relative;
}
.top-info-box {
  width: 100%;
  position: relative;
  display: flex;
  align-items: flex-start;
}
.top-info-line {
  position: absolute;
  width: 100%;
  height: 2rpx;
  bottom: -32rpx;
  left: 0;
  background-image: linear-gradient(
    to right,
    rgba(255, 255, 255, 0.2) 0%,
    rgba(255, 255, 255, 0.2) 50%,
    transparent 0%
  );
  background-size: 16rpx 2rpx;
  background-repeat: repeat-x;
}
.avatar {
  width: 128rpx;
  height: 128rpx;
  margin-right: 32rpx;
  border-radius: 16rpx;
  flex-shrink: 0;
}
.top-info-right {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.name {
  font-size: 34rpx;
  font-family: SourceHanSansCN, SourceHanSansCN;
  font-weight: 500;
  color: #ffffff;
  line-height: 50rpx;
}
.red-text {
  font-size: 22rpx;
  font-family: SourceHanSansCN, SourceHanSansCN;
  font-weight: 400;
  color: #ed171f;
  line-height: 34rpx;
}
.top-info-tags {
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  margin-top: 16rpx;
  margin-bottom: 14rpx;
}
.tips-img {
  /* position: absolute; */
  top: 38rpx;
  right: 32rpx;
  align-items: center;
  font-size: 22rpx;
  font-family: SourceHanSansCN, SourceHanSansCN;
  font-weight: 400;
  color: #cfcfcf;
}
.label {
  margin-right: 12rpx;
  margin-bottom: 12rpx;
  padding: 10rpx 16rpx;
  line-height: 22rpx;
  background: rgba(255, 255, 255, 0.12);
  border-radius: 8rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.2);
  font-size: 22rpx;
  font-family: SourceHanSansCN, SourceHanSansCN;
  font-weight: 400;
  color: #cfcfcf;
}
.top-info-text {
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.8);
  line-height: 34rpx;
  display: flex;
  align-items: baseline;
  margin-right: 32rpx;
}
.top-info-text-num {
  color: #ed171f;
  font-size: 26rpx;
  line-height: 38rpx;
  margin-left: 6rpx;
}
.bottom-info {
  padding: 32rpx 32rpx 8rpx 32rpx;
  box-sizing: border-box;
}
.bottom-info .txt1 {
  font-size: 22rpx;
  font-family: SourceHanSansCN, SourceHanSansCN;
  color: rgba(255, 255, 255, 0.8);
  line-height: 34rpx;
  margin-bottom: 4rpx;
}
.bottom-info .txt2 {
  margin-bottom: 24rpx;
  font-size: 26rpx;
  font-family: SourceHanSansCN, SourceHanSansCN;
  font-weight: 500;
  color: #ffffff;
  line-height: 38rpx;
}

.icon {
  width: 30rpx;
  height: 30rpx;
  margin-right: 12rpx;
}
/* 公共 */
.flex-row {
  display: flex;
  align-items: center;
}
.flex-jus {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.uni-ec-canvas-custom-box {
  width: 100%;
  height: 334rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 32rpx;
  margin-bottom: 40rpx;
}

/* 星级 */
.result-page-star-box {
  color: #fff;
  font-size: 22rpx;
  margin-top: 26rpx;
  display: flex;
  align-items: center;
}
.result-page-star {
  width: 28rpx;
  height: 28rpx;
  margin-right: 10rpx;
}
.result-page-tips-img {
  width: 20rpx;
  height: 20rpx;
  margin-left: 8rpx;
  margin-right: 16rpx;
}
.result-page-now-star {
  color: #fff;
  font-size: 22rpx;
  margin-top: 38rpx;
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;
  padding-top: 38rpx;
  position: relative;
}
.result-page-now-star-line {
  position: absolute;
  width: 100%;
  height: 2rpx;
  top: 0;
  left: 0;
  background-image: linear-gradient(
    to right,
    rgba(255, 255, 255, 0.2) 0%,
    rgba(255, 255, 255, 0.2) 50%,
    transparent 0%
  );
  background-size: 16rpx 2rpx;
  background-repeat: repeat-x;
}
.solid-line {
  width: 100%;
  height: 2rpx;
  background-image: linear-gradient(
    to right,
    rgba(255, 255, 255, 0.2) 0%,
    rgba(255, 255, 255, 0.2) 50%,
    transparent 0%
  );
  background-size: 16rpx 2rpx;
  margin-bottom: 38rpx;
}

/* 点赞/点踩区域样式 */
.upvote-downvote-box {
  text-align: center;
}

.vote-title {
  font-size: 28rpx;
  font-family: SourceHanSansCN, SourceHanSansCN;
  font-weight: 500;
  color: #ffffff;
  line-height: 40rpx;
  margin-bottom: 32rpx;
}

.vote-buttons {
  display: flex;
  justify-content: flex-end;
}

.vote-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.vote-btn {
  margin-right: 48rpx;
}

.vote-btn:active {
  transform: scale(0.95);
}
.vote-buttons .active span {
  color: #D31145;
}

.vote-icon {
  width: 32rpx;
  height: 32rpx;
  margin-right: 12rpx;
}

.vote-btn span {
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 24rpx;
  color: #FFFFFF;
  line-height: 34rpx;
  text-align: left;
  font-style: normal;
}
</style>

<style>
page {
  background-color: rgba(0, 0, 0, 0.3) !important;
  background-repeat: no-repeat;
  background-size: contain;
}
</style>
