/*
 * @Description: Description
 * @Author: wangyang
 * @Date: 2025-06-13 15:21:28
 * @LastEditors: wangyang
 * @LastEditTime: 2025-06-13 15:37:13
 */
/*
 * @Description: Description
 * @Author: wangyang
 * @Date: 2025-06-13 15:21:28
 * @LastEditors: wangyang
 * @LastEditTime: 2025-06-13 15:32:30
 */
const { defineConfig } = require('@vue/cli-service')
// const HtmlWebpackPlugin = require('html-webpack-plugin')
// const oss_url = 'https://oss.example.com/'; // 替换为你的OSS地址

module.exports = defineConfig({
  transpileDependencies: true,
  // chainWebpack: config => {
  //   config.plugin('html').tap(args => {
  //     args[0].meta = {
  //       ...(args[0].meta || {}),
  //       'Content-Security-Policy': {
  //         'http-equiv': 'Content-Security-Policy',
  //         content: `default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: ${oss_url}; connect-src 'self' ${
  //           process.env.VITE_API_DOMAIN || process.env.VUE_APP_BASE_URL
  //         }`,
  //       },
  //     };
  //     return args
  //   })
  // }
})
