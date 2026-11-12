import { useState, useEffect, useRef } from 'react'
import CodeBlock from '@/components/CodeBlock/CodeBlock'
import SectionPath from '@/components/SectionPath/SectionPath'
import PageNav from '@/components/PageNav/PageNav'
import '../shared.css'

const effectBasicCode = `// useEffect 基本用法
import { useState, useEffect } from 'react'

function DataFetcher() {
  const [data, setData] = useState(null)

  useEffect(() => {
    // 副作用：发起 API 请求
    fetch('https://api.example.com/users')
      .then(res => res.json())
      .then(data => setData(data))
  }, []) // 空数组 = 只在挂载时执行一次

  return <div>{data ? JSON.stringify(data) : '加载中...'}</div>
}`

const effectDepsCode = `// 依赖数组决定何时重新执行
useEffect(() => { ... })          // 每次渲染都执行
useEffect(() => { ... }, [])      // 仅挂载时执行一次
useEffect(() => { ... }, [a, b])  // a 或 b 变化时重新执行`

const effectCleanupCode = `// 清理函数 —— 防止内存泄漏
function LiveClock() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)

    // 返回清理函数（组件卸载或依赖变化前执行）
    return () => clearInterval(timer)
  }, [])

  return <p>{time.toLocaleTimeString()}</p>
}`

const effectCommonMistakes = `// ❌ 常见错误

// 1. 忘记依赖
useEffect(() => {
  console.log(user.name) // user 不在依赖数组中！
}, [])

// 2. 无限循环
useEffect(() => {
  setData({ ... }) // 创建新对象，每次引用都不同
}, [data])

// ✅ 正确做法
// 1. 完整列出依赖
useEffect(() => {
  console.log(user.name)
}, [user])

// 2. 使用函数式更新或比较值
useEffect(() => {
  if (needsUpdate) setData(prev => ({ ...prev, updated: true }))
}, [needsUpdate])`

function UseEffect() {
  const [seconds, setSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [width, setWidth] = useState(0)
  const demoRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isRunning) return
    const timer = setInterval(() => {
      setSeconds((s) => s + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [isRunning])

  useEffect(() => {
    if (!demoRef.current) return
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setWidth(Math.round(entry.contentRect.width))
      }
    })
    observer.observe(demoRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="rl-page">
      <h1>7. useEffect Hook</h1>
      <p className="rl-subtitle">处理副作用的利器 —— 数据获取、定时器、订阅等都靠它</p>

      <SectionPath />

      {/* 概念 */}
      <div className="rl-section concept" id="section-concept">
        <div className="rl-section-header">
          <span className="rl-icon">💡</span> 理解概念 — What & Why
        </div>
        <div className="rl-section-body">
          <h3>什么是副作用？</h3>
          <p>
            副作用是指<strong>组件渲染之外</strong>的操作，比如：请求数据、设置定时器、修改
            DOM、添加事件监听等。 这些操作不能直接在渲染过程中执行（因为它们不产生 JSX）。
          </p>
          <p>useEffect 就是 React 提供的"副作用执行器"，让你在渲染后安全地执行这些操作。</p>

          <h3>useEffect 的执行时机</h3>
          <table className="rl-compare-table">
            <thead>
              <tr>
                <th>写法</th>
                <th>执行时机</th>
                <th>类比类组件</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <code>useEffect(fn)</code>
                </td>
                <td>每次渲染后</td>
                <td>componentDidMount + Update</td>
              </tr>
              <tr>
                <td>
                  <code>useEffect(fn, [])</code>
                </td>
                <td>仅挂载时</td>
                <td>componentDidMount</td>
              </tr>
              <tr>
                <td>
                  <code>useEffect(fn, [dep])</code>
                </td>
                <td>dep 变化时</td>
                <td>componentDidUpdate（有条件）</td>
              </tr>
              <tr>
                <td>
                  <code>return () =&gt; cleanup</code>
                </td>
                <td>卸载/重新执行前</td>
                <td>componentWillUnmount</td>
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
          <h3>基本用法：数据获取</h3>
          <CodeBlock code={effectBasicCode} language="jsx" title="useEffect 数据获取" />

          <h3>依赖数组</h3>
          <CodeBlock code={effectDepsCode} language="jsx" title="三种依赖模式" />

          <h3>清理函数</h3>
          <CodeBlock code={effectCleanupCode} language="jsx" title="清理函数防止内存泄漏" />

          <h3>常见错误</h3>
          <CodeBlock code={effectCommonMistakes} language="jsx" title="useEffect 常见陷阱" />

          <div className="rl-tip warning">
            ⚠️ 每个 useEffect 只负责一个副作用。不要在一个 effect 里做太多事情。
          </div>
        </div>
      </div>

      {/* 实践 */}
      <div className="rl-section practice" id="section-practice">
        <div className="rl-section-header">
          <span className="rl-icon">🛠️</span> 动手实践 — Do
        </div>
        <div className="rl-section-body">
          <h3>试一试：实时计时器</h3>
          <p>启动/停止计时器，观察 useEffect 的清理机制：</p>
          <div className="rl-demo-box">
            <div className="rl-demo-title">Interactive Demo - 计时器（useEffect + 清理）</div>
            <div>
              <button onClick={() => setIsRunning(!isRunning)}>
                {isRunning ? '⏸ 暂停' : '▶ 启动'}
              </button>
              <button
                onClick={() => {
                  setSeconds(0)
                  setIsRunning(false)
                }}
              >
                🔄 重置
              </button>
            </div>
            <div className="rl-demo-result">
              已运行：<strong>{seconds}</strong> 秒{isRunning && ' （运行中...）'}
              {!isRunning && seconds > 0 && ' （已暂停）'}
            </div>
          </div>

          <h3>试一试：窗口尺寸监控</h3>
          <div className="rl-demo-box" ref={demoRef}>
            <div className="rl-demo-title">Interactive Demo - ResizeObserver</div>
            <div className="rl-demo-result">
              当前容器宽度：<strong>{width}px</strong>
              （缩放浏览器窗口试试）
            </div>
          </div>

          <h3>推荐练习</h3>
          <ul className="rl-exercises">
            <li>
              <span className="rl-ex-num">1</span>
              <div className="rl-ex-content">
                <div className="rl-ex-title">实时搜索</div>
                <div className="rl-ex-desc">
                  输入关键词后延迟 500ms 发起搜索请求（防抖 + useEffect）
                </div>
              </div>
            </li>
            <li>
              <span className="rl-ex-num">2</span>
              <div className="rl-ex-content">
                <div className="rl-ex-title">页面标题更新</div>
                <div className="rl-ex-desc">根据当前页面状态动态修改 document.title</div>
              </div>
            </li>
            <li>
              <span className="rl-ex-num">3</span>
              <div className="rl-ex-content">
                <div className="rl-ex-title">事件监听器</div>
                <div className="rl-ex-desc">
                  用 useEffect 添加 window 的 online/offline 事件监听
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
                <summary>useEffect 中的异步函数怎么处理？</summary>
                <div className="rl-answer">
                  <p>
                    useEffect 的回调不能直接声明为 async，因为 useEffect 期望返回一个清理函数（或
                    undefined），而 async 函数返回 Promise。
                  </p>
                  <p>
                    正确做法：在 useEffect 内部定义一个 async 函数然后调用它：
                    <code>
                      useEffect(() =&gt; &#123; const fetchData = async () =&gt; &#123; ... &#125;;
                      fetchData(); &#125;, [deps]);
                    </code>
                  </p>
                </div>
              </details>
            </li>
            <li>
              <details>
                <summary>React 18 严格模式下 useEffect 为什么会执行两次？</summary>
                <div className="rl-answer">
                  <p>
                    React 18 的 Strict Mode 在开发环境会执行「挂载 → 卸载 →
                    再挂载」的过程，模拟组件被卸载后重新挂载的场景。
                  </p>
                  <p>
                    这是为了帮你发现副作用的清理问题 —— 如果你的 useEffect
                    没有正确编写清理函数，在第二次挂载时就会暴露问题（如重复订阅、重复请求）。生产环境不会执行两次。
                  </p>
                </div>
              </details>
            </li>
            <li>
              <details>
                <summary>useLayoutEffect 和 useEffect 的区别？</summary>
                <div className="rl-answer">
                  <p>
                    <code>useEffect</code>{' '}
                    在浏览器完成绘制后异步执行，不会阻塞渲染。适合数据获取、订阅、定时器等大多数场景。
                  </p>
                  <p>
                    <code>useLayoutEffect</code> 在 DOM
                    更新后、浏览器绘制前同步执行，会阻塞渲染。只在需要在绘制前读取/修改 DOM
                    布局时使用（如测量元素尺寸、同步调整滚动位置），避免用户看到闪烁。
                  </p>
                </div>
              </details>
            </li>
            <li>
              <details>
                <summary>useEffect vs useEvent（React 实验性 API）</summary>
                <div className="rl-answer">
                  <p>
                    useEffect
                    用于「同步」外部系统（如订阅、定时器），它依赖特定的值来重新执行。但很多时候你需要的是一个「事件处理器」——
                    只响应某个动作，不依赖响应式。
                  </p>
                  <p>
                    <code>useEvent</code>（已重命名为 <code>useEffectEvent</code>）是一个实验性
                    API，它创建一个始终能访问最新状态的回调，但不会触发 useEffect
                    重新执行，解决了「既想用最新状态又不想加依赖」的难题。
                  </p>
                </div>
              </details>
            </li>
          </ul>

          <h3>推荐资源</h3>
          <div className="rl-resources">
            <a
              className="rl-resource"
              href="https://react.dev/reference/react/useEffect"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="rl-res-icon">📖</span> useEffect Reference
            </a>
            <a
              className="rl-resource"
              href="https://react.dev/learn/synchronizing-with-effects"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="rl-res-icon">📖</span> Synchronizing with Effects
            </a>
          </div>
        </div>
      </div>
      <PageNav currentPath="/react-learning/useEffect" />
    </div>
  )
}

export default UseEffect
