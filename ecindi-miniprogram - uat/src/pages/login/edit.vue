<template>
  <div class="login-page">
    <nav-bar :navOption="navOption"></nav-bar>
    <!-- 背景图 -->
    <bg-image src="/static/icons/bg.jpeg"></bg-image>
    <div class="login-content">
      <div class="login-title">修改个人信息</div>
      <div class="login-sub-title">
        目前AI对练工具暂未开放个人资料再次修改的功能，请谨慎修改个人信息，并牢记您的登录信息
      </div>
      <div class="login-input-box">
        <input
          type="text"
          class="login-input"
          placeholder-class="login-input-placeholder"
          v-model="regData.nickName"
          placeholder="请输入昵称"
        />
      </div>
      <div class="login-input-box">
        <input
          type="text"
          :password="!showPassword"
          class="login-input"
          placeholder-class="login-input-placeholder"
          v-model="regData.newPassword"
          placeholder="请输入新密码"
        />
        <div
          class="login-input-icon-box"
          @click="changeShowPassword"
          v-if="regData.newPassword"
        >
          <image
            src="../../static/icons/password.png"
            v-show="showPassword"
            mode=""
            class="login-input-icon"
          />
          <image
            src="../../static/icons/password-no.png"
            v-show="!showPassword"
            mode=""
            class="login-input-icon"
          />
        </div>
      </div>

      <!-- 新增密码确认输入框 -->
      <div class="login-input-box">
        <input
          type="text"
          :password="!showConfirmPassword"
          class="login-input"
          placeholder-class="login-input-placeholder"
          v-model="regData.confirmPassword"
          placeholder="请确认新密码"
        />
        <div
          class="login-input-icon-box"
          @click="changeShowConfirmPassword"
          v-if="regData.confirmPassword"
        >
          <image
            src="../../static/icons/password.png"
            v-show="showConfirmPassword"
            mode=""
            class="login-input-icon"
          />
          <image
            src="../../static/icons/password-no.png"
            v-show="!showConfirmPassword"
            mode=""
            class="login-input-icon"
          />
        </div>
      </div>

      <div class="login-input-box">
        <input
          :value="handleLabel('name', teamID, teamList)"
          type="text"
          class="login-input-picker"
          placeholder-class="login-input-picker-placeholder"
          placeholder="请选择组织"
          disabled
        />
      </div>
      <div class="login-input-box" @click="clickShowPopup('city')">
        <input
          :value="handleLabel('name', cityID, cityList)"
          type="text"
          class="login-input-picker"
          placeholder-class="login-input-picker-placeholder"
          placeholder="请选择省市"
          disabled
        />
        <!-- <div class="login-input-icon-box">
          <image
            src="../../static/icons/down-orange.png"
            mode=""
            class="login-input-icon"
          />
        </div> -->
      </div>
      <div class="login-input-box" @click="clickShowPopup('org')">
        <input
          :value="handleLabel('name', orgID, orgList)"
          type="text"
          class="login-input-picker"
          placeholder-class="login-input-picker-placeholder"
          placeholder="请选择网点"
          disabled
        />
        <!-- <div class="login-input-icon-box">
          <image
            src="../../static/icons/down-orange.png"
            mode=""
            class="login-input-icon"
          />
        </div> -->
      </div>
      <div class="login-page-err" v-if="errMsg">{{ errMsg }}</div>
    </div>
    <div class="login-butt-box">
      <div class="login-butt-examine" @click.stop="changeIsAgree">
        <div class="login-butt-examine-img-box">
          <img
            src="../../static/icons/examine-checked.png"
            alt=""
            srcset=""
            class="login-butt-examine-img"
            v-show="isAgree"
          />
          <img
            src="../../static/icons/examine-checked-no.png"
            alt=""
            srcset=""
            class="login-butt-examine-img"
            v-show="!isAgree"
          />
        </div>
        <div class="login-butt-examine-text">
          我已阅读并同意<span
            class="login-butt-examine-text-active"
            @click.stop="goAgreement('user')"
            >用户协议</span
          >和<span
            class="login-butt-examine-text-active"
            @click.stop="goAgreement('privacy')"
            >隐私条款</span
          >
        </div>
      </div>
      <div
        class="login-butt"
        :class="[isClickLogin ? 'login-butt-active' : '']"
        @click="updateUserInfo"
      >
        立即开始
      </div>
    </div>
    <!-- <custom-picker
      ref="pickerPopup"
      :title="pickerData.title"
      :list="pickerData.list"
      :labelKey="pickerData.labelKey"
      :currentID="pickerData.currentID"
      @selectItem="selectItem"
    ></custom-picker> -->
  </div>
</template>

<script>
import CryptoJS from 'crypto-js'
import pageCommon from '@/mixins/page.common.js'
// import CustomPicker from '../../components/login/CustomPicker.vue'
export default {
  mixins: [pageCommon],
  // components: {
  //   CustomPicker
  // },
  data() {
    return {
      navOption: {
        navTitle: 'AI对练工具',
        backgroundColor: '',
        hasPlaceholder: true,
        showBackTip: false,
        color: '#fff'
      },
      regData: {
        nickName: '',
        newPassword: '',
        confirmPassword: '' // 新增确认密码字段
      },
      showPassword: false, // 是否显示密码
      showConfirmPassword: false, // 新增：是否显示确认密码
      isAgree: false, // 是否确定同意
      errMsg: '', //请输入正确的登录用户名和用户密码
      cityList: [], //省市
      orgList: [], //网点
      teamList: [] //组织
      // pickerData: {
      //   source: '',
      //   title: '',
      //   list: [],
      //   labelKey: '',
      //   currentID: 0
      // }
    }
  },
  computed: {
    isClickLogin() {
      if (this.regData.nickName && 
          this.regData.newPassword && 
          this.regData.confirmPassword && 
          this.isAgree) {
        return true
      }
      return false
    },
    orgID() {
      return this.user && this.user.orgID ? this.user.orgID : 0
    },
    cityID() {
      return this.user && this.user.org && this.user.org.cityID
        ? this.user.org.cityID
        : 0
    }
  },
  async onShow() {
    await this.waitingUserLoaded()
    await this.fetchData()
  },
  methods: {
    async fetchData() {
      let defaultNickName =
        this.user && this.user.nickName ? this.user.nickName : ''
      this.regData = {
        nickName: defaultNickName,
        newPassword: '',
        confirmPassword: '' // 重置确认密码
      }
      this.showPassword = false
      this.showConfirmPassword = false // 重置确认密码显示状态
      this.isAgree = false
      this.errMsg = ''
      this.cityList = []
      this.orgList = []
      this.teamList = []
      // this.pickerData = {
      //   source: '',
      //   title: '',
      //   list: [],
      //   labelKey: '',
      //   currentID: 0
      // }
      await this.getSearchTeam()
      await this.getSearchCity()
      await this.getSearchOrgs()
    },
    goAgreement(type) {
      uni.navigateTo({
        url: '/pages/grant/agreement?type=' + type
      })
    },
    async getSearchTeam() {
      let res = await this.$api.getSearchTeam({ pageSize: 500 })
      this.teamList = res.data || []
    },
    async getSearchCity() {
      let res = await this.$api.getSearchCity({ pageSize: 500 })
      this.cityList = res.data || []
    },
    async getSearchOrgs() {
      let query = {
        pageSize: 500
      }
      if (this.teamID) {
        query.teamID = this.teamID
      }
      if (this.cityID) {
        query.cityID = this.cityID
      }
      let res = await this.$api.getSearchOrgs(query)
      this.orgList = res.data || []
    },
    // 切换是否显示密码
    changeShowPassword() {
      this.showPassword = !this.showPassword
    },
    // 新增：切换是否显示确认密码
    changeShowConfirmPassword() {
      this.showConfirmPassword = !this.showConfirmPassword
    },
    // 是否确认同意
    changeIsAgree() {
      this.isAgree = !this.isAgree
    },
    // 打开弹出层
    clickShowPopup(source) {
      console.log('source', source)
      // this.pickerData.source = source
      // if (source === 'org' && !this.regData.cityID) {
      //   return uni.showToast({
      //     title: '请先选择省市',
      //     icon: 'none',
      //     duration: 2000
      //   })
      // }
      // this.$refs.pickerPopup.open()
      // switch (this.pickerData.source) {
      //   case 'city':
      //     this.pickerData.title = '请选择省市'
      //     this.pickerData.list = this.cityList
      //     this.pickerData.labelKey = 'name'
      //     this.pickerData.currentID = this.regData.cityID
      //     return
      //   case 'org':
      //     this.pickerData.title = '请选择网点'
      //     this.pickerData.list = this.orgList
      //     this.pickerData.labelKey = 'name'
      //     this.pickerData.currentID = this.regData.orgID
      //     return
      //   default:
      // }
    },
    // selectItem(e) {
    //   switch (this.pickerData.source) {
    //     case 'city':
    //       this.regData.cityID = e
    //       this.getSearchOrgs()
    //       return
    //     case 'org':
    //       this.regData.orgID = e
    //       return
    //     default:
    //   }
    // },
    handleLabel(key, value, list) {
      let findData = list.find((item) => item.id === value)
      if (findData && findData[key]) {
        return findData[key]
      }
      return ''
    },
    // 检查两次密码是否一致
    checkPasswordMatch() {
      if (this.regData.newPassword !== this.regData.confirmPassword) {
        return '两次输入的密码不一致'
      }
      return ''
    },
    // 更新用户
    async updateUserInfo() {
      if (!this.isClickLogin) return

      const plainPass = this.regData.newPassword
      const confirmPass = this.regData.confirmPassword

      // 先检查密码是否一致
      const matchErrorMsg = this.checkPasswordMatch()
      if (matchErrorMsg) {
        uni.showModal({
          title: '提示',
          content: matchErrorMsg,
          showCancel: false
        })
        return
      }

      // 校验密码强度
      let passwordErrorMsg = this.checkPasswordStrength(plainPass)
      if (passwordErrorMsg) {
        // show modal
        uni.showModal({
          title: '提示',
          content: passwordErrorMsg,
          showCancel: false
        })
        return
      }

      let loginData = {
        ...this.regData
      }
      delete loginData.confirmPassword;
      // 注意：这里需要使用md5加密，这样API记录的log里不会泄露明文密码
      loginData.newPassword = CryptoJS.MD5(plainPass).toString()
      loginData.newPasswordHash256 = CryptoJS.SHA256(plainPass).toString()

      const res = await this.$api.updateUserInfo(loginData)
      if (res && res.error) {
        this.errMsg = res.error
        return
      }
      await this.getUserData()
      await this.goHomeOrExamine()
    },
    // 校验密码强度
    checkPasswordStrength(password) {
      // 密码强度规则：必须包含数字、大小写字母以及特殊字符
      // const passwordRegex =
      //   /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*_=+-]).{8,}$/

      // 规则1: 密码长度必须大于8位
      if (password.length < 8) {
        return '密码长度必须大于或等于8位'
      }
      // 规则2: 密码必须包含数字
      if (!/\d/.test(password)) {
        return '密码必须包含数字'
      }
      // 规则3: 密码必须包含大写字母
      if (!/[A-Z]/.test(password)) {
        return '密码必须包含大写字母'
      }
      // 规则4: 密码必须包含小写字母
      if (!/[a-z]/.test(password)) {
        return '密码必须包含小写字母'
      }
      // 规则5: 密码必须包含特殊字符
      if (!/[!@#$%^&*_=+-]/.test(password)) {
        return '密码必须包含特殊字符'
      }
      return ''
    }
  }
}
</script>
<style>
.login-input-placeholder {
  color: rgba(0, 0, 0, 0.3);
}
.login-input-picker-placeholder {
  color: rgba(207, 207, 207, 0.3);
}
</style>
<style scoped>
.login-page {
  width: 100%;
  padding-bottom: 340rpx;
  box-sizing: border-box;
}

.login-content {
  margin-top: 192rpx;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.login-title {
  color: #ffffff;
  font-size: 42rpx;
  margin-bottom: 64rpx;
}
.login-sub-title {
  color: #cfcfcf;
  padding: 0 48rpx;
  box-sizing: border-box;
  font-size: 22rpx;
  line-height: 34rpx;
  margin-bottom: 50rpx;
  text-align: center;
}

.login-input-box {
  width: 526rpx;
  height: 80rpx;
  margin-bottom: 40rpx;
  position: relative;
}
.login-input {
  height: 100%;
  border-radius: 40rpx;
  width: 100%;
  background-color: #fff;
  padding-left: 40rpx;
  padding-right: 100rpx;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  font-size: 28rpx;
  color: #000000;
}

.login-input-picker {
  height: 100%;
  border-radius: 40rpx;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.1);
  padding-left: 40rpx;
  padding-right: 100rpx;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  font-size: 28rpx;
  color: #cfcfcf;
}

.login-input-icon-box {
  width: 100rpx;
  height: 100%;
  position: absolute;
  right: 0;
  top: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
.login-input-icon {
  width: 28rpx;
  height: 28rpx;
}

.login-page-err {
  padding: 0 40rpx;
  box-sizing: border-box;
  color: #f31c38;
  font-size: 22rpx;
  line-height: 34rpx;
  margin-top: 40rpx;
}

/* 按钮 */
.login-butt-box {
  position: fixed;
  bottom: 96rpx;
  padding: 0 48rpx;
  box-sizing: border-box;
  left: 0;
  width: 100%;
  z-index: 10;
  background-color: transparent;
}

.login-butt-examine {
  width: 100%;
  margin-bottom: 80rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login-butt-examine-img-box {
  width: 28rpx;
  height: 28rpx;
  margin-right: 12rpx;
  display: flex;
  align-items: center;
}
.login-butt-examine-img {
  width: 100%;
  height: 100%;
}
.login-butt-examine-text {
  color: #cfcfcf;
  font-size: 22rpx;
  line-height: 34rpx;
}
.login-butt-examine-text-active {
  color: #ed171f;
  cursor: pointer;
}

.login-butt {
  width: 100%;
  height: 112rpx;
  border-radius: 56rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 38rpx;
  color: #fff;
  opacity: 0.5;
  background-color: #ed171f;
}
.login-butt-active {
  opacity: 1;
}
</style>
