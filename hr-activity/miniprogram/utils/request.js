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
        resolve(res?.data);
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
        const result = await getRequest('/wx/user/login', {
          data: {
            code: res.code
          }
        })
        if (result) {
          wx.setStorage({
            key: "openId",
            data: result
          })
        }
      } else {
        console.log('登录失败！' + res.errMsg)
      }
    }
  })
}
export const getDict = async () => {
  try {
    const result = await postRequest('/sys/dict/list');
    if (result.code === "200") {
      const {
        bu_question,
        bu_algo_type
      } = result.data;

      const buQuestion = bu_question.map((n, i) => {
        return {
          ...n,
          enumvalue: n.enumvalue.replace(/“|”/g, '"')
        }
      })
      wx.setStorage({
        key: "dict",
        data: JSON.stringify({
          bu_question: buQuestion,
          bu_algo_type
        })
      })
    }
  } catch (error) {
    console.log('getDict', error);
  }
}