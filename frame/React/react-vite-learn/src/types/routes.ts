import { lazy, type ComponentType, type LazyExoticComponent } from 'react'

export interface RouteConfig {
  path: string
  name: string
  children?: RouteConfig[]
}

export interface RouteComponentConfig {
  path: string
  component: LazyExoticComponent<ComponentType>
}

export const routes: RouteConfig[] = [
  {
    path: '/',
    name: '首页',
  },
  {
    path: '/about',
    name: '关于',
  },
  {
    path: '/react-learning',
    name: 'React 学习路线',
    children: [
      { path: '/react-learning/basics', name: '1. React 基础概念' },
      { path: '/react-learning/jsx', name: '2. JSX 语法' },
      { path: '/react-learning/components', name: '3. 组件基础' },
      { path: '/react-learning/props-state', name: '4. Props 与 State' },
      { path: '/react-learning/events', name: '5. 事件处理' },
      { path: '/react-learning/hooks-intro', name: '6. Hooks 入门' },
      { path: '/react-learning/useEffect', name: '7. useEffect Hook' },
      { path: '/react-learning/custom-hooks', name: '8. 自定义 Hooks' },
      { path: '/react-learning/context', name: '9. Context API' },
      { path: '/react-learning/redux', name: '10. Redux 状态管理' },
      { path: '/react-learning/zustand', name: '10.1 Zustand 状态管理' },
      { path: '/react-learning/router', name: '11. React Router' },
      { path: '/react-learning/forms', name: '12. 表单处理' },
      { path: '/react-learning/performance', name: '13. 性能优化' },
      { path: '/react-learning/testing', name: '14. 测试' },
      { path: '/react-learning/typescript', name: '15. TypeScript 集成' },
      { path: '/react-learning/advanced-patterns', name: '16. 高级模式' },
      { path: '/react-learning/ssr', name: '17. 服务端渲染 (SSR)' },
      { path: '/react-learning/ecosystem', name: '18. 生态系统' },
    ],
  },
  {
    path: '/lifecycle',
    name: '生命周期',
    children: [
      { path: '/lifecycle/function', name: '函数组件生命周期' },
      { path: '/lifecycle/class', name: '类组件生命周期' },
    ],
  },
  {
    path: '/antd-demo',
    name: 'Antd 演示',
  },
  {
    path: '/codeblock-demo',
    name: '代码块演示',
  },
  {
    path: '/library-usage',
    name: '库使用',
    children: [{ path: '/library-usage/react-markdown', name: 'react-markdown' }],
  },
  {
    path: '/interview',
    name: 'React 面试题',
    children: [
      { path: '/interview/basics', name: '1. 基础概念' },
      { path: '/interview/hooks', name: '2. Hooks' },
      { path: '/interview/components', name: '3. 组件与通信' },
      { path: '/interview/state', name: '4. 状态管理' },
      { path: '/interview/performance', name: '5. 性能优化' },
      { path: '/interview/router-ssr', name: '6. 路由与 SSR' },
    ],
  },
]

export const routeComponents: RouteComponentConfig[] = [
  { path: '/', component: lazy(() => import('@/pages/Home/Home')) },
  { path: '/about', component: lazy(() => import('@/pages/About/About')) },
  {
    path: '/lifecycle/function',
    component: lazy(() => import('@/pages/Lifecycle/FunctionLifecycle/FunctionLifecycle')),
  },
  {
    path: '/lifecycle/class',
    component: lazy(() => import('@/pages/Lifecycle/ClassLifecycle/ClassLifecycle')),
  },
  { path: '/antd-demo', component: lazy(() => import('@/pages/AntdDemo/AntdDemo')) },
  { path: '/codeblock-demo', component: lazy(() => import('@/pages/CodeBlockDemo/CodeBlockDemo')) },
  {
    path: '/library-usage/react-markdown',
    component: lazy(() => import('@/pages/LibraryUsage/ReactMarkdown/ReactMarkdownDemo')),
  },
  {
    path: '/react-learning/basics',
    component: lazy(() => import('@/pages/ReactLearning/Basics/Basics')),
  },
  { path: '/react-learning/jsx', component: lazy(() => import('@/pages/ReactLearning/Jsx/Jsx')) },
  {
    path: '/react-learning/components',
    component: lazy(() => import('@/pages/ReactLearning/Components/Components')),
  },
  {
    path: '/react-learning/props-state',
    component: lazy(() => import('@/pages/ReactLearning/PropsState/PropsState')),
  },
  {
    path: '/react-learning/events',
    component: lazy(() => import('@/pages/ReactLearning/Events/Events')),
  },
  {
    path: '/react-learning/hooks-intro',
    component: lazy(() => import('@/pages/ReactLearning/HooksIntro/HooksIntro')),
  },
  {
    path: '/react-learning/useEffect',
    component: lazy(() => import('@/pages/ReactLearning/UseEffect/UseEffect')),
  },
  {
    path: '/react-learning/custom-hooks',
    component: lazy(() => import('@/pages/ReactLearning/CustomHooks/CustomHooks')),
  },
  {
    path: '/react-learning/context',
    component: lazy(() => import('@/pages/ReactLearning/Context/Context')),
  },
  {
    path: '/react-learning/redux',
    component: lazy(() => import('@/pages/ReactLearning/Redux/Redux')),
  },
  {
    path: '/react-learning/zustand',
    component: lazy(() => import('@/pages/ReactLearning/Zustand/Zustand')),
  },
  {
    path: '/react-learning/router',
    component: lazy(() => import('@/pages/ReactLearning/Router/Router')),
  },
  {
    path: '/react-learning/forms',
    component: lazy(() => import('@/pages/ReactLearning/Forms/Forms')),
  },
  {
    path: '/react-learning/performance',
    component: lazy(() => import('@/pages/ReactLearning/Performance/Performance')),
  },
  {
    path: '/react-learning/testing',
    component: lazy(() => import('@/pages/ReactLearning/Testing/Testing')),
  },
  {
    path: '/react-learning/typescript',
    component: lazy(() => import('@/pages/ReactLearning/TypeScript/TypeScript')),
  },
  {
    path: '/react-learning/advanced-patterns',
    component: lazy(() => import('@/pages/ReactLearning/AdvancedPatterns/AdvancedPatterns')),
  },
  { path: '/react-learning/ssr', component: lazy(() => import('@/pages/ReactLearning/SSR/SSR')) },
  {
    path: '/react-learning/ecosystem',
    component: lazy(() => import('@/pages/ReactLearning/Ecosystem/Ecosystem')),
  },
  {
    path: '/interview/basics',
    component: lazy(() => import('@/pages/Interview/Basics/InterviewBasics')),
  },
  {
    path: '/interview/hooks',
    component: lazy(() => import('@/pages/Interview/Hooks/InterviewHooks')),
  },
  {
    path: '/interview/components',
    component: lazy(() => import('@/pages/Interview/Components/InterviewComponents')),
  },
  {
    path: '/interview/state',
    component: lazy(() => import('@/pages/Interview/State/InterviewState')),
  },
  {
    path: '/interview/performance',
    component: lazy(() => import('@/pages/Interview/Performance/InterviewPerformance')),
  },
  {
    path: '/interview/router-ssr',
    component: lazy(() => import('@/pages/Interview/RouterSSR/InterviewRouterSSR')),
  },
]
