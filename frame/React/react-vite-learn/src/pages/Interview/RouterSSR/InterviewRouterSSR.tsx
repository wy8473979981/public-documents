import { useState } from 'react'
import PageNav from '@/components/PageNav/PageNav'
import { interviewPages } from '../interviewPages'
import '../interview.css'

function InterviewRouterSSR() {
  const [filter, setFilter] = useState<'all' | 'easy' | 'medium' | 'hard'>('all')

  const qas = [
    {
      id: 1,
      level: 'easy' as const,
      question: 'React Router 中 BrowserRouter 和 HashRouter 有什么区别？',
      answer: (
        <>
          <table className="iv-table">
            <thead>
              <tr>
                <th>特性</th>
                <th>BrowserRouter</th>
                <th>HashRouter</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>URL 格式</td>
                <td>
                  <code>/about</code>
                </td>
                <td>
                  <code>/#/about</code>
                </td>
              </tr>
              <tr>
                <td>底层 API</td>
                <td>HTML5 History API</td>
                <td>window.location.hash</td>
              </tr>
              <tr>
                <td>服务端配置</td>
                <td>需要配置 fallback</td>
                <td>不需要</td>
              </tr>
              <tr>
                <td>SEO 友好</td>
                <td>是</td>
                <td>否</td>
              </tr>
              <tr>
                <td>适用场景</td>
                <td>生产环境、需 SEO</td>
                <td>静态部署、GitHub Pages</td>
              </tr>
            </tbody>
          </table>
          <div className="iv-key-point">
            <strong>面试回答：</strong>BrowserRouter 使用 HTML5 History API，URL
            更美观，但需要服务端配置 fallback；HashRouter 使用 URL
            hash，无需服务端配置，适合静态托管。
          </div>
        </>
      ),
    },
    {
      id: 2,
      level: 'easy' as const,
      question: 'React Router v6 和 v5 有什么主要区别？',
      answer: (
        <>
          <p>React Router v6 的主要变化：</p>
          <table className="iv-table">
            <thead>
              <tr>
                <th>特性</th>
                <th>v5</th>
                <th>v6</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>路由配置</td>
                <td>
                  <code>Switch</code> + <code>Route</code>
                </td>
                <td>
                  <code>Routes</code>（自动排序、最优匹配）
                </td>
              </tr>
              <tr>
                <td>嵌套路由</td>
                <td>手写相对路径</td>
                <td>
                  <code>Outlet</code> + 相对路径
                </td>
              </tr>
              <tr>
                <td>导航</td>
                <td>
                  <code>useHistory()</code>
                </td>
                <td>
                  <code>useNavigate()</code>
                </td>
              </tr>
              <tr>
                <td>路由匹配</td>
                <td>
                  <code>exact</code> 属性
                </td>
                <td>默认精确匹配</td>
              </tr>
              <tr>
                <td>包体积</td>
                <td>~20 KB</td>
                <td>~8 KB</td>
              </tr>
            </tbody>
          </table>
        </>
      ),
    },
    {
      id: 3,
      level: 'medium' as const,
      question: '什么是路由守卫（Protected Route）？如何实现？',
      answer: (
        <>
          <p>
            路由守卫是<strong>需要认证才能访问的路由</strong>，未登录用户会被重定向到登录页。
          </p>
          <pre>{`function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()

  if (isLoading) return <Spinner />
  if (!user) return <Navigate to="/login" replace />

  return <>{children}</>
}

// 使用
<Routes>
  <Route path="/login" element={<Login />} />
  <Route
    path="/dashboard"
    element={
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    }
  />
</Routes>`}</pre>
          <div className="iv-key-point">
            <strong>注意：</strong>
            <code>replace</code> 属性避免登录后按返回键又回到受保护页面。
          </div>
        </>
      ),
    },
    {
      id: 4,
      level: 'medium' as const,
      question: 'CSR、SSR、SSG、ISR 分别是什么？如何选择？',
      answer: (
        <>
          <table className="iv-table">
            <thead>
              <tr>
                <th>模式</th>
                <th>全称</th>
                <th>渲染时机</th>
                <th>适用场景</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>CSR</strong>
                </td>
                <td>Client-Side Rendering</td>
                <td>浏览器下载 JS 后渲染</td>
                <td>后台管理系统、交互密集应用</td>
              </tr>
              <tr>
                <td>
                  <strong>SSR</strong>
                </td>
                <td>Server-Side Rendering</td>
                <td>每次请求时服务端渲染</td>
                <td>SEO 重要、数据频繁变化</td>
              </tr>
              <tr>
                <td>
                  <strong>SSG</strong>
                </td>
                <td>Static Site Generation</td>
                <td>构建时生成静态 HTML</td>
                <td>博客、文档、营销页</td>
              </tr>
              <tr>
                <td>
                  <strong>ISR</strong>
                </td>
                <td>Incremental Static Regeneration</td>
                <td>SSG + 按需重新生成</td>
                <td>内容多、更新频繁的网站</td>
              </tr>
            </tbody>
          </table>
          <div className="iv-key-point">
            <strong>Next.js 选择策略：</strong>默认 SSG，需要实时数据用 SSR，页面很多且需 SEO 用
            ISR。
          </div>
        </>
      ),
    },
    {
      id: 5,
      level: 'medium' as const,
      question: '什么是水合（Hydration）？为什么 SSR 需要水合？',
      answer: (
        <>
          <p>
            <strong>水合</strong>是客户端接管服务端渲染的 HTML 的过程：React 复用已有的 DOM
            节点，附加事件监听器，使页面变得可交互。
          </p>
          <p>SSR 的两阶段过程：</p>
          <ol>
            <li>
              <strong>服务端渲染：</strong>生成静态 HTML（用户立即看到内容，但无法交互）
            </li>
            <li>
              <strong>客户端水合：</strong>下载 JS，React 接管 DOM，添加事件处理（页面变得可交互）
            </li>
          </ol>
          <pre>{`// React 18 的水合 API
const root = hydrateRoot(
  document.getElementById('root'),
  <App />
)`}</pre>
          <p>React 18 的改进：</p>
          <ul>
            <li>
              <strong>Selective Hydration：</strong>配合 Suspense，按需水合（用户点击区域优先水合）
            </li>
            <li>
              <strong>流式 SSR：</strong>服务端可以分段发送 HTML，不用等所有数据就绪
            </li>
          </ul>
        </>
      ),
    },
    {
      id: 6,
      level: 'hard' as const,
      question: 'Next.js 的 App Router 和 Pages Router 有什么区别？',
      answer: (
        <>
          <table className="iv-table">
            <thead>
              <tr>
                <th>特性</th>
                <th>Pages Router（旧）</th>
                <th>App Router（新，Next.js 13+）</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>目录结构</td>
                <td>
                  <code>pages/</code>
                </td>
                <td>
                  <code>app/</code>
                </td>
              </tr>
              <tr>
                <td>组件类型</td>
                <td>客户端组件</td>
                <td>默认服务端组件（RSC）</td>
              </tr>
              <tr>
                <td>数据获取</td>
                <td>
                  <code>getServerSideProps</code> / <code>getStaticProps</code>
                </td>
                <td>直接在组件中 async/await</td>
              </tr>
              <tr>
                <td>布局</td>
                <td>
                  <code>_app.tsx</code> 全局布局
                </td>
                <td>
                  <code>layout.tsx</code> 嵌套布局
                </td>
              </tr>
              <tr>
                <td>流式渲染</td>
                <td>有限支持</td>
                <td>原生支持（loading.tsx）</td>
              </tr>
            </tbody>
          </table>
          <pre>{`// App Router：直接 async 获取数据（服务端组件）
async function ProductList() {
  const products = await db.products.findMany()  // 直接访问数据库！
  return products.map(p => <ProductCard key={p.id} {...p} />)
}

// 需要交互性时，标记为客户端组件
'use client'
function LikeButton() {
  const [liked, setLiked] = useState(false)
  return <button onClick={() => setLiked(!liked)}>❤️</button>
}`}</pre>
        </>
      ),
    },
    {
      id: 7,
      level: 'hard' as const,
      question: 'React Server Components (RSC) 是什么？和 SSR 有什么区别？',
      answer: (
        <>
          <p>
            React Server Components 是<strong>只在服务端运行的 React 组件</strong>
            ，代码不会发送到客户端，可直接访问数据库、文件系统。
          </p>
          <table className="iv-table">
            <thead>
              <tr>
                <th>特性</th>
                <th>SSR</th>
                <th>RSC</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>组件代码</td>
                <td>发送到客户端（水合需要）</td>
                <td>不发送，零客户端 JS</td>
              </tr>
              <tr>
                <td>交互能力</td>
                <td>有（水合后可交互）</td>
                <td>无（纯渲染，需配合客户端组件）</td>
              </tr>
              <tr>
                <td>数据获取</td>
                <td>getServerSideProps 等</td>
                <td>组件内直接 async/await</td>
              </tr>
              <tr>
                <td>包体积</td>
                <td>所有组件代码都打包到客户端</td>
                <td>服务端组件不计入客户端包</td>
              </tr>
            </tbody>
          </table>
          <div className="iv-key-point">
            <strong>核心思想：</strong>RSC + 客户端组件混合使用——列表/详情用 RSC（零
            JS），按钮/表单用客户端组件（可交互）。
          </div>
        </>
      ),
    },
  ]

  const filteredQas = filter === 'all' ? qas : qas.filter((q) => q.level === filter)
  const levelLabel = { easy: '简单', medium: '中等', hard: '困难' }
  const stats = {
    total: qas.length,
    easy: qas.filter((q) => q.level === 'easy').length,
    medium: qas.filter((q) => q.level === 'medium').length,
    hard: qas.filter((q) => q.level === 'hard').length,
  }

  return (
    <div className="iv-page">
      <h1>6. 路由与 SSR 面试题</h1>
      <p className="iv-subtitle">React Router、SSR/SSG/ISR、Next.js、Server Components 等考点</p>

      <div className="iv-stats">
        <span>共 {stats.total} 题</span>
        <span style={{ color: '#52c41a' }}>简单 {stats.easy}</span>
        <span style={{ color: '#faad14' }}>中等 {stats.medium}</span>
        <span style={{ color: '#ff4d4f' }}>困难 {stats.hard}</span>
      </div>

      <div className="iv-filter-bar">
        <button
          className={`iv-filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          全部
        </button>
        <button
          className={`iv-filter-btn ${filter === 'easy' ? 'active-easy' : ''}`}
          onClick={() => setFilter('easy')}
        >
          简单
        </button>
        <button
          className={`iv-filter-btn ${filter === 'medium' ? 'active-medium' : ''}`}
          onClick={() => setFilter('medium')}
        >
          中等
        </button>
        <button
          className={`iv-filter-btn ${filter === 'hard' ? 'active-hard' : ''}`}
          onClick={() => setFilter('hard')}
        >
          困难
        </button>
      </div>

      <div className="iv-qa-list">
        {filteredQas.map((qa, idx) => (
          <details key={qa.id} className="iv-qa-card">
            <summary>
              <span className="iv-arrow">▶</span>
              <span className="iv-q-num">{idx + 1}</span>
              <span className="iv-q-text">{qa.question}</span>
              <span className={`iv-level ${qa.level}`}>{levelLabel[qa.level]}</span>
            </summary>
            <div className="iv-answer">{qa.answer}</div>
          </details>
        ))}
      </div>

      <PageNav currentPath="/interview/router-ssr" pages={interviewPages} />
    </div>
  )
}

export default InterviewRouterSSR
