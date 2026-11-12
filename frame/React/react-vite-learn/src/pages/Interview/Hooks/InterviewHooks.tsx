import { useState } from 'react'
import PageNav from '@/components/PageNav/PageNav'
import { interviewPages } from '../interviewPages'
import '../interview.css'

function InterviewHooks() {
  const [filter, setFilter] = useState<'all' | 'easy' | 'medium' | 'hard'>('all')

  const qas = [
    {
      id: 1,
      level: 'easy' as const,
      question: 'React Hooks 是什么？为什么要使用 Hooks？',
      answer: (
        <>
          <p>
            Hooks 是 React 16.8 引入的特性，让<strong>函数组件</strong>也能使用状态、生命周期等
            React 特性，无需编写类组件。
          </p>
          <p>使用 Hooks 的好处：</p>
          <ul>
            <li>
              <strong>简化逻辑复用：</strong>无需 HOC 或 Render Props，通过自定义 Hook
              即可复用状态逻辑
            </li>
            <li>
              <strong>代码更简洁：</strong>函数组件比类组件代码量更少，更易理解
            </li>
            <li>
              <strong>逻辑聚合：</strong>相关逻辑不再分散在多个生命周期方法中
            </li>
            <li>
              <strong>避免 this 问题：</strong>函数组件没有 this 指向的困扰
            </li>
          </ul>
        </>
      ),
    },
    {
      id: 2,
      level: 'easy' as const,
      question: 'useState 的工作原理是什么？',
      answer: (
        <>
          <p>
            <code>useState</code> 是最基础的 Hook，用于在函数组件中添加状态。
          </p>
          <pre>{`const [count, setCount] = useState(0)`}</pre>
          <p>工作原理：</p>
          <ul>
            <li>
              React 在内部维护一个<strong>状态数组（Fiber 节点的 memoizedState）</strong>，每次调用
              useState 就按顺序追加一个状态槽
            </li>
            <li>
              <code>setCount</code> 不会直接修改状态，而是将新值放入更新队列，等 React
              下次渲染时批量处理
            </li>
            <li>
              React 18 起，所有 setState 都是<strong>批量更新</strong>（包括 setTimeout、Promise
              回调中）
            </li>
          </ul>
          <div className="iv-key-point">
            <strong>注意：</strong>
            <code>useState</code> 的 setter
            是异步的，不能立即拿到最新值。如需立即获取，可使用函数式更新{' '}
            <code>setCount(prev ={'>'} prev + 1)</code>。
          </div>
        </>
      ),
    },
    {
      id: 3,
      level: 'easy' as const,
      question: 'Hooks 的使用规则有哪些？为什么有这些规则？',
      answer: (
        <>
          <p>Hooks 有两条核心规则：</p>
          <ol>
            <li>
              <strong>只在最顶层调用：</strong>不能在循环、条件判断、嵌套函数中调用 Hooks
            </li>
            <li>
              <strong>只在 React 函数组件或自定义 Hook 中调用：</strong>不能在普通 JS 函数中调用
            </li>
          </ol>
          <p>为什么有这些规则？</p>
          <p>
            React 依赖 Hooks <strong>调用顺序</strong>来关联状态和对应的 Hook。每次渲染时，React
            按相同顺序执行 Hooks，从而正确地将内部状态分配给对应的 Hook。
          </p>
          <pre>{`// ❌ 错误：条件调用，顺序可能改变
if (condition) {
  const [x, setX] = useState(0)  // 第1次渲染：槽位1
}

// ✅ 正确：始终在顶层调用
const [x, setX] = useState(0)    // 每次渲染都在槽位1`}</pre>
          <div className="iv-key-point">
            <strong>工具推荐：</strong>使用 <code>eslint-plugin-react-hooks</code>{' '}
            自动检测违规调用。
          </div>
        </>
      ),
    },
    {
      id: 4,
      level: 'medium' as const,
      question: 'useEffect 和 useLayoutEffect 有什么区别？',
      answer: (
        <>
          <table className="iv-table">
            <thead>
              <tr>
                <th>特性</th>
                <th>useEffect</th>
                <th>useLayoutEffect</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>执行时机</td>
                <td>
                  浏览器绘制<strong>之后</strong>（异步）
                </td>
                <td>
                  浏览器绘制<strong>之前</strong>（同步）
                </td>
              </tr>
              <tr>
                <td>阻塞渲染</td>
                <td>不阻塞</td>
                <td>阻塞</td>
              </tr>
              <tr>
                <td>适用场景</td>
                <td>数据请求、订阅、日志</td>
                <td>DOM 测量、同步修改 DOM、避免闪烁</td>
              </tr>
            </tbody>
          </table>
          <pre>{`// 使用 useLayoutEffect 避免闪烁
useLayoutEffect(() => {
  // 在浏览器绘制前同步执行，用户看不到中间状态
  const rect = divRef.current.getBoundingClientRect()
  setPosition({ top: rect.bottom, left: rect.left })
}, [])`}</pre>
          <div className="iv-key-point">
            <strong>原则：</strong>大多数情况用 useEffect，只有需要在绘制前同步修改 DOM 时才用
            useLayoutEffect。
          </div>
        </>
      ),
    },
    {
      id: 5,
      level: 'medium' as const,
      question: 'useMemo 和 useCallback 有什么区别？什么时候使用？',
      answer: (
        <>
          <p>
            两者都用于<strong>性能优化</strong>，避免不必要的重新计算或子组件重渲染：
          </p>
          <table className="iv-table">
            <thead>
              <tr>
                <th>Hook</th>
                <th>缓存内容</th>
                <th>典型场景</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <code>useMemo</code>
                </td>
                <td>计算结果</td>
                <td>复杂数组过滤、大数据计算</td>
              </tr>
              <tr>
                <td>
                  <code>useCallback</code>
                </td>
                <td>函数引用</td>
                <td>传给子组件的回调函数</td>
              </tr>
            </tbody>
          </table>
          <pre>{`// useMemo：缓存计算结果
const sortedList = useMemo(() => {
  return items.filter(item => item.active).sort((a, b) => a.name.localeCompare(b.name))
}, [items])

// useCallback：缓存函数引用
const handleClick = useCallback((id: number) => {
  setSelected(id)
}, [])  // 依赖为空，函数引用永不变`}</pre>
          <div className="iv-key-point">
            <strong>不要滥用！</strong>每次调用 useMemo/useCallback
            都有开销（依赖比较）。只在子组件使用 <code>React.memo</code> 或计算确实昂贵时才使用。
          </div>
        </>
      ),
    },
    {
      id: 6,
      level: 'medium' as const,
      question: 'useRef 有什么用途？它和 useState 的区别？',
      answer: (
        <>
          <p>
            <code>useRef</code> 返回一个 <code>{`{ current: value }`}</code> 对象，有两个主要用途：
          </p>
          <ol>
            <li>
              <strong>访问 DOM 节点：</strong>
              <pre>{`const inputRef = useRef<HTMLInputElement>(null)
// 使用：inputRef.current?.focus()`}</pre>
            </li>
            <li>
              <strong>保存跨渲染的可变值：</strong>修改 <code>.current</code> 不会触发重渲染
              <pre>{`const timerRef = useRef<number | null>(null)
timerRef.current = setInterval(() => {...}, 1000)
// 清理：clearInterval(timerRef.current)`}</pre>
            </li>
          </ol>
          <p>与 useState 的区别：</p>
          <table className="iv-table">
            <thead>
              <tr>
                <th>特性</th>
                <th>useState</th>
                <th>useRef</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>修改触发重渲染</td>
                <td>是</td>
                <td>否</td>
              </tr>
              <tr>
                <td>每次渲染值相同</td>
                <td>否（可能更新）</td>
                <td>是（同一对象引用）</td>
              </tr>
              <tr>
                <td>适用场景</td>
                <td>驱动 UI 更新的数据</td>
                <td>不需要触发渲染的值、DOM 引用</td>
              </tr>
            </tbody>
          </table>
        </>
      ),
    },
    {
      id: 7,
      level: 'hard' as const,
      question: '如何理解 useEffect 的依赖数组？空数组和不传的区别？',
      answer: (
        <>
          <table className="iv-table">
            <thead>
              <tr>
                <th>写法</th>
                <th>执行时机</th>
                <th>类似类组件生命周期</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <code>useEffect(fn)</code>
                </td>
                <td>每次渲染后都执行</td>
                <td>componentDidMount + componentDidUpdate</td>
              </tr>
              <tr>
                <td>
                  <code>useEffect(fn, [])</code>
                </td>
                <td>只在挂载时执行一次</td>
                <td>componentDidMount</td>
              </tr>
              <tr>
                <td>
                  <code>useEffect(fn, [a, b])</code>
                </td>
                <td>a 或 b 变化时执行</td>
                <td>componentDidUpdate（带条件）</td>
              </tr>
              <tr>
                <td>
                  <code>return () =&gt; cleanup</code>
                </td>
                <td>卸载或下次 effect 执行前</td>
                <td>componentWillUnmount</td>
              </tr>
            </tbody>
          </table>
          <div className="iv-key-point">
            <strong>常见 bug：</strong>依赖数组中漏掉某个变量，导致 effect
            拿到的是"旧值"（闭包陷阱）。可用 <code>useRef</code> 保存最新值，或使用函数式 setState
            规避。
          </div>
        </>
      ),
    },
    {
      id: 8,
      level: 'hard' as const,
      question: '自定义 Hook 的设计原则和常见场景有哪些？',
      answer: (
        <>
          <p>
            自定义 Hook 是以 <code>use</code> 开头的普通函数，内部可以调用其他 Hooks，用于
            <strong>封装和复用有状态的逻辑</strong>。
          </p>
          <p>设计原则：</p>
          <ul>
            <li>
              <strong>命名以 use 开头：</strong>让 React 识别并强制遵循 Hook 规则
            </li>
            <li>
              <strong>单一职责：</strong>每个 Hook 只做一件事
            </li>
            <li>
              <strong>返回值清晰：</strong>返回组件需要的状态和操作函数
            </li>
          </ul>
          <pre>{`// 常见自定义 Hook 示例
useLocalStorage('key', defaultValue)   // 持久化状态
useDebounce(value, delay)              // 防抖值
useFetch(url)                          // 数据请求
useWindowSize()                        // 窗口尺寸
useClickOutside(ref, handler)          // 点击外部
usePrevious(value)                     // 上一次的值`}</pre>
          <div className="iv-key-point">
            <strong>注意：</strong>自定义 Hook 复用的是<strong>逻辑</strong>
            ，不是状态本身。不同组件调用同一自定义 Hook，各自的状态是独立的。
          </div>
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
      <h1>2. React Hooks 面试题</h1>
      <p className="iv-subtitle">
        深入理解 useState、useEffect、useMemo 等核心 Hooks 的原理和使用技巧
      </p>

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

      <PageNav currentPath="/interview/hooks" pages={interviewPages} />
    </div>
  )
}

export default InterviewHooks
