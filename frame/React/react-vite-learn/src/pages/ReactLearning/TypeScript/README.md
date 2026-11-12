# 15. TypeScript 集成

> 为 React 应用添加类型安全，提升开发体验与代码质量

## 学习目标

- 掌握 React 组件的 TypeScript 类型定义
- 理解 Props、State、Hook、事件的类型标注
- 能够编写类型安全的泛型组件

## 内容结构

### 💡 概念（What & Why）

- TypeScript 为 React 添加编译期类型检查
- 类型安全带来的好处：自动补全、重构安全、文档化

### ⚙️ 用法（How）

- **组件类型**：`FC` / `PFC`、函数声明式
- **Props 类型**：`interface`、`type`、泛型组件
- **Hook 类型**：`useState<T>()`、`useRef<HTMLDivElement>(null)`
- **事件类型**：`ChangeEvent`、`FormEvent`、`MouseEvent`
- **常用类型**：`React.ReactNode`、`React.CSSProperties`、`React.RefObject`

### 🛠️ 实践（Do）

- 类型化组件 Demo
- 推荐练习：泛型列表组件、类型安全的表单

### 🔗 扩展（Think & Connect）

- TypeScript 高级类型在 React 中的应用
- 第三方库类型定义（`@types/*`）

## 涉及文件

| 文件             | 说明         |
| ---------------- | ------------ |
| `TypeScript.tsx` | 页面组件主体 |
| `TypeScript.css` | 页面样式     |

## 前置知识

→ [14. 测试](../Testing/)

## 后续章节

→ [16. 高级模式](../AdvancedPatterns/) —— 深入 React 设计模式
