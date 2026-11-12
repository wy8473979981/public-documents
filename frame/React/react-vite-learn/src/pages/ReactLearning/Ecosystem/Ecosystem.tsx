import { useState } from 'react'
import CodeBlock from '@/components/CodeBlock/CodeBlock'
import SectionPath from '@/components/SectionPath/SectionPath'
import PageNav from '@/components/PageNav/PageNav'
import '../shared.css'

const uiLibraryCode = `// Ant Design 示例
import { Button, Table, Modal } from 'antd'

function UserList() {
  const columns = [
    { title: '姓名', dataIndex: 'name', key: 'name' },
    { title: '年龄', dataIndex: 'age', key: 'age' },
  ]
  return <Table columns={columns} dataSource={data} />
}

// Tailwind CSS 示例
function Card({ title, children }) {
  return (
    <div className="rounded-lg shadow-md p-4 bg-white">
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <p className="text-gray-600">{children}</p>
    </div>
  )
}`

const dataFetchCode = `// React Query（TanStack Query）示例
import { useQuery, useMutation } from '@tanstack/react-query'

function UserList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: () => fetch('/api/users').then(r => r.json()),
  })

  const mutation = useMutation({
    mutationFn: (newUser) =>
      fetch('/api/users', {
        method: 'POST',
        body: JSON.stringify(newUser),
      }),
  })

  if (isLoading) return <Spinner />
  if (error) return <Error message={error.message} />
  return <UserTable users={data} />
}`

const toolingCode = `// vite.config.ts — Vite 配置示例
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: { port: 3000 },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})

// .eslintrc — ESLint 配置
{
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "rules": {
    "react/react-in-jsx-scope": "off"
  }
}`

function Ecosystem() {
  const [selectedCategory, setSelectedCategory] = useState('ui')

  const categories: Record<string, { icon: string; title: string; desc: string; items: string[] }> =
    {
      ui: {
        icon: '🎨',
        title: 'UI 组件库',
        desc: '提供现成的组件，加速开发',
        items: [
          'Ant Design — 企业级 UI 组件库，适合中后台',
          'Material UI — Google Material Design 实现',
          'Chakra UI — 模块化、无障碍、易于定制',
          'Tailwind CSS — 原子化 CSS，灵活组合',
        ],
      },
      state: {
        icon: '📦',
        title: '状态管理',
        desc: '管理跨组件的共享状态',
        items: [
          'Redux Toolkit — 最成熟、适合大型应用',
          'Zustand — 极简 API、无需 Provider',
          'Jotai — 原子化状态、自下而上',
          'Valtio — 基于 Proxy 的响应式状态',
        ],
      },
      data: {
        icon: '🌐',
        title: '数据获取',
        desc: '简化异步请求与缓存',
        items: [
          'TanStack Query — 服务端状态管理（推荐）',
          'SWR — Vercel 出品，轻量缓存策略',
          'Apollo Client — GraphQL 最佳客户端',
          'Axios — 经典 HTTP 请求库',
        ],
      },
      tools: {
        icon: '🛠️',
        title: '开发工具',
        desc: '提升开发效率与代码质量',
        items: [
          'Vite — 极速开发服务器（推荐）',
          'React DevTools — 组件调试必备',
          'ESLint + Prettier — 代码规范 + 格式化',
          'TypeScript — 类型安全',
        ],
      },
      deploy: {
        icon: '🚀',
        title: '部署平台',
        desc: '一键部署与托管',
        items: [
          'Vercel — Next.js 官方平台，零配置',
          'Netlify — 静态站点 + Serverless',
          'AWS Amplify — 全栈云平台',
          'Cloudflare Pages — 全球 CDN，速度快',
        ],
      },
    }

  const current = categories[selectedCategory]

  return (
    <div className="rl-page">
      <h1>18. 生态系统</h1>
      <p className="rl-subtitle">了解 React 生态中的核心工具与库 —— 选对工具，事半功倍</p>
      <SectionPath />
      <div className="rl-section concept" id="section-concept">
        <div className="rl-section-header">
          <span className="rl-icon">💡</span> 理解概念 — What & Why
        </div>
        <div className="rl-section-body">
          <h3>为什么需要了解生态？</h3>
          <p>
            React 本身只是一个 UI 库。要构建完整的应用，需要路由、状态管理、数据获取、UI
            组件库等工具的配合。了解生态能帮助你做出更好的技术选型。
          </p>
          <h3>React 生态全景</h3>
          <table className="rl-compare-table">
            <thead>
              <tr>
                <th>类别</th>
                <th>解决的问题</th>
                <th>代表工具</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>UI 组件库</strong>
                </td>
                <td>提供现成 UI 组件</td>
                <td>Ant Design, MUI, Tailwind</td>
              </tr>
              <tr>
                <td>
                  <strong>状态管理</strong>
                </td>
                <td>跨组件状态共享</td>
                <td>Redux, Zustand, Jotai</td>
              </tr>
              <tr>
                <td>
                  <strong>数据获取</strong>
                </td>
                <td>异步请求 + 缓存</td>
                <td>TanStack Query, SWR</td>
              </tr>
              <tr>
                <td>
                  <strong>路由</strong>
                </td>
                <td>页面导航</td>
                <td>React Router, TanStack Router</td>
              </tr>
              <tr>
                <td>
                  <strong>构建工具</strong>
                </td>
                <td>开发与打包</td>
                <td>Vite, Next.js, Turbopack</td>
              </tr>
              <tr>
                <td>
                  <strong>测试</strong>
                </td>
                <td>质量保证</td>
                <td>Vitest, Testing Library, Playwright</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="rl-section usage" id="section-usage">
        <div className="rl-section-header">
          <span className="rl-icon">⚙️</span> 掌握用法 — How
        </div>
        <div className="rl-section-body">
          <h3>UI 组件库 + Tailwind</h3>
          <CodeBlock code={uiLibraryCode} language="jsx" title="组件库使用示例" />
          <h3>数据获取 — TanStack Query</h3>
          <CodeBlock code={dataFetchCode} language="jsx" title="React Query 数据获取" />
          <h3>工程化工具</h3>
          <CodeBlock code={toolingCode} language="ts" title="Vite + ESLint 配置" />
        </div>
      </div>
      <div className="rl-section practice" id="section-practice">
        <div className="rl-section-header">
          <span className="rl-icon">🛠️</span> 动手实践 — Do
        </div>
        <div className="rl-section-body">
          <h3>试一试：探索生态分类</h3>
          <div className="rl-demo-box">
            <div className="rl-demo-title">Interactive Demo - 生态工具分类浏览</div>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 12 }}>
              {Object.entries(categories).map(([key, cat]) => (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  style={{
                    fontWeight: selectedCategory === key ? 'bold' : 'normal',
                    background: selectedCategory === key ? '#1677ff' : '#f0f0f0',
                    color: selectedCategory === key ? '#fff' : '#333',
                    border: 'none',
                    borderRadius: 4,
                    padding: '6px 12px',
                    cursor: 'pointer',
                  }}
                >
                  {cat.icon} {cat.title}
                </button>
              ))}
            </div>
            <div className="rl-demo-result">
              <h4>
                {current.icon} {current.title}
              </h4>
              <p style={{ color: '#666', marginBottom: 8 }}>{current.desc}</p>
              <ul style={{ paddingLeft: 20, margin: 0 }}>
                {current.items.map((item, i) => (
                  <li key={i} style={{ marginBottom: 4 }}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <h3>推荐练习</h3>
          <ul className="rl-exercises">
            <li>
              <span className="rl-ex-num">1</span>
              <div className="rl-ex-content">
                <div className="rl-ex-title">技术选型练习</div>
                <div className="rl-ex-desc">为一个假想的电商项目选择合适的技术栈并说明理由</div>
              </div>
            </li>
            <li>
              <span className="rl-ex-num">2</span>
              <div className="rl-ex-content">
                <div className="rl-ex-title">集成 TanStack Query</div>
                <div className="rl-ex-desc">在现有项目中用 React Query 替换手动 fetch</div>
              </div>
            </li>
            <li>
              <span className="rl-ex-num">3</span>
              <div className="rl-ex-content">
                <div className="rl-ex-title">组件库对比</div>
                <div className="rl-ex-desc">
                  分别用 Ant Design 和 Tailwind 实现同一个表单，对比开发体验
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div className="rl-section connect" id="section-connect">
        <div className="rl-section-header">
          <span className="rl-icon">🔗</span> 反思与扩展 — Think & Connect
        </div>
        <div className="rl-section-body">
          <h3>延伸思考</h3>
          <ul className="rl-think-list">
            <li>
              <details>
                <summary>什么时候不需要状态管理库？useState + Context 够用吗？</summary>
                <div className="rl-answer">
                  <p>
                    大多数中小型项目，<code>useState</code> + <code>Context</code>{' '}
                    完全够用。只有当你遇到以下问题时才考虑引入状态管理库：①
                    多个不相关组件需要共享同一状态；② 状态更新逻辑复杂（多个 action）；③ Context
                    导致大量组件不必要的重渲染。
                  </p>
                  <p>原则：先用 React 内置方案，遇到问题再引入外部库，避免过早引入复杂工具。</p>
                </div>
              </details>
            </li>
            <li>
              <details>
                <summary>TanStack Query 和 Redux 是互补还是竞争关系？</summary>
                <div className="rl-answer">
                  <p>
                    它们是 <strong>互补关系</strong>。TanStack Query（原 React Query）专注于{' '}
                    <strong>服务端状态</strong>（数据获取、缓存、同步），Redux 管理{' '}
                    <strong>客户端状态</strong>（UI 状态、表单、全局配置）。
                  </p>
                  <p>
                    实际上，引入了 TanStack Query 后，很多原本放在 Redux 中的状态（如 API
                    数据、加载状态、错误状态）可以移除，大幅简化状态管理。很多项目用 TanStack Query
                    + Zustand 就够了。
                  </p>
                </div>
              </details>
            </li>
            <li>
              <details>
                <summary>如何评估一个第三方库的质量？</summary>
                <div className="rl-answer">
                  <p>
                    核心指标：① <strong>GitHub Star 数</strong>（知名度）；②{' '}
                    <strong>维护活跃度</strong>（最近 commit 时间、Issue 响应速度）；③{' '}
                    <strong>下载量</strong>（npm trends）；④ <strong>社区活跃度</strong>
                    （Discord、Discussion）。
                  </p>
                  <p>
                    其他关注点：TypeScript 支持情况、包体积（bundlephobia.com）、是否有 E2E
                    测试、是否支持 Tree-shaking、是否有中文文档（对国内项目重要）。
                  </p>
                </div>
              </details>
            </li>
            <li>
              <details>
                <summary>React 生态和 Vue 生态有哪些相似之处？</summary>
                <div className="rl-answer">
                  <p>
                    两者生态高度平行：路由（React Router vs Vue Router）、状态管理（Redux/Zustand vs
                    Pinia/Vuex）、构建工具（Vite 是共用的）、UI 库（Ant Design vs Element
                    Plus）、测试（Testing Library 两者都支持）。
                  </p>
                  <p>
                    主要区别：Vue 生态更「官方化」（路由、状态管理都是官方提供），React
                    生态更「社区化」（工具来自社区，选择更多但也更分散）。掌握一个生态后，学习另一个的成本很低。
                  </p>
                </div>
              </details>
            </li>
          </ul>
          <h3>推荐资源</h3>
          <div className="rl-resources">
            <a
              className="rl-resource"
              href="https://reactjs.org/community/tools.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="rl-res-icon">📖</span> React 官方工具推荐
            </a>
            <a
              className="rl-resource"
              href="https://github.com/enaqx/awesome-react"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="rl-res-icon">📖</span> Awesome React（生态合集）
            </a>
            <a
              className="rl-resource"
              href="https://tanstack.com/query/latest"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="rl-res-icon">📖</span> TanStack Query 文档
            </a>
          </div>
        </div>
      </div>
      <PageNav currentPath="/react-learning/ecosystem" />
    </div>
  )
}

export default Ecosystem
