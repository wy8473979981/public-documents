# 7. useEffect Hook

> 处理组件中的副作用 —— 数据获取、订阅、DOM 操作等

## 学习目标

- 深入理解 useEffect 的执行时机与依赖数组
- 掌握清理函数的编写方式
- 避免常见的 useEffect 使用陷阱

## 内容结构

### 💡 概念（What & Why）

- useEffect 用于在函数组件中执行副作用操作
- 替代类组件的生命周期方法

### ⚙️ 用法（How）

- **每次渲染后执行**：`useEffect(() => { ... })`
- **仅挂载时执行**：`useEffect(() => { ... }, [])`
- **依赖变化时执行**：`useEffect(() => { ... }, [dep])`
- **清理函数**：返回函数处理卸载逻辑
- 常见用途：API 调用、订阅、定时器、DOM 操作

### 🛠️ 实践（Do）

- 数据获取 Demo
- 推荐练习：自动保存、窗口大小监听、倒计时

### 🔗 扩展（Think & Connect）

- useEffect vs useLayoutEffect 区别
- 依赖数组的常见陷阱（对象/数组依赖导致无限循环）

## 涉及文件

| 文件            | 说明         |
| --------------- | ------------ |
| `UseEffect.tsx` | 页面组件主体 |
| `UseEffect.css` | 页面样式     |

## 前置知识

→ [6. Hooks 入门](../HooksIntro/)

## 后续章节

→ [8. 自定义 Hooks](../CustomHooks/) —— 封装可复用的 Hook 逻辑
