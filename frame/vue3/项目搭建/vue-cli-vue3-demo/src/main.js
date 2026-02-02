/*
 * @Description: Description
 * @Author: wangyang
 * @Date: 2025-06-13 15:21:28
 * @LastEditors: wangyang
 * @LastEditTime: 2025-06-20 10:40:42
 */
import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import App from './App.vue';

const app = createApp(App);

app.use(ElementPlus);
app.mount('#app');
