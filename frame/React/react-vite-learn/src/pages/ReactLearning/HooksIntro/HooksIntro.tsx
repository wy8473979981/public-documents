import { useState } from 'react'
import CodeBlock from '@/components/CodeBlock/CodeBlock'
import SectionPath from '@/components/SectionPath/SectionPath'
import PageNav from '@/components/PageNav/PageNav'
import '../shared.css'

const hookBasicCode = `// Hook 的基本概念
import { useState, useEffect } from 'react'

function Timer() {
  // useState —— 添加状态
  const [seconds, setSeconds] = useState(0)

  // useEffect —— 添加副作用
  useEffect(() => {
    const id = setInterval(() => {
      setSeconds(prev => prev + 1)
    }, 1000)
    return () => clearInterval(id) // 清理
  }, []) // 空依赖 = 只执行一次

  return <p>已运行 {seconds} 秒</p>
}`

const hooksRulesCode = `// ❌ 错误：在条件中调用 Hook
function Bad() {
  if (someCondition) {
    const [value, setValue] = useState('') // 错误！
  }
}

// ✅ 正确：在顶层调用 Hook
function Good() {
  const [value, setValue] = useState('')

  if (someCondition) {
    // 在条件中使用 state，而非 Hook 本身
    return <p>{value}</p>
  }
  return <input value={value} onChange={e => setValue(e.target.value)} />
}`

const useStateCode = `// useState 详解
function TodoApp() {
  const [todos, setTodos] = useState([])
  const [input, setInput] = useState('')

  const addTodo = () => {
    if (!input.trim()) return
    setTodos(prev => [...prev, { text: input, done: false }])
    setInput('')
  }

  const toggleTodo = (index) => {
    setTodos(prev =>
      prev.map((todo, i) =>
        i === index ? { ...todo, done: !todo.done } : todo
      )
    )
  }

  return (
    <div>
      <input value={input} onChange={e => setInput(e.target.value)} />
      <button onClick={addTodo}>添加</button>
      {todos.map((todo, i) => (
        <p key={i} onClick={() => toggleTodo(i)}>
          {todo.done ? '✅' : '⬜'} {todo.text}
        </p>
      ))}
    </div>
  )
}`

function HooksIntro() {
  const [name, setName] = useState('')
  const [count, setCount] = useState(0)

  return (
    <div className="rl-page">
      <h1>6. Hooks 入门</h1>
      <p className="rl-subtitle">
        Hooks 让函数组件拥有了使用状态和副作用的能力，是 React 最重要的特性
      </p>

      <SectionPath />

      {/* 概念 */}
      <div className="rl-section concept" id="section-concept">
        <div className="rl-section-header">
          <span className="rl-icon">💡</span> 理解概念 — What & Why
        </div>
        <div className="rl-section-body">
          <h3>Hooks 是什么？</h3>
          <p>
            Hooks 是 React 16.8 引入的特性，允许你在<strong>函数组件</strong>中使用状态、生命周期等
            React 功能。 它解决了类组件中逻辑复用困难、代码复杂等问题。
          </p>

          <h3>为什么需要 Hooks？</h3>
          <div className="rl-concept-cards">
            <div className="rl-concept-card">
              <div className="rl-card-title">🔀 逻辑复用难</div>
              <div className="rl-card-desc">
                类组件中复用逻辑需要 HOC 或 Render Props，导致"包装地狱"。Hooks 让逻辑提取变得简单。
              </div>
            </div>
            <div className="rl-concept-card">
              <div className="rl-card-title">📦 复杂组件</div>
              <div className="rl-card-desc">
                类组件的 componentDidMount 中混杂不相关逻辑。Hooks 可以按功能拆分逻辑。
              </div>
            </div>
            <div className="rl-concept-card">
              <div className="rl-card-title">🤯 this 困扰</div>
              <div className="rl-card-desc">
                类组件中 this 指向令人困惑。函数组件没有 this，代码更直观。
              </div>
            </div>
          </div>

          <h3>常用 Hooks 速览</h3>
          <table className="rl-compare-table">
            <thead>
              <tr>
                <th>Hook</th>
                <th>用途</th>
                <th>使用频率</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>useState</strong>
                </td>
                <td>管理组件状态</td>
                <td>⭐⭐⭐⭐⭐</td>
              </tr>
              <tr>
                <td>
                  <strong>useEffect</strong>
                </td>
                <td>处理副作用（API调用、订阅等）</td>
                <td>⭐⭐⭐⭐⭐</td>
              </tr>
              <tr>
                <td>
                  <strong>useContext</strong>
                </td>
                <td>消费 Context 数据</td>
                <td>⭐⭐⭐⭐</td>
              </tr>
              <tr>
                <td>
                  <strong>useRef</strong>
                </td>
                <td>访问 DOM / 保存不触发渲染的值</td>
                <td>⭐⭐⭐⭐</td>
              </tr>
              <tr>
                <td>
                  <strong>useMemo</strong>
                </td>
                <td>缓存计算结果</td>
                <td>⭐⭐⭐</td>
              </tr>
              <tr>
                <td>
                  <strong>useCallback</strong>
                </td>
                <td>缓存回调函数</td>
                <td>⭐⭐⭐</td>
              </tr>
              <tr>
                <td>
                  <strong>useReducer</strong>
                </td>
                <td>复杂状态逻辑</td>
                <td>⭐⭐⭐</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 用法 */}
      <div className="rl-section usage" id="section-usage">
        <div className="rl-section-header">
          <span className="rl-icon">⚙️</span> 掌握用法 — How
        </div>
        <div className="rl-section-body">
          <h3>Hooks 基本用法</h3>
          <CodeBlock code={hookBasicCode} language="jsx" title="useState + useEffect 组合" />

          <h3>Hook 规则（必须遵守）</h3>
          <CodeBlock code={hooksRulesCode} language="jsx" title="Hook 调用规则" />

          <div className="rl-tip warning">
            ⚠️ 两条铁律：1. 只在顶层调用 Hook；2. 只在 React 函数组件或自定义 Hook
            中调用。违反规则会导致不可预测的 Bug。
          </div>

          <h3>useState 详解</h3>
          <CodeBlock code={useStateCode} language="jsx" title="useState 管理数组状态" />
        </div>
      </div>

      {/* 实践 */}
      <div className="rl-section practice" id="section-practice">
        <div className="rl-section-header">
          <span className="rl-icon">🛠️</span> 动手实践 — Do
        </div>
        <div className="rl-section-body">
          <h3>试一试：多个 useState</h3>
          <div className="rl-demo-box">
            <div className="rl-demo-title">Interactive Demo - 多状态管理</div>
            <div>
              <input
                placeholder="你的名字"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <button onClick={() => setCount(count + 1)}>点击 {count} 次</button>
            </div>
            <div className="rl-demo-result">
              <p>
                名字（State 1）：<strong>{name || '未输入'}</strong>
              </p>
              <p>
                计数（State 2）：<strong>{count}</strong>
              </p>
              <p>
                组合：
                <strong>
                  {name || '某人'}点击了 {count} 次
                </strong>
              </p>
            </div>
          </div>

          <h3>推荐练习</h3>
          <ul className="rl-exercises">
            <li>
              <span className="rl-ex-num">1</span>
              <div className="rl-ex-content">
                <div className="rl-ex-title">开关灯</div>
                <div className="rl-ex-desc">用 useState(boolean) 实现亮色/暗色主题切换</div>
              </div>
            </li>
            <li>
              <span className="rl-ex-num">2</span>
              <div className="rl-ex-content">
                <div className="rl-ex-title">秒表</div>
                <div className="rl-ex-desc">useState + useEffect + setInterval 实现一个计时器</div>
              </div>
            </li>
            <li>
              <span className="rl-ex-num">3</span>
              <div className="rl-ex-content">
                <div className="rl-ex-title">窗口大小监控</div>
                <div className="rl-ex-desc">
                  用 useState + useEffect 监听 window.resize 显示当前窗口尺寸
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* 扩展 */}
      <div className="rl-section connect" id="section-connect">
        <div className="rl-section-header">
          <span className="rl-icon">🔗</span> 反思与扩展 — Think & Connect
        </div>
        <div className="rl-section-body">
          <h3>延伸思考</h3>
          <ul className="rl-think-list">
            <li>
              <details>
                <summary>Hooks 底层是如何工作的？</summary>
                <div className="rl-answer">
                  <p>
                    React 内部用 <strong>链表</strong> 来保存每个组件的 Hook 状态。每个 Hook
                    调用对应链表中的一个节点，按调用顺序链接。
                  </p>
                  <p>
                    这就是为什么 Hook 不能放在条件语句或循环中 —— 如果某次渲染跳过了某个
                    Hook，后续所有 Hook 的对应关系都会错位，导致状态混乱。
                  </p>
                </div>
              </details>
            </li>
            <li>
              <details>
                <summary>为什么不能在条件语句中调用 Hook？</summary>
                <div className="rl-answer">
                  <p>
                    因为 React 依赖 Hook 的 <strong>调用顺序</strong>{' '}
                    来匹配对应的状态。每次渲染时，React 按顺序读取链表中的 Hook 节点。
                  </p>
                  <p>
                    如果 Hook 放在 <code>if</code> 语句中，当条件变化时，调用顺序就会改变，导致
                    React 把错误的状态赋给错误的 Hook。这就是为什么 ESLint 规则{' '}
                    <code>rules-of-hooks</code> 会强制检查这一点。
                  </p>
                </div>
              </details>
            </li>
            <li>
              <details>
                <summary>类组件的生命周期方法分别对应哪些 Hooks？</summary>
                <div className="rl-answer">
                  <p>
                    <code>componentDidMount</code> → <code>useEffect(fn, [])</code>（空依赖数组）
                  </p>
                  <p>
                    <code>componentDidUpdate</code> → <code>useEffect(fn, [deps])</code>（指定依赖）
                  </p>
                  <p>
                    <code>componentWillUnmount</code> → useEffect 的 <strong>清理函数</strong>
                    （return () =&gt; ...）
                  </p>
                  <p>
                    <code>shouldComponentUpdate</code> → <code>React.memo</code> +{' '}
                    <code>useMemo</code> / <code>useCallback</code>
                  </p>
                </div>
              </details>
            </li>
            <li>
              <details>
                <summary>React 18 引入了哪些新 Hook？</summary>
                <div className="rl-answer">
                  <p>
                    <code>useId</code> —— 生成在 SSR 和 CSR 中保持一致的唯一 ID，解决服务端渲染时的
                    hydration 不匹配问题。
                  </p>
                  <p>
                    <code>useSyncExternalStore</code> —— 让外部状态库（如
                    Redux、Zustand）安全地在并发模式下订阅状态变化，防止撕裂（tearing）问题。
                  </p>
                  <p>
                    <code>useInsertionEffect</code> —— 在 DOM 更新后、布局计算前同步执行，主要给
                    CSS-in-JS 库使用，普通开发者很少用到。
                  </p>
                </div>
              </details>
            </li>
          </ul>

          <h3>推荐资源</h3>
          <div className="rl-resources">
            <a
              className="rl-resource"
              href="https://react.dev/reference/react/hooks"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="rl-res-icon">📖</span> React Hooks Reference
            </a>
            <a
              className="rl-resource"
              href="https://react.dev/learn/reusing-logic-with-custom-hooks"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="rl-res-icon">📖</span> Reusing Logic with Custom Hooks
            </a>
          </div>
        </div>
      </div>
      <PageNav currentPath="/react-learning/hooks-intro" />
    </div>
  )
}

export default HooksIntro
