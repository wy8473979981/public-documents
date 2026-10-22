import Vue from 'vue'
import App from './App'
import router from './utils/router'
import util from './utils/util.js'
import api from './api/index'
import Vuex from 'vuex'
import store from '@/store'
import getUserDevice from './public/getUserDevice.js'
import dayjs from 'dayjs'
var relativeTime = require('dayjs/plugin/relativeTime')
require('dayjs/locale/zh-cn')
dayjs.locale('zh-cn')
dayjs.extend(relativeTime)

import wxlog from '@/utils/wxlog'
Vue.config.errorHandler = function (err, vm, info) {
  wxlog.error('Vue全局错误', err, info)
}

import { smallImg, normalImg, webpImg } from './utils/img'

Vue.config.productionTip = false
Vue.use(Vuex)

App.mpType = 'app'
const app = new Vue({
  store,
  ...App
})
app.$mount()

/* eslint-disable */
Vue.prototype.app = getApp()
Vue.prototype.$api = api
Vue.prototype.$store = store
Vue.prototype.$router = router
Vue.prototype.$util = util
Vue.prototype.$dayjs = dayjs
Vue.prototype.$smallImg = smallImg
Vue.prototype.$normalImg = normalImg
Vue.prototype.$webpImg = webpImg
// 节流防抖
Vue.prototype.$noMultipleClicks = util.noMultipleClicks
// 全局设备类型
Vue.prototype.$UserDeviceType = ''
getUserDevice
  .getUserDeviceType()
  .then((screenType) => {
    Vue.prototype.$UserDeviceType = screenType
  })
  .catch((err) => {
    console.log('error: ' + err)
  })

import splash from '@/components/splash'
import navBarVue from '@/components/navBar.vue'
import bgImageVue from '@/components/bgImage.vue'
import PublicLogo from '@/components/PublicLogo.vue'

// 全局注册组件
Vue.component('splash', splash)
Vue.component('navBar', navBarVue)
Vue.component('bgImage', bgImageVue)
Vue.component('PublicLogo', PublicLogo)
