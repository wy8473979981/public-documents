# 17. 服务端渲染 (SSR)

> 在服务器上生成 HTML，提升 SEO 与首屏性能

## 学习目标

- 理解 SSR 的优势与适用场景
- 掌握 CSR、SSR、SSG、ISR 的区别
- 了解主流 SSR 框架

## 内容结构

### 💡 概念（What & Why）

- SSR 在服务器上生成 HTML，发送给客户端
- 优势：更好的 SEO、更快的首屏加载、社交分享正常

### ⚙️ 用法（How）

- **渲染方式对比**：
  - CSR（客户端渲染）—— 浏览器下载 JS 后渲染
  - SSR（服务端渲染）—— 服务器生成 HTML
  - SSG（静态生成）—— 构建时生成 HTML
  - ISR（增量静态再生）—— 混合 SSG 和 SSR
- **水合（Hydration）**：客户端接管服务端 HTML，添加事件监听
- **主流框架**：
  - **Next.js** —— 最流行的 React SSR 框架
  - **Remix** —— 专注 Web 标准和用户体验
  - **Gatsby** —— 静态站点生成器

### 🛠️ 实践（Do）

- SSR 概念 Demo
- 推荐练习：用 Next.js 创建简单 SSR 页面

### 🔗 扩展（Think & Connect）

- SSR 的性能权衡（服务器负载 vs 用户体验）
- 流式 SSR（Streaming SSR）与 React Server Components

## 涉及文件

| 文件      | 说明         |
| --------- | ------------ |
| `SSR.tsx` | 页面组件主体 |
| `SSR.css` | 页面样式     |

## 前置知识

→ [16. 高级模式](../AdvancedPatterns/)

## 后续章节

→ [18. 生态系统](../Ecosystem/) —— 探索 React 生态全景
