export function getEnvVersion() {
  // 获取当前是什么版本；develop:开发版；trial：体验版；release：正式版
  const accountInfo = wx.getAccountInfoSync();
  return accountInfo?.miniProgram?.envVersion || 'develop';
}

function getBaseUrl(envVersion) {
  const urlMap = {
    develop: 'https://tdauat.aia.com.cn/uat/fan-sail',
    trial: 'https://tdauat.aia.com.cn/uat/fan-sail',
    release: 'https://tda.aia.com.cn/p/fan-sail',
  };
  return urlMap[envVersion];
}

export async function getRequest(url, options = {}) {
  const envVersion = getEnvVersion();
  return new Promise((resolve, reject) => {
    wx.request({
      url: getBaseUrl(envVersion) + url,
      method: 'GET',
      header: {
        'content-type': 'application/json', // 默认值
        ...options.header,
      },
      data: options.data || {},
      success: function (res) {
        resolve(res);
      },
      fail: function (err) {
        reject(err);
      },
    });
  });
}

export async function postRequest(url, options = {}) {
  const envVersion = getEnvVersion();
  return new Promise((resolve, reject) => {
    wx.request({
      url: getBaseUrl(envVersion) + url,
      method: 'POST',
      header: {
        'content-type': 'application/json', // 默认值
        ...options.header,
      },
      data: options.data || {},
      success: function (res) {
        resolve(res);
      },
      fail: function (err) {
        reject(err);
      },
    });
  });
}

export function getOpenId() {
  wx.login({
    success: async (res) => {
      if (res.code) {
        wx.setStorage({
          key: "wxCode",
          data: res.code
        })
        const result = await getRequest('/fan-sail/wx/user/login', {
          data: {
            code: res.code
          }
        })
        console.log('result', result);

      } else {
        console.log('登录失败！' + res.errMsg)
      }
    }
  })
}