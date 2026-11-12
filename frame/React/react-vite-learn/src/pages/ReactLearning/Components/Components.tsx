import { useState } from 'react'
import CodeBlock from '@/components/CodeBlock/CodeBlock'
import SectionPath from '@/components/SectionPath/SectionPath'
import PageNav from '@/components/PageNav/PageNav'
import '../shared.css'

const functionComponentCode = `// 函数组件 —— React 推荐的组件写法
function Welcome({ name }) {
  return <h1>你好，{name}！</h1>
}

// 使用组件
function App() {
  return (
    <div>
      <Welcome name="小明" />
      <Welcome name="小红" />
      <Welcome name="小刚" />
    </div>
  )
}`

const classComponentCode = `// 类组件 —— 旧式写法（了解即可）
import { Component } from 'react'

class Welcome extends Component {
  render() {
    return <h1>你好，{this.props.name}！</h1>
  }
}`

const compositionCode = `// 组件组合 —— 用小组件拼出大组件
function Avatar({ src, alt }) {
  return <img src={src} alt={alt} className="avatar" />
}

function UserInfo({ name, bio }) {
  return (
    <div className="user-info">
      <h3>{name}</h3>
      <p>{bio}</p>
    </div>
  )
}

function UserCard({ user }) {
  return (
    <div className="card">
      <Avatar src={user.avatar} alt={user.name} />
      <UserInfo name={user.name} bio={user.bio} />
    </div>
  )
}`

const childrenCode = `// 使用 children 实现灵活的组件嵌套
function Card({ title, children }) {
  return (
    <div className="card">
      <div className="card-header">{title}</div>
      <div className="card-body">{children}</div>
    </div>
  )
}

// 使用时，children 就是标签内的内容
function App() {
  return (
    <Card title="用户列表">
      <p>这里可以放任何内容</p>
      <ul>
        <li>小明</li>
        <li>小红</li>
      </ul>
    </Card>
  )
}`

function Components() {
  const [count, setCount] = useState(0)
  const [color, setColor] = useState('blue')

  return (
    <div className="rl-page">
      <h1>3. 组件基础</h1>
      <p className="rl-subtitle">组件是 React 的核心 —— 学会拆分和组合组件是 React 开发的第一步</p>

      <SectionPath />

      {/* 概念 */}
      <div className="rl-section concept" id="section-concept">
        <div className="rl-section-header">
          <span className="rl-icon">💡</span> 理解概念 — What & Why
        </div>
        <div className="rl-section-body">
          <h3>组件是什么？</h3>
          <p>
            组件是 React 应用的<strong>基本构建单元</strong>。 每个组件就是一个独立的、可复用的 UI
            片段，它接收输入（Props），返回描述 UI 的 JSX。
          </p>
          <p>
            类比理解：如果整个应用是一栋大楼，那组件就是砖块、门窗、房间 ——
            每个部分各司其职，组合起来就是完整的建筑。
          </p>

          <div className="rl-concept-cards">
            <div className="rl-concept-card">
              <div className="rl-card-title">🔄 可复用</div>
              <div className="rl-card-desc">
                同一组件可以在页面不同位置使用多次，传入不同的 Props 展现不同内容。
              </div>
            </div>
            <div className="rl-concept-card">
              <div className="rl-card-title">🧩 可组合</div>
              <div className="rl-card-desc">
                小组件可以组合成大组件，大组件组合成页面，页面组合成应用。
              </div>
            </div>
            <div className="rl-concept-card">
              <div className="rl-card-title">📦 独立封装</div>
              <div className="rl-card-desc">
                每个组件管理自己的逻辑和状态，互不干扰，便于维护和测试。
              </div>
            </div>
          </div>

          <h3>函数组件 vs 类组件</h3>
          <table className="rl-compare-table">
            <thead>
              <tr>
                <th>特性</th>
                <th>函数组件</th>
                <th>类组件</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>定义方式</strong>
                </td>
                <td>普通函数</td>
                <td>extends React.Component</td>
              </tr>
              <tr>
                <td>
                  <strong>状态管理</strong>
                </td>
                <td>Hooks（useState 等）</td>
                <td>this.state / this.setState</td>
              </tr>
              <tr>
                <td>
                  <strong>代码量</strong>
                </td>
                <td>更少、更简洁</td>
                <td>更多、更复杂</td>
              </tr>
              <tr>
                <td>
                  <strong>推荐程度</strong>
                </td>
                <td>✅ 官方推荐</td>
                <td>❌ 逐渐淘汰</td>
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
          <h3>函数组件（推荐）</h3>
          <CodeBlock code={functionComponentCode} language="jsx" title="函数组件定义与使用" />

          <h3>类组件（了解即可）</h3>
          <CodeBlock code={classComponentCode} language="jsx" title="类组件（旧式写法）" />

          <h3>组件组合</h3>
          <p>将复杂 UI 拆分为多个小组件，每个组件只关注一件事：</p>
          <CodeBlock code={compositionCode} language="jsx" title="组件组合 —— 用小组件搭建大组件" />

          <h3>children 属性</h3>
          <p>children 是 React 的特殊 prop，代表组件标签内的内容：</p>
          <CodeBlock code={childrenCode} language="jsx" title="使用 children 实现内容插槽" />

          <div className="rl-tip info">
            💡 组件名必须以大写字母开头！React 用小写开头的标签识别原生 HTML 元素。
          </div>
        </div>
      </div>

      {/* 实践 */}
      <div className="rl-section practice" id="section-practice">
        <div className="rl-section-header">
          <span className="rl-icon">🛠️</span> 动手实践 — Do
        </div>
        <div className="rl-section-body">
          <h3>试一试：组件复用</h3>
          <p>下面的按钮是一个可复用的组件，传入不同 props 呈现不同样式：</p>
          <div className="rl-demo-box">
            <div className="rl-demo-title">Interactive Demo - 可复用按钮组件</div>
            <button
              style={{ background: color, color: '#fff', border: 'none', padding: '8px 20px' }}
              onClick={() => setCount(count + 1)}
            >
              点击了 {count} 次
            </button>
            <div style={{ marginTop: 12 }}>
              <span>选择颜色：</span>
              {['blue', 'green', 'red', 'purple'].map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  style={{
                    background: c,
                    color: '#fff',
                    border: c === color ? '3px solid #333' : 'none',
                    padding: '4px 12px',
                    margin: '0 4px',
                  }}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <h3>推荐练习</h3>
          <ul className="rl-exercises">
            <li>
              <span className="rl-ex-num">1</span>
              <div className="rl-ex-content">
                <div className="rl-ex-title">封装 Button 组件</div>
                <div className="rl-ex-desc">
                  支持 variant（primary/outline）、size、disabled 等 Props
                </div>
              </div>
            </li>
            <li>
              <span className="rl-ex-num">2</span>
              <div className="rl-ex-content">
                <div className="rl-ex-title">拆分页面组件</div>
                <div className="rl-ex-desc">
                  将一个完整页面拆分为 Header、Sidebar、Content、Footer
                </div>
              </div>
            </li>
            <li>
              <span className="rl-ex-num">3</span>
              <div className="rl-ex-content">
                <div className="rl-ex-title">实现 Card 组件</div>
                <div className="rl-ex-desc">
                  使用 children 和 title props 创建可嵌套任意内容的卡片
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
          <h3>组件拆分原则</h3>
          <ul>
            <li>
              <strong>单一职责</strong> —— 一个组件只做一件事
            </li>
            <li>
              <strong>可描述性</strong> —— 如果你很难用一句话描述组件的功能，说明它该拆了
            </li>
            <li>
              <strong>复用频率</strong> —— 在 3 个以上地方使用？值得抽成组件
            </li>
            <li>
              <strong>测试友好</strong> —— 小组件更容易写单元测试
            </li>
          </ul>

          <h3>延伸思考</h3>
          <ul className="rl-think-list">
            <li>
              <details>
                <summary>组件粒度如何把握？太粗不灵活，太细导致 prop drilling</summary>
                <div className="rl-answer">
                  <p>
                    原则：一个组件只做一件事（单一职责）。如果组件超过 200
                    行或包含多个不相关的逻辑，就该拆分；如果组件只渲染一个按钮或一个标签，可能就太细了。
                  </p>
                  <p>
                    实践建议：先从粗粒度开始，在实际开发中发现重复逻辑时再拆分。组件粒度没有绝对标准，关键是让代码可读、可复用、可测试。
                  </p>
                </div>
              </details>
            </li>
            <li>
              <details>
                <summary>什么时候用 children，什么时候用具名 props？</summary>
                <div className="rl-answer">
                  <p>
                    <code>children</code> 适合「包裹型」组件（如
                    Card、Modal、Layout），子元素的结构由父组件决定，灵活度高。
                  </p>
                  <p>
                    <strong>具名 props</strong> 适合「结构固定」的组件（如 Dialog 有
                    title、content、footer），父组件传数据，子组件控制布局。
                  </p>
                  <p>简单规则：子元素位置/数量不固定用 children，子元素角色明确用具名 props。</p>
                </div>
              </details>
            </li>
            <li>
              <details>
                <summary>React.memo 是什么？什么时候需要对组件做记忆化？</summary>
                <div className="rl-answer">
                  <p>
                    <code>React.memo</code> 是一个高阶组件，它对 Props 做浅比较，如果 Props
                    没变就跳过重新渲染。
                  </p>
                  <p>
                    适用场景：① 组件渲染开销大且 Props 变化不频繁；② 父组件经常 re-render
                    但传给子组件的 Props 稳定。
                  </p>
                  <p>
                    不适用：① Props 每次都变（memo 反而增加开销）；②
                    组件本身很轻量（比较的开销可能比渲染还大）。配合 <code>useMemo</code> 和{' '}
                    <code>useCallback</code> 使用效果更好。
                  </p>
                </div>
              </details>
            </li>
          </ul>

          <h3>推荐资源</h3>
          <div className="rl-resources">
            <a
              className="rl-resource"
              href="https://react.dev/learn/your-first-component"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="rl-res-icon">📖</span> Your First Component
            </a>
            <a
              className="rl-resource"
              href="https://react.dev/learn/importing-and-exporting-components"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="rl-res-icon">📖</span> Importing and Exporting
            </a>
          </div>
        </div>
      </div>
      <PageNav currentPath="/react-learning/components" />
    </div>
  )
}

export default Components
