/*
 * @Description: Description
 * @Author: wangyang
 * @Date: 2025-09-16 09:43:13
 * @LastEditors: wangyang
 * @LastEditTime: 2025-09-16 16:47:12
 */
const { defineConfig } = require('@vue/cli-service');
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  configureWebpack: {
    devtool: 'source-map'
  }
});
