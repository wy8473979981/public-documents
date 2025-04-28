export function getEnvVersion() {
  // 获取当前是什么版本；develop:开发版；trial：体验版；release：正式版
  const accountInfo = wx.getAccountInfoSync();
  return accountInfo?.miniProgram?.envVersion;
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
  const type = options?.header?.type;
  const requestUrl = getBaseUrl(envVersion, type) + url;
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
  const type = options?.header?.type;
  const requestUrl = getBaseUrl(envVersion, type) + url;
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

export function getOpenId(expireDays = 2) {
  try {

    const loginCache = wx.getStorageSync('loginCache');
    const now = Date.now();
    const expireTime = expireDays * 24 * 60 * 60 * 1000;

    if (
      loginCache &&
      loginCache.openId &&
      loginCache.ntCode &&
      loginCache.savedAt &&
      now - loginCache.savedAt < expireTime
    ) {
      console.log(`[cache] 使用已有缓存(loginCache)`, );
      return;
    }

    wx.login({
      success: async (res) => {
        if (res.code) {
          const result = await getRequest('/wx/user/login', {
            data: {
              code: res.code,
            },
          });
          const { code, data } = result;

          if (code === '200') {
            const newCache = {
              openId: data?.openId ? data?.openId : '',
              ntCode: data?.ntCode ? data?.ntCode : '',
              savedAt: now,
            };
            wx.setStorage({
              key: 'loginCache',
              data: newCache,
            });
            console.log(`[cache] 缓存更新成功(loginCache)`, );
          }
        } else {
          console.log('登录失败！' + res.errMsg);
        }
      },
    });
  } catch (error) {
    console.error('getOpenId', error);
  }
}
export const getDict = async () => {
  try {
    const result = await postRequest('/sys/dict/list');
    if (result.code === '200') {
      const { bu_question, bu_algo_type3 } = result.data;

      const buQuestion = bu_question.map((n, i) => {
        return {
          ...n,
          enumvalue: n.enumvalue.replace(/“|”/g, '"'),
        };
      });

      const buAlgoType3 = bu_algo_type3
        .map((n, i) => {
          const labels = n?.label?.split('-');
          const algoType = labels[0];
          const sort = labels[1];
          const modelType = labels[2];
          const options = JSON.parse(n?.enumvalue);

          return {
            sort: sort,
            algoType: algoType,
            modelType: modelType,
            remark: n?.remark,
            options: options.map((item) => {
              return {
                ...item,
                src: `${item.src}?v=` + new Date().getTime(),
              };
            }),
          };
        })
        .sort((a, b) => a.sort - b.sort);

      wx.setStorage({
        key: 'dict',
        data: {
          bu_question: buQuestion,
          buAlgoType3: buAlgoType3,
        },
      });
    }
  } catch (error) {
    console.error('getDict', error);
  }
};

export const getToken = async (expireDays = 2) => {
  try {
    const tokenCache = wx.getStorageSync('tokenCache');
    const now = Date.now();
    const expireTime = expireDays * 24 * 60 * 60 * 1000;

    if (
      tokenCache &&
      tokenCache.token &&
      tokenCache.savedAt &&
      now - tokenCache.savedAt < expireTime
    ) {
      console.log(`[cache] 使用已有缓存(tokenCache)`,);
      return;
    }

    const result = await postRequest('/poster/getToken');
    if (result.code === '200') {
      const newCache = {
        token: `Bearer ${result.data}`,
        savedAt: now,
      };
      wx.setStorage({
        key: 'tokenCache',
        data: newCache,
      });
      console.log(`[cache] 缓存更新成功(tokenCache)`,);
    }
  } catch (error) {
    console.error('getToken', error);
  }
};
