let loadingCount = 0
let isEnabled = true

export const enableLoading = () => {
  isEnabled = true
  loadingCount = 0
}

export const disableLoading = () => {
  // 是否由我禁用
  if (!isEnabled) return false

  isEnabled = false
  loadingCount = 0

  wx.hideLoading()

  // 是否由我禁用
  return true
}

export const showLoading = (title = '加载中', mask = false) => {
  if (!isEnabled) return
  loadingCount++
  if (loadingCount === 1) {
    wx.showLoading({
      title: title,
      mask: mask
    })
  }
}

export const hideLoading = () => {
  if (!isEnabled) return
  setTimeout(() => {
    if (loadingCount > 0) {
      loadingCount--
    }
    if (loadingCount <= 0) {
      wx.hideLoading()
    }
  }, 100)
}
