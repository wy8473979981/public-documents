import { useState } from 'react'
import { create } from 'zustand'
import CodeBlock from '@/components/CodeBlock/CodeBlock'
import SectionPath from '@/components/SectionPath/SectionPath'
import PageNav from '@/components/PageNav/PageNav'
import '../shared.css'
import './Zustand.css'

/* ---------- 代码示例 ---------- */

const installCode = `# 安装 Zustand
npm install zustand

# 如果使用 TypeScript，Zustand 自带类型声明，无需额外安装 @types`

const basicStoreCode = `// 1. 创建 Store（全局状态）
import { create } from 'zustand'

interface CounterState {
  count: number
  increment: () => void
  decrement: () => void
  reset: () => void
}

const useCounterStore = create<CounterState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
}))

// 2. 在组件中使用（无需 Provider 包裹！）
function Counter() {
  const { count, increment, decrement, reset } = useCounterStore()
  return (
    <div>
      <p>计数：{count}</p>
      <button onClick={increment}>+1</button>
      <button onClick={decrement}>-1</button>
      <button onClick={reset}>重置</button>
    </div>
  )
}`

const selectorCode = `// 选择器用法 —— 只订阅需要的字段，避免不必要的重渲染
function CountDisplay() {
  // 只订阅 count，increment 变化时不会重渲染此组件
  const count = useCounterStore((state) => state.count)
  return <span>{count}</span>
}

// 使用浅比较选择多个字段
function CounterActions() {
  const { increment, decrement } = useCounterStore(
    (state) => ({ increment: state.increment, decrement: state.decrement }),
    shallow  // 需要导入 shallow 比较函数
  )
  return (
    <>
      <button onClick={increment}>+1</button>
      <button onClick={decrement}>-1</button>
    </>
  )
}`

const middlewareCode = `// 中间件用法 —— persist 持久化到 localStorage
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ThemeState {
  theme: 'light' | 'dark'
  toggleTheme: () => void
}

const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'light',
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === 'light' ? 'dark' : 'light',
        })),
    }),
    { name: 'theme-storage' } // localStorage 的 key
  )
)

// 页面刷新后 theme 值依然保留！`

const asyncCode = `// 异步操作 —— 直接在 action 中使用 async/await
interface UserState {
  users: string[]
  loading: boolean
  error: string | null
  fetchUsers: () => Promise<void>
}

const useUserStore = create<UserState>((set) => ({
  users: [],
  loading: false,
  error: null,
  fetchUsers: async () => {
    set({ loading: true, error: null })
    try {
      const res = await fetch('/api/users')
      const data = await res.json()
      set({ users: data, loading: false })
    } catch (err) {
      set({ error: '获取用户失败', loading: false })
    }
  },
}))`

const sliceCode = `// 拆分 Store —— 大型项目推荐按功能拆分
// stores/counterSlice.ts
import { StateCreator } from 'zustand'

interface CounterSlice {
  count: number
  increment: () => void
  decrement: () => void
}

export const createCounterSlice: StateCreator<AppState, [], [], CounterSlice> = (set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
})

// stores/useAppStore.ts
import { create } from 'zustand'
import { createCounterSlice } from './counterSlice'
import { createUserSlice } from './userSlice'

type AppState = CounterSlice & UserSlice

const useAppStore = create<AppState>()((...a) => ({
  ...createCounterSlice(...a),
  ...createUserSlice(...a),
}))`

/* ---------- 实际可用的 Store（用于演示） ---------- */

// Demo 1: 计数器
interface DemoState {
  count: number
  increment: () => void
  decrement: () => void
  incrementBy: (n: number) => void
  reset: () => void
}

const useDemoStore = create<DemoState>((set) => ({
  count: 0,
  increment: () => set((s) => ({ count: s.count + 1 })),
  decrement: () => set((s) => ({ count: s.count - 1 })),
  incrementBy: (n) => set((s) => ({ count: s.count + n })),
  reset: () => set({ count: 0 }),
}))

// Demo 2: Todo 列表
interface Todo {
  id: number
  text: string
  completed: boolean
}

interface TodoState {
  todos: Todo[]
  filter: 'all' | 'active' | 'completed'
  addTodo: (text: string) => void
  toggleTodo: (id: number) => void
  removeTodo: (id: number) => void
  setFilter: (filter: 'all' | 'active' | 'completed') => void
  clearCompleted: () => void
}

const useTodoStore = create<TodoState>((set) => ({
  todos: [],
  filter: 'all',
  addTodo: (text) =>
    set((s) => ({
      todos: [...s.todos, { id: Date.now(), text, completed: false }],
    })),
  toggleTodo: (id) =>
    set((s) => ({
      todos: s.todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    })),
  removeTodo: (id) => set((s) => ({ todos: s.todos.filter((t) => t.id !== id) })),
  setFilter: (filter) => set({ filter }),
  clearCompleted: () => set((s) => ({ todos: s.todos.filter((t) => !t.completed) })),
}))

// Demo 3: 购物车
interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
}

interface CartState {
  items: CartItem[]
  addItem: (product: { id: number; name: string; price: number }) => void
  removeItem: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  clearCart: () => void
}

const useCartStore = create<CartState>((set) => ({
  items: [],
  addItem: (product) =>
    set((s) => {
      const existing = s.items.find((i) => i.id === product.id)
      if (existing) {
        return {
          items: s.items.map((i) => (i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i)),
        }
      }
      return { items: [...s.items, { ...product, quantity: 1 }] }
    }),
  removeItem: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
  updateQuantity: (id, quantity) =>
    set((s) => ({
      items:
        quantity <= 0
          ? s.items.filter((i) => i.id !== id)
          : s.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
    })),
  clearCart: () => set({ items: [] }),
}))

// Demo 4: 主题切换
interface ThemeStoreState {
  theme: 'light' | 'dark'
  toggleTheme: () => void
}

const useThemeStore = create<ThemeStoreState>((set) => ({
  theme: 'light',
  toggleTheme: () => set((s) => ({ theme: s.theme === 'light' ? 'dark' : 'light' })),
}))

/* ---------- Demo 子组件 ---------- */

/** 商品目录（购物车用） */
const products = [
  { id: 1, name: 'React 小册', price: 39 },
  { id: 2, name: 'TypeScript 指南', price: 29 },
  { id: 3, name: 'Vite 实战', price: 19 },
  { id: 4, name: 'CSS 秘籍', price: 25 },
]

function TodoDemo() {
  const { todos, filter, addTodo, toggleTodo, removeTodo, setFilter, clearCompleted } =
    useTodoStore()
  const [input, setInput] = useState('')

  const handleAdd = () => {
    const text = input.trim()
    if (!text) return
    addTodo(text)
    setInput('')
  }

  const filtered = todos.filter((t) => {
    if (filter === 'active') return !t.completed
    if (filter === 'completed') return t.completed
    return true
  })

  const activeCount = todos.filter((t) => !t.completed).length

  return (
    <div className="rl-demo-box">
      <div className="rl-demo-title">Interactive Demo - Todo Store</div>
      <div className="zustand-todo-input-row">
        <input
          type="text"
          placeholder="输入待办事项..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
        />
        <button onClick={handleAdd}>添加</button>
      </div>
      {todos.length > 0 && (
        <>
          <div className="zustand-todo-filters">
            {(['all', 'active', 'completed'] as const).map((f) => (
              <button
                key={f}
                className={filter === f ? 'zustand-filter-active' : ''}
                onClick={() => setFilter(f)}
              >
                {f === 'all' ? '全部' : f === 'active' ? '待办' : '已完成'}
              </button>
            ))}
            <span className="zustand-todo-count">{activeCount} 项待办</span>
          </div>
          <ul className="zustand-todo-list">
            {filtered.map((todo) => (
              <li key={todo.id} className={todo.completed ? 'zustand-todo-done' : ''}>
                <label>
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                  />
                  <span>{todo.text}</span>
                </label>
                <button className="zustand-todo-remove" onClick={() => removeTodo(todo.id)}>
                  ×
                </button>
              </li>
            ))}
            {filtered.length === 0 && (
              <li className="zustand-todo-empty">
                {filter === 'all' ? '暂无待办，添加一个吧！' : '没有匹配的项目'}
              </li>
            )}
          </ul>
          {todos.some((t) => t.completed) && (
            <button className="zustand-todo-clear" onClick={clearCompleted}>
              清除已完成
            </button>
          )}
        </>
      )}
    </div>
  )
}

function CartDemo() {
  const { items, addItem, removeItem, updateQuantity, clearCart } = useCartStore()

  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const totalCount = items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <div className="rl-demo-box">
      <div className="rl-demo-title">Interactive Demo - Cart Store</div>
      <div className="zustand-cart-products">
        <span className="zustand-cart-label">商品目录：</span>
        {products.map((p) => (
          <button key={p.id} onClick={() => addItem(p)}>
            {p.name}（¥{p.price}）
          </button>
        ))}
      </div>
      {items.length > 0 ? (
        <>
          <table className="zustand-cart-table">
            <thead>
              <tr>
                <th>商品</th>
                <th>单价</th>
                <th>数量</th>
                <th>小计</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>¥{item.price}</td>
                  <td>
                    <div className="zustand-qty-controls">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                    </div>
                  </td>
                  <td>¥{item.price * item.quantity}</td>
                  <td>
                    <button className="zustand-cart-remove" onClick={() => removeItem(item.id)}>
                      删除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="zustand-cart-summary">
            <span>
              共 <strong>{totalCount}</strong> 件商品，合计：
              <strong className="zustand-cart-total">¥{totalPrice}</strong>
            </span>
            <button onClick={clearCart}>清空购物车</button>
          </div>
        </>
      ) : (
        <div className="rl-demo-result">🛒 购物车是空的，点击上方商品添加</div>
      )}
    </div>
  )
}

function ThemeDemo() {
  const { theme, toggleTheme } = useThemeStore()
  const isDark = theme === 'dark'

  return (
    <div className="rl-demo-box">
      <div className="rl-demo-title">Interactive Demo - Theme Store</div>
      <button onClick={toggleTheme}>{isDark ? '☀️ 切换亮色' : '🌙 切换暗色'}</button>
      <div
        className="zustand-theme-preview"
        style={{
          background: isDark ? '#1a1a2e' : '#ffffff',
          color: isDark ? '#e0e0e0' : '#333333',
          borderColor: isDark ? '#444' : '#e8e8e8',
        }}
      >
        <p>
          当前主题：<strong>{theme}</strong>
        </p>
        <p>这是一个主题预览区域。点击按钮切换主题，观察状态变化。</p>
        <p style={{ fontSize: 12, opacity: 0.7 }}>
          💡 在实际项目中，配合 persist 中间件可以实现刷新后主题不丢失。
        </p>
      </div>
      <div className="rl-demo-result">
        useThemeStore.theme = <strong>{theme}</strong>
      </div>
    </div>
  )
}

/* ---------- 页面组件 ---------- */

function Zustand() {
  const { count, increment, decrement, incrementBy, reset } = useDemoStore()

  const [inputVal, setInputVal] = useState(5)

  return (
    <div className="rl-page">
      <h1>Zustand 状态管理</h1>
      <p className="rl-subtitle">轻量、现代的状态管理库 —— 极简 API，无需 Provider，开箱即用</p>

      <SectionPath />

      {/* ===== 概念 ===== */}
      <div className="rl-section concept" id="section-concept">
        <div className="rl-section-header">
          <span className="rl-icon">💡</span> 理解概念 — What & Why
        </div>
        <div className="rl-section-body">
          <h3>Zustand 是什么？</h3>
          <p>
            Zustand（德语"状态"）是一个<strong>轻量级 React 状态管理库</strong>。 它用 Hooks
            的方式管理全局状态，API 极其简洁，没有 Provider 包裹、没有 reducer 模板代码，
            几行代码就能创建一个功能完备的全局 Store。
          </p>

          <div className="rl-concept-cards">
            <div className="rl-concept-card">
              <div className="rl-card-title">🪝 Hook 驱动</div>
              <div className="rl-card-desc">
                通过 <code>useStore()</code> Hook 直接读取状态，和 useState 一样自然
              </div>
            </div>
            <div className="rl-concept-card">
              <div className="rl-card-title">🚫 无 Provider</div>
              <div className="rl-card-desc">
                不需要在根组件包裹 Provider，任何组件都能直接使用 Store
              </div>
            </div>
            <div className="rl-concept-card">
              <div className="rl-card-title">🎯 精准订阅</div>
              <div className="rl-card-desc">
                通过选择器只订阅需要的字段，其他字段变化不会触发重渲染
              </div>
            </div>
            <div className="rl-concept-card">
              <div className="rl-card-title">🧩 中间件机制</div>
              <div className="rl-card-desc">
                内置 persist（持久化）、devtools（调试）、immer（不可变更新）等中间件
              </div>
            </div>
          </div>

          <h3>为什么选择 Zustand？</h3>
          <ul>
            <li>
              <strong>极简 API</strong>：核心只有一个 <code>create</code> 函数，5 分钟上手
            </li>
            <li>
              <strong>无模板代码</strong>：不需要 action type、action creator、reducer
            </li>
            <li>
              <strong>TypeScript 友好</strong>：自带类型声明，泛型推导完善
            </li>
            <li>
              <strong>性能优秀</strong>：基于发布-订阅模式，精准订阅避免不必要渲染
            </li>
            <li>
              <strong>体积极小</strong>：gzip 后仅约 1KB
            </li>
            <li>
              <strong>中间件丰富</strong>：persist、devtools、immer 等开箱即用
            </li>
          </ul>

          <h3>适用场景</h3>
          <div className="zustand-scenarios">
            <div className="zustand-scenario">
              <div className="zustand-scenario-icon">🛒</div>
              <div className="zustand-scenario-title">电商购物车</div>
              <div className="zustand-scenario-desc">
                商品增删、数量修改、总价计算，多组件共享状态
              </div>
            </div>
            <div className="zustand-scenario">
              <div className="zustand-scenario-icon">👤</div>
              <div className="zustand-scenario-title">用户认证</div>
              <div className="zustand-scenario-desc">
                登录状态、用户信息、Token 管理，跨页面共享
              </div>
            </div>
            <div className="zustand-scenario">
              <div className="zustand-scenario-icon">🎨</div>
              <div className="zustand-scenario-title">主题/设置</div>
              <div className="zustand-scenario-desc">
                全局主题切换、语言偏好，配合 persist 持久化
              </div>
            </div>
            <div className="zustand-scenario">
              <div className="zustand-scenario-icon">📝</div>
              <div className="zustand-scenario-title">表单向导</div>
              <div className="zustand-scenario-desc">多步骤表单数据暂存，步骤间共享中间状态</div>
            </div>
            <div className="zustand-scenario">
              <div className="zustand-scenario-icon">🎮</div>
              <div className="zustand-scenario-title">游戏/画布状态</div>
              <div className="zustand-scenario-desc">
                游戏分数、画布图层、撤销/重做等频繁更新场景
              </div>
            </div>
            <div className="zustand-scenario">
              <div className="zustand-scenario-icon">📡</div>
              <div className="zustand-scenario-title">异步数据缓存</div>
              <div className="zustand-scenario-desc">API 请求结果缓存、loading/error 状态管理</div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== 用法 ===== */}
      <div className="rl-section usage" id="section-usage">
        <div className="rl-section-header">
          <span className="rl-icon">⚙️</span> 掌握用法 — How
        </div>
        <div className="rl-section-body">
          <h3>1. 安装</h3>
          <CodeBlock code={installCode} language="bash" title="安装命令" />

          <h3>2. 创建 Store 并在组件中使用</h3>
          <p>
            用 <code>create()</code> 定义状态和修改方法，组件中通过 <code>useStore()</code> Hook
            直接使用，无需 Provider：
          </p>
          <CodeBlock
            code={basicStoreCode}
            language="tsx"
            title="基本用法 —— 创建 Store + 组件消费"
          />

          <h3>3. 选择器（Selector）—— 精准订阅</h3>
          <p>通过选择器函数只订阅需要的字段，避免 Store 中其他状态变化导致不必要的重渲染：</p>
          <CodeBlock code={selectorCode} language="tsx" title="选择器用法" />

          <h3>4. 中间件 —— persist 持久化</h3>
          <p>
            Zustand 内置中间件机制，最常用的 <code>persist</code> 可以自动将状态同步到
            localStorage，刷新页面不丢失：
          </p>
          <CodeBlock code={middlewareCode} language="tsx" title="persist 中间件" />

          <h3>5. 异步操作</h3>
          <p>Zustand 的 action 可以直接使用 async/await，无需额外中间件：</p>
          <CodeBlock code={asyncCode} language="tsx" title="异步 action" />

          <h3>6. 拆分 Store（大型项目）</h3>
          <p>当 Store 变大时，可以按功能拆分为多个 Slice，再合并到一个 Store 中：</p>
          <CodeBlock code={sliceCode} language="tsx" title="Slice 模式" />
        </div>
      </div>

      {/* ===== 实践 ===== */}
      <div className="rl-section practice" id="section-practice">
        <div className="rl-section-header">
          <span className="rl-icon">🛠️</span> 动手实践 — Do
        </div>
        <div className="rl-section-body">
          <h3>Demo 1：Zustand 计数器（真实 Store）</h3>
          <div className="rl-demo-box">
            <div className="rl-demo-title">Interactive Demo - 使用真实 Zustand Store</div>
            <div className="zustand-demo-controls">
              <button onClick={increment}>+1</button>
              <button onClick={decrement}>-1</button>
              <button onClick={() => incrementBy(inputVal)}>+{inputVal}</button>
              <button onClick={reset}>重置</button>
              <label className="zustand-sr-only" htmlFor="increment-val">
                递增值
              </label>
              <input
                id="increment-val"
                type="number"
                value={inputVal}
                onChange={(e) => setInputVal(Number(e.target.value) || 0)}
                style={{ width: 60 }}
              />
            </div>
            <div className="rl-demo-result">
              useDemoStore.count = <strong>{count}</strong>
            </div>
          </div>

          <div className="rl-tip info">
            💡 上面的计数器使用的是页面内创建的真实 Zustand Store。打开 React DevTools
            可以观察到：只有使用了 <code>count</code> 的组件才会因 count 变化而重渲染。
          </div>

          <h3>Demo 2：Todo 待办应用（增删改查 + 筛选）</h3>
          <TodoDemo />

          <h3>Demo 3：购物车（精准订阅 + 计算属性）</h3>
          <CartDemo />

          <h3>Demo 4：主题切换（模拟 persist 效果）</h3>
          <ThemeDemo />

          <h3>推荐练习</h3>
          <ul className="rl-exercises">
            <li>
              <span className="rl-ex-num">1</span>
              <div className="rl-ex-content">
                <div className="rl-ex-title">Todo + 持久化</div>
                <div className="rl-ex-desc">
                  给上面的 Todo 应用添加 persist 中间件，刷新页面后数据不丢失
                </div>
              </div>
            </li>
            <li>
              <span className="rl-ex-num">2</span>
              <div className="rl-ex-content">
                <div className="rl-ex-title">购物车优惠计算</div>
                <div className="rl-ex-desc">
                  在购物车 Demo 基础上增加满减优惠逻辑（如满 100 打 8 折）
                </div>
              </div>
            </li>
            <li>
              <span className="rl-ex-num">3</span>
              <div className="rl-ex-content">
                <div className="rl-ex-title">异步数据获取</div>
                <div className="rl-ex-desc">
                  实现一个 Store 管理 API 请求的 data / loading / error 状态
                </div>
              </div>
            </li>
            <li>
              <span className="rl-ex-num">4</span>
              <div className="rl-ex-content">
                <div className="rl-ex-title">Slice 模式拆分</div>
                <div className="rl-ex-desc">
                  将 Todo + Cart + Theme 合并到一个 useAppStore 中，体会 Slice 模式
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* ===== 扩展 ===== */}
      <div className="rl-section connect" id="section-connect">
        <div className="rl-section-header">
          <span className="rl-icon">🔗</span> 反思与扩展 — Think & Connect
        </div>
        <div className="rl-section-body">
          <h3>状态管理方案对比</h3>
          <table className="rl-compare-table">
            <thead>
              <tr>
                <th>特性</th>
                <th>Zustand</th>
                <th>Redux Toolkit</th>
                <th>Context + useReducer</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>包体积</strong>
                </td>
                <td>~1 KB</td>
                <td>~11 KB</td>
                <td>0（内置）</td>
              </tr>
              <tr>
                <td>
                  <strong>Provider</strong>
                </td>
                <td>不需要</td>
                <td>需要</td>
                <td>需要</td>
              </tr>
              <tr>
                <td>
                  <strong>模板代码</strong>
                </td>
                <td>极少</td>
                <td>较多</td>
                <td>中等</td>
              </tr>
              <tr>
                <td>
                  <strong>TypeScript</strong>
                </td>
                <td>自带类型</td>
                <td>自带类型</td>
                <td>需手动定义</td>
              </tr>
              <tr>
                <td>
                  <strong>DevTools</strong>
                </td>
                <td>中间件支持</td>
                <td>内置</td>
                <td>无</td>
              </tr>
              <tr>
                <td>
                  <strong>学习曲线</strong>
                </td>
                <td>低</td>
                <td>中高</td>
                <td>低</td>
              </tr>
              <tr>
                <td>
                  <strong>适用规模</strong>
                </td>
                <td>小到大型</td>
                <td>中到大型</td>
                <td>小到中型</td>
              </tr>
            </tbody>
          </table>

          <h3>延伸思考</h3>
          <ul className="rl-think-list">
            <li>
              <details>
                <summary>Zustand 为什么不需要 Provider？</summary>
                <div className="rl-answer">
                  <p>
                    Zustand 的 Store 是一个独立的发布-订阅容器，不依赖 React Context。
                    <code>create()</code> 返回的 Hook 内部通过 <code>useSyncExternalStore</code>{' '}
                    直接订阅 Store 的变化，因此无需在组件树顶层注入 Provider。
                  </p>
                  <p>
                    这也是 Zustand 性能好的原因之一：Context 变化会导致所有消费者重渲染， 而 Zustand
                    的选择器可以精确控制哪个组件订阅哪个字段。
                  </p>
                </div>
              </details>
            </li>
            <li>
              <details>
                <summary>Zustand 和 Redux 该怎么选？</summary>
                <div className="rl-answer">
                  <p>
                    <strong>选 Zustand</strong>：项目规模中小、追求开发效率、团队对 Redux
                    不熟悉、不想写大量模板代码。
                  </p>
                  <p>
                    <strong>选 Redux Toolkit</strong>：大型团队需要严格规范、需要 Redux DevTools
                    的时间旅行调试、已有 Redux 技术栈积累、需要 RTK Query 的数据获取能力。
                  </p>
                  <p>简单原则：新项目默认 Zustand，遇到复杂调试需求再考虑 Redux。</p>
                </div>
              </details>
            </li>
            <li>
              <details>
                <summary>persist 中间件的底层原理是什么？</summary>
                <div className="rl-answer">
                  <p>
                    <code>persist</code> 中间件在 Store 初始化时从 <code>localStorage</code>{' '}
                    （或其他存储引擎）读取已保存的状态，合并到 initialState 中。每次{' '}
                    <code>set()</code> 调用后，中间件会自动将最新状态序列化写入存储。
                  </p>
                  <p>
                    它还支持自定义 <code>storage</code> 引擎（如 AsyncStorage、sessionStorage）、
                    <code>partialize</code> 函数（只持久化部分字段）、以及 <code>onRehydrate</code>{' '}
                    回调（水合完成后的钩子）。
                  </p>
                </div>
              </details>
            </li>
          </ul>

          <h3>推荐资源</h3>
          <div className="rl-resources">
            <a
              className="rl-resource"
              href="https://docs.pmnd.rs/zustand/getting-started/introduction"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="rl-res-icon">📖</span> Zustand 官方文档
            </a>
            <a
              className="rl-resource"
              href="https://github.com/pmndrs/zustand"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="rl-res-icon">🐙</span> Zustand GitHub 仓库
            </a>
          </div>
        </div>
      </div>

      <PageNav currentPath="/react-learning/zustand" />
    </div>
  )
}

export default Zustand
