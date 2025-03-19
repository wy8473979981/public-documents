const imageMap = {
  "shop-girl": "https://nav-uat.aia.com.cn/fan/sail/resource/hrActivity/images/shop-girl.png",
  "shop-man": "https://nav-uat.aia.com.cn/fan/sail/resource/hrActivity/images/shop-man.png",
  "goods": "https://nav-uat.aia.com.cn/fan/sail/resource/hrActivity/images/goods.png",
  "cart": "https://nav-uat.aia.com.cn/fan/sail/resource/hrActivity/images/cart.png"
};
export const preloadImages = async () => {
  const promises = Object.entries(imageMap).map(([key, url]) => {
    return new Promise((resolve, reject) => {
      wx.getImageInfo({
        src: url,
        success: (res) => resolve({ key, path: res.path }), // 返回 key 和本地路径
        fail: reject
      });
    });
  });

  const results = await Promise.all(promises);
  return results.reduce((acc, { key, path }) => {
    acc[key] = path;
    return acc;
  }, {});
}