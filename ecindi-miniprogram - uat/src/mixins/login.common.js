import { mapGetters } from 'vuex'
import { getJwtPayload } from '@/utils/jwt.js'
import { wxlogin } from '@/api/index.js'
const wxlog = require('@/utils/wxlog.js')
export default {
  computed: {
    ...mapGetters([
      'hasLogin',
      'user',
      'isRegistered',
      'isFirstLogin',
      'appTitle',
      'initDone',
      'initWelcome'
    ]),
    teamID() {
      return this.user && this.user.org && this.user.org.teamID
        ? this.user.org.teamID
        : 0
    }
  },
  methods: {
    // 在welcome页面内判断用户是否登录；已登录跳home/index, 未登录跳到login/index页
    async checkLoginForWelcome() {
      if (!this.initWelcome) {
        wxlog.info('welcome页面未初始化，准备跳转到welcome页面', {
          user: this.user,
          initWelcome: this.initWelcome
        })
        return uni.redirectTo({ url: '/pages/welcome/index' })
      }
      // 判断是否要跳转页面
      const pages = getCurrentPages()
      console.log('当前页面', pages)

      const shouldJump = !this.hasLogin || this.isFirstLogin
      if (shouldJump) {
        console.log('未登录，准备跳转')
        // 不要重复跳转
        const loginPage = '/pages/login/index'
        const shoudJump = pages.every(
          (page) => loginPage.includes(page.route) === false
        )

        if (shoudJump) {
          wxlog.info('未登录或者是初次登录，准备跳转登录页', {
            user: this.user,
            hasLogin: this.hasLogin,
            isFirstLogin: this.isFirstLogin,
            loginPage: loginPage
          })
          return uni.redirectTo({ url: loginPage })
        } else {
          console.log('已经在登录页了，取消跳转')
        }
      } else {
        console.log('已登录，准备跳转首页')
        // 不要重复跳转
        const homePage = '/pages/home/index'
        const shouldJump = pages.every(
          (page) => homePage.includes(page.route) === false
        )

        if (shouldJump) {
          wxlog.info('已登录，准备跳转首页', {
            user: this.user,
            hasLogin: this.hasLogin,
            isFirstLogin: this.isFirstLogin,
            homePage: homePage
          })
          return uni.redirectTo({ url: homePage })
        } else {
          console.log('已经在首页了，取消跳转')
        }
      }
    },
    // 在其他页面判断用户是否已登录；未登录跳welcome页
    async checkLoginForOtherPage() {
      const isLogin = !this.hasLogin || this.isFirstLogin
      if (isLogin) {
        console.log('未登录，准备跳转')
        // 不要重复跳转
        const welcomePage = '/pages/welcome/index'
        const shouldJump = pages.every(
          (page) => welcomePage.includes(page.route) === false
        )

        if (shouldJump) {
          wxlog.info('当前在首页，但未登录，现在跳转到welcome页', {
            user: this.user,
            hasLogin: this.hasLogin,
            isFirstLogin: this.isFirstLogin,
            welcomePage: welcomePage
          })
          return uni.redirectTo({ url: welcomePage })
        } else {
          console.log('已经在welcome页了，取消跳转')
        }
      }
    },
    // 登录注册/修改用户信息-判断组织ID，再跳转
    async goHomeOrExamine() {
      // teamID==1:东亚银行  teamID==2:邮银财富 teamID==101:中国建设银行 跳到examine  teamID为其他数据，就跳到首页
      if (this.teamID === 1 || this.teamID === 2 || this.teamID === 101) {
        uni.redirectTo({
          url: '/pages/login/examine'
        })
      } else {
        uni.redirectTo({
          url: '/pages/home/index'
        })
      }
    },

    async checkUserForAppLogin(forced = false) {
      const ok = this.hasValidToken()
      if (forced || !ok) {
        await this.doWxLogin()

        await this.waitingUserLoaded()
      }
    },
    // 判断token是否过期，未过期就到首页，已过期就到登录页
    async checkUserLogin(forced = false) {
      const ok = this.hasValidToken()
      if (forced || !ok) {
        await this.doWxLogin()

        await this.waitingUserLoaded()
      }

      await this.checkLoginForWelcome()
    },

    async doWxLogin() {
      const accountInfo = wx.getAccountInfoSync()
      const appID = accountInfo.miniProgram.appId
      const envVersion = accountInfo.miniProgram.envVersion
      const that = this
      // 定义
      const p = () =>
        new Promise((resolve, reject) => {
          wx.login({
            async success(res) {
              const code = res && res.code
              if (code) {
                let userData = await wxlogin({ code, appID, envVersion })
                const error = userData && userData.error
                if (error) {
                  return reject(error)
                }
                await that.$store.dispatch('root/set_user', userData)
                // 由微信直接登录的用户，无需sso验证
                if (userData && userData.id > 0) {
                  await that.$store.dispatch('root/setPendingSsoStep', false)
                }
              } else {
                return reject('code is empty')
              }
              resolve('login done')
            },
            async fail(res) {
              reject(res)
            },
            async timeout(res) {
              reject(res)
            }
          })
        })

      // 执行
      await p().catch((e) => {
        uni.showModal({
          title: '提示',
          content: `登录失败[${JSON.stringify(e)}]`,
          showCancel: false
        })
      })
    },
    async getUserData() {
      let res = await this.$api.getUserInfo()
      await this.$store.dispatch('root/set_user', res)
      return res
    },
    hasValidToken() {
      const obj = getJwtPayload()
      const isExpired = !obj.exp || obj.exp < Date.now() / 1000
      if (
        !isExpired &&
        this &&
        this.user &&
        (this.user.id || this.user.wechatUserID)
      ) {
        return true
      }
      return false
    },
    async wait(ms) {
      return new Promise((resolve) => {
        setTimeout(resolve, ms)
      })
    },
    async waitingUserLoaded() {
      // wait for user is ready, timeout 10 seconds
      for (let i = 1; i < 100; i++) {
        if (this.hasValidToken()) {
          break
        }
        // const token = this.getToken()
        // if (token && token.uid && this.user) {
        //   break
        // }
        await this.wait(100)
      }
    }
  }
}
