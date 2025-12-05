以下是将之前的回答转换为 Markdown 格式的内容：

```markdown
# 使用 vue-cli 创建 Vue 3 项目并集成 Pinia、Element Plus 和 Vue Router

## 一、安装和创建项目
1. **安装 Node.js**  
   确保已安装 [Node.js](https://nodejs.org/)（建议版本 16+），并检查是否安装成功：
   ```bash
   node -v
   npm -v
   ```

2. **全局安装 vue-cli**  
   如果尚未安装 `vue-cli`，运行以下命令：
   ```bash
   npm install -g @vue/cli
   ```

3. **创建 Vue 3 项目**  
   使用 `vue-cli` 创建项目，选择 Vue 3 预设：
   ```bash
   vue create vue-cli-vue3-element-demo --packageManager npm
   ```
   - 在交互式界面中，选择 **`Manually select features`**。
   - 勾选以下选项：
     - `Babel`
     - `Router`（按空格键选择）
     - 其他按需选择（如 `Linter/Formatter`）
   - 选择 **Vue 3** 作为版本。
   - 选择 **JavaScript** 作为语言。
   - 其他配置按需选择（如 `ESLint + Prettier`）。

4. **进入项目目录**  
   ```bash
   明确使用npm安装
   vue create vue-cli-vue3-element-demo --packageManager npm
   ```

## 二、安装 Pinia 和 Element Plus
1. **安装 Pinia**  
   `Pinia` 是 Vue 3 的官方状态管理库：
   ```bash
   npm install pinia --save
   ```

2. **安装 Element Plus**  
   `Element Plus` 是基于 Vue 3 的组件库：
   ```bash
   npm install element-plus --save
   ```

## 三、配置 Pinia
1. **在 `src` 目录下创建 `stores` 文件夹**  
   用于存放 Pinia 的 store 文件。

2. **创建 Pinia store 示例**  
   新建文件 `src/stores/counter.js`：
   ```javascript
   import { defineStore } from 'pinia';

   export const useCounterStore = defineStore('counter', {
     state: () => ({
       count: 0,
     }),
     actions: {
       increment() {
         this.count++;
       },
     },
   });
   ```

3. **在 `main.js` 中引入 Pinia**  
   修改 `src/main.js`：
   ```javascript
   import { createApp } from 'vue';
   import { createPinia } from 'pinia';
   import App from './App.vue';
   import router from './router';

   const app = createApp(App);
   app.use(createPinia());
   app.use(router);
   app.mount('#app');
   ```

## 四、配置 Element Plus
1. **全局引入 Element Plus**  
   修改 `src/main.js`，添加以下内容：
   ```javascript
   import ElementPlus from 'element-plus';
   import 'element-plus/dist/index.css';

   const app = createApp(App);
   app.use(ElementPlus);
   ```

2. **按需引入（可选）**  
   如果希望按需引入以减少打包体积，可以安装 `unplugin-vue-components`：
   ```bash
   npm install -D unplugin-vue-components unplugin-auto-import
   ```
   然后在 `vite.config.js`（如果使用 Vite）或 `vue.config.js` 中配置（此处以 `vue.config.js` 为例）：
   ```javascript
   const { defineConfig } = require('@vue/cli-service');
   const AutoImport = require('unplugin-auto-import/webpack');
   const Components = require('unplugin-vue-components/webpack');
   const { ElementPlusResolver } = require('unplugin-vue-components/resolvers');

   module.exports = defineConfig({
     configureWebpack: {
       plugins: [
         AutoImport({
           resolvers: [ElementPlusResolver()],
         }),
         Components({
           resolvers: [ElementPlusResolver()],
         }),
       ],
     },
   });
   ```

## 五、验证配置
1. **在组件中使用 Pinia**  
   修改 `src/views/Home.vue`（或其他组件）：
   ```javascript
   <template>
     <div>
       <h1>Count: {{ counter.count }}</h1>
       <el-button @click="counter.increment">Increment</el-button>
     </div>
   </template>

   <script>
   import { useCounterStore } from '@/stores/counter';
   import { ElButton } from 'element-plus';

   export default {
     setup() {
       const counter = useCounterStore();
       return { counter };
     },
   };
   </script>
   ```

2. **运行项目**  
   ```bash
   npm run serve
   ```
   打开浏览器访问 `http://localhost:8080`，检查是否正常运行。

## 六、项目结构
最终项目结构如下：
```
my-vue3-project/
├── node_modules/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── router/
│   │   └── index.js
│   ├── stores/
│   │   └── counter.js
│   ├── views/
│   │   ├── Home.vue
│   │   └── About.vue
│   ├── App.vue
│   └── main.js
├── package.json
└── vue.config.js
```

## 七、常用命令
| 命令 | 作用 |
|------|------|
| `npm run serve` | 启动开发服务器 |
| `npm run build` | 打包生产环境代码 |
| `npm run lint` | 运行 ESLint 检查 |

通过以上步骤，您已成功创建一个基于 Vue 3、Pinia、Element Plus 和 Vue Router 的项目！
```