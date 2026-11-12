import { useState } from 'react'
import CodeBlock from '@/components/CodeBlock/CodeBlock'
import SectionPath from '@/components/SectionPath/SectionPath'
import PageNav from '@/components/PageNav/PageNav'
import '../shared.css'

const hocCode = `// 高阶组件（HOC）
function withAuth(WrappedComponent) {
  return function AuthenticatedComponent(props) {
    const { user } = useAuth()
    if (!user) return <LoginPage />
    return <WrappedComponent {...props} user={user} />
  }
}

// 使用
const ProtectedDashboard = withAuth(Dashboard)`

const compoundCode = `// 复合组件模式
function Tabs({ children, defaultTab }) {
  const [active, setActive] = useState(defaultTab)
  return (
    <TabsContext.Provider value={{ active, setActive }}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  )
}
Tabs.List = function TabList({ children }) {
  return <div className="tab-list">{children}</div>
}
Tabs.Tab = function Tab({ id, children }) {
  const { active, setActive } = useContext(TabsContext)
  return <button className={active === id ? 'active' : ''} onClick={() => setActive(id)}>{children}</button>
}
Tabs.Panel = function TabPanel({ id, children }) {
  const { active } = useContext(TabsContext)
  return active === id ? <div className="tab-panel">{children}</div> : null
}

// 使用
<Tabs defaultTab="home">
  <Tabs.List>
    <Tabs.Tab id="home">首页</Tabs.Tab>
    <Tabs.Tab id="about">关于</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel id="home">首页内容</Tabs.Panel>
  <Tabs.Panel id="about">关于内容</Tabs.Panel>
</Tabs>`

const portalCode = `// Portals —— 将内容渲染到 DOM 其他位置
import { createPortal } from 'react-dom'

function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null
  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {children}
        <button onClick={onClose}>关闭</button>
      </div>
    </div>,
    document.body // 渲染到 body，而非当前组件位置
  )
}`

function AdvancedPatterns() {
  const [activeTab, setActiveTab] = useState('tab1')

  return (
    <div className="rl-page">
      <h1>16. 高级模式</h1>
      <p className="rl-subtitle">React 高级设计模式 —— HOC、Render Props、复合组件等</p>
      <SectionPath />
      <div className="rl-section concept" id="section-concept">
        <div className="rl-section-header">
          <span className="rl-icon">💡</span> 理解概念 — What & Why
        </div>
        <div className="rl-section-body">
          <h3>为什么需要设计模式？</h3>
          <p>
            随着应用复杂度增加，组件间的逻辑复用成为挑战。React
            提供了多种模式来解决这个问题，每种模式有各自的适用场景。
          </p>
          <div className="rl-concept-cards">
            <div className="rl-concept-card">
              <div className="rl-card-title">🎩 HOC</div>
              <div className="rl-card-desc">
                高阶组件，接收组件返回增强组件。适合横切关注点（认证、日志等）
              </div>
            </div>
            <div className="rl-concept-card">
              <div className="rl-card-title">🧩 复合组件</div>
              <div className="rl-card-desc">
                多个组件协同工作，共享隐式状态。如 Tabs、Select、Accordion
              </div>
            </div>
            <div className="rl-concept-card">
              <div className="rl-card-title">🚪 Portals</div>
              <div className="rl-card-desc">
                将内容渲染到 DOM 树之外。适合模态框、Tooltip、Toast
              </div>
            </div>
            <div className="rl-concept-card">
              <div className="rl-card-title">🛡️ Error Boundaries</div>
              <div className="rl-card-desc">捕获子组件树中的错误，显示降级 UI</div>
            </div>
          </div>
        </div>
      </div>
      <div className="rl-section usage" id="section-usage">
        <div className="rl-section-header">
          <span className="rl-icon">⚙️</span> 掌握用法 — How
        </div>
        <div className="rl-section-body">
          <h3>高阶组件（HOC）</h3>
          <CodeBlock code={hocCode} language="jsx" title="HOC 认证包装" />
          <h3>复合组件</h3>
          <CodeBlock code={compoundCode} language="jsx" title="Tabs 复合组件模式" />
          <h3>Portals</h3>
          <CodeBlock code={portalCode} language="jsx" title="Portal 模态框" />
        </div>
      </div>
      <div className="rl-section practice" id="section-practice">
        <div className="rl-section-header">
          <span className="rl-icon">🛠️</span> 动手实践 — Do
        </div>
        <div className="rl-section-body">
          <h3>试一试：简易 Tab 切换</h3>
          <div className="rl-demo-box">
            <div className="rl-demo-title">Interactive Demo - 复合组件 Tab</div>
            <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
              {['tab1', 'tab2', 'tab3'].map((id) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  style={{
                    fontWeight: activeTab === id ? 'bold' : 'normal',
                    background: activeTab === id ? '#1890ff' : '#fff',
                    color: activeTab === id ? '#fff' : '#333',
                  }}
                >
                  Tab {id.slice(-1)}
                </button>
              ))}
            </div>
            <div className="rl-demo-result">
              {activeTab === 'tab1' && (
                <p>📄 Tab 1 的内容 — 复合组件通过 Context 共享 activeTab 状态</p>
              )}
              {activeTab === 'tab2' && <p>📊 Tab 2 的内容 — 每个 Panel 根据 id 决定是否渲染</p>}
              {activeTab === 'tab3' && <p>⚙️ Tab 3 的内容 — 类似 Ant Design 的 Tabs 组件原理</p>}
            </div>
          </div>
          <h3>推荐练习</h3>
          <ul className="rl-exercises">
            <li>
              <span className="rl-ex-num">1</span>
              <div className="rl-ex-content">
                <div className="rl-ex-title">实现 withLoading HOC</div>
                <div className="rl-ex-desc">自动处理组件的 loading 状态</div>
              </div>
            </li>
            <li>
              <span className="rl-ex-num">2</span>
              <div className="rl-ex-content">
                <div className="rl-ex-title">实现 Accordion 复合组件</div>
                <div className="rl-ex-desc">可折叠面板组件</div>
              </div>
            </li>
            <li>
              <span className="rl-ex-num">3</span>
              <div className="rl-ex-content">
                <div className="rl-ex-title">Error Boundary</div>
                <div className="rl-ex-desc">实现一个捕获错误并显示友好提示的组件</div>
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
          <h3>模式演进</h3>
          <table className="rl-compare-table">
            <thead>
              <tr>
                <th>模式</th>
                <th>时代</th>
                <th>现状</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>HOC</strong>
                </td>
                <td>React 早期</td>
                <td>仍有用，但 Hooks 更灵活</td>
              </tr>
              <tr>
                <td>
                  <strong>Render Props</strong>
                </td>
                <td>HOC 之后</td>
                <td>大多被 Hooks 取代</td>
              </tr>
              <tr>
                <td>
                  <strong>复合组件</strong>
                </td>
                <td>现在</td>
                <td>UI 库的首选模式</td>
              </tr>
              <tr>
                <td>
                  <strong>Custom Hooks</strong>
                </td>
                <td>React 16.8+</td>
                <td>逻辑复用的最佳选择</td>
              </tr>
            </tbody>
          </table>

          <h3>延伸思考</h3>
          <ul className="rl-think-list">
            <li>
              <details>
                <summary>HOC 为什么被 Hooks 取代？它还有什么用？</summary>
                <div className="rl-answer">
                  <p>
                    HOC 的问题：① Props 来源不透明（被包裹后不知道额外 Props 从哪来）；②
                    嵌套层级深时调试困难；③ TypeScript 类型推导复杂。
                  </p>
                  <p>
                    Hooks 的优势：逻辑复用不改变组件层级，Props 清晰透明，TypeScript 友好。但 HOC
                    在类组件中仍有用，某些场景（如错误边界 ErrorBoundary）目前只能用类组件实现。
                  </p>
                </div>
              </details>
            </li>
            <li>
              <details>
                <summary>复合组件模式是什么？为什么 UI 库都喜欢用？</summary>
                <div className="rl-answer">
                  <p>
                    复合组件（Compound Components）是指一组协同工作的组件，通过 Context
                    共享内部状态。如{' '}
                    <code>
                      &lt;Select&gt;&lt;Option value="a"&gt;A&lt;/Option&gt;&lt;/Select&gt;
                    </code>
                    。
                  </p>
                  <p>
                    优势：① 使用者可以灵活组合子组件；② 内部状态自动共享，无需手动传递 Props；③ 符合
                    HTML 原生语义（如 <code>&lt;select&gt;</code> 和 <code>&lt;option&gt;</code>{' '}
                    的关系）。Headless UI、Radix UI 等库都广泛采用这种模式。
                  </p>
                </div>
              </details>
            </li>
            <li>
              <details>
                <summary>createPortal 有什么用途？</summary>
                <div className="rl-answer">
                  <p>
                    <code>createPortal</code> 可以将组件渲染到 DOM
                    树的其他位置，而不是当前父组件内。
                  </p>
                  <p>
                    典型场景：① <strong>Modal / Dialog</strong> —— 渲染到 body 下，避免 z-index 和
                    overflow 问题；② <strong>Tooltip / Popover</strong> ——
                    渲染到顶层避免被父容器截断；③ <strong>全局通知</strong> ——
                    渲染到专门的容器节点。
                  </p>
                  <p>
                    注意：虽然 DOM 位置变了，但 React 的事件冒泡仍然按组件树进行，而不是 DOM 树。
                  </p>
                </div>
              </details>
            </li>
          </ul>

          <h3>推荐资源</h3>
          <div className="rl-resources">
            <a
              className="rl-resource"
              href="https://react.dev/reference/react/createPortal"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="rl-res-icon">📖</span> createPortal
            </a>
          </div>
        </div>
      </div>
      <PageNav currentPath="/react-learning/advanced-patterns" />
    </div>
  )
}

export default AdvancedPatterns
