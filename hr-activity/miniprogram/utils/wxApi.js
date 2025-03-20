export function getUserInfo() {
  wx.getUserInfo({
    desc: '用于完善会员资料', // 必须填写
    success: (res) => {
      console.log('用户信息:', res, res.userInfo);
      this.setData({
        userInfo: res.userInfo,
      });
    },
    fail: (err) => {
      console.log('用户拒绝授权:', err);
      wx.showModal({
        title: '提示',
        content: '您拒绝了授权，部分功能可能无法正常使用，请前往设置页开启授权。',
        success(res) {
          if (res.confirm) {
            wx.openSetting();
          }
        },
      });
    },
  });
}