export const jumpURL = (url) => {
  // 第三方程序
  const isJson = url.indexOf('{') == 0
  if (isJson) {
    const obj = JSON.parse(url)
    return wx.navigateToMiniProgram(obj)
  }

  // h5页面
  const isH5 = url.indexOf('https://') == 0
  if (isH5) {
    const fullURL = `/pages/h5/index?url=${url}`
    return wx.navigateTo({
      url: fullURL
    })
  }

  // 纯数字，跳详情
  const isNum = url.match(/^\d+$/g)
  if (isNum) {
    return wx.navigateTo({
      url: `/pages/event/index?eventID=${url}`
    })
  }

  // 小程序内部页面，或跳转直播
  return wx.navigateTo({
    url: url
  })
}
