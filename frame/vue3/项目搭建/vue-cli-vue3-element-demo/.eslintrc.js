/*
 * @Description: Description
 * @Author: wangyang
 * @Date: 2025-09-15 23:21:22
 * @LastEditors: wangyang
 * @LastEditTime: 2025-12-05 09:52:17
 */
module.exports = {
  root: true,
  env: {
    node: true
  },
  plugins: ['vue'],
  extends: ['plugin:vue/vue3-essential', 'eslint:recommended', 'plugin:prettier/recommended'],
  parserOptions: {
    parser: '@babel/eslint-parser'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    quotes: ['error', 'single', { avoidEscape: true }],
    'vue/no-unused-components': 'off',
    'no-unused-vars': 'off'
  },
  overrides: [
    {
      files: ['*.vue', '*.js'],
      rules: {
        quotes: ['error', 'single', { avoidEscape: true }]
      }
    }
  ]
};
