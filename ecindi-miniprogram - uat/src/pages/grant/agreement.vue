<template>
  <div class="grant-page" v-html="pageText"></div>
</template>

<script>
export default {
  data() {
    return {
      title: '',
      pageText: ''
    }
  },
  components: {},
  async onLoad(option) {
    if (option) {
      uni.setNavigationBarTitle({
        title: this.title
      })
      await this.getGrantData(option.type)
    } else {
      uni.navigateBack({
        delta: 1
      })
    }
  },
  methods: {
    async getGrantData(type) {
      let text
      // 用户协议
      if (type == 'user') {
        text = await this.$api.getLegalStatement()
      } else {
        // 隐私
        text = await this.$api.getPrivacyStatement()
      }

      const pageList = text.split('\n')
      this.pageText = ''
      pageList.forEach((item) => {
        item = `<div>${item}</div>`
        this.pageText += item
      })
    }
  },
  async onPullDownRefresh() {
    await this.getGrantData(this.type)
    uni.stopPullDownRefresh()
  }
}
</script>
<style></style>
<style scoped>
.grant-page {
  width: 100%;
  box-sizing: border-box;
  padding: 40rpx;
  text-indent: 60rpx;
  font-size: 30rpx;
  color: #333333;
}
</style>
