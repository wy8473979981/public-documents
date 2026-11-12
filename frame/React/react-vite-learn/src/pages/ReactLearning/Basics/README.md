# 1. React 基础概念

> 从零开始理解 React —— 一个用于构建用户界面的 JavaScript 库

## 学习目标

- 理解 React 的本质与核心思想
- 掌握组件化、声明式编程、虚拟 DOM 等核心概念
- 能够编写第一个 React 组件并理解其运行机制

## 内容结构

### 💡 概念（What & Why）

- **React 是什么**：由 Meta（Facebook）开发的开源 JavaScript 库，专注于构建用户界面
- **五大核心概念**：
  - 组件化 —— 把 UI 拆成独立、可复用的小块
  - 声明式编程 —— 描述"UI 应该长什么样"而非"怎么一步步创建"
  - 虚拟 DOM —— 在内存中维护 DOM 副本，通过 Diff 最小化真实 DOM 操作
  - 单向数据流 —— 数据从父组件通过 Props 流向子组件
  - JSX —— JavaScript 的语法扩展，在 JS 中写类似 HTML 的代码
  - 状态驱动 —— UI 是状态的映射，状态变化则 UI 自动更新

### ⚙️ 用法（How）

- 最简 React 应用的创建方式
- 声明式编程 vs 命令式编程对比
- 关键规则：组件名大写、返回单一根元素、className 代替 class、驼峰命名属性

### 🛠️ 实践（Do）

- 交互式计数器 Demo
- 推荐练习：Hello World 组件、简单计数器、条件渲染

### 🔗 扩展（Think & Connect）

- React vs Vue vs Angular 对比
- 延伸思考：虚拟 DOM 性能、声明式编程优势
- 推荐资源：React 官方教程、API 参考、设计思维

## 涉及文件

| 文件         | 说明         |
| ------------ | ------------ |
| `Basics.tsx` | 页面组件主体 |
| `Basics.css` | 页面样式     |

## 前置知识

- HTML / CSS 基础
- JavaScript 基础（变量、函数、对象、数组）
- ES6+ 语法（箭头函数、解构、模板字符串、模块化）

## 后续章节

→ [2. JSX 语法](../Jsx/) —— 深入学习 React 的核心语法
