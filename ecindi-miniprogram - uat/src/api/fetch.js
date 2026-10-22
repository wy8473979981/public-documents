import { getApiRoot, debug } from './apiroot'
import { getJwtObj } from '../utils/jwt'
import { showLoading, hideLoading } from '../utils/loading'
var Fly = require('flyio/dist/npm/wx')

const wxlog = require('@/utils/wxlog.js')

function log() {
  if (debug) {
    console.log.apply(null, arguments)
  }
}

const GLOBAL_TIMEOUT = 2 * 60 * 1000 // 2 minutes

export default async (x, data, method = 'GET') => {
  let baseURL = getApiRoot()
  var url = baseURL + x

  // 支持阿里云网关
  if (process.env.VUE_APP_GATEWAY_APPCODE) {
    if (method.match(/^get$/gi)) {
      data = {
        ...data,
        AppCode: process.env.VUE_APP_GATEWAY_APPCODE
      }
    } else {
      url = getUrlForApiGateway(url)
    }
  }

  var fly = createFly()
  return fly.request({
    url,
    body: data,
    method,
    timeout: GLOBAL_TIMEOUT
  })
}

export const createFly = () => {
  var fly = new Fly()
  if (fly.config) {
    fly.config.timeout = GLOBAL_TIMEOUT
  }

  fly.interceptors.request.use((request) => {
    request.timeout = GLOBAL_TIMEOUT

    showLoading('加载中...', true)
    var token = wx.getStorageSync('authorization')
    if (token) {
      request.headers['authorization'] = token
    }

    // 增加随机码: 使用日期+随机数
    request.headers['X-Ca-Nonce'] =
      new Date().getTime() + Math.random().toString(36).substring(2, 15)

    return request
  })

  fly.interceptors.response.use(
    (response) => {
      // log('<<< response', response)

      hideLoading()
      let token = response.headers.authorization
      if (token && typeof token === 'object' && token.length > 0) {
        token = token[0]
      }
      // should not save token, when existing token has user ID, but new token is visitor
      // 解决的问题：api调用滞后，导致返回的visitor token覆盖了user token
      const skipSetting = checkTokenSettingShouldBeSkip(token)

      if (token && !skipSetting) {
        // log('saving authorization', token)
        wx.setStorageSync('authorization', token)
      }
      return response.data
    },
    (err) => {
      hideLoading()
      log('!!! err', err)

      // 官方后台，记录实时log
      wxlog.error('网络错误', err)

      const req = err.request || {}
      const resp = err.response || {}
      const statusCode = resp.status
      const defaultErrorMessage = `${statusCode}错误, ${req.method} ${req.url}`

      // 发生网络错误后会走到这里
      log('网络错误', JSON.stringify(resp))

      // unauthorized
      if (statusCode === 401) {
        wx.showModal({
          title: '您的权限不够',
          showCancel: false
        })
        return
      } else if (statusCode === 403) {
        wx.showModal({
          title: '提示',
          content: defaultErrorMessage,
          showCancel: false
        })
        return
      }

      // 其他错误
      wx.showModal({
        title: '提示',
        content:
          (resp.data && resp.data.error) ||
          JSON.stringify(resp.data) ||
          err.message ||
          '',
        showCancel: false
      })
    }
  )

  return fly
}

const checkTokenSettingShouldBeSkip = (token) => {
  const obj = getJwtObj(token)
  const isVisitor = obj.visitor
  if (isVisitor) {
    return true
  }

  return false
}

const getUrlForApiGateway = (url) => {
  const appcode = process.env.VUE_APP_GATEWAY_APPCODE || ''
  const seperator = url.includes('?') ? '&' : '?'
  return url + seperator + 'AppCode=' + appcode
}
