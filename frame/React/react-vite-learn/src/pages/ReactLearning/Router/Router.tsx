import { useState } from 'react'
import CodeBlock from '@/components/CodeBlock/CodeBlock'
import SectionPath from '@/components/SectionPath/SectionPath'
import PageNav from '@/components/PageNav/PageNav'
import '../shared.css'

const routerBasicCode = `import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">首页</Link>
        <Link to="/about">关于</Link>
        <Link to="/users/42">用户 42</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/users/:id" element={<UserDetail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}`

const routerHooksCode = `// React Router Hooks
import { useParams, useNavigate, useLocation } from 'react-router-dom'

function UserDetail() {
  const { id } = useParams()           // 获取路由参数
  const navigate = useNavigate()       // 编程式导航
  const location = useLocation()       // 当前位置信息

  return (
    <div>
      <h1>用户 {id}</h1>
      <p>当前路径：{location.pathname}</p>
      <button onClick={() => navigate('/users')}>返回用户列表</button>
      <button onClick={() => navigate(-1)}>后退</button>
    </div>
  )
}`

function RouterPage() {
  const [currentPath, setCurrentPath] = useState('/')

  return (
    <div className="rl-page">
      <h1>11. React Router</h1>
      <p className="rl-subtitle">单页应用的路由管理 —— 让 React 应用拥有多页面体验</p>

      <SectionPath />

      <div className="rl-section concept" id="section-concept">
        <div className="rl-section-header">
          <span className="rl-icon">💡</span> 理解概念 — What & Why
        </div>
        <div className="rl-section-body">
          <h3>什么是路由？</h3>
          <p>
            在传统网站中，不同 URL 对应不同 HTML 页面。而在单页应用（SPA）中，只有一个 HTML，通过{' '}
            <strong>React Router</strong> 根据 URL 渲染不同组件，实现"多页面"体验。
          </p>
          <div className="rl-concept-cards">
            <div className="rl-concept-card">
              <div className="rl-card-title">🧭 BrowserRouter</div>
              <div className="rl-card-desc">路由容器，使用 History API 管理 URL</div>
            </div>
            <div className="rl-concept-card">
              <div className="rl-card-title">📍 Routes + Route</div>
              <div className="rl-card-desc">路由规则配置，匹配 URL 并渲染组件</div>
            </div>
            <div className="rl-concept-card">
              <div className="rl-card-title">🔗 Link / NavLink</div>
              <div className="rl-card-desc">导航链接，不刷新页面切换路由</div>
            </div>
          </div>
        </div>
      </div>

      <div className="rl-section usage" id="section-usage">
        <div className="rl-section-header">
          <span className="rl-icon">⚙️</span> 掌握用法 — How
        </div>
        <div className="rl-section-body">
          <h3>基本路由配置</h3>
          <CodeBlock code={routerBasicCode} language="jsx" title="路由基本配置" />
          <h3>路由 Hooks</h3>
          <CodeBlock
            code={routerHooksCode}
            language="jsx"
            title="useParams / useNavigate / useLocation"
          />
          <h3>路由类型</h3>
          <table className="rl-compare-table">
            <thead>
              <tr>
                <th>类型</th>
                <th>路径</th>
                <th>说明</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>静态路由</strong>
                </td>
                <td>/about</td>
                <td>固定路径</td>
              </tr>
              <tr>
                <td>
                  <strong>动态路由</strong>
                </td>
                <td>/users/:id</td>
                <td>包含参数</td>
              </tr>
              <tr>
                <td>
                  <strong>嵌套路由</strong>
                </td>
                <td>/dashboard/*</td>
                <td>路由嵌套</td>
              </tr>
              <tr>
                <td>
                  <strong>通配路由</strong>
                </td>
                <td>*</td>
                <td>404 页面</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="rl-section practice" id="section-practice">
        <div className="rl-section-header">
          <span className="rl-icon">🛠️</span> 动手实践 — Do
        </div>
        <div className="rl-section-body">
          <h3>试一试：模拟路由切换</h3>
          <div className="rl-demo-box">
            <div className="rl-demo-title">Interactive Demo - 路由模拟</div>
            <div style={{ display: 'flex', gap: 8 }}>
              {['/', '/about', '/users/42'].map((path) => (
                <button
                  key={path}
                  onClick={() => setCurrentPath(path)}
                  style={{ fontWeight: currentPath === path ? 'bold' : 'normal' }}
                >
                  {path}
                </button>
              ))}
            </div>
            <div className="rl-demo-result">
              {currentPath === '/' && <p>🏠 这是首页组件</p>}
              {currentPath === '/about' && <p>📖 这是关于页面</p>}
              {currentPath === '/users/42' && <p>👤 用户详情页，ID = 42（来自 useParams）</p>}
            </div>
          </div>
          <h3>推荐练习</h3>
          <ul className="rl-exercises">
            <li>
              <span className="rl-ex-num">1</span>
              <div className="rl-ex-content">
                <div className="rl-ex-title">多页面应用</div>
                <div className="rl-ex-desc">配置首页、关于、联系三个页面路由</div>
              </div>
            </li>
            <li>
              <span className="rl-ex-num">2</span>
              <div className="rl-ex-content">
                <div className="rl-ex-title">动态路由</div>
                <div className="rl-ex-desc">实现用户列表 → 用户详情的动态路由跳转</div>
              </div>
            </li>
            <li>
              <span className="rl-ex-num">3</span>
              <div className="rl-ex-content">
                <div className="rl-ex-title">路由守卫</div>
                <div className="rl-ex-desc">实现需要登录才能访问的保护路由</div>
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
                <summary>React Router v6 和 v5 的主要区别？</summary>
                <div className="rl-answer">
                  <p>
                    ① <code>&lt;Switch&gt;</code> 改为 <code>&lt;Routes&gt;</code>
                    ，支持相对路由和嵌套路由；② <code>
                      &lt;Route component=&#123;X&#125;&gt;
                    </code>{' '}
                    改为 <code>&lt;Route element=&#123;&lt;X /&gt;&#125;&gt;</code>；③ 用{' '}
                    <code>useNavigate</code> 替代 <code>useHistory</code>；④ 移除了{' '}
                    <code>withRouter</code> HOC；⑤ 支持数据加载器（loader / action）。
                  </p>
                </div>
              </details>
            </li>
            <li>
              <details>
                <summary>HashRouter vs BrowserRouter，什么时候用哪个？</summary>
                <div className="rl-answer">
                  <p>
                    <strong>BrowserRouter</strong>：URL 形如 <code>/about</code>，更美观、更符合
                    SEO。需要服务器配置将所有请求指向 index.html，否则会 404。
                  </p>
                  <p>
                    <strong>HashRouter</strong>：URL 形如 <code>/#/about</code>
                    ，不需要服务器配置，适合静态部署（如 GitHub Pages）。缺点是对 SEO 不友好、URL
                    不美观。
                  </p>
                  <p>原则：有服务器控制权用 BrowserRouter，纯静态部署用 HashRouter。</p>
                </div>
              </details>
            </li>
            <li>
              <details>
                <summary>如何实现路由懒加载？</summary>
                <div className="rl-answer">
                  <p>
                    使用 <code>React.lazy</code> + <code>Suspense</code>：
                    <code>const Home = lazy(() =&gt; import('./Home'));</code> 然后在 Routes 中用{' '}
                    <code>
                      &lt;Suspense fallback=&#123;&lt;Loading /&gt;&#125;&gt;&lt;Route
                      element=&#123;&lt;Home /&gt;&#125; /&gt;&lt;/Suspense&gt;
                    </code>
                    。
                  </p>
                  <p>
                    这样每个路由对应的组件会在首次访问时才下载，减小初始 JS 包体积。配合 Vite /
                    Webpack 的代码分割，每个路由会自动生成单独的 chunk 文件。
                  </p>
                </div>
              </details>
            </li>
          </ul>
          <h3>推荐资源</h3>
          <div className="rl-resources">
            <a
              className="rl-resource"
              href="https://reactrouter.com/en/main/start/tutorial"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="rl-res-icon">📖</span> React Router Tutorial
            </a>
          </div>
        </div>
      </div>
      <PageNav currentPath="/react-learning/router" />
    </div>
  )
}

export default RouterPage
