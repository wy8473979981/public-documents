# 2. JSX 语法

> JavaScript 的语法扩展，允许在 JavaScript 中编写类似 HTML 的代码

## 学习目标

- 理解 JSX 的本质（编译为 `React.createElement()` 调用）
- 掌握 JSX 的语法规则与常见用法
- 能够在 JSX 中嵌入 JavaScript 表达式

## 内容结构

### 💡 概念（What & Why）

- JSX 是 JavaScript 的语法扩展，让代码更直观、更接近最终 UI
- JSX 最终编译为 `React.createElement()` 调用

### ⚙️ 用法（How）

- 使用花括号 `{}` 嵌入 JavaScript 表达式
- 属性使用驼峰命名（`className`、`onClick` 等）
- 必须有且仅有一个根元素包裹所有内容
- 自闭合标签必须以 `/>` 结尾
- 条件渲染：三元表达式、`&&` 短路运算
- 列表渲染：`map()` + `key`

### 🛠️ 实践（Do）

- 动态内容渲染 Demo
- 推荐练习：用户卡片组件、条件显示、列表渲染

### 🔗 扩展（Think & Connect）

- JSX 与模板引擎的对比
- JSX 的安全性（自动转义防 XSS）

## 涉及文件

| 文件      | 说明         |
| --------- | ------------ |
| `Jsx.tsx` | 页面组件主体 |
| `Jsx.css` | 页面样式     |

## 前置知识

→ [1. React 基础概念](../Basics/)

## 后续章节

→ [3. 组件基础](../Components/) —— 学习 React 的构建块
