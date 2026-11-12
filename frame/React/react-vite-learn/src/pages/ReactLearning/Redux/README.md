# 10. Redux 状态管理

> 可预测的状态容器，管理大型应用的复杂状态

## 学习目标

- 理解 Redux 的核心概念与数据流
- 掌握 Redux Toolkit 的现代用法
- 判断何时需要引入 Redux

## 内容结构

### 💡 概念（What & Why）

- Redux 是一个可预测的状态容器
- 核心概念：Store（状态存储）、Action（事件描述）、Reducer（状态更新）、Dispatch（派发）

### ⚙️ 用法（How）

- **Redux Toolkit（推荐方式）**：
  - `createSlice` —— 简化 reducer 和 action 创建
  - `configureStore` —— 配置 store
  - `createAsyncThunk` —— 处理异步逻辑
- `useSelector` 读取状态、`useDispatch` 派发 action

### 🛠️ 实践（Do）

- Todo App Demo
- 推荐练习：购物车、计数器带 Redux

### 🔗 扩展（Think & Connect）

- Redux vs Context API 选型对比
- 何时真正需要 Redux

## 涉及文件

| 文件        | 说明         |
| ----------- | ------------ |
| `Redux.tsx` | 页面组件主体 |
| `Redux.css` | 页面样式     |

## 前置知识

→ [9. Context API](../Context/)

## 后续章节

→ [11. React Router](../Router/) —— 实现页面导航
