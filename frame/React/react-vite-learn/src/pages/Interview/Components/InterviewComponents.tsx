import { useState } from 'react'
import PageNav from '@/components/PageNav/PageNav'
import { interviewPages } from '../interviewPages'
import '../interview.css'

function InterviewComponents() {
  const [filter, setFilter] = useState<'all' | 'easy' | 'medium' | 'hard'>('all')

  const qas = [
    {
      id: 1,
      level: 'easy' as const,
      question: 'React 组件间有哪些通信方式？',
      answer: (
        <>
          <table className="iv-table">
            <thead>
              <tr>
                <th>方向</th>
                <th>方式</th>
                <th>说明</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>父 → 子</td>
                <td>Props</td>
                <td>最常用，传递数据或回调函数</td>
              </tr>
              <tr>
                <td>子 → 父</td>
                <td>回调函数 Props</td>
                <td>父组件传函数给子组件调用</td>
              </tr>
              <tr>
                <td>跨层级</td>
                <td>Context API</td>
                <td>无需逐层传递 props</td>
              </tr>
              <tr>
                <td>兄弟组件</td>
                <td>状态提升 / Redux / Zustand</td>
                <td>将共享状态放到共同父组件或全局 store</td>
              </tr>
              <tr>
                <td>任意组件</td>
                <td>Redux / Zustand / 发布订阅</td>
                <td>全局状态管理或事件总线</td>
              </tr>
            </tbody>
          </table>
        </>
      ),
    },
    {
      id: 2,
      level: 'easy' as const,
      question: '什么是受控组件和非受控组件？',
      answer: (
        <>
          <table className="iv-table">
            <thead>
              <tr>
                <th>特性</th>
                <th>受控组件</th>
                <th>非受控组件</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>数据源</td>
                <td>React state</td>
                <td>DOM 自身</td>
              </tr>
              <tr>
                <td>获取值</td>
                <td>
                  <code>{'value={state}'}</code>
                </td>
                <td>
                  <code>ref.current.value</code>
                </td>
              </tr>
              <tr>
                <td>实时验证</td>
                <td>容易实现</td>
                <td>较难</td>
              </tr>
              <tr>
                <td>代码量</td>
                <td>较多</td>
                <td>较少</td>
              </tr>
            </tbody>
          </table>
          <pre>{`// 受控组件
const [val, setVal] = useState('')
<input value={val} onChange={e => setVal(e.target.value)} />

// 非受控组件
const inputRef = useRef<HTMLInputElement>(null)
<input ref={inputRef} defaultValue="" />
// 提交时：inputRef.current?.value`}</pre>
        </>
      ),
    },
    {
      id: 3,
      level: 'medium' as const,
      question: '什么是高阶组件（HOC）？和 Hooks 相比有什么优劣？',
      answer: (
        <>
          <p>
            高阶组件（Higher-Order Component）是<strong>接收组件并返回新组件</strong>
            的函数，用于逻辑复用。
          </p>
          <pre>{`// HOC 示例：注入 user prop
function withAuth(WrappedComponent) {
  return function AuthenticatedComponent(props) {
    const user = useAuth()
    if (!user) return <Login />
    return <WrappedComponent {...props} user={user} />
  }
}`}</pre>
          <table className="iv-table">
            <thead>
              <tr>
                <th>特性</th>
                <th>HOC</th>
                <th>Hooks</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>代码可读性</td>
                <td>嵌套深时难读（Wrapper Hell）</td>
                <td>扁平，更清晰</td>
              </tr>
              <tr>
                <td>Props 来源</td>
                <td>不明确（隐式注入）</td>
                <td>明确可见</td>
              </tr>
              <tr>
                <td>TypeScript 支持</td>
                <td>类型推导复杂</td>
                <td>类型推导好</td>
              </tr>
              <tr>
                <td>使用场景</td>
                <td>类组件复用逻辑</td>
                <td>函数组件复用逻辑</td>
              </tr>
            </tbody>
          </table>
          <div className="iv-key-point">
            <strong>现状：</strong>Hooks 出现后，HOC 的使用大幅减少。但在需要包裹组件（如 Error
            Boundary）时仍需使用。
          </div>
        </>
      ),
    },
    {
      id: 4,
      level: 'medium' as const,
      question: '什么是 Render Props 模式？',
      answer: (
        <>
          <p>
            Render Props 是<strong>通过 prop 传递渲染函数</strong>来复用逻辑的模式。
          </p>
          <pre>{`// Render Props 示例
function MouseTracker({ render }) {
  const [pos, setPos] = useState({ x: 0, y: 0 })

  return (
    <div onMouseMove={e => setPos({ x: e.clientX, y: e.clientY })}>
      {render(pos)}
    </div>
  )
}

// 使用
<MouseTracker render={({ x, y }) => <div>鼠标位置: {x}, {y}</div>} />`}</pre>
          <p>
            与 HOC 相比，Render Props 让数据来源更清晰，但嵌套过多时也会出现"回调地狱"。Hooks
            是目前推荐的替代方案。
          </p>
        </>
      ),
    },
    {
      id: 5,
      level: 'medium' as const,
      question: '什么是 Error Boundary（错误边界）？如何实现？',
      answer: (
        <>
          <p>
            Error Boundary 是<strong>捕获子组件树中 JavaScript 错误</strong>的 React
            组件，可以展示降级 UI，避免整个应用崩溃。
          </p>
          <pre>{`class ErrorBoundary extends React.Component {
  state = { hasError: false }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    logErrorToService(error, errorInfo)  // 上报错误
  }

  render() {
    if (this.state.hasError) {
      return <h1>出错了，请稍后再试</h1>
    }
    return this.props.children
  }
}`}</pre>
          <p>Error Boundary 能捕获的错误：</p>
          <ul>
            <li>渲染过程中的错误</li>
            <li>生命周期方法中的错误</li>
            <li>子组件树中的错误</li>
          </ul>
          <p>不能捕获的错误：</p>
          <ul>
            <li>事件处理函数中的错误（用 try/catch）</li>
            <li>异步代码（setTimeout、Promise）</li>
            <li>SSR 中的错误</li>
            <li>Error Boundary 自身的错误</li>
          </ul>
          <div className="iv-key-point">
            <strong>注意：</strong>目前只能用<strong>类组件</strong>实现 Error Boundary（需要
            getDerivedStateFromError 或 componentDidCatch）。可用
            <code>react-error-boundary</code> 库简化使用。
          </div>
        </>
      ),
    },
    {
      id: 6,
      level: 'hard' as const,
      question: '什么是 React 的 Portal？什么场景下使用？',
      answer: (
        <>
          <p>
            <code>ReactDOM.createPortal</code> 可以将子节点渲染到 DOM 树之外的节点，同时保持 React
            事件冒泡和 Context 不变。
          </p>
          <pre>{`import { createPortal } from 'react-dom'

function Modal({ children, onClose }) {
  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    document.body  // 渲染到 body 下，脱离组件层级
  )
}`}</pre>
          <p>典型使用场景：</p>
          <ul>
            <li>
              <strong>模态框（Modal）：</strong>避免 overflow:hidden 截断
            </li>
            <li>
              <strong>Tooltip / Popover：</strong>需要脱离父容器定位
            </li>
            <li>
              <strong>全局通知：</strong>渲染到页面固定位置
            </li>
          </ul>
        </>
      ),
    },
    {
      id: 7,
      level: 'hard' as const,
      question: 'React.forwardRef 是什么？什么时候使用？',
      answer: (
        <>
          <p>
            默认情况下，<code>ref</code> 不能作为 prop 传递给子组件（和 key 一样被 React
            特殊处理）。<code>forwardRef</code> 允许组件将 ref 转发给内部的 DOM 节点。
          </p>
          <pre>{`// 使用 forwardRef 暴露内部 input
const FancyInput = forwardRef<HTMLInputElement, Props>((props, ref) => {
  return <input ref={ref} className="fancy" {...props} />
})

// 父组件可以直接操作子组件内部的 input
const inputRef = useRef<HTMLInputElement>(null)
<FancyInput ref={inputRef} placeholder="Type here" />
// inputRef.current?.focus()  // 生效！`}</pre>
          <p>使用场景：</p>
          <ul>
            <li>封装 UI 组件库时，暴露内部 DOM 给使用者</li>
            <li>高阶组件中需要转发 ref 给被包裹组件</li>
            <li>需要父组件直接操作子组件中的某个 DOM 节点</li>
          </ul>
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
      <h1>3. 组件与通信面试题</h1>
      <p className="iv-subtitle">组件通信、设计模式、错误边界、Ref 转发等高频考点</p>

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

      <PageNav currentPath="/interview/components" pages={interviewPages} />
    </div>
  )
}

export default InterviewComponents
