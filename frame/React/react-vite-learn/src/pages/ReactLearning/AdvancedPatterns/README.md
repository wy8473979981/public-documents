# 16. 高级模式

> React 高级设计模式，应对复杂场景的代码组织策略

## 学习目标

- 掌握 HOC、Render Props、复合组件等设计模式
- 理解 Error Boundary 和 Portals 的使用
- 能够根据场景选择合适的架构模式

## 内容结构

### 💡 概念（What & Why）

- 高级模式解决复杂组件逻辑与复用问题
- 各模式的适用场景与优缺点

### ⚙️ 用法（How）

- **高阶组件（HOC）**：接收组件返回新组件，用于逻辑复用
- **Render Props**：通过 prop 传递渲染函数，灵活组合
- **复合组件**：多组件协同工作，共享隐式状态
- **控制与非控制组件**：外部控制 vs 内部管理
- **Error Boundaries**：捕获子组件树错误，显示降级 UI
- **Portals**：将子节点渲染到 DOM 其他位置（模态框、tooltip）

### 🛠️ 实践（Do）

- 各模式 Demo 对比
- 推荐练习：实现一个 Modal（Portal）、错误边界组件

### 🔗 扩展（Think & Connect）

- 模式演进：HOC → Render Props → Hooks
- 选择最佳模式的决策树

## 涉及文件

| 文件                   | 说明         |
| ---------------------- | ------------ |
| `AdvancedPatterns.tsx` | 页面组件主体 |
| `AdvancedPatterns.css` | 页面样式     |

## 前置知识

→ [15. TypeScript 集成](../TypeScript/)

## 后续章节

→ [17. 服务端渲染 (SSR)](../SSR/) —— 服务端生成 HTML
