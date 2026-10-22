<template>
  <view class="comm">
    <nav-bar :navOption="navOption" @navigateBack="navBack"></nav-bar>
    <bg-image src="/static/icons/bg.jpeg"></bg-image>
    <div class="title">
      <p class="_title1">考核点内容预览</p>
      <p class="_title2">
        请仔细阅读对练内容,思考与客户的对话重点,点击底部“准备好了,开始训练”按钮开始案前准备训练
      </p>
      <div class="dot-text">
        如需针对以下内容获取更加具体的沟通策略，请联系对应FC同事。
      </div>
    </div>

    <p class="solid-line"></p>

    <div class="content" v-for="(item, index) in preCaseLists" :key="index">
      <p class="content_title">{{ item.title }}:</p>

      <div v-for="(itemContent, index) in item.content" :key="index">
        <p class="content_text">{{ itemContent }}</p>
      </div>
    </div>

    <div class="_button" @click="goNext">准备好了 开始训练</div>
  </view>
</template>

<script>
import pageCommon from '@/mixins/page.common.js'
import { getPrecase } from '@/api/index'
export default {
  mixins: [pageCommon],
  data() {
    return {
      lists: [
        { name: 'inquiry', text: '建议询问的维度' },
        { name: 'potential', text: '潜在需求' },
        { name: 'questions', text: '用户可能会问' },
        { name: 'challenges', text: '用户可能的异议' }
      ],
      navOption: {
        navTitle: '案前准备',
        backgroundColor: '',
        hasPlaceholder: true,
        showBackTip: true,
        color: '#ffffff'
      },
      preCaseID: 0,
      preCaseLists: [],
      ai: 0,
      type: ''
    }
  },
  async onShow() {
    await this.waitingUserLoaded()
    await this.fetchData()
  },
  async onLoad(options) {
    if (options && options.id) {
      this.preCaseID = parseInt(options.id) || 0
    }
  },
  methods: {
    async fetchData() {
      await this.getPrecaseData()
    },
    async goNext() {
      return uni.navigateTo({
        url: `/pages/training/connect?ai=${this.ai}&type=${this.type}&precaseid=${this.preCaseID}`
      })
    },
    // 获取数据
    async getPrecaseData() {
      if (this.preCaseLists.length <= 0) {
        const res = await getPrecase(this.preCaseID)
        this.ai = res.aiHumanID
        this.type = 'precase'
        let parsedObject = JSON.parse(res.plan) || []

        //转化数据
        for (let key in parsedObject) {
          if (parsedObject.hasOwnProperty(key)) {
            let _nameData = this.lists.find((item) => item.name === key)
            this.preCaseLists.push({
              title: _nameData ? _nameData.text : '',
              content: parsedObject[key]
            })
          }
        }
      }
    }
  }
}
</script>

<style scoped>
.solid-line {
  background: rgba(255, 255, 255, 0.1);
  height: 2rpx;
}

.dot-text {
  padding-left: 28rpx;
  padding-top: 12rpx;
  position: relative;
  width: 642rpx;
  height: 76rpx;
  font-weight: 400;
  font-size: 26rpx;
  color: #ff8433;
  line-height: 38rpx;
}

.dot-text::before {
  width: 16rpx;
  height: 16rpx;
  background: #ff8433;
  content: '';
  display: inline-block;
  border-radius: 50%; /* 圆形效果 */
  position: absolute;
  left: 0;
  top: 35%;
  transform: translateY(-50%);
}

.comm {
  width: 100%;
  font-family: SourceHanSansCN, SourceHanSansCN;
  color: #ffffff;
  font-style: normal;
  padding-bottom: 220rpx;
}

.title {
  text-align: left;
  margin: 48rpx 40rpx 26rpx 40rpx;
}

._title1 {
  height: 46rpx;
  font-weight: 500;
  font-size: 34rpx;
  line-height: 46rpx;
}

._title2 {
  height: 76rpx;
  font-weight: 400;
  font-size: 26rpx;
  line-height: 38rpx;
  margin-top: 16rpx;
  color: rgba(255, 255, 255, 0.8);
}

.content {
  margin: 8rpx 40rpx 0 40rpx;
}

.content_title {
  height: 42rpx;
  font-weight: 500;
  font-size: 30rpx;
  color: #ff8433;
  line-height: 42rpx;
  margin-top: 48rpx;
  text-align: left;
  margin-bottom: 12rpx;
}

.content_text {
  font-weight: 400;
  font-size: 28rpx;
  text-align: left;
  color: rgba(255, 255, 255, 0.8);
}

._button {
  width: 654rpx;
  height: 112rpx;
  background: #ed171f;
  border-radius: 56rpx;
  font-weight: 400;
  font-size: 38rpx;
  line-height: 112rpx;
  text-align: center;
  margin-left: 48rpx;
  position: fixed;
  bottom: 96rpx;
}
</style>
