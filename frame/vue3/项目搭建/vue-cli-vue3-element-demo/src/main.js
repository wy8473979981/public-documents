/*
 * @Description: Description
 * @Author: wangyang
 * @Date: 2025-09-15 23:21:22
 * @LastEditors: wangyang
 * @LastEditTime: 2025-09-15 23:25:41
 */
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';

import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.use(ElementPlus);
app.mount('#app');
