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
        // console.log('/wx/user/login', result);
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
        bu_algo_type,
        bu_algo_type1
      } = result.data;

      const buQuestion = bu_question.map((n, i) => {
        return {
          ...n,
          enumvalue: n.enumvalue.replace(/“|”/g, '"')
        }
      })
      const buAlgoType = bu_algo_type.map((n, i) => {
        const labels = n?.label?.split("-")
        const algoType = labels[0];
        const sort = labels[1];
        const options = JSON.parse(n?.enumvalue);
        return {
          sort: sort,
          algoType: algoType,
          remark: n?.remark,
          options: options
        }
      }).sort((a, b) => a.sort - b.sort);
      const buAlgoType1 = bu_algo_type1.map((n, i) => {
        const labels = n?.label?.split("-")
        const algoType = labels[0];
        const sort = labels[1];
        const options = JSON.parse(n?.enumvalue);
        return {
          sort: sort,
          algoType: algoType,
          remark: n?.remark,
          options: options
        }
      }).sort((a, b) => a.sort - b.sort);

      wx.setStorage({
        key: "dict",
        data: JSON.stringify({
          bu_question: buQuestion,
          'un_matting_template': buAlgoType1,
          'matting_template': buAlgoType
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
export function preloadBubblyAudio() {
  const bubblyAudioSrc = wx.getStorageSync('bubblyAudioSrc');
  if (!bubblyAudioSrc) {
    const fs = wx.getFileSystemManager(); // 获取文件系统管理器
    wx.downloadFile({
      url: 'https://nav-uat.aia.com.cn/fan/sail/resource/bubblyActivity/images/bubbly.mp4',
      success: (res) => {
        if (res.statusCode === 200) {
          fs.saveFile({
            tempFilePath: res.tempFilePath,
            success: (savedRes) => {
              wx.setStorage({
                key: "bubblyAudioSrc",
                data: savedRes.savedFilePath,
                success: () => {
                  console.log('bubblyAudioSrc-数据缓存成功');
                },
                fail: (err) => {
                  console.error('存储失败:', err);
                }
              });
            },
            fail: (err) => {
              reject(new Error(`保存文件失败: ${url}, Error: ${err.errMsg}`));
            }
          });
        }
      }
    });
  }
}
export function preloadCheersAudio() {
  const cheersAudioSrc = wx.getStorageSync('cheersAudioSrc');
  if (!cheersAudioSrc) {
    const fs = wx.getFileSystemManager(); // 获取文件系统管理器
    wx.downloadFile({
      url: 'https://nav-uat.aia.com.cn/fan/sail/resource/bubblyActivity/images/cheers.mp4',
      success: (res) => {
        if (res.statusCode === 200) {
          fs.saveFile({
            tempFilePath: res.tempFilePath,
            success: (savedRes) => {
              wx.setStorage({
                key: "cheersAudioSrc",
                data: savedRes.savedFilePath,
                success: () => {
                  console.log('cheersAudioSrc-数据缓存成功');
                },
                fail: (err) => {
                  console.error('存储失败:', err);
                }
              });
            },
            fail: (err) => {
              reject(new Error(`保存文件失败: ${url}, Error: ${err.errMsg}`));
            }
          });
        }
      }
    });
  }
}
export function preloadBottleSrc() {
  const bottleImgSrc = wx.getStorageSync('bottleImgSrc');
  if (!bottleImgSrc) {
    const fs = wx.getFileSystemManager(); // 获取文件系统管理器
    wx.downloadFile({
      url: 'https://nav-uat.aia.com.cn/fan/sail/resource/bubblyActivity/images/bottle.png',
      success: (res) => {
        if (res.statusCode === 200) {
          fs.saveFile({
            tempFilePath: res.tempFilePath,
            success: (savedRes) => {
              wx.setStorage({
                key: "bottleImgSrc",
                data: savedRes.savedFilePath,
                success: () => {
                  console.log('bottleImgSrc-数据缓存成功');
                },
                fail: (err) => {
                  console.error('存储失败:', err);
                }
              });
            },
            fail: (err) => {
              reject(new Error(`保存文件失败: ${url}, Error: ${err.errMsg}`));
            }
          });
        }
      }
    });
  }
}
export function preloadGlassSrc() {
  const glassImgSrc = wx.getStorageSync('glassImgSrc');
  if (!glassImgSrc) {
    const fs = wx.getFileSystemManager(); // 获取文件系统管理器
    wx.downloadFile({
      url: 'https://nav-uat.aia.com.cn/fan/sail/resource/bubblyActivity/images/glass.png',
      success: (res) => {
        if (res.statusCode === 200) {
          fs.saveFile({
            tempFilePath: res.tempFilePath,
            success: (savedRes) => {
              wx.setStorage({
                key: "glassImgSrc",
                data: savedRes.savedFilePath,
                success: () => {
                  console.log('glassImgSrc-数据缓存成功');
                },
                fail: (err) => {
                  console.error('存储失败:', err);
                }
              });
            },
            fail: (err) => {
              reject(new Error(`保存文件失败: ${url}, Error: ${err.errMsg}`));
            }
          });
        }
      }
    });
  }
}
export function preloadCheersLastSrc() {
  const cheersLastImgSrc = wx.getStorageSync('cheersLastImgSrc');
  if (!cheersLastImgSrc) {
    const fs = wx.getFileSystemManager(); // 获取文件系统管理器
    wx.downloadFile({
      url: 'https://nav-uat.aia.com.cn/fan/sail/resource/bubblyActivity/images/cheers-last.png',
      success: (res) => {
        if (res.statusCode === 200) {
          fs.saveFile({
            tempFilePath: res.tempFilePath,
            success: (savedRes) => {
              wx.setStorage({
                key: "cheersLastImgSrc",
                data: savedRes.savedFilePath,
                success: () => {
                  console.log('cheersLastImgSrc-数据缓存成功');
                },
                fail: (err) => {
                  console.error('存储失败:', err);
                }
              });
            },
            fail: (err) => {
              reject(new Error(`保存文件失败: ${url}, Error: ${err.errMsg}`));
            }
          });
        }
      }
    });
  }
}

