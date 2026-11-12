import { useState } from 'react'
import CodeBlock from '@/components/CodeBlock/CodeBlock'
import SectionPath from '@/components/SectionPath/SectionPath'
import PageNav from '@/components/PageNav/PageNav'
import '../shared.css'

const reduxBasicCode = `// Redux Toolkit 基本用法
import { configureStore, createSlice } from '@reduxjs/toolkit'
import { Provider, useSelector, useDispatch } from 'react-redux'

// 1. 创建 Slice（包含 reducer 和 actions）
const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: (state) => { state.value += 1 },
    decrement: (state) => { state.value -= 1 },
    incrementBy: (state, action) => { state.value += action.payload },
  },
})

const { increment, decrement, incrementBy } = counterSlice.actions

// 2. 配置 Store
const store = configureStore({
  reducer: { counter: counterSlice.reducer },
})

// 3. 在组件中使用
function Counter() {
  const count = useSelector(state => state.counter.value)
  const dispatch = useDispatch()
  return (
    <div>
      <p>计数：{count}</p>
      <button onClick={() => dispatch(increment())}>+1</button>
      <button onClick={() => dispatch(decrement())}>-1</button>
      <button onClick={() => dispatch(incrementBy(5))}>+5</button>
    </div>
  )
}`

const reduxAsyncCode = `// 异步操作（createAsyncThunk）
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

const fetchUsers = createAsyncThunk('users/fetch', async () => {
  const res = await fetch('/api/users')
  return res.json()
})

const usersSlice = createSlice({
  name: 'users',
  initialState: { list: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => { state.loading = true })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false
        state.list = action.payload
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  },
})`

function Redux() {
  const [count, setCount] = useState(0)

  return (
    <div className="rl-page">
      <h1>10. Redux 状态管理</h1>
      <p className="rl-subtitle">可预测的状态容器 —— 管理复杂应用状态的行业标准方案</p>

      <SectionPath />

      <div className="rl-section concept" id="section-concept">
        <div className="rl-section-header">
          <span className="rl-icon">💡</span> 理解概念 — What & Why
        </div>
        <div className="rl-section-body">
          <h3>Redux 是什么？</h3>
          <p>
            Redux 是一个<strong>可预测的状态容器</strong>。所有状态存在一个 Store 中，通过 Action
            描述"发生了什么"，Reducer 根据 Action 更新状态。
          </p>
          <div className="rl-concept-cards">
            <div className="rl-concept-card">
              <div className="rl-card-title">🏪 Store</div>
              <div className="rl-card-desc">存储应用状态的单一数据源（Single Source of Truth）</div>
            </div>
            <div className="rl-concept-card">
              <div className="rl-card-title">📢 Action</div>
              <div className="rl-card-desc">描述"发生了什么"的普通对象，如 type: 'INCREMENT'</div>
            </div>
            <div className="rl-concept-card">
              <div className="rl-card-title">⚙️ Reducer</div>
              <div className="rl-card-desc">纯函数，根据 Action 计算新的 State</div>
            </div>
            <div className="rl-concept-card">
              <div className="rl-card-title">📤 Dispatch</div>
              <div className="rl-card-desc">发送 Action 到 Store 的唯一方式</div>
            </div>
          </div>
          <h3>什么时候需要 Redux？</h3>
          <ul>
            <li>应用状态复杂，多个不相关组件需要共享状态</li>
            <li>状态更新逻辑复杂（如乐观更新、撤销/重做）</li>
            <li>需要时间旅行调试（Time Travel Debugging）</li>
            <li>中等以上规模的团队协作项目</li>
          </ul>
        </div>
      </div>

      <div className="rl-section usage" id="section-usage">
        <div className="rl-section-header">
          <span className="rl-icon">⚙️</span> 掌握用法 — How
        </div>
        <div className="rl-section-body">
          <h3>Redux Toolkit（推荐方式）</h3>
          <CodeBlock code={reduxBasicCode} language="jsx" title="Redux Toolkit 完整示例" />
          <h3>异步操作</h3>
          <CodeBlock code={reduxAsyncCode} language="jsx" title="createAsyncThunk 处理异步" />
        </div>
      </div>

      <div className="rl-section practice" id="section-practice">
        <div className="rl-section-header">
          <span className="rl-icon">🛠️</span> 动手实践 — Do
        </div>
        <div className="rl-section-body">
          <h3>试一试：模拟 Redux 计数器</h3>
          <div className="rl-demo-box">
            <div className="rl-demo-title">Interactive Demo - 计数器（Redux 风格）</div>
            <button onClick={() => setCount(count + 1)}>increment</button>
            <button onClick={() => setCount(count - 1)}>decrement</button>
            <button onClick={() => setCount(count + 5)}>incrementBy(5)</button>
            <button onClick={() => setCount(0)}>reset</button>
            <div className="rl-demo-result">
              store.counter.value = <strong>{count}</strong>
            </div>
          </div>
          <h3>推荐练习</h3>
          <ul className="rl-exercises">
            <li>
              <span className="rl-ex-num">1</span>
              <div className="rl-ex-content">
                <div className="rl-ex-title">Todo 应用</div>
                <div className="rl-ex-desc">用 Redux Toolkit 实现增删改查的 Todo 应用</div>
              </div>
            </li>
            <li>
              <span className="rl-ex-num">2</span>
              <div className="rl-ex-content">
                <div className="rl-ex-title">购物车</div>
                <div className="rl-ex-desc">实现商品添加、删除、数量修改和总价计算</div>
              </div>
            </li>
            <li>
              <span className="rl-ex-num">3</span>
              <div className="rl-ex-content">
                <div className="rl-ex-title">异步数据获取</div>
                <div className="rl-ex-desc">
                  用 createAsyncThunk 获取 API 数据并处理 loading/error 状态
                </div>
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
          <h3>状态管理方案对比</h3>
          <table className="rl-compare-table">
            <thead>
              <tr>
                <th>方案</th>
                <th>复杂度</th>
                <th>适用场景</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>useState</strong>
                </td>
                <td>低</td>
                <td>组件内部简单状态</td>
              </tr>
              <tr>
                <td>
                  <strong>Context</strong>
                </td>
                <td>低</td>
                <td>低频全局数据（主题、语言）</td>
              </tr>
              <tr>
                <td>
                  <strong>Redux Toolkit</strong>
                </td>
                <td>高</td>
                <td>复杂状态逻辑的大型应用</td>
              </tr>
              <tr>
                <td>
                  <strong>Zustand</strong>
                </td>
                <td>中</td>
                <td>中等复杂度的轻量替代</td>
              </tr>
              <tr>
                <td>
                  <strong>Jotai</strong>
                </td>
                <td>中</td>
                <td>原子化状态，适合细粒度更新</td>
              </tr>
            </tbody>
          </table>

          <h3>延伸思考</h3>
          <ul className="rl-think-list">
            <li>
              <details>
                <summary>Redux 的三个核心原则是什么？</summary>
                <div className="rl-answer">
                  <p>
                    ① <strong>单一数据源</strong>（Single Source of Truth）：整个应用的状态存在一个
                    Store 中。
                  </p>
                  <p>
                    ② <strong>State 是只读的</strong>（State is Read-Only）：唯一改变 State
                    的方式是触发 Action。
                  </p>
                  <p>
                    ③ <strong>用纯函数执行修改</strong>（Changes are Made with Pure
                    Functions）：Reducer 必须是纯函数，根据 Action 返回新 State，不修改原 State。
                  </p>
                </div>
              </details>
            </li>
            <li>
              <details>
                <summary>Redux Toolkit 解决了 Redux 的哪些痛点？</summary>
                <div className="rl-answer">
                  <p>
                    传统 Redux 的痛点：① 配置繁琐（手写 action type、action creator、reducer）；②
                    需要大量样板代码；③ 不可变更新逻辑复杂。
                  </p>
                  <p>
                    Redux Toolkit 的解决：① <code>createSlice</code> 自动生成 action 和 reducer；②
                    内置 Immer，可以直接“修改” state（内部自动转换为不可变更新）；③{' '}
                    <code>configureStore</code> 自动配置 middleware 和 DevTools；④{' '}
                    <code>createAsyncThunk</code> 简化异步逻辑。
                  </p>
                </div>
              </details>
            </li>
            <li>
              <details>
                <summary>什么时候该用 Redux？什么时候用 Zustand 就够了？</summary>
                <div className="rl-answer">
                  <p>
                    <strong>Redux Toolkit</strong>{' '}
                    适合：大型团队、复杂业务逻辑、需要时间旅行调试（DevTools）、严格的状态管理规范。
                  </p>
                  <p>
                    <strong>Zustand</strong> 适合：中小型项目、想快速上手、不需要 Redux
                    的仪式性代码。Zustand API 极简（<code>const useStore = create(...)</code>
                    ），支持 TypeScript，性能优秀。
                  </p>
                  <p>
                    简单原则：小项目用 Zustand / Jotai，大项目且团队熟悉 Redux 用 Redux
                    Toolkit。不确定时先用 useState + Context，需要时再升级。
                  </p>
                </div>
              </details>
            </li>
          </ul>

          <h3>推荐资源</h3>
          <div className="rl-resources">
            <a
              className="rl-resource"
              href="https://redux-toolkit.js.org/tutorials/quick-start"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="rl-res-icon">📖</span> Redux Toolkit Quick Start
            </a>
          </div>
        </div>
      </div>
      <PageNav currentPath="/react-learning/redux" />
    </div>
  )
}

export default Redux
