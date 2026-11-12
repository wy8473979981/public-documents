import { useState } from 'react'
import CodeBlock from '@/components/CodeBlock/CodeBlock'
import SectionPath from '@/components/SectionPath/SectionPath'
import PageNav from '@/components/PageNav/PageNav'
import '../shared.css'

const propsExampleCode = `// Props —— 从父组件传递给子组件的数据
function UserCard({ name, age, role = '普通用户' }) {
  return (
    <div className="card">
      <h3>{name}</h3>
      <p>年龄：{age}</p>
      <p>角色：{role}</p>
    </div>
  )
}

// 父组件传递 Props
function App() {
  return (
    <div>
      <UserCard name="小明" age={25} role="管理员" />
      <UserCard name="小红" age={22} />
      {/* age 不传 role 会使用默认值 "普通用户" */}
    </div>
  )
}`

const stateExampleCode = `// State —— 组件内部的可变数据
import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <p>当前计数：{count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
      <button onClick={() => setCount(count - 1)}>-1</button>
      <button onClick={() => setCount(0)}>重置</button>
    </div>
  )
}`

const objectStateCode = `// 对象状态的正确更新方式
function ProfileForm() {
  const [user, setUser] = useState({ name: '', email: '', age: 0 })

  // ❌ 错误：直接修改对象（不会触发重渲染）
  // user.name = '小明'

  // ✅ 正确：创建新对象（展开运算符）
  const updateName = (name) => {
    setUser(prev => ({ ...prev, name }))
  }

  return (
    <input
      value={user.name}
      onChange={e => updateName(e.target.value)}
      placeholder="输入名字"
    />
  )
}`

const liftStateCode = `// 状态提升 —— 将共享状态放到最近的公共父组件
function Parent() {
  const [text, setText] = useState('')

  return (
    <div>
      <InputBox text={text} onChange={setText} />
      <DisplayBox text={text} />
      {/* 两个子组件共享同一个状态 */}
    </div>
  )
}`

function PropsState() {
  const [text, setText] = useState('')
  const [todos, setTodos] = useState<string[]>(['学习 Props', '理解 State'])
  const [newTodo, setNewTodo] = useState('')

  return (
    <div className="rl-page">
      <h1>4. Props 与 State</h1>
      <p className="rl-subtitle">
        React 数据流的核心 —— Props 向下传递数据，State 管理组件内部变化
      </p>

      <SectionPath />

      {/* 概念 */}
      <div className="rl-section concept" id="section-concept">
        <div className="rl-section-header">
          <span className="rl-icon">💡</span> 理解概念 — What & Why
        </div>
        <div className="rl-section-body">
          <h3>Props 和 State 的区别是什么？</h3>
          <p>
            React 中数据有两种来源：<strong>Props</strong>（来自外部传入）和 <strong>State</strong>
            （组件内部自己管理的）。 理解它们的区别是掌握 React 数据流的基础。
          </p>

          <div className="rl-concept-cards">
            <div className="rl-concept-card">
              <div className="rl-card-title">📨 Props（属性）</div>
              <div className="rl-card-desc">
                从父组件传给子组件的数据。<strong>只读</strong>，子组件不能修改。类似函数的参数。
              </div>
            </div>
            <div className="rl-concept-card">
              <div className="rl-card-title">🗄️ State（状态）</div>
              <div className="rl-card-desc">
                组件内部管理的可变数据。通过 useState 创建，状态变化会触发<strong>重新渲染</strong>
                。
              </div>
            </div>
          </div>

          <h3>核心对比</h3>
          <table className="rl-compare-table">
            <thead>
              <tr>
                <th>特性</th>
                <th>Props</th>
                <th>State</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>来源</strong>
                </td>
                <td>父组件传入</td>
                <td>组件内部创建</td>
              </tr>
              <tr>
                <td>
                  <strong>可变性</strong>
                </td>
                <td>只读（不可修改）</td>
                <td>可变（通过 setter 函数）</td>
              </tr>
              <tr>
                <td>
                  <strong>类比</strong>
                </td>
                <td>函数参数</td>
                <td>函数内变量</td>
              </tr>
              <tr>
                <td>
                  <strong>数据方向</strong>
                </td>
                <td>自上而下（父 → 子）</td>
                <td>组件内部</td>
              </tr>
            </tbody>
          </table>

          <div className="rl-tip info">
            💡 单向数据流：数据从父组件通过 Props 流向子组件。子组件想通知父组件？需要通过回调函数
            Props。
          </div>
        </div>
      </div>

      {/* 用法 */}
      <div className="rl-section usage" id="section-usage">
        <div className="rl-section-header">
          <span className="rl-icon">⚙️</span> 掌握用法 — How
        </div>
        <div className="rl-section-body">
          <h3>Props 的使用</h3>
          <CodeBlock code={propsExampleCode} language="jsx" title="Props 传递与默认值" />

          <h3>State 的使用</h3>
          <CodeBlock code={stateExampleCode} language="jsx" title="useState 基本用法" />

          <h3>对象状态的更新</h3>
          <p>
            State 更新是<strong>替换</strong>而非合并，对象/数组必须创建新引用：
          </p>
          <CodeBlock code={objectStateCode} language="jsx" title="对象状态正确更新方式" />

          <h3>状态提升</h3>
          <p>当多个子组件需要共享数据时，把状态提升到它们最近的公共父组件：</p>
          <CodeBlock code={liftStateCode} language="jsx" title="状态提升（Lifting State Up）" />

          <div className="rl-tip warning">
            ⚠️ 不要直接修改 state（如 state.name = 'xxx'），必须使用 setter
            函数。直接修改不会触发重渲染！
          </div>
        </div>
      </div>

      {/* 实践 */}
      <div className="rl-section practice" id="section-practice">
        <div className="rl-section-header">
          <span className="rl-icon">🛠️</span> 动手实践 — Do
        </div>
        <div className="rl-section-body">
          <h3>试一试：Props + State 配合</h3>
          <p>下面的输入框是 State，展示区通过 Props 接收 State 的值：</p>
          <div className="rl-demo-box">
            <div className="rl-demo-title">Interactive Demo - 实时双向绑定</div>
            <input
              type="text"
              placeholder="输入一些内容..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <div className="rl-demo-result">
              <p>
                原始：<strong>{text || '（空）'}</strong>
              </p>
              <p>
                大写：<strong>{text.toUpperCase() || '（空）'}</strong>
              </p>
              <p>
                长度：<strong>{text.length}</strong> 字符
              </p>
              <p>
                反转：<strong>{text.split('').reverse().join('') || '（空）'}</strong>
              </p>
            </div>
          </div>

          <h3>试一试：简单 Todo 列表</h3>
          <div className="rl-demo-box">
            <div className="rl-demo-title">Interactive Demo - Todo List</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                placeholder="添加新待办..."
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newTodo.trim()) {
                    setTodos([...todos, newTodo.trim()])
                    setNewTodo('')
                  }
                }}
              />
              <button
                onClick={() => {
                  if (newTodo.trim()) {
                    setTodos([...todos, newTodo.trim()])
                    setNewTodo('')
                  }
                }}
              >
                添加
              </button>
            </div>
            <div className="rl-demo-result">
              <p>共 {todos.length} 项：</p>
              <ul>
                {todos.map((todo, i) => (
                  <li key={i}>
                    {todo}{' '}
                    <button
                      onClick={() => setTodos(todos.filter((_, idx) => idx !== i))}
                      style={{ marginLeft: 8, color: 'red', fontSize: 12 }}
                    >
                      删除
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <h3>推荐练习</h3>
          <ul className="rl-exercises">
            <li>
              <span className="rl-ex-num">1</span>
              <div className="rl-ex-content">
                <div className="rl-ex-title">温度转换器</div>
                <div className="rl-ex-desc">两个输入框（摄氏/华氏），修改一个自动更新另一个</div>
              </div>
            </li>
            <li>
              <span className="rl-ex-num">2</span>
              <div className="rl-ex-content">
                <div className="rl-ex-title">用户信息表单</div>
                <div className="rl-ex-desc">用对象 State 管理 name、email、age 三个字段</div>
              </div>
            </li>
            <li>
              <span className="rl-ex-num">3</span>
              <div className="rl-ex-content">
                <div className="rl-ex-title">购物车组件</div>
                <div className="rl-ex-desc">商品列表 + 购物车，通过 Props 传数据、回调传操作</div>
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
                <summary>
                  <strong>setCount(count + 1)</strong> vs{' '}
                  <strong>setCount(prev =&gt; prev + 1)</strong>：什么时候有区别？
                </summary>
                <div className="rl-answer">
                  <p>
                    在单次事件处理中两者效果相同。区别在于 <strong>批量更新</strong>{' '}
                    场景（如循环中多次调用 setState）。
                  </p>
                  <p>
                    React 18 默认批量更新，<code>setCount(count + 1)</code> 中的 <code>count</code>{' '}
                    是闭包中的旧值，多次调用结果相同；而 <code>setCount(prev =&gt; prev + 1)</code>{' '}
                    的 <code>prev</code> 始终是最新值，每次调用都会正确累加。
                  </p>
                  <p>
                    建议：当新值依赖旧值时，始终使用函数式更新 <code>setXxx(prev =&gt; ...)</code>。
                  </p>
                </div>
              </details>
            </li>
            <li>
              <details>
                <summary>Prop Drilling（属性逐层传递）的问题如何解决？</summary>
                <div className="rl-answer">
                  <p>
                    Prop Drilling
                    指数据从顶层组件一层层传递到深层子组件，中间组件明明不需要这些数据却被迫接收和转发。
                  </p>
                  <p>
                    解决方案：① <strong>Context API</strong> ——
                    让任意深层组件直接读取数据，跳过中间层；②{' '}
                    <strong>组件组合（Composition）</strong> —— 把子组件作为 children 或 props
                    传入，减少中间层级；③ <strong>状态管理库</strong> —— Redux / Zustand
                    等，将状态提取到全局 Store。
                  </p>
                </div>
              </details>
            </li>
            <li>
              <details>
                <summary>什么时候用 useState，什么时候用 useReducer？</summary>
                <div className="rl-answer">
                  <p>
                    <code>useState</code>{' '}
                    适合简单、独立的状态（布尔值、字符串、数字），逻辑简单直接。
                  </p>
                  <p>
                    <code>useReducer</code> 适合：① 状态逻辑复杂（多个子字段联动）；②
                    下一个状态依赖前一个状态；③ 多个操作类型（action）需要统一管理；④
                    需要把更新逻辑提取到组件外部做测试。
                  </p>
                  <p>
                    简单规则：如果你发现 useState 的 setState 逻辑越来越复杂，就是切换到 useReducer
                    的时机。
                  </p>
                </div>
              </details>
            </li>
          </ul>

          <h3>推荐资源</h3>
          <div className="rl-resources">
            <a
              className="rl-resource"
              href="https://react.dev/learn/passing-props-to-a-component"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="rl-res-icon">📖</span> Passing Props to a Component
            </a>
            <a
              className="rl-resource"
              href="https://react.dev/learn/sharing-state-between-components"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="rl-res-icon">📖</span> Sharing State Between Components
            </a>
          </div>
        </div>
      </div>
      <PageNav currentPath="/react-learning/props-state" />
    </div>
  )
}

export default PropsState
