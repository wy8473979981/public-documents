<template>
  <div>
    <nav-bar :navOption="navOption" @navigateBack="navBack"></nav-bar>
    <bg-image src="/static/icons/bg.jpeg"></bg-image>
    <training-list :list="trainingList"></training-list>
    <public-logo></public-logo>
  </div>
</template>

<script>
import pageCommon from '@/mixins/page.common.js'
import TrainingList from '@/components/trainingList.vue'
export default {
  name: 'Records',
  mixins: [pageCommon],
  components: { TrainingList },
  data() {
    return {
      navOption: {
        navTitle: '历史训练',
        backgroundColor: '',
        hasPlaceholder: true,
        showBackTip: true,
        color: '#ffffff'
      },
      trainingList: [],
      pageNo: 1,
      totalPage: 1
    }
  },
  async onReady() {
    await this.waitingUserLoaded()
    await this.fetchData()
  },
  methods: {
    async fetchData() {
      this.trainingList = []
      this.pageNo = 1
      this.totalPage = 1
      await this.getSearchTraining()
    },
    // 历史训练-10条
    async getSearchTraining() {
      let res = await this.$api.getSearchTraining({ pageNo: this.pageNo })
      let nowData = res.data || []
      this.pageNo = res.pageNo
      this.totalPage = res.totalPage
      if (this.pageNo === 1) this.trainingList = []
      this.trainingList = this.trainingList.concat(nowData)
    }
  },
  async onPullDownRefresh() {
    await this.fetchData()
    uni.stopPullDownRefresh()
  },
  async onReachBottom() {
    this.pageNo++
    if (this.pageNo <= this.totalPage) {
      await this.getSearchTraining()
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

<style scoped></style>
