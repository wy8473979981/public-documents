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

export const getToken = async () => {
  try {
    // const result = await postRequest('/poster/getToken');
    // if (result.code === "200") {
    const token = 'Bearer fCebZ1SBPiGnyKVk9z3PpLoY9aUG6iYvEmVB2jopshr8UgjwN1h9PI+H1VdaXQzr2z+pGU0c5Ppx0NBS/1E8u0R7cmmoQ6uXTdpqZX0/LKW9wXhecMZcnHv8upIiNj9pE3oilaonnqJEPp9zWhFM2WMeSBAi8Ci/dFsMN9UyskeBwNW2zVluCv2T04LeIdFXnd/vVRUXf5TFJqe6HaFspDUJLURanZOxA10QMDoqnPoVUD5GfzxGsXb7DmQ5Z7y8BshivNgdnuXJyEwl0yKiE0keElpGuPU5LA/tkGTe0y/sNf54ft2IYv8pQBuC+mxTjqsQkIGYPovhv5UXkOnP]Q==';
    wx.setStorage({
      key: "token",
      data: token
    });
    // }
  } catch (error) {
    console.log('getDict', error);
  }
}