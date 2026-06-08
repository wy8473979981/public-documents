# React + TypeScript + Vite

这是一个学习 React API 的项目，使用 Vite + React + TypeScript 构建。

## 使用 Vite 创建 React + TypeScript 项目

### 前置要求

- Node.js 20.19+ 或 22.12+（本项目使用 Node.js 22.22.3）
- npm、yarn 或 pnpm 包管理器

### 创建步骤

#### 方法一：使用 npm create vite（推荐）

```bash
# 进入项目目录
cd your-project-name

# 使用 Vite 创建 React + TypeScript 项目
npm create vite@latest . -- --template react-ts

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

#### 方法二：交互式创建

```bash
# 运行创建命令
npm create vite@latest

# 按提示操作：
# 1. 输入项目名称
# 2. 选择框架：React
# 3. 选择变体：TypeScript

# 进入项目目录
cd your-project-name

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 可用的模板

Vite 提供了多种 React 模板：

- `react` - React + JavaScript
- `react-ts` - React + TypeScript（本项目使用）
- `react-swc` - React + SWC + JavaScript
- `react-swc-ts` - React + SWC + TypeScript

### 项目结构

```
project/
├── public/          # 静态资源
├── src/
│   ├── components/  # 组件
│   ├── pages/       # 页面
│   ├── types/       # TypeScript 类型定义
│   ├── App.tsx      # 主应用组件
│   ├── main.tsx     # 入口文件
│   └── index.css    # 全局样式
├── index.html       # HTML 模板
├── package.json     # 项目配置
├── tsconfig.json    # TypeScript 配置
├── vite.config.ts   # Vite 配置
└── eslint.config.js # ESLint 配置
```

### 常用命令

```bash
# 开发模式
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview

# 代码检查
npm run lint
```

### 添加路由

```bash
# 安装 React Router
npm install react-router-dom
```

---

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
