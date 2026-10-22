<script>
import pageCommon from '@/mixins/page.common.js'
import { appTitle } from '@/utils/baseconfig'
import { willTokenExpireIn, isTokenExpired } from '@/utils/jwt.js'
import wxlog from '@/utils/wxlog'

import dayjs from 'dayjs'

// 检查token是否过期的时间间隔
const CHECK_TOKEN_INTERVAL = 1000 * 60 * 10 // x分钟
const FORCE_REFRESH_TOKEN_TIME = 1000 * 60 * 15 // y分钟内过期,强制刷新token; 注意：y分钟要大于x分钟
// 例如：x=10分钟，y=15分钟，则在token过期前5分钟刷新token
// 这样可以避免token过期后，用户操作时才刷新token，导致用户体验不佳

export default {
  mixins: [pageCommon],
  data() {
    return {
      isCheckingToken: false,
      checkTokenTimer: null,
      hasHidden: false
    }
  },
  globalData: {
    statusBar: null,
    custom: null,
    customBar: null,
    windowWidth: null
  },

  async onLaunch(options) {
    this.reformatConsoleLog()
    console.log('小程序启动了', options)
    this.setCustomBar()
    this.saveAppOptions(options)
    await this.globalInit()
    await this.checkUserForAppLogin(true)
    await this.$store.dispatch('root/setInitDone')
    await this.$store.dispatch('root/setInitWelcome', false)

    // 每x分钟自动检查token是否过期
    this.checkTokenTimer = setInterval(async () => {
      await this.smartRefreshToken()
    }, CHECK_TOKEN_INTERVAL)
  },

  async onHide() {
    this.hasHidden = true
  },

  async onShow() {
    // 如果小程序被隐藏后再次打开，需要校验token或session是否过期
    if (this.hasHidden) {
      console.log('小程序被隐藏后再次打开')
      await this.smartRefreshToken()
    }
  },

  onUnload() {
    console.log('小程序卸载了', options)
    // 执行清理操作
    if (this.checkTokenTimer) {
      clearInterval(this.checkTokenTimer)
      this.checkTokenTimer = null
    }
  },

  methods: {
    saveAppOptions(options) {
      wx.setStorageSync('appOptions', options)
    },

    setCustomBar() {
      const that = this

      const res = wx.getWindowInfo()
      that.globalData.windowWidth = res.windowWidth
      that.globalData.statusBar = res.statusBarHeight
      const custom = wx.getMenuButtonBoundingClientRect()
      that.globalData.custom = custom
      that.globalData.customBar = custom.bottom + custom.top - res.statusBarHeight
    },
    async globalInit() {
      await this.$store.dispatch('root/initDicts')
      this.$store.dispatch('root/setAppTitle', appTitle || '')
    },

    async smartRefreshToken() {
      // 如果正在刷新token，则不再执行
      if (this.isCheckingToken) {
        console.log('smartRefreshToken执行中，不再重复执行')
        return
      }

      try {
        // 增加标志位，防止重复执行
        this.isCheckingToken = true

        // log当前时间
        console.log('smartRefreshToken')

        // 1. 检查token是否已过期，如果已过期，则重新登录
        const shouldRelaunch = isTokenExpired()
        if (shouldRelaunch) {
          console.log('token已过期，重新登录')
          await this.checkUserForAppLogin(true)
          // wx.reLaunch({ url: '/pages/welcome/index' })
          return
        }

        // 2. 检查token是否将要过期
        const shouldRefreshToken = willTokenExpireIn(FORCE_REFRESH_TOKEN_TIME)

        // 3. 如果token将要过期，则刷新token
        if (shouldRefreshToken) {
          wxlog.warn('token将要过期，刷新token')
          console.log('token将要过期，刷新token')
          await this.$api.refreshToken()
        } else {
          console.log('token未过期')
        }
      } catch (error) {
        console.error('smartRefreshToken error:', error)
      } finally {
        this.isCheckingToken = false
      }
    },

    reformatConsoleLog() {
      // 备份原始的console方法
      const originalConsole = {
        log: console.log,
        info: console.info,
        warn: console.warn,
        error: console.error
      }

      // 获取当前时间戳字符串
      function getTimestamp() {
        return dayjs().format('YYYY-MM-DD HH:mm:ss.SSS')
      }

      // 重写console方法
      console.log = function (...args) {
        originalConsole.log(`[${getTimestamp()}]`, ...args)
      }

      console.info = function (...args) {
        originalConsole.info(`[${getTimestamp()}] INFO:`, ...args)
      }

      console.warn = function (...args) {
        originalConsole.warn(`[${getTimestamp()}] WARN:`, ...args)
      }

      console.error = function (...args) {
        originalConsole.error(`[${getTimestamp()}] ERROR:`, ...args)
      }
    }
  }
}
</script>

<style lang="stylus">
// 特殊类
.flex{
  display flex
  align-items center
}
.jus{
  display flex
  justify-content space-between
  align-items center
}
.grid{
  display grid
  place-items center
}
</style>
<style>
::-webkit-scrollbar {
  display: none;
  width: 0;
  height: 0;
  color: transparent;
}
</style>
