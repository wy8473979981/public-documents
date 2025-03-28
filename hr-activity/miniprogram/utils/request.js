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

export async function uploadFile(url, options = {}) {

  const envVersion = getEnvVersion();
  const type = options?.header?.type;
  const requestUrl = getBaseUrl(envVersion, type) + url;

  return new Promise((resolve, reject) => {
    const filePath = options.data.srcImage; // 获取图片路径
    wx.uploadFile({
      url: requestUrl,
      name: 'srcImage',
      filePath: filePath,
      formData: options.data || {},
      header: {
        'content-type': 'application/json', // 默认值
        ...options.header,
      },
      success: function (res) {
        return resolve(res); // 返回数据
      },
      fail: function (err) {
        return reject(err); // 返回错误
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
        const {
          code,
          data
        } = result;

        if (code === "200") {
          wx.setStorage({
            key: "openId",
            data: data?.openId ? data?.openId : ''
          });
          wx.setStorage({
            key: "ntCode",
            data: data?.ntCode ? data?.ntCode : ''
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
    const result = await postRequest('/poster/getToken');
    if (result.code === "200") {
      wx.setStorage({
        key: "token",
        data: `Bearer ${result.data}`
      });
    }
  } catch (error) {
    console.log('getDict', error);
  }
}

export const getCompoundGif = async () => {
  // 预加载的gif
  try {
    const gifUrl = 'https://nav-uat.aia.com.cn/fan/sail/resource/hrActivity/images/compound.gif'
    const res = await wx.getImageInfo({
      src: gifUrl
    });
    wx.setStorage({
      key: "compoundGif",
      data: res.path
    });
  } catch (err) {
    console.error(err); // 处理错误情况
  }
}