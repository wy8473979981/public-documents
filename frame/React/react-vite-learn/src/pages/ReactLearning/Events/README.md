# 5. 事件处理

> 掌握 React 中的事件机制，响应用户交互

## 学习目标

- 理解 React 合成事件（SyntheticEvent）机制
- 掌握常见事件的绑定方式
- 学会处理事件对象和阻止默认行为

## 内容结构

### 💡 概念（What & Why）

- React 事件与原生 DOM 事件的区别
- 合成事件（SyntheticEvent）的跨浏览器兼容性
- 事件名使用驼峰命名，传递函数而非字符串

### ⚙️ 用法（How）

- 事件绑定方式：内联箭头函数、独立处理函数
- 事件对象的使用（`e.target`、`e.preventDefault()`）
- 向事件处理函数传递参数
- 常见事件：`onClick`、`onChange`、`onSubmit`、`onMouseEnter/Leave`

### 🛠️ 实践（Do）

- 各类事件 Demo
- 推荐练习：点击计数器、表单提交、键盘事件处理

### 🔗 扩展（Think & Connect）

- 事件委托与性能优化
- 自定义事件的使用场景

## 涉及文件

| 文件         | 说明         |
| ------------ | ------------ |
| `Events.tsx` | 页面组件主体 |
| `Events.css` | 页面样式     |

## 前置知识

→ [4. Props 与 State](../PropsState/)

## 后续章节

→ [6. Hooks 入门](../HooksIntro/) —— 进入 React Hooks 的世界
