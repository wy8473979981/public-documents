export const debug = true

const apiRoot = process.env.VUE_APP_BASE

// 输出log
console.log('%c apiRoot', 'color: yellow; font-size:18px', apiRoot)

const noapiroot = () => {
  wx.showModal({
    title: '提示',
    content: `${envVersion}环境未配置api地址，请联系管理员`,
    showCancel: false
  })

  return '<noapiroot>'
}

export const getApiRoot = () => {
  if (apiRoot) return apiRoot

  // 如果没有配置api地址，提示用户
  return noapiroot()
}
