function getURL(target) {
  if (typeof target === 'string') {
    return target
  }
  if (typeof target === 'object') {
    /**
     *  1. in fact, target should be a map
     *  2. notice, if with params, ? should follow the path
     *  3. example: const target = new Map([
     *                                [this.$pages.HOME, '?'],
     *                                [shopId, 1]
     *                             ])
     */
    const url = [...target].reduce(this.genReducer(target.size), '')
    return url
  }

  return ''
}

export default {
  methods: {
    // url reducer
    genReducer(size) {
      const reducer = (sum, current, index) => {
        if (index === 0) {
          sum += `${current[0]}${current[1]}`
        } else if (index === size - 1) {
          sum += `${current[0]}=${current[1]}`
        } else {
          sum += `${current[0]}=${current[1]}&`
        }
        return sum
      }
      return reducer
    },

    // page navigate
    navTo(target, params) {
      return wx.navigateTo({
        url: getURL(target),
        ...params
      })
    },

    // page switchTab
    tabTo(target, params) {
      wx.switchTab({
        url: getURL(target),
        ...params
      })
    },

    // page redirect
    redirectTo(target, params) {
      wx.redirectTo({
        url: getURL(target),
        ...params
      })
    },

    relaunchTo(target, params) {
      wx.reLaunch({
        url: getURL(target),
        ...params
      })
    },

    // navigate back
    navBack() {
      const isTop = getCurrentPages().length <= 1
      if (isTop) {
        wx.redirectTo({ url: '/pages/home/index' })
      } else {
        wx.navigateBack()
      }
    },

    // set top navigate bar title
    setNavBarTitle(title) {
      wx.setNavigationBarTitle({ title })
    },

    // alert to fill in form field
    alertToFillIn(field) {
      wx.showModal({
        title: '提示',
        content: `请先填写${field}`,
        success() {}
      })
    },

    // notice message
    noticeMessage(mes) {
      wx.showModal({
        title: '提示',
        content: mes,
        success() {}
      })
    },
    async settingAppTitle(title) {
      wx.setNavigationBarTitle({
        title: title || this.appTitle
      })
    },
    // 获取用户信息
    getAihumanInfo(aihuman) {
      aihuman = aihuman || {}
      const info = []
      if (aihuman.sexCode) {
        const val = this.mapForLabel(
          aihuman.sexCode,
          this.$store.getters.genderList
        )
        info.push(val)
      }
      if (aihuman.age) {
        info.push(`${aihuman.age}岁`)
      }
      if (aihuman.mariStatusCode) {
        const val = this.mapForLabel(
          aihuman.mariStatusCode,
          this.$store.getters.mariageList
        )
        info.push(val)
      }

      return info.join(', ')
    },
    mapForLabel(value, list) {
      let findData = list.find((item) => item.value === value)
      if (findData) return findData.label || ''
      return ''
    }
  }
}
