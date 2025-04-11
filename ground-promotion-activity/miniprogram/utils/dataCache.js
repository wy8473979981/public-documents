/**
 * 通用资源下载并本地缓存工具（async 版本）
 * @param {Object} options
 * @param {string} options.url - 资源下载地址
 * @param {string} options.cacheKey - 本地存储的 key
 * @param {number} [options.expireDays=1] - 缓存有效时间（单位：天）
 * @returns {Promise<string>} 本地可用文件路径
 */
export async function getCachedFile(url, cacheKey, expireDays = 1) {
  const cache = wx.getStorageSync(cacheKey);
  const now = Date.now();
  const expireTime = expireDays * 24 * 60 * 60 * 1000;

  if (cache && cache.path && now - cache.savedAt < expireTime) {
    console.log(`[cache] 使用已有缓存(${cacheKey}):`, cache.path);
    return cache.path;
  }

  const fs = wx.getFileSystemManager();

  const downloadRes = await new Promise((resolve, reject) => {
    wx.downloadFile({
      url,
      success: (res) =>
        res.statusCode === 200
          ? resolve(res)
          : reject(`下载失败: ${res.statusCode}`),
      fail: reject,
    });
  });

  const savedRes = await new Promise((resolve, reject) => {
    fs.saveFile({
      tempFilePath: downloadRes.tempFilePath,
      success: resolve,
      fail: reject,
    });
  });

  const newCache = {
    path: savedRes.savedFilePath,
    savedAt: now,
  };

  await new Promise((resolve) => {
    wx.setStorage({
      key: cacheKey,
      data: newCache,
      success: () => {
        console.log(`[cache] 缓存更新成功(${cacheKey}):`, newCache.path);
        resolve();
      },
      fail: (err) => {
        console.warn(`[cache] 存储失败(${cacheKey})，但文件已下载:`, err);
        resolve(); // 存储失败不影响主流程
      },
    });
  });

  return newCache.path;
}
