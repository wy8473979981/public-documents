<template>
  <div class="login-page">
    <nav-bar :navOption="navOption"></nav-bar>
    <!-- 背景图 -->
    <bg-image src="/static/icons/bg.jpeg"></bg-image>
    <div class="login-content">
      <div class="login-title">登录iPassport</div>
      <div class="login-input-box">
        <input
          type="text"
          class="login-input"
          :class="{ 'login-input-readonly': !canChangeAgentCode }"
          placeholder-class="login-input-placeholder"
          v-model="aiaAgentCode"
          :disabled="!canChangeAgentCode"
          placeholder="请输入营销员编号"
        />
      </div>
      <div class="login-input-box">
        <input
          type="text"
          :password="!showPassword"
          class="login-input"
          placeholder-class="login-input-placeholder"
          v-model="password"
          placeholder="请输入密码"
        />
        <div
          class="login-input-icon-box"
          @click="changeShowPassword"
          v-if="password"
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
      <div class="login-input-box">
        <picker
          mode="selector"
          :range="companyList"
          range-key="name"
          @change="onCompanyChange"
        >
          <view class="login-input">
            <text class="picker-text">{{
              selectedCompany ? selectedCompany.name : '请选择团队所属城市'
            }}</text>
            <image
              src="../../static/icons/down-orange.png"
              mode=""
              class="down-orange-icon"
            />
          </view>
        </picker>
      </div>
      <div class="login-input-box verification-code">
        <input
          type="text"
          class="login-input"
          placeholder-class="login-input-placeholder"
          v-model="smsCode"
          placeholder="请输入验证码"
        />
        <view
          class="get-code-btn"
          :class="{ disabled: countdown > 0 }"
          @click="getVerificationCode"
        >
          {{ countdown > 0 ? `${countdown}s后可重发` : '获取验证码' }}
        </view>
      </div>
    </div>
    <div class="login-butt-box">
      <div
        class="login-butt"
        :class="[canClickLogin ? 'login-butt-active' : '']"
        @click="handleLogin"
      >
        立即开始
      </div>
    </div>
  </div>
</template>

<script>
import CryptoJS from 'crypto-js'
import pageCommon from '@/mixins/page.common.js'

export default {
  mixins: [pageCommon],
  name: 'LoginSSO',
  data() {
    return {
      navOption: {
        navTitle: 'AI对练工具',
        backgroundColor: '',
        hasPlaceholder: true,
        showBackTip: false,
        color: '#fff'
      },
      aiaAgentCode: '',
      userName: '',
      canChangeAgentCode: true,
      password: '',
      showPassword: false,
      companyList: [],
      selectedCompany: {},
      mobile: '',
      smsCode: '',
      countdown: 0,
      timer: null
    }
  },

  computed: {
    canClickLogin() {
      return (
        this.aiaAgentCode &&
        this.selectedCompany &&
        this.smsCode &&
        this.password
      )
    }
  },

  async onLoad(options) {
    const { aiaAgentCode, userName } = options
    if (aiaAgentCode) {
      this.aiaAgentCode = aiaAgentCode
      this.canChangeAgentCode = false
    }
    if (userName) {
      this.userName = userName
    }
    await this.fetchData()
  },

  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer)
    }
  },

  methods: {
    async fetchData() {
      await this.fetchCompanyList()
      this.setDefaultValues()
    },

    async fetchCompanyList() {
      const res = await this.$api.getAiaCompanyList()
      this.companyList = res || []
    },

    setDefaultValues() {
      const user = this.$store.state.root.user || {}
      // 如果没有传入的aiaAgentCode，则使用用户信息中的aiaAgentCode
      if (!this.aiaAgentCode) {
        this.aiaAgentCode = user.aiaAgentCode || ''
      }
      const defaultCompany = this.companyList.find(
        (item) => item.id === user.aiaCompanyID
      )
      if (defaultCompany) {
        this.selectedCompany = defaultCompany
      } else if (this.companyList.length > 0) {
        this.selectedCompany = this.companyList[0] || {}
      }
    },

    onCompanyChange(e) {
      const index = e.detail.value
      this.selectedCompany = this.companyList[index]
    },

    async getVerificationCode() {
      if (this.countdown > 0) return

      // 校验agentCode是否已填写
      if (!this.aiaAgentCode) {
        uni.showToast({
          title: '请输入营销员编号',
          icon: 'none'
        })
        return
      }

      // 校验分公司是否已选择
      if (!this.selectedCompany) {
        uni.showToast({
          title: '请选择团队所属城市',
          icon: 'none'
        })
        return
      }

      // 调用获取验证码的接口
      const res = await this.$api.sendIPassportSmsCode({
        aiaAgentCode: this.aiaAgentCode,
        aiaCompanyID: this.selectedCompany.id
      })

      if (!res) {
        return
      }

      if (res.msg) {
        let msg = res.msg || ''
        // 手机号脱敏
        msg = msg.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')

        uni.showModal({
          title: '提示',
          content: msg,
          showCancel: false
        })
      }

      if (!res.success) {
        return
      }

      this.mobile = res.mobile || ''

      // 倒计时
      this.countdown = 60
      this.timer = setInterval(() => {
        if (this.countdown > 0) {
          this.countdown--
        } else {
          clearInterval(this.timer)
        }
      }, 1000)
    },

    async handleLogin() {
      if (!this.canClickLogin) return

      if (!this.mobile) {
        uni.showToast({
          title: '请先获取验证码',
          icon: 'none'
        })
        return
      }

      // sha256加密密码
      const passwordHash256 = CryptoJS.SHA256(this.password).toString()

      // 调用登录的接口
      const res = await this.$api.loginIPassport({
        aiaAgentCode: this.aiaAgentCode,
        aiaCompanyID: this.selectedCompany.id,
        userName: this.userName,
        mobile: this.mobile,
        smsCode: this.smsCode,
        passwordHash256: passwordHash256
      })

      if (!res) {
        return
      }

      await this.getUserData()
      // 取消sso校验flag
      await this.$store.dispatch('root/setPendingSsoStep', false)

      // // 判断是否需要修改密码
      // if (res.isFirstLogin) {
      //   uni.redirectTo({
      //     url: '/pages/login/edit'
      //   })
      //   return
      // }

      return await this.goHomeOrExamine()
    },

    // 切换是否显示密码
    changeShowPassword() {
      this.showPassword = !this.showPassword
    }
  }
}
</script>

<style>
.login-input-placeholder {
  color: rgba(0, 0, 0, 0.3);
}
</style>

<style scoped>
.login-page {
  width: 100%;
}

.login-content {
  margin-top: 192rpx;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin-bottom: 208rpx;
}

.login-title {
  color: #ffffff;
  font-size: 42rpx;
  margin-bottom: 112rpx;
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
  padding-right: 40rpx;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  font-size: 28rpx;
  color: #000000;
}

.login-input-readonly {
  background-color: #f5f5f5 !important;
  color: #757575 !important;
}

.login-input-icon-box {
  width: 100rpx;
  height: 100%;
  position: absolute;
  right: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}

.login-input-icon {
  width: 28rpx;
  height: 28rpx;
}

.down-orange-icon {
  width: 28rpx;
  height: 28rpx;
}

.picker-text {
  flex: 1;
  font-size: 28rpx;
  color: #000000;
  height: 48rpx;
  text-align: left;
  padding: 20rpx 0;
}

.picker-text:empty::before {
  content: '请选择团队所属城市';
  color: rgba(0, 0, 0, 0.3);
}

.arrow {
  color: #999;
  font-size: 24rpx;
  margin-left: 10rpx;
}

.verification-code {
  display: flex;
  align-items: center;
}

.verification-code .login-input {
  padding-right: 180rpx;
}

.get-code-btn {
  position: absolute;
  right: 30rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  color: #ff0000;
  font-size: 28rpx;
  border-left: 1px solid #eee;
  padding-left: 20rpx;
}

.get-code-btn.disabled {
  height: 36rpx;
  font-weight: 500;
  font-size: 24rpx;
  color: #ed171f;
  line-height: 36rpx;
  opacity: 0.3;
}

.login-butt-box {
  width: 100%;
  display: flex;
  justify-content: center;
  position: fixed;
  bottom: 96rpx;
}

.login-butt {
  width: 654rpx;
  height: 112rpx;
  background: #ed171f;
  border-radius: 56rpx;
  opacity: 0.5;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-weight: 400;
  font-size: 38rpx;
}

.login-butt-active {
  background-color: #ff0000;
  color: #ffffff;
  opacity: 1;
}
</style>
