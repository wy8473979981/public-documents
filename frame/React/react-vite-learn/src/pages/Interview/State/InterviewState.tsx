import { useState } from 'react'
import PageNav from '@/components/PageNav/PageNav'
import { interviewPages } from '../interviewPages'
import '../interview.css'

function InterviewState() {
  const [filter, setFilter] = useState<'all' | 'easy' | 'medium' | 'hard'>('all')

  const qas = [
    {
      id: 1,
      level: 'easy' as const,
      question: 'React 中有哪些状态管理方案？如何选择？',
      answer: (
        <>
          <table className="iv-table">
            <thead>
              <tr>
                <th>方案</th>
                <th>适用场景</th>
                <th>特点</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>useState</strong>
                </td>
                <td>组件内部简单状态</td>
                <td>最基础，无需额外库</td>
              </tr>
              <tr>
                <td>
                  <strong>useReducer</strong>
                </td>
                <td>复杂状态逻辑、多字段联动</td>
                <td>类 Redux 模式，可测试</td>
              </tr>
              <tr>
                <td>
                  <strong>Context API</strong>
                </td>
                <td>低频全局数据（主题、语言）</td>
                <td>内置，无需第三方库</td>
              </tr>
              <tr>
                <td>
                  <strong>Zustand</strong>
                </td>
                <td>中小型项目全局状态</td>
                <td>轻量、API 简洁</td>
              </tr>
              <tr>
                <td>
                  <strong>Redux Toolkit</strong>
                </td>
                <td>大型复杂应用</td>
                <td>可预测、时间旅行调试</td>
              </tr>
              <tr>
                <td>
                  <strong>React Query</strong>
                </td>
                <td>服务端状态（API 数据）</td>
                <td>缓存、同步、后台刷新</td>
              </tr>
            </tbody>
          </table>
          <div className="iv-key-point">
            <strong>选型建议：</strong>先确定状态类型——UI 状态用 useState/Zustand，服务端状态用
            React Query，全局配置用 Context。
          </div>
        </>
      ),
    },
    {
      id: 2,
      level: 'easy' as const,
      question: 'Context API 有什么性能问题？如何优化？',
      answer: (
        <>
          <p>
            Context 的<strong>核心问题</strong>：当 Context value 变化时，所有消费该 Context
            的组件都会重渲染，即使它们只用了 value 中的一部分。
          </p>
          <p>优化方案：</p>
          <ol>
            <li>
              <strong>拆分 Context：</strong>将频繁变化和不常变化的值分开放到不同 Context
              <pre>{`// 拆分为 UserContext 和 ThemeContext
const UserContext = createContext(user)
const ThemeContext = createContext(theme)`}</pre>
            </li>
            <li>
              <strong>useMemo 缓存 value：</strong>避免父组件重渲染时创建新对象
              <pre>{`const value = useMemo(() => ({ user, logout }), [user])
<UserContext.Provider value={value}>`}</pre>
            </li>
            <li>
              <strong>使用选择器库：</strong>
              <code>use-context-selector</code> 只订阅需要的字段
            </li>
          </ol>
        </>
      ),
    },
    {
      id: 3,
      level: 'medium' as const,
      question: 'Redux 的核心概念是什么？数据流是怎样的？',
      answer: (
        <>
          <p>Redux 三大原则：</p>
          <ol>
            <li>
              <strong>单一数据源：</strong>整个应用的 state 存储在一棵对象树（Store）中
            </li>
            <li>
              <strong>State 只读：</strong>唯一改变 state 的方式是 dispatch action
            </li>
            <li>
              <strong>纯函数修改：</strong>Reducer 是纯函数，(state, action) =&gt; newState
            </li>
          </ol>
          <p>数据流（单向）：</p>
          <pre>{`用户操作 → dispatch(action) → Reducer → 新 State → UI 更新
   ↑                                                    ↓
   └────────────── 用户看到新 UI ←──────────────────────┘`}</pre>
          <pre>{`// Redux Toolkit 示例
const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: (state) => { state.value += 1 },
    addBy: (state, action) => { state.value += action.payload },
  }
})`}</pre>
        </>
      ),
    },
    {
      id: 4,
      level: 'medium' as const,
      question: 'Zustand 和 Redux 有什么区别？各自适合什么场景？',
      answer: (
        <>
          <table className="iv-table">
            <thead>
              <tr>
                <th>特性</th>
                <th>Redux Toolkit</th>
                <th>Zustand</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>概念复杂度</td>
                <td>Action + Reducer + Store</td>
                <td>直接定义 Store</td>
              </tr>
              <tr>
                <td>Provider 包裹</td>
                <td>需要</td>
                <td>不需要</td>
              </tr>
              <tr>
                <td>不可变性</td>
                <td>强制（immer 内置）</td>
                <td>可选（immer 中间件）</td>
              </tr>
              <tr>
                <td>DevTools</td>
                <td>内置，功能强大</td>
                <td>需配置中间件</td>
              </tr>
              <tr>
                <td>包大小</td>
                <td>~11 KB</td>
                <td>~1 KB</td>
              </tr>
              <tr>
                <td>TypeScript</td>
                <td>良好</td>
                <td>优秀，类型推导更好</td>
              </tr>
            </tbody>
          </table>
          <div className="iv-key-point">
            <strong>选择建议：</strong>小中型项目 →
            Zustand；大型应用、需要时间旅行调试或团队协作规范 → Redux Toolkit。
          </div>
        </>
      ),
    },
    {
      id: 5,
      level: 'medium' as const,
      question: '什么是 useReducer？和 useState 有什么区别？',
      answer: (
        <>
          <p>
            <code>useReducer</code> 是 <code>useState</code> 的增强版，适合
            <strong>复杂状态逻辑</strong>或<strong>多个子值联动</strong>的场景。
          </p>
          <pre>{`type State = { count: number; step: number }
type Action =
  | { type: 'increment' }
  | { type: 'decrement' }
  | { type: 'setStep'; payload: number }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'increment': return { ...state, count: state.count + state.step }
    case 'decrement': return { ...state, count: state.count - state.step }
    case 'setStep':   return { ...state, step: action.payload }
  }
}

const [state, dispatch] = useReducer(reducer, { count: 0, step: 1 })`}</pre>
          <p>与 useState 的对比：</p>
          <ul>
            <li>
              <strong>useState：</strong>状态简单，直接 set 新值
            </li>
            <li>
              <strong>useReducer：</strong>状态逻辑复杂，将更新逻辑集中到 reducer
              函数，便于测试和维护
            </li>
            <li>
              useReducer 返回的 <code>dispatch</code> 引用稳定，可避免向子组件传递回调函数
            </li>
          </ul>
        </>
      ),
    },
    {
      id: 6,
      level: 'hard' as const,
      question: '什么是 React Query / TanStack Query？它解决了什么问题？',
      answer: (
        <>
          <p>
            React Query 是<strong>服务端状态管理库</strong>
            ，专门解决数据获取、缓存、同步的问题，让你不再把 API 数据塞进 Redux/useState。
          </p>
          <p>解决的问题：</p>
          <ul>
            <li>手动管理 loading/error/success 状态繁琐</li>
            <li>重复请求、数据过时、缓存策略复杂</li>
            <li>竞态条件（快速切换页面时的旧请求覆盖新数据）</li>
          </ul>
          <pre>{`const { data, isLoading, error, refetch } = useQuery({
  queryKey: ['users', page],
  queryFn: () => fetchUsers(page),
  staleTime: 5 * 60 * 1000,    // 5分钟内视为新鲜数据
  gcTime: 10 * 60 * 1000,      // 10分钟后垃圾回收
})`}</pre>
          <div className="iv-key-point">
            <strong>核心概念：</strong>
            <code>queryKey</code> 是缓存的唯一标识；相同 key 的请求自动去重、共享数据。
          </div>
        </>
      ),
    },
    {
      id: 7,
      level: 'hard' as const,
      question: '状态管理中"服务端状态"和"客户端状态"有什么区别？为什么要分开管理？',
      answer: (
        <>
          <table className="iv-table">
            <thead>
              <tr>
                <th>类型</th>
                <th>客户端状态</th>
                <th>服务端状态</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>数据源</td>
                <td>本地（UI 交互产生）</td>
                <td>远程服务器</td>
              </tr>
              <tr>
                <td>示例</td>
                <td>表单输入、侧边栏展开、主题</td>
                <td>用户列表、商品信息、文章</td>
              </tr>
              <tr>
                <td>同步需求</td>
                <td>无需同步</td>
                <td>需要与服务端保持同步</td>
              </tr>
              <tr>
                <td>缓存需求</td>
                <td>简单</td>
                <td>复杂（失效、过期、乐观更新）</td>
              </tr>
              <tr>
                <td>推荐工具</td>
                <td>useState / Zustand / Redux</td>
                <td>React Query / SWR</td>
              </tr>
            </tbody>
          </table>
          <div className="iv-key-point">
            <strong>最佳实践：</strong>用 React Query 管理服务端状态，用 Zustand/useState
            管理客户端状态，职责清晰，代码更简洁。
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
      <h1>4. 状态管理面试题</h1>
      <p className="iv-subtitle">Context、Redux、Zustand、React Query 等状态管理方案的原理与选型</p>

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

      <PageNav currentPath="/interview/state" pages={interviewPages} />
    </div>
  )
}

export default InterviewState
