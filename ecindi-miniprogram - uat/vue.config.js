module.exports = {
  transpileDependencies: ['@dcloudio/uni-ui'],
  configureWebpack: {
    devServer: {
      // 不检查host 如果检查，本地域名将失效
      disableHostCheck: true,
      proxy: {
        '^/api': {
          target: process.env.VUE_APP_BASE,
          ws: true,
          secure: false,
          changeOrigin: true,
          logLevel: 'debug'
        }
      }
    }
  }
}
