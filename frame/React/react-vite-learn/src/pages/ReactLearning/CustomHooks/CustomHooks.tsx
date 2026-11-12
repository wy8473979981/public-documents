import { useState } from 'react'
import CodeBlock from '@/components/CodeBlock/CodeBlock'
import SectionPath from '@/components/SectionPath/SectionPath'
import PageNav from '@/components/PageNav/PageNav'
import '../shared.css'

const customHookBasicCode = `// 自定义 Hook：useLocalStorage
import { useState, useEffect } from 'react'

function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : initialValue
  })

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return [value, setValue]
}

// 使用
function App() {
  const [theme, setTheme] = useLocalStorage('theme', 'light')
  return <button onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}>
    当前主题：{theme}
  </button>
}`

const useFetchCode = `// 自定义 Hook：useFetch
function useFetch(url) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)

    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (!cancelled) {
          setData(data)
          setLoading(false)
        }
      })
      .catch(err => {
        if (!cancelled) {
          setError(err)
          setLoading(false)
        }
      })

    return () => { cancelled = true }
  }, [url])

  return { data, loading, error }
}`

const useToggleCode = `// 简单的自定义 Hook：useToggle
function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue)
  const toggle = () => setValue(v => !v)
  const setTrue = () => setValue(true)
  const setFalse = () => setValue(false)
  return { value, toggle, setTrue, setFalse }
}

// 使用
function Modal() {
  const { value: isOpen, toggle, setFalse: close } = useToggle(false)
  return (
    <>
      <button onClick={toggle}>打开/关闭</button>
      {isOpen && <div className="modal"><button onClick={close}>关闭</button></div>}
    </>
  )
}`

function CustomHooks() {
  const [theme, setTheme] = useState('light')
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="rl-page">
      <h1>8. 自定义 Hooks</h1>
      <p className="rl-subtitle">将组件逻辑提取为可复用的函数 —— React 中最强大的复用模式</p>

      <SectionPath />

      <div className="rl-section concept" id="section-concept">
        <div className="rl-section-header">
          <span className="rl-icon">💡</span> 理解概念 — What & Why
        </div>
        <div className="rl-section-body">
          <h3>什么是自定义 Hook？</h3>
          <p>
            自定义 Hook 是以 <code>use</code> 开头的 JavaScript 函数，内部可以调用其他 Hook。
            它让你能把组件中重复的逻辑提取出来，在多个组件间共享。
          </p>

          <div className="rl-concept-cards">
            <div className="rl-concept-card">
              <div className="rl-card-title">🔁 逻辑复用</div>
              <div className="rl-card-desc">
                不用 HOC 或 Render Props，直接用函数提取和复用状态逻辑。
              </div>
            </div>
            <div className="rl-concept-card">
              <div className="rl-card-title">📂 关注分离</div>
              <div className="rl-card-desc">
                把数据获取、表单处理等逻辑拆到独立 Hook，组件代码更清晰。
              </div>
            </div>
            <div className="rl-concept-card">
              <div className="rl-card-title">🧪 易于测试</div>
              <div className="rl-card-desc">Hook 是纯函数，可以独立于组件进行测试。</div>
            </div>
          </div>

          <h3>自定义 Hook vs 普通函数</h3>
          <table className="rl-compare-table">
            <thead>
              <tr>
                <th>特性</th>
                <th>自定义 Hook</th>
                <th>普通函数</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>命名</strong>
                </td>
                <td>必须 use 开头</td>
                <td>无限制</td>
              </tr>
              <tr>
                <td>
                  <strong>可调用 Hook</strong>
                </td>
                <td>可以</td>
                <td>不可以</td>
              </tr>
              <tr>
                <td>
                  <strong>遵循 Hook 规则</strong>
                </td>
                <td>是</td>
                <td>否</td>
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
          <h3>实用 Hook：useLocalStorage</h3>
          <CodeBlock code={customHookBasicCode} language="jsx" title="持久化状态到 localStorage" />

          <h3>数据获取 Hook：useFetch</h3>
          <CodeBlock code={useFetchCode} language="jsx" title="封装数据获取逻辑" />

          <h3>简单 Hook：useToggle</h3>
          <CodeBlock code={useToggleCode} language="jsx" title="开关状态管理" />

          <div className="rl-tip info">
            💡 自定义 Hook 之间不共享状态，每个组件调用 Hook 时获得独立的状态。
          </div>
        </div>
      </div>

      <div className="rl-section practice" id="section-practice">
        <div className="rl-section-header">
          <span className="rl-icon">🛠️</span> 动手实践 — Do
        </div>
        <div className="rl-section-body">
          <h3>试一试：模拟 useToggle</h3>
          <div className="rl-demo-box">
            <div className="rl-demo-title">Interactive Demo - useToggle</div>
            <button onClick={() => setIsModalOpen(!isModalOpen)}>
              {isModalOpen ? '关闭' : '打开'}弹窗
            </button>
            {isModalOpen && (
              <div className="rl-demo-result" style={{ marginTop: 8 }}>
                <p>这是一个弹窗！点击"关闭"按钮试试。</p>
                <button onClick={() => setIsModalOpen(false)}>关闭</button>
              </div>
            )}
          </div>

          <h3>试一试：模拟 useLocalStorage</h3>
          <div className="rl-demo-box">
            <div className="rl-demo-title">Interactive Demo - 主题切换</div>
            <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>切换主题</button>
            <div
              className="rl-demo-result"
              style={{
                background: theme === 'dark' ? '#333' : '#fff',
                color: theme === 'dark' ? '#fff' : '#333',
                padding: 12,
                borderRadius: 6,
              }}
            >
              当前主题：<strong>{theme}</strong>（刷新页面后仍会保留）
            </div>
          </div>

          <h3>推荐练习</h3>
          <ul className="rl-exercises">
            <li>
              <span className="rl-ex-num">1</span>
              <div className="rl-ex-content">
                <div className="rl-ex-title">useWindowSize</div>
                <div className="rl-ex-desc">监听窗口尺寸变化，返回 width 和 height</div>
              </div>
            </li>
            <li>
              <span className="rl-ex-num">2</span>
              <div className="rl-ex-content">
                <div className="rl-ex-title">useDebounce</div>
                <div className="rl-ex-desc">对输入值进行防抖处理</div>
              </div>
            </li>
            <li>
              <span className="rl-ex-num">3</span>
              <div className="rl-ex-content">
                <div className="rl-ex-title">useOnlineStatus</div>
                <div className="rl-ex-desc">监听 navigator.onLine 状态变化</div>
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
                <summary>社区有哪些优秀的自定义 Hook 库？</summary>
                <div className="rl-answer">
                  <p>
                    <strong>ahooks</strong>（阿里出品）：包含
                    useRequest、useVirtualList、useDebounceFn 等 60+ Hook，中文文档友好。
                  </p>
                  <p>
                    <strong>react-use</strong>：最全面的 Hook 集合（200+），覆盖
                    useLocalStorage、useMedia、useKey 等日常场景。
                  </p>
                  <p>
                    <strong>@react-hookz/web</strong>
                    ：轻量级替代，质量高、类型安全。选择时注意：库的维护活跃度、TypeScript
                    支持、包体积。
                  </p>
                </div>
              </details>
            </li>
            <li>
              <details>
                <summary>Hook 组合 vs 继承 vs HOC，哪种模式更优？</summary>
                <div className="rl-answer">
                  <p>
                    <strong>HOC</strong>（高阶组件）：早期主流模式，容易产生“嵌套地狱”，Props
                    来源不透明。
                  </p>
                  <p>
                    <strong>Render Props</strong>：解决了 Props 来源问题，但导致 JSX
                    嵌套过深（回调地狱）。
                  </p>
                  <p>
                    <strong>Custom Hooks</strong>
                    ：最简洁、最灵活，逻辑复用不改变组件结构，TypeScript 友好。是目前 React 社区的{' '}
                    <strong>推荐模式</strong>。但 HOC 在类组件中仍有用，Render Props 在某些 UI
                    库中仍可见。
                  </p>
                </div>
              </details>
            </li>
            <li>
              <details>
                <summary>如何测试自定义 Hook？</summary>
                <div className="rl-answer">
                  <p>
                    使用 <code>@testing-library/react</code> 的 <code>renderHook</code>{' '}
                    函数，可以在测试环境中渲染 Hook 并检查其返回值。
                  </p>
                  <p>
                    示例：
                    <code>
                      const &#123; result &#125; = renderHook(() =&gt; useCounter()); act(() =&gt;
                      result.current.increment()); expect(result.current.count).toBe(1);
                    </code>
                  </p>
                  <p>
                    测试时关注 Hook 的输入输出，而不是内部实现。如果 Hook 包含异步逻辑，使用{' '}
                    <code>waitFor</code> 等待结果。
                  </p>
                </div>
              </details>
            </li>
          </ul>
          <h3>推荐资源</h3>
          <div className="rl-resources">
            <a
              className="rl-resource"
              href="https://react.dev/learn/reusing-logic-with-custom-hooks"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="rl-res-icon">📖</span> Reusing Logic with Custom Hooks
            </a>
            <a
              className="rl-resource"
              href="https://github.com/streamich/react-use"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="rl-res-icon">📦</span> react-use 库
            </a>
          </div>
        </div>
      </div>
      <PageNav currentPath="/react-learning/custom-hooks" />
    </div>
  )
}

export default CustomHooks
