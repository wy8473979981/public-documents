const getUserDeviceType = function () {
  return new Promise((resolve, reject) => {
    try {
      const deviceInfo = uni.getDeviceInfo()
      const windowInfo = uni.getWindowInfo()
      let type = ''

      if (deviceInfo.model.indexOf('iPad') > -1) {
        type = 'iPad'
        uni.setStorage({
          key: 'deviceType',
          data: 'iPad'
        })
        resolve(type)
      } else {
        if (windowInfo.screenWidth > 512) {
          type = 'iPad'
          uni.setStorage({
            key: 'deviceType',
            data: 'iPad'
          })
          resolve(type)
        } else {
          uni.setStorage({
            key: 'deviceType',
            data: 'phone'
          })
          type = 'phone'
          resolve(type)
        }
      }
    } catch (error) {
      reject(error)
    }
  })
}

export default {
  getUserDeviceType
}
