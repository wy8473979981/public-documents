export interface NavPage {
  path: string
  title: string
}

/** 学习路线所有页面，按顺序排列 */
export const learningPages: NavPage[] = [
  { path: '/react-learning/basics', title: '1. React 基础概念' },
  { path: '/react-learning/jsx', title: '2. JSX 语法' },
  { path: '/react-learning/components', title: '3. 组件基础' },
  { path: '/react-learning/props-state', title: '4. Props 与 State' },
  { path: '/react-learning/events', title: '5. 事件处理' },
  { path: '/react-learning/hooks-intro', title: '6. Hooks 入门' },
  { path: '/react-learning/useEffect', title: '7. useEffect Hook' },
  { path: '/react-learning/custom-hooks', title: '8. 自定义 Hooks' },
  { path: '/react-learning/context', title: '9. Context API' },
  { path: '/react-learning/redux', title: '10. Redux 状态管理' },
  { path: '/react-learning/zustand', title: '10.1 Zustand 状态管理' },
  { path: '/react-learning/router', title: '11. React Router' },
  { path: '/react-learning/forms', title: '12. 表单处理' },
  { path: '/react-learning/performance', title: '13. 性能优化' },
  { path: '/react-learning/testing', title: '14. 测试' },
  { path: '/react-learning/typescript', title: '15. TypeScript 集成' },
  { path: '/react-learning/advanced-patterns', title: '16. 高级模式' },
  { path: '/react-learning/ssr', title: '17. 服务端渲染 (SSR)' },
  { path: '/react-learning/ecosystem', title: '18. 生态系统' },
]
