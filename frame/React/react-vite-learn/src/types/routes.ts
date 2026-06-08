export interface RouteConfig {
  path: string
  name: string
  element?: React.ReactNode
  children?: RouteConfig[]
}

export const routes: RouteConfig[] = [
  {
    path: '/',
    name: '首页',
    element: null, // 将在 App.tsx 中设置
  },
  {
    path: '/about',
    name: '关于',
    element: null,
  },
  {
    path: '/react-learning',
    name: 'React 学习路线',
    element: null,
    children: [
      {
        path: '/react-learning/basics',
        name: '1. React 基础概念',
        element: null,
      },
      {
        path: '/react-learning/jsx',
        name: '2. JSX 语法',
        element: null,
      },
      {
        path: '/react-learning/components',
        name: '3. 组件基础',
        element: null,
      },
      {
        path: '/react-learning/props-state',
        name: '4. Props 与 State',
        element: null,
      },
      {
        path: '/react-learning/events',
        name: '5. 事件处理',
        element: null,
      },
      {
        path: '/react-learning/hooks-intro',
        name: '6. Hooks 入门',
        element: null,
      },
      {
        path: '/react-learning/useEffect',
        name: '7. useEffect Hook',
        element: null,
      },
      {
        path: '/react-learning/custom-hooks',
        name: '8. 自定义 Hooks',
        element: null,
      },
      {
        path: '/react-learning/context',
        name: '9. Context API',
        element: null,
      },
      {
        path: '/react-learning/redux',
        name: '10. Redux 状态管理',
        element: null,
      },
      {
        path: '/react-learning/router',
        name: '11. React Router',
        element: null,
      },
      {
        path: '/react-learning/forms',
        name: '12. 表单处理',
        element: null,
      },
      {
        path: '/react-learning/performance',
        name: '13. 性能优化',
        element: null,
      },
      {
        path: '/react-learning/testing',
        name: '14. 测试',
        element: null,
      },
      {
        path: '/react-learning/typescript',
        name: '15. TypeScript 集成',
        element: null,
      },
      {
        path: '/react-learning/advanced-patterns',
        name: '16. 高级模式',
        element: null,
      },
      {
        path: '/react-learning/ssr',
        name: '17. 服务端渲染 (SSR)',
        element: null,
      },
      {
        path: '/react-learning/ecosystem',
        name: '18. 生态系统',
        element: null,
      },
    ],
  },
  {
    path: '/lifecycle',
    name: '生命周期',
    element: null,
    children: [
      {
        path: '/lifecycle/function',
        name: '函数组件生命周期',
        element: null,
      },
      {
        path: '/lifecycle/class',
        name: '类组件生命周期',
        element: null,
      },
    ],
  },
  {
    path: '/antd-demo',
    name: 'Antd 演示',
    element: null,
  },
]
