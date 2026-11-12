# 14. 测试

> React 应用的测试策略与工具链

## 学习目标

- 理解前端测试的类型与策略
- 掌握 Jest 与 React Testing Library 的使用
- 编写可靠的组件测试

## 内容结构

### 💡 概念（What & Why）

- 测试类型：单元测试、集成测试、E2E 测试
- 测试金字塔与测试策略选择

### ⚙️ 用法（How）

- **Jest** —— JavaScript 测试框架
- **React Testing Library** —— 测试 React 组件（测试用户行为而非实现细节）
- **Cypress / Playwright** —— E2E 测试
- 测试组织：`describe` / `it` 结构
- Mock 与 Stub：模拟 API、定时器等外部依赖

### 🛠️ 实践（Do）

- 组件测试 Demo
- 推荐练习：按钮测试、表单验证测试、异步操作测试

### 🔗 扩展（Think & Connect）

- 测试覆盖率与 CI/CD 集成
- TDD（测试驱动开发）实践

## 涉及文件

| 文件          | 说明         |
| ------------- | ------------ |
| `Testing.tsx` | 页面组件主体 |
| `Testing.css` | 页面样式     |

## 前置知识

→ [13. 性能优化](../Performance/)

## 后续章节

→ [15. TypeScript 集成](../TypeScript/) —— 为 React 添加类型安全
