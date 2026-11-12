# 6. Hooks 入门

> React 16.8 引入的革命性特性，让函数组件拥有完整的能力

## 学习目标

- 理解 Hooks 的设计动机与规则
- 掌握 `useState`、`useEffect` 等核心 Hooks
- 能够使用 Hooks 构建完整的函数组件

## 内容结构

### 💡 概念（What & Why）

- Hooks 让函数组件可以使用状态和其他 React 特性
- 解决类组件的痛点：逻辑复用困难、复杂组件难以理解、`this` 指向混乱

### ⚙️ 用法（How）

- **useState**：管理组件状态
- **useEffect**：处理副作用（数据获取、订阅等）
- **useContext**：访问 Context
- **useReducer**：复杂状态管理
- **useCallback**：记忆化回调函数
- **useMemo**：记忆化计算结果
- **useRef**：访问 DOM 或保存可变值

### 🛠️ 实践（Do）

- Hook 使用 Demo
- 推荐练习：状态切换、数据获取、本地存储同步

### 🔗 扩展（Think & Connect）

- Hook 规则详解（只在顶层调用、只在函数组件中调用）
- 自定义 ESLint 规则检测 Hook 使用

## 涉及文件

| 文件             | 说明         |
| ---------------- | ------------ |
| `HooksIntro.tsx` | 页面组件主体 |
| `HooksIntro.css` | 页面样式     |

## 前置知识

→ [5. 事件处理](../Events/)

## 后续章节

→ [7. useEffect Hook](../UseEffect/) —— 深入理解副作用处理
