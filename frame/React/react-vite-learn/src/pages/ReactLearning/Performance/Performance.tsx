import { useState, useMemo, useCallback, memo } from 'react'
import CodeBlock from '@/components/CodeBlock/CodeBlock'
import SectionPath from '@/components/SectionPath/SectionPath'
import PageNav from '@/components/PageNav/PageNav'
import '../shared.css'

const memoCode = `// React.memo 防止不必要的重渲染
const ExpensiveList = memo(function ExpensiveList({ items, onClick }) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id} onClick={() => onClick(item.id)}>
          {item.name}
        </li>
      ))}
    </ul>
  )
})`

const useMemoCode = `// useMemo 缓存计算结果
function SortedList({ items, sortOrder }) {
  // 只在 items 或 sortOrder 变化时重新排序
  const sorted = useMemo(() => {
    return [...items].sort((a, b) =>
      sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    )
  }, [items, sortOrder])

  return sorted.map(item => <p key={item.id}>{item.name}</p>)
}`

const lazyCode = `// React.lazy + Suspense 代码分割
import { lazy, Suspense } from 'react'

const HeavyChart = lazy(() => import('./HeavyChart'))

function Dashboard() {
  return (
    <Suspense fallback={<div>加载图表中...</div>}>
      <HeavyChart />
    </Suspense>
  )
}`

const ExpensiveItem = memo(function ExpensiveItem({
  name,
  onHighlight,
}: {
  name: string
  onHighlight: () => void
}) {
  return (
    <li style={{ padding: '4px 0' }}>
      <span onClick={onHighlight} style={{ cursor: 'pointer' }}>
        {name}
      </span>
    </li>
  )
})

function Performance() {
  const [count, setCount] = useState(0)
  const [filter, setFilter] = useState('')

  const items = useMemo(
    () =>
      ['React', 'Vue', 'Angular', 'Svelte', 'Solid', 'Qwik', 'Preact', 'Lit'].filter((i) =>
        i.toLowerCase().includes(filter.toLowerCase())
      ),
    [filter]
  )

  const handleHighlight = useCallback((name: string) => {
    alert(`你选择了 ${name}`)
  }, [])

  return (
    <div className="rl-page">
      <h1>13. 性能优化</h1>
      <p className="rl-subtitle">减少不必要的渲染，让你的 React 应用更快</p>
      <SectionPath />
      <div className="rl-section concept" id="section-concept">
        <div className="rl-section-header">
          <span className="rl-icon">💡</span> 理解概念 — What & Why
        </div>
        <div className="rl-section-body">
          <h3>React 渲染何时是"浪费"的？</h3>
          <p>
            当父组件状态变化时，所有子组件默认都会重新渲染。如果子组件的 Props
            没有变化，这次渲染就是"浪费"的。
          </p>
          <div className="rl-concept-cards">
            <div className="rl-concept-card">
              <div className="rl-card-title">🧠 React.memo</div>
              <div className="rl-card-desc">记忆化组件，Props 不变时跳过重渲染</div>
            </div>
            <div className="rl-concept-card">
              <div className="rl-card-title">💾 useMemo</div>
              <div className="rl-card-desc">缓存计算结果，依赖不变时返回缓存值</div>
            </div>
            <div className="rl-concept-card">
              <div className="rl-card-title">🔒 useCallback</div>
              <div className="rl-card-desc">缓存回调函数引用，避免子组件因函数变化而重渲染</div>
            </div>
            <div className="rl-concept-card">
              <div className="rl-card-title">✂️ 代码分割</div>
              <div className="rl-card-desc">React.lazy + Suspense 按需加载组件</div>
            </div>
          </div>
        </div>
      </div>
      <div className="rl-section usage" id="section-usage">
        <div className="rl-section-header">
          <span className="rl-icon">⚙️</span> 掌握用法 — How
        </div>
        <div className="rl-section-body">
          <h3>React.memo</h3>
          <CodeBlock code={memoCode} language="jsx" title="React.memo 记忆化组件" />
          <h3>useMemo</h3>
          <CodeBlock code={useMemoCode} language="jsx" title="useMemo 缓存计算" />
          <h3>代码分割</h3>
          <CodeBlock code={lazyCode} language="jsx" title="React.lazy 懒加载" />
        </div>
      </div>
      <div className="rl-section practice" id="section-practice">
        <div className="rl-section-header">
          <span className="rl-icon">🛠️</span> 动手实践 — Do
        </div>
        <div className="rl-section-body">
          <h3>试一试：useMemo + memo 效果</h3>
          <div className="rl-demo-box">
            <div className="rl-demo-title">Interactive Demo - 性能优化</div>
            <input
              placeholder="过滤框架..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
            <button onClick={() => setCount(count + 1)}>重新渲染 ({count})</button>
            <div className="rl-demo-result">
              <p>过滤后的框架列表（useMemo 缓存）：</p>
              <ul>
                {items.map((item) => (
                  <ExpensiveItem key={item} name={item} onHighlight={() => handleHighlight(item)} />
                ))}
              </ul>
            </div>
          </div>
          <h3>推荐练习</h3>
          <ul className="rl-exercises">
            <li>
              <span className="rl-ex-num">1</span>
              <div className="rl-ex-content">
                <div className="rl-ex-title">React DevTools Profiler</div>
                <div className="rl-ex-desc">用 Profiler 观察组件渲染次数</div>
              </div>
            </li>
            <li>
              <span className="rl-ex-num">2</span>
              <div className="rl-ex-content">
                <div className="rl-ex-title">大列表优化</div>
                <div className="rl-ex-desc">用 react-window 实现 10000 条数据的虚拟列表</div>
              </div>
            </li>
            <li>
              <span className="rl-ex-num">3</span>
              <div className="rl-ex-content">
                <div className="rl-ex-title">路由懒加载</div>
                <div className="rl-ex-desc">用 React.lazy 实现按路由分割代码</div>
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
                <summary>什么时候不需要优化？</summary>
                <div className="rl-answer">
                  <p>「过早优化是万恶之源」。大多数 React 应用在没有优化的情况下已经足够快。</p>
                  <p>
                    只在以下情况考虑优化：① 用户能感知到卡顿；② React DevTools Profiler
                    显示频繁的「浪费」渲染；③
                    列表超过数百项。先用工具度量问题，再针对性优化，而不是到处加{' '}
                    <code>useMemo</code>。
                  </p>
                </div>
              </details>
            </li>
            <li>
              <details>
                <summary>React Compiler（React Forget）会自动处理记忆化吗？</summary>
                <div className="rl-answer">
                  <p>
                    React Compiler 是 Meta 开发的编译器，它会自动分析组件并插入 <code>useMemo</code>
                    、<code>useCallback</code>、<code>React.memo</code> 等价代码。
                  </p>
                  <p>
                    这意味着开发者不再需要手动记忆化，编译器会自动处理。目前已在 Meta
                    内部大规模使用，未来将逐步向社区开放。这是 React 性能优化的未来方向。
                  </p>
                </div>
              </details>
            </li>
            <li>
              <details>
                <summary>useMemo 和 useCallback 本身也有开销，何时值得使用？</summary>
                <div className="rl-answer">
                  <p>
                    每次渲染时，<code>useMemo</code> 需要重新计算比较依赖是否变化，
                    <code>useCallback</code>{' '}
                    也需要检查。如果计算本身很轻量，记忆化的开销可能比重新计算还大。
                  </p>
                  <p>
                    <strong>值得用</strong>：① 计算复杂（如过滤/排序大数组）；② 作为 props 传给 memo
                    化的子组件；③ 作为 useEffect 的依赖。
                  </p>
                  <p>
                    <strong>不值得用</strong>：简单的字符串拼接、基本算术、不会传给子组件的值。
                  </p>
                </div>
              </details>
            </li>
          </ul>
          <h3>推荐资源</h3>
          <div className="rl-resources">
            <a
              className="rl-resource"
              href="https://react.dev/learn/render-and-commit"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="rl-res-icon">📖</span> Render and Commit
            </a>
          </div>
        </div>
      </div>
      <PageNav currentPath="/react-learning/performance" />
    </div>
  )
}

export default Performance
