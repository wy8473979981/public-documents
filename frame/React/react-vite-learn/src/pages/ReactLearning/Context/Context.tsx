import { useState } from 'react'
import CodeBlock from '@/components/CodeBlock/CodeBlock'
import SectionPath from '@/components/SectionPath/SectionPath'
import PageNav from '@/components/PageNav/PageNav'
import '../shared.css'

const contextBasicCode = `// 创建 Context
import { createContext, useContext } from 'react'

const ThemeContext = createContext('light')

// Provider 提供数据
function App() {
  const [theme, setTheme] = useState('light')
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <Toolbar />
    </ThemeContext.Provider>
  )
}

// 任意深层组件消费数据
function ThemedButton() {
  const { theme, setTheme } = useContext(ThemeContext)
  return (
    <button
      onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
      style={{ background: theme === 'dark' ? '#333' : '#fff' }}
    >
      当前主题：{theme}
    </button>
  )
}`

const propDrillingCode = `// ❌ Prop Drilling 问题
function App() {
  const [user, setUser] = useState({ name: '小明' })
  return <Layout user={user} />
}
function Layout({ user }) {
  return <Sidebar user={user} />
}
function Sidebar({ user }) {
  return <UserMenu user={user} /> // 中间层只是透传
}
function UserMenu({ user }) {
  return <p>你好，{user.name}</p>
}

// ✅ 使用 Context 解决
const UserContext = createContext()
function App() {
  const [user, setUser] = useState({ name: '小明' })
  return (
    <UserContext.Provider value={user}>
      <Layout /> {/* 不需要传 user */}
    </UserContext.Provider>
  )
}
function UserMenu() {
  const user = useContext(UserContext) // 直接获取
  return <p>你好，{user.name}</p>
}`

function Context() {
  const [theme, setTheme] = useState('light')

  return (
    <div className="rl-page">
      <h1>9. Context API</h1>
      <p className="rl-subtitle">跨组件共享数据的利器 —— 解决 Prop Drilling 的优雅方案</p>

      <SectionPath />

      <div className="rl-section concept" id="section-concept">
        <div className="rl-section-header">
          <span className="rl-icon">💡</span> 理解概念 — What & Why
        </div>
        <div className="rl-section-body">
          <h3>Context 解决了什么问题？</h3>
          <p>
            在组件树中，数据通常通过 Props 从父传到子。但如果很多层组件都需要同一数据，
            就得一层层"透传" Props，这就是 <strong>Prop Drilling</strong>（属性钻洞）。 Context
            让你跳过中间层，让任意深层组件直接获取数据。
          </p>

          <h3>Context 的三个角色</h3>
          <div className="rl-concept-cards">
            <div className="rl-concept-card">
              <div className="rl-card-title">1️⃣ createContext</div>
              <div className="rl-card-desc">创建 Context 对象，设置默认值</div>
            </div>
            <div className="rl-concept-card">
              <div className="rl-card-title">2️⃣ Provider</div>
              <div className="rl-card-desc">在组件树中"广播"数据，所有子组件都可访问</div>
            </div>
            <div className="rl-concept-card">
              <div className="rl-card-title">3️⃣ useContext</div>
              <div className="rl-card-desc">在消费组件中获取 Provider 提供的数据</div>
            </div>
          </div>

          <h3>适合使用 Context 的场景</h3>
          <ul>
            <li>
              🎨 <strong>主题切换</strong> —— 全局亮/暗色
            </li>
            <li>
              🔐 <strong>用户认证</strong> —— 登录状态全局共享
            </li>
            <li>
              🌐 <strong>国际化</strong> —— 当前语言/区域
            </li>
            <li>
              📊 <strong>全局状态</strong> —— 简单场景下的全局数据
            </li>
          </ul>
        </div>
      </div>

      <div className="rl-section usage" id="section-usage">
        <div className="rl-section-header">
          <span className="rl-icon">⚙️</span> 掌握用法 — How
        </div>
        <div className="rl-section-body">
          <h3>基本用法</h3>
          <CodeBlock code={contextBasicCode} language="jsx" title="Context 完整用法" />

          <h3>解决 Prop Drilling</h3>
          <CodeBlock code={propDrillingCode} language="jsx" title="Prop Drilling vs Context" />

          <div className="rl-tip warning">
            ⚠️ 不要滥用 Context！高频更新的数据（如动画状态）不适合用
            Context，会导致大量组件重渲染。
          </div>
        </div>
      </div>

      <div className="rl-section practice" id="section-practice">
        <div className="rl-section-header">
          <span className="rl-icon">🛠️</span> 动手实践 — Do
        </div>
        <div className="rl-section-body">
          <h3>试一试：主题切换</h3>
          <div className="rl-demo-box">
            <div className="rl-demo-title">Interactive Demo - 主题切换</div>
            <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>切换主题</button>
            <div
              className="rl-demo-result"
              style={{
                background: theme === 'dark' ? '#1a1a2e' : '#fff',
                color: theme === 'dark' ? '#eee' : '#333',
                padding: 16,
                borderRadius: 8,
                marginTop: 8,
              }}
            >
              <p>
                当前主题：<strong>{theme}</strong>
              </p>
              <p>在实际项目中，这个主题值会通过 Context 传递给所有子组件。</p>
            </div>
          </div>

          <h3>推荐练习</h3>
          <ul className="rl-exercises">
            <li>
              <span className="rl-ex-num">1</span>
              <div className="rl-ex-content">
                <div className="rl-ex-title">全局主题</div>
                <div className="rl-ex-desc">创建 ThemeContext，在任意深层组件中切换主题</div>
              </div>
            </li>
            <li>
              <span className="rl-ex-num">2</span>
              <div className="rl-ex-content">
                <div className="rl-ex-title">用户登录状态</div>
                <div className="rl-ex-desc">创建 AuthContext 管理登录/登出状态</div>
              </div>
            </li>
            <li>
              <span className="rl-ex-num">3</span>
              <div className="rl-ex-content">
                <div className="rl-ex-title">多语言切换</div>
                <div className="rl-ex-desc">创建 I18nContext 实现中英文切换</div>
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
          <h3>Context vs Redux vs Zustand</h3>
          <table className="rl-compare-table">
            <thead>
              <tr>
                <th>特性</th>
                <th>Context</th>
                <th>Redux</th>
                <th>Zustand</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>复杂度</strong>
                </td>
                <td>低</td>
                <td>高</td>
                <td>中</td>
              </tr>
              <tr>
                <td>
                  <strong>性能</strong>
                </td>
                <td>更新触发全部消费组件</td>
                <td>精确更新</td>
                <td>精确更新</td>
              </tr>
              <tr>
                <td>
                  <strong>DevTools</strong>
                </td>
                <td>无</td>
                <td>强大</td>
                <td>有</td>
              </tr>
              <tr>
                <td>
                  <strong>适合场景</strong>
                </td>
                <td>低频全局数据</td>
                <td>复杂状态逻辑</td>
                <td>中等复杂度</td>
              </tr>
            </tbody>
          </table>

          <h3>延伸思考</h3>
          <ul className="rl-think-list">
            <li>
              <details>
                <summary>Context 的性能问题是什么？如何优化？</summary>
                <div className="rl-answer">
                  <p>
                    Context 的默认行为是：当 value 变化时，<strong>所有</strong>消费该 Context
                    的组件都会重新渲染，即使它们只用了 value 中的某个字段。
                  </p>
                  <p>
                    优化方案：① 将 Context 拆分为多个小 Context（如 ThemeContext 和 UserContext
                    分开）；② 用 <code>useMemo</code> 包裹 value 避免每次渲染创建新对象；③
                    在消费组件内部用 <code>useMemo</code> 或 <code>React.memo</code>{' '}
                    减少不必要的渲染。
                  </p>
                </div>
              </details>
            </li>
            <li>
              <details>
                <summary>Context 适合什么场景？不适合什么场景？</summary>
                <div className="rl-answer">
                  <p>
                    <strong>适合</strong>
                    ：低频变化的全局数据（主题、语言、用户登录状态、配置信息），避免层层传递 Props。
                  </p>
                  <p>
                    <strong>不适合</strong>
                    ：高频变化的状态（如表单输入、动画状态），因为每次变化会导致所有消费组件重新渲染。这类场景应该用
                    Zustand、Redux 等支持精确更新的状态管理库。
                  </p>
                </div>
              </details>
            </li>
            <li>
              <details>
                <summary>Context 和全局变量有什么区别？</summary>
                <div className="rl-answer">
                  <p>
                    全局变量（如 <code>window.xxx</code>）变化时 React
                    不会知道，不会触发重渲染。Context 变化时 React 会自动通知所有消费组件更新。
                  </p>
                  <p>
                    另外，Context 支持 React 的组件化思想，可以在测试中方便地
                    mock，支持多实例（如不同区域用不同的 Theme），而全局变量做不到这些。
                  </p>
                </div>
              </details>
            </li>
          </ul>

          <h3>推荐资源</h3>
          <div className="rl-resources">
            <a
              className="rl-resource"
              href="https://react.dev/learn/passing-data-deeply-with-context"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="rl-res-icon">📖</span> Passing Data Deeply with Context
            </a>
          </div>
        </div>
      </div>
      <PageNav currentPath="/react-learning/context" />
    </div>
  )
}

export default Context
