export interface InterviewPage {
  path: string
  title: string
}

/** 面试题所有页面，按顺序排列 */
export const interviewPages: InterviewPage[] = [
  { path: '/interview/basics', title: '1. 基础概念' },
  { path: '/interview/hooks', title: '2. Hooks' },
  { path: '/interview/components', title: '3. 组件与通信' },
  { path: '/interview/state', title: '4. 状态管理' },
  { path: '/interview/performance', title: '5. 性能优化' },
  { path: '/interview/router-ssr', title: '6. 路由与 SSR' },
]
