export function getEnvVersion() {
  // 获取当前是什么版本；develop:开发版；trial：体验版；release：正式版
  const accountInfo = wx.getAccountInfoSync();
  return accountInfo?.miniProgram?.envVersion || 'develop';
}

function getBaseUrl(envVersion, type = 1) {
  const urlMap = {
    develop: 'https://tdauat.aia.com.cn/uat/fan-sail',
    trial: 'https://tdauat.aia.com.cn/uat/fan-sail',
    release: 'https://tda.aia.com.cn/p/fan-sail',
  };

  const gatewayUrlMap = {
    develop: 'https://gateway-test.nuanwa.net',
    trial: 'https://gateway-test.nuanwa.net',
    release: 'https://gateway.nuanwa.net',
  };

  return type === 1 ? urlMap[envVersion] : gatewayUrlMap[envVersion];
}

export async function getRequest(url, options = {}) {
  const envVersion = getEnvVersion();
  const type = options?.header?.type
  const requestUrl = getBaseUrl(envVersion, type) + url
  return new Promise((resolve, reject) => {
    wx.request({
      url: requestUrl,
      method: 'GET',
      header: {
        'content-type': 'application/json', // 默认值
        ...options.header,
      },
      data: options.data || {},
      success: function (res) {
        resolve(res?.data);
      },
      fail: function (err) {
        reject(err);
      },
    });
  });
}

export async function postRequest(url, options = {}) {
  const envVersion = getEnvVersion();
  const type = options?.header?.type
  const requestUrl = getBaseUrl(envVersion, type) + url
  return new Promise((resolve, reject) => {
    wx.request({
      url: requestUrl,
      method: 'POST',
      header: {
        'content-type': 'application/json', // 默认值
        ...options.header,
      },
      data: options.data || {},
      success: function (res) {
        resolve(res?.data);
      },
      fail: function (err) {
        reject(err);
      },
    });
  });
}
export function preloadVideo1() {
  wx.downloadFile({
    url: 'https://nav-uat.aia.com.cn/fan/sail/resource/bubblyActivity/images/video.mp4',
    success: (res) => {
      if (res.statusCode === 200) {
        wx.setStorage({
          key: "videoSrc",
          data: res.tempFilePath
        });
      }
    }
  });
}
export function preloadVideo2() {
  wx.downloadFile({
    url: 'https://nav-uat.aia.com.cn/fan/sail/resource/bubblyActivity/images/cheers.mp4',
    success: (res) => {
      if (res.statusCode === 200) {
        wx.setStorage({
          key: "videoCheersSrc",
          data: res.tempFilePath
        });
      }
    }
  });
}
export function getOpenId() {
  wx.login({
    success: async (res) => {
      if (res.code) {
        const result = await getRequest('/wx/user/login', {
          data: {
            code: res.code
          }
        })
        const {
          code,
          data
        } = result;
        if (code === "200") {
          const openId = data?.openId ? data?.openId : '';
          wx.setStorage({
            key: "openId",
            data: openId
          });
          wx.setStorage({
            key: "ntCode",
            data: data?.ntCode ? data?.ntCode : ''
          });
          activityGet(openId);
        }
      } else {
        console.log('登录失败！' + res.errMsg)
      }
    }
  })
}

export async function activityGet(openId) {
  const params = {
    data: {
      openId: openId,
      type: 1,
    }
  }
  const result = await postRequest('/activity/get', params);
  const {
    code,
    msg,
    data
  } = result;
  if (code === "200") {
    console.log('activityGet', data)
    if (data?.status == 1) {
      wx.redirectTo({
        url: '/pages/cheersPage/cheersPage'
      });
    }
  } else {
    console.error(msg);
  }
}