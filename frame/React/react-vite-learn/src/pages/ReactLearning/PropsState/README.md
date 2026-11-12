# 4. Props 与 State

> 理解 React 组件的数据流动机制 —— Props 传递与 State 管理

## 学习目标

- 掌握 Props 的传递方式与规则
- 理解 State 的概念与 `useState` 的使用
- 区分 Props（只读）与 State（可变）的使用场景

## 内容结构

### 💡 概念（What & Why）

- **Props（属性）**：从父组件传递给子组件的数据，只读不可修改
- **State（状态）**：组件内部管理的可变数据，状态变化触发重新渲染

### ⚙️ 用法（How）

- Props 传递：普通值、函数、对象、children
- State 管理：`useState` Hook 的使用
- Props 的默认值与类型校验
- 状态提升（Lifting State Up）

### 🛠️ 实践（Do）

- 交互式组件 Demo
- 推荐练习：Todo List、购物车计数器

### 🔗 扩展（Think & Connect）

- 单向数据流的设计哲学
- Props Drilling 问题及解决方案

## 涉及文件

| 文件             | 说明         |
| ---------------- | ------------ |
| `PropsState.tsx` | 页面组件主体 |
| `PropsState.css` | 页面样式     |

## 前置知识

→ [3. 组件基础](../Components/)

## 后续章节

→ [5. 事件处理](../Events/) —— 响应用户交互
