# 9. Context API

> 在组件树中传递数据，无需逐层传递 Props

## 学习目标

- 理解 Context 的设计目的与适用场景
- 掌握 `createContext`、`Provider`、`useContext` 的使用
- 避免 Context 的滥用

## 内容结构

### 💡 概念（What & Why）

- Context 解决 Props Drilling（逐层传递）问题
- 适用场景：主题切换、用户认证、语言设置、全局状态

### ⚙️ 用法（How）

- `React.createContext()` —— 创建 Context
- `Context.Provider` —— 提供数据
- `useContext` Hook —— 消费数据
- 多 Context 组合使用

### 🛠️ 实践（Do）

- 主题切换 Demo
- 推荐练习：用户登录状态管理、多语言切换

### 🔗 扩展（Think & Connect）

- Context 性能问题与优化
- Context vs 状态管理库的选择时机

## 涉及文件

| 文件          | 说明         |
| ------------- | ------------ |
| `Context.tsx` | 页面组件主体 |
| `Context.css` | 页面样式     |

## 前置知识

→ [8. 自定义 Hooks](../CustomHooks/)

## 后续章节

→ [10. Redux 状态管理](../Redux/) —— 应对更复杂的全局状态
