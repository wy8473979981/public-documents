import { useState } from 'react'
import CodeBlock from '@/components/CodeBlock/CodeBlock'
import SectionPath from '@/components/SectionPath/SectionPath'
import PageNav from '@/components/PageNav/PageNav'
import '../shared.css'

const eventBasicCode = `// React 事件处理基础
function EventDemo() {
  // 方式 1：直接传入函数
  const handleClick = () => {
    alert('按钮被点击了！')
  }

  // 方式 2：箭头函数传参
  const handleGreet = (name) => {
    alert(\`你好，\${name}！\`)
  }

  return (
    <div>
      <button onClick={handleClick}>点击我</button>
      <button onClick={() => handleGreet('小明')}>打招呼</button>
      {/* 注意：不要写 onClick={handleClick()}，这会立即执行 */}
    </div>
  )
}`

const eventObjectCode = `// 事件对象 SyntheticEvent
function FormDemo() {
  const handleSubmit = (e) => {
    e.preventDefault() // 阻止默认提交行为
    const formData = new FormData(e.target)
    console.log('表单数据：', Object.fromEntries(formData))
  }

  const handleInput = (e) => {
    // e.target.value 获取输入值
    // e.target.name 获取输入框名称
    console.log('输入内容：', e.target.value)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="username" onChange={handleInput} />
      <button type="submit">提交</button>
    </form>
  )
}`

const eventPropagationCode = `// 事件冒泡与阻止
function PropagationDemo() {
  const handleOuter = () => console.log('外层被点击')
  const handleInner = () => console.log('内层被点击')

  return (
    <div onClick={handleOuter}>
      <button
        onClick={(e) => {
          e.stopPropagation() // 阻止冒泡
          handleInner()
        }}
      >
        点击我（不会触发外层）
      </button>
    </div>
  )
}`

function Events() {
  const [log, setLog] = useState<string[]>([])
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  const addLog = (msg: string) => {
    setLog((prev) => [...prev.slice(-4), `[${new Date().toLocaleTimeString()}] ${msg}`])
  }

  return (
    <div className="rl-page">
      <h1>5. 事件处理</h1>
      <p className="rl-subtitle">React 事件系统 —— 学习如何响应用户交互</p>

      <SectionPath />

      {/* 概念 */}
      <div className="rl-section concept" id="section-concept">
        <div className="rl-section-header">
          <span className="rl-icon">💡</span> 理解概念 — What & Why
        </div>
        <div className="rl-section-body">
          <h3>React 事件和原生事件有什么不同？</h3>
          <p>
            React 有自己的事件系统，称为<strong>合成事件（SyntheticEvent）</strong>。
            它包装了浏览器的原生事件，提供了跨浏览器一致的 API。
          </p>

          <div className="rl-concept-cards">
            <div className="rl-concept-card">
              <div className="rl-card-title">🐪 驼峰命名</div>
              <div className="rl-card-desc">
                React 事件用驼峰命名（onClick），而非 HTML 的全小写（onclick）。
              </div>
            </div>
            <div className="rl-concept-card">
              <div className="rl-card-title">🔧 传函数非字符串</div>
              <div className="rl-card-desc">传入函数引用作为事件处理器，不能用字符串。</div>
            </div>
            <div className="rl-concept-card">
              <div className="rl-card-title">🚫 不能 return false</div>
              <div className="rl-card-desc">必须显式调用 e.preventDefault() 来阻止默认行为。</div>
            </div>
            <div className="rl-concept-card">
              <div className="rl-card-title">🌐 事件委托</div>
              <div className="rl-card-desc">React 将所有事件委托到根节点，提升性能并统一管理。</div>
            </div>
          </div>

          <h3>React 事件 vs 原生 DOM 事件</h3>
          <table className="rl-compare-table">
            <thead>
              <tr>
                <th>特性</th>
                <th>React</th>
                <th>原生 DOM</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>命名</strong>
                </td>
                <td>onClick</td>
                <td>onclick</td>
              </tr>
              <tr>
                <td>
                  <strong>处理器</strong>
                </td>
                <td>函数</td>
                <td>函数或字符串</td>
              </tr>
              <tr>
                <td>
                  <strong>阻止默认</strong>
                </td>
                <td>必须 e.preventDefault()</td>
                <td>可以 return false</td>
              </tr>
              <tr>
                <td>
                  <strong>事件对象</strong>
                </td>
                <td>SyntheticEvent</td>
                <td>原生 Event</td>
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
          <h3>基础事件绑定</h3>
          <CodeBlock code={eventBasicCode} language="jsx" title="事件处理基础" />

          <h3>事件对象</h3>
          <CodeBlock code={eventObjectCode} language="jsx" title="使用事件对象" />

          <h3>事件冒泡</h3>
          <CodeBlock code={eventPropagationCode} language="jsx" title="事件冒泡与阻止" />

          <h3>常用事件速查</h3>
          <table className="rl-compare-table">
            <thead>
              <tr>
                <th>事件类型</th>
                <th>React 事件名</th>
                <th>用途</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>点击</td>
                <td>onClick</td>
                <td>按钮、链接、任意元素点击</td>
              </tr>
              <tr>
                <td>输入</td>
                <td>onChange</td>
                <td>input、select、textarea 变化</td>
              </tr>
              <tr>
                <td>提交</td>
                <td>onSubmit</td>
                <td>表单提交</td>
              </tr>
              <tr>
                <td>键盘</td>
                <td>onKeyDown/Up</td>
                <td>键盘按键事件</td>
              </tr>
              <tr>
                <td>鼠标</td>
                <td>onMouseEnter/Leave</td>
                <td>鼠标悬停</td>
              </tr>
              <tr>
                <td>焦点</td>
                <td>onFocus/onBlur</td>
                <td>输入框获得/失去焦点</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 实践 */}
      <div className="rl-section practice" id="section-practice">
        <div className="rl-section-header">
          <span className="rl-icon">🛠️</span> 动手实践 — Do
        </div>
        <div className="rl-section-body">
          <h3>试一试：事件日志</h3>
          <p>触发下面的各种事件，观察日志输出：</p>
          <div className="rl-demo-box">
            <div className="rl-demo-title">Interactive Demo - 事件追踪</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button onClick={() => addLog('按钮被点击')}>onClick</button>
              <button onMouseEnter={() => addLog('鼠标进入')}>onMouseEnter</button>
              <button onMouseLeave={() => addLog('鼠标离开')}>onMouseLeave</button>
              <input
                placeholder="输入触发 onChange"
                onChange={(e) => addLog(`输入: ${e.target.value}`)}
              />
              <input
                placeholder="按任意键触发 onKeyDown"
                onKeyDown={(e) => addLog(`按键: ${e.key}`)}
              />
            </div>
            <div className="rl-demo-result">
              <p>
                <strong>事件日志（最近 5 条）：</strong>
              </p>
              {log.length === 0 ? (
                <p style={{ color: '#999' }}>还没有触发任何事件...</p>
              ) : (
                log.map((entry, i) => <div key={i}>{entry}</div>)
              )}
            </div>
            <button onClick={() => setLog([])}>清空日志</button>
          </div>

          <h3>试一试：鼠标追踪</h3>
          <div
            className="rl-demo-box"
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect()
              setMousePos({
                x: Math.round(e.clientX - rect.left),
                y: Math.round(e.clientY - rect.top),
              })
            }}
          >
            <div className="rl-demo-title">Interactive Demo - 鼠标位置追踪</div>
            <div className="rl-demo-result">
              鼠标位置：X = <strong>{mousePos.x}</strong>，Y = <strong>{mousePos.y}</strong>
            </div>
          </div>

          <h3>推荐练习</h3>
          <ul className="rl-exercises">
            <li>
              <span className="rl-ex-num">1</span>
              <div className="rl-ex-content">
                <div className="rl-ex-title">双击计数器</div>
                <div className="rl-ex-desc">用 onDoubleClick 实现双击计数的功能</div>
              </div>
            </li>
            <li>
              <span className="rl-ex-num">2</span>
              <div className="rl-ex-content">
                <div className="rl-ex-title">键盘快捷键</div>
                <div className="rl-ex-desc">按 Ctrl+S 保存、按 Escape 关闭弹窗</div>
              </div>
            </li>
            <li>
              <span className="rl-ex-num">3</span>
              <div className="rl-ex-content">
                <div className="rl-ex-title">拖拽排序</div>
                <div className="rl-ex-desc">用鼠标事件实现简单的列表项拖拽排序</div>
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
                <summary>为什么 onClick=&#123;handleClick()&#125; 会立即执行？</summary>
                <div className="rl-answer">
                  <p>
                    因为 <code>handleClick()</code> 是 <strong>函数调用</strong>，在 JSX
                    解析时就会立即执行，并把返回值赋给 onClick。
                  </p>
                  <p>
                    正确写法是 <code>onClick=&#123;handleClick&#125;</code>，传的是{' '}
                    <strong>函数引用</strong>
                    ，只有用户点击时才会被调用。如果需要传参，用箭头函数包裹：
                    <code>onClick=&#123;() =&gt; handleClick(id)&#125;</code>。
                  </p>
                </div>
              </details>
            </li>
            <li>
              <details>
                <summary>频繁触发的事件（scroll、resize）如何优化？</summary>
                <div className="rl-answer">
                  <p>
                    使用 <strong>防抖（Debounce）</strong> 或 <strong>节流（Throttle）</strong>。
                  </p>
                  <p>
                    <strong>防抖</strong>：事件停止触发后等待 N
                    毫秒才执行（如搜索输入框，用户停止输入后才发请求）。<strong>节流</strong>
                    ：固定时间间隔内最多执行一次（如滚动事件，每 100ms 只处理一次）。
                  </p>
                  <p>
                    可以用 <code>lodash.debounce</code> / <code>lodash.throttle</code>，或在
                    useEffect 中自己实现。配合 <code>useRef</code> 保存定时器引用。
                  </p>
                </div>
              </details>
            </li>
            <li>
              <details>
                <summary>React 的合成事件池在 React 17+ 有什么变化？</summary>
                <div className="rl-answer">
                  <p>
                    React 16
                    及之前：使用「事件池」机制，事件对象用完后会被回收清空，异步访问属性需要先调用{' '}
                    <code>e.persist()</code>。
                  </p>
                  <p>
                    React 17+：<strong>废弃了事件池</strong>
                    ，事件对象不再被重用，可以正常异步访问所有属性。这是因为现代浏览器性能已经足够好，事件池带来的优化收益不大，反而容易引发
                    Bug。
                  </p>
                  <p>
                    另外，React 17 将事件委托从 <code>document</code> 改为了挂载的根 DOM
                    节点，使多个 React 应用共存时事件不会互相干扰。
                  </p>
                </div>
              </details>
            </li>
            <li>
              <details>
                <summary>自定义事件怎么在 React 中使用？</summary>
                <div className="rl-answer">
                  <p>
                    React 的合成事件只支持标准 DOM
                    事件。对于自定义事件（如第三方库触发的事件），需要在 <code>useEffect</code>{' '}
                    中使用原生 <code>addEventListener</code> 监听，并在清理函数中{' '}
                    <code>removeEventListener</code>。
                  </p>
                  <p>
                    示例：
                    <code>
                      useEffect(() =&gt; &#123; window.addEventListener('my-event', handler); return
                      () =&gt; window.removeEventListener('my-event', handler); &#125;, []);
                    </code>
                  </p>
                  <p>
                    注意将 handler 用 <code>useCallback</code> 包裹，避免不必要的重新绑定。
                  </p>
                </div>
              </details>
            </li>
          </ul>

          <h3>推荐资源</h3>
          <div className="rl-resources">
            <a
              className="rl-resource"
              href="https://react.dev/learn/responding-to-events"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="rl-res-icon">📖</span> Responding to Events
            </a>
          </div>
        </div>
      </div>
      <PageNav currentPath="/react-learning/events" />
    </div>
  )
}

export default Events
