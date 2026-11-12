# 11. React Router

> React 应用的标准路由库，实现单页应用的页面导航

## 学习目标

- 掌握路由配置与导航方式
- 理解动态路由、嵌套路由、保护路由
- 能够构建多页面 SPA 应用

## 内容结构

### 💡 概念（What & Why）

- SPA（单页应用）的路由需求
- React Router 的声明式路由理念

### ⚙️ 用法（How）

- **核心组件**：`BrowserRouter`、`Routes`、`Route`、`Link`、`NavLink`
- **Hooks**：`useNavigate`（编程式导航）、`useParams`（路由参数）、`useLocation`（当前位置）
- **路由类型**：静态路由、动态路由（`/user/:id`）、嵌套路由、保护路由

### 🛠️ 实践（Do）

- 多页面应用 Demo
- 推荐练习：带侧边栏的 Dashboard、博客路由

### 🔗 扩展（Think & Connect）

- 路由懒加载（`React.lazy` + `Suspense`）
- 服务端路由 vs 客户端路由

## 涉及文件

| 文件         | 说明         |
| ------------ | ------------ |
| `Router.tsx` | 页面组件主体 |
| `Router.css` | 页面样式     |

## 前置知识

→ [10. Redux 状态管理](../Redux/)

## 后续章节

→ [12. 表单处理](../Forms/) —— 表单数据管理
