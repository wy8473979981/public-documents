import { useState } from 'react'
import PageNav from '@/components/PageNav/PageNav'
import { interviewPages } from '../interviewPages'
import '../interview.css'

function InterviewPerformance() {
  const [filter, setFilter] = useState<'all' | 'easy' | 'medium' | 'hard'>('all')

  const qas = [
    {
      id: 1,
      level: 'easy' as const,
      question: 'React 中有哪些常见的性能优化手段？',
      answer: (
        <>
          <p>React 性能优化可以从以下几个维度入手：</p>
          <ol>
            <li>
              <strong>减少不必要的重渲染：</strong>React.memo、useMemo、useCallback
            </li>
            <li>
              <strong>减少渲染计算量：</strong>虚拟列表、代码分割、懒加载
            </li>
            <li>
              <strong>优化状态管理：</strong>状态下移、避免大 Context、合理拆分组件
            </li>
            <li>
              <strong>减少资源体积：</strong>Tree Shaking、动态导入、生产构建
            </li>
          </ol>
          <div className="iv-key-point">
            <strong>原则：</strong>不要过早优化！先用 React DevTools Profiler
            找到性能瓶颈，再针对性优化。
          </div>
        </>
      ),
    },
    {
      id: 2,
      level: 'easy' as const,
      question: 'React.memo 是什么？什么时候使用？',
      answer: (
        <>
          <p>
            <code>React.memo</code> 是一个<strong>高阶组件</strong>
            ，对函数组件做"浅比较"记忆化：如果 props 没有变化，则跳过重渲染，复用上次的渲染结果。
          </p>
          <pre>{`const ExpensiveList = React.memo(function ExpensiveList({ items }: Props) {
  return items.map(item => <ExpensiveItem key={item.id} {...item} />)
})

// 只有 items 引用变化时才会重渲染`}</pre>
          <p>注意事项：</p>
          <ul>
            <li>
              只做<strong>浅比较</strong>，对象/数组内容变化但引用不变时不会触发更新
            </li>
            <li>
              传入的回调函数如果每次都是新引用，会导致 memo 失效 → 配合 <code>useCallback</code>
            </li>
            <li>
              组件本身渲染很快时，memo 的开销可能比省掉的渲染还大 → <strong>不要滥用</strong>
            </li>
          </ul>
        </>
      ),
    },
    {
      id: 3,
      level: 'medium' as const,
      question: 'React 中如何实现代码分割和懒加载？',
      answer: (
        <>
          <p>
            使用 <code>React.lazy</code> + <code>Suspense</code> 实现组件级别的代码分割：
          </p>
          <pre>{`import { lazy, Suspense } from 'react'

// 动态导入，按需加载
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Settings = lazy(() => import('./pages/Settings'))

function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Suspense>
  )
}`}</pre>
          <p>常见的代码分割策略：</p>
          <ul>
            <li>
              <strong>路由级分割：</strong>每个路由页面作为一个 chunk（最常用）
            </li>
            <li>
              <strong>组件级分割：</strong>大型组件（图表、富文本编辑器）懒加载
            </li>
            <li>
              <strong>条件分割：</strong>只在特定条件下才渲染的组件（如模态框）
            </li>
          </ul>
        </>
      ),
    },
    {
      id: 4,
      level: 'medium' as const,
      question: '什么是虚拟列表（Virtual List）？什么时候使用？',
      answer: (
        <>
          <p>
            虚拟列表只渲染<strong>可视区域内的元素</strong>，无论列表有多长，DOM
            节点数量始终固定，解决大列表渲染卡顿问题。
          </p>
          <p>原理：</p>
          <ol>
            <li>计算可视区域能显示多少个元素（viewport / itemHeight）</li>
            <li>只渲染这部分元素，其余用空白占位</li>
            <li>滚动时动态计算偏移量，更新渲染范围</li>
          </ol>
          <pre>{`import { FixedSizeList } from 'react-window'

<FixedSizeList
  height={600}        // 可视区高度
  itemCount={10000}   // 总条数
  itemSize={50}       // 每项高度
  width="100%"
>
  {({ index, style }) => (
    <div style={style}>Row {index}</div>
  )}
</FixedSizeList>`}</pre>
          <p>常用库：</p>
          <ul>
            <li>
              <code>react-window</code>：轻量（~6 KB），推荐
            </li>
            <li>
              <code>react-virtuoso</code>：功能更丰富，支持动态高度
            </li>
          </ul>
        </>
      ),
    },
    {
      id: 5,
      level: 'medium' as const,
      question: '如何避免 React 组件不必要的重渲染？',
      answer: (
        <>
          <p>常见原因和解决方案：</p>
          <table className="iv-table">
            <thead>
              <tr>
                <th>原因</th>
                <th>解决方案</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>父组件重渲染导致子组件重渲染</td>
                <td>
                  <code>React.memo</code> 包裹子组件
                </td>
              </tr>
              <tr>
                <td>内联函数每次都是新引用</td>
                <td>
                  <code>useCallback</code> 缓存函数
                </td>
              </tr>
              <tr>
                <td>内联对象/数组每次都是新引用</td>
                <td>
                  <code>useMemo</code> 缓存对象
                </td>
              </tr>
              <tr>
                <td>Context value 变化导致所有消费者重渲染</td>
                <td>拆分 Context，useMemo 缓存 value</td>
              </tr>
              <tr>
                <td>状态下放不够</td>
                <td>将状态移动到真正需要它的子组件中</td>
              </tr>
            </tbody>
          </table>
          <div className="iv-key-point">
            <strong>状态下移原则：</strong>
            如果一个状态只被某个子组件使用，就把它放到那个子组件里，而不是放在父组件。
          </div>
        </>
      ),
    },
    {
      id: 6,
      level: 'hard' as const,
      question: 'React 的批量更新（Batching）机制是怎样的？',
      answer: (
        <>
          <p>
            批量更新是指 React 将<strong>多次 setState 合并为一次重渲染</strong>，减少渲染次数。
          </p>
          <p>React 18 之前：</p>
          <ul>
            <li>
              只在<strong>React 合成事件和生命周期</strong>中批量更新
            </li>
            <li>
              <code>setTimeout</code>、<code>Promise.then</code>、原生事件中每次 setState
              都会触发一次渲染
            </li>
          </ul>
          <p>React 18 之后（Automatic Batching）：</p>
          <ul>
            <li>
              <strong>所有场景</strong>都自动批量更新，包括 setTimeout、Promise、原生事件
            </li>
            <li>
              如需立即更新（如读取 DOM 尺寸），使用 <code>flushSync</code>
            </li>
          </ul>
          <pre>{`// React 18：两次 setState 只触发一次渲染
setTimeout(() => {
  setCount(c => c + 1)   // 不立即渲染
  setFlag(f => !f)       // 合并到一起渲染
}, 1000)

// 强制同步更新（罕见场景）
import { flushSync } from 'react-dom'
flushSync(() => setCount(c => c + 1))  // 立即渲染`}</pre>
        </>
      ),
    },
    {
      id: 7,
      level: 'hard' as const,
      question: '如何使用 React DevTools Profiler 分析性能？',
      answer: (
        <>
          <p>Profiler 可以记录每次渲染的耗时和原因，帮你找到性能瓶颈：</p>
          <ol>
            <li>
              <strong>打开 React DevTools → Profiler 面板</strong>
            </li>
            <li>
              <strong>点击 Record，执行要分析的操作</strong>，然后停止录制
            </li>
            <li>
              <strong>查看火焰图：</strong>每个色块代表一个组件，颜色越深渲染越慢
            </li>
          </ol>
          <p>重点关注：</p>
          <ul>
            <li>
              <strong>渲染原因：</strong>"Did not render"（被跳过）vs "The parent component
              rendered"
            </li>
            <li>
              <strong>渲染耗时：</strong>哪些组件耗时最长
            </li>
            <li>
              <strong>不必要的渲染：</strong>props 没变但还是重渲染了
            </li>
          </ul>
          <p>
            代码中也可以用 <code>{`<Profiler>`}</code> 组件编程式测量：
          </p>
          <pre>{`<Profiler id="Navigation" onRender={(id, phase, actualDuration) => {
  console.log(id, phase, actualDuration)  // 记录到分析平台
}}>
  <Navigation />
</Profiler>`}</pre>
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
      <h1>5. 性能优化面试题</h1>
      <p className="iv-subtitle">React.memo、代码分割、虚拟列表、批量更新等性能相关考点</p>

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

      <PageNav currentPath="/interview/performance" pages={interviewPages} />
    </div>
  )
}

export default InterviewPerformance
