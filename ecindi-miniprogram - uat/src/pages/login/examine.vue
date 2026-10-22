<template>
  <div>
    <nav-bar :navOption="navOption"></nav-bar>
    <!-- 背景图 -->
    <bg-image :src="bgImage" v-if="bgImage"></bg-image>
    <div class="examine-content">
      <image
        :src="logoImage"
        alt=""
        class="examine-logo"
        mode="heightFix"
        v-if="logoImage"
      />
      <image
        :src="middleImage"
        alt=""
        class="examine-middle"
        mode="heightFix"
        v-if="middleImage"
      />
      <div class="examine-name">{{ nickName }}</div>
      <div class="examine-name">欢迎登录</div>
      <div class="examine-button" @click="goHomePage">开启训练</div>
    </div>
  </div>
</template>

<script>
const Stay_Time = 2000 // 页面停留时间
import pageCommon from '@/mixins/page.common.js'
export default {
  mixins: [pageCommon],
  data() {
    return {
      navOption: {
        navTitle: 'AI对练工具',
        backgroundColor: '',
        hasPlaceholder: true,
        showBackTip: false,
        color: '#fff'
      },
      timer: null
    }
  },
  computed: {
    nickName() {
      return this.user && this.user.nickName
        ? this.user.nickName
        : this.user.userName
    },
    // teamID==1:东亚银行  teamID==2:邮银财富 teamID==101:中国建设银行  teamID为其他数据，就不跳到当前页面
    teamID() {
      return this.user && this.user.org && this.user.org.teamID
        ? this.user.org.teamID
        : 0
    },
    bgImage() {
      if (this.teamID === 1)
        return 'https://cdn.edesoft.com/cindi/upload/202503/19/1189730508.jpg'
      if (this.teamID === 2)
        return 'https://cdn.edesoft.com/cindi/upload/202503/19/1181713946.jpg'
      if (this.teamID === 101)
        return 'https://cdn.edesoft.com/cindi/upload/202504/08/3865894959.jpg'
      return ''
    },
    logoImage() {
      if (this.teamID === 1)
        return 'https://cdn.edesoft.com/cindi/upload/202503/19/1031746913.png'
      if (this.teamID === 2)
        return 'https://cdn.edesoft.com/cindi/upload/202503/19/1834920307.png'
      if (this.teamID === 101)
        return 'https://cdn.edesoft.com/cindi/upload/202504/08/371897241.png'
      return ''
    },
    middleImage() {
      if (this.teamID === 1)
        return 'https://cdn.edesoft.com/cindi/upload/202503/19/2322067470.png'
      if (this.teamID === 2)
        return 'https://cdn.edesoft.com/cindi/upload/202503/19/1422083175.png'
      if (this.teamID === 101)
        return 'https://cdn.edesoft.com/cindi/upload/202504/08/644227708.png'
      return ''
    }
  },
  onShow() {
    this.timer = setTimeout(() => {
      this.goHomePage()
    }, Stay_Time)
  },
  methods: {
    goHomePage() {
      if (this.timer) clearTimeout(this.timer)
      uni.redirectTo({
        url: '/pages/home/index'
      })
    }
  }
}
</script>
<style scoped>
.examine-content {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin-top: 144rpx;
}
.examine-logo {
  height: 96rpx;
  margin-bottom: 96rpx;
}
.examine-middle {
  height: 562rpx;
  margin-bottom: 80rpx;
}
.examine-name {
  color: #ffffff;
  font-weight: 500;
  font-size: 42rpx;
  line-height: 54rpx;
}
.examine-button {
  height: 112rpx;
  width: calc(100% - 96rpx);
  border-radius: 56rpx;
  background-color: rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.75);
  font-size: 38rpx;
  margin-top: 154rpx;
  margin-bottom: 96rpx;
}
</style>
