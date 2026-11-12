# 8. 自定义 Hooks

> 将组件逻辑提取为可复用的函数，以 "use" 开头命名

## 学习目标

- 掌握自定义 Hook 的编写规范
- 理解逻辑复用的最佳实践
- 能够封装常见的业务 Hook

## 内容结构

### 💡 概念（What & Why）

- 自定义 Hook 是以 `use` 开头的函数，可调用其他 Hook
- 优势：逻辑复用、代码组织清晰、测试友好

### ⚙️ 用法（How）

- 命名规范：必须以 `use` 开头
- 遵循 Hook 规则（顶层调用、函数组件中使用）
- 返回值设计：返回状态、方法或对象

### 🛠️ 实践（Do）

- 常见自定义 Hook Demo：
  - `useLocalStorage` —— 持久化数据到 localStorage
  - `useFetch` —— 封装数据获取逻辑
  - `useDebounce` —— 防抖处理
  - `useWindowSize` —— 监听窗口大小变化

### 🔗 扩展（Think & Connect）

- Hook 组合模式
- 社区优质 Hook 库推荐（react-use、ahooks）

## 涉及文件

| 文件              | 说明         |
| ----------------- | ------------ |
| `CustomHooks.tsx` | 页面组件主体 |
| `CustomHooks.css` | 页面样式     |

## 前置知识

→ [7. useEffect Hook](../UseEffect/)

## 后续章节

→ [9. Context API](../Context/) —— 跨组件数据传递
