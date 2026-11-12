import { useState } from 'react'
import CodeBlock from '@/components/CodeBlock/CodeBlock'
import SectionPath from '@/components/SectionPath/SectionPath'
import PageNav from '@/components/PageNav/PageNav'
import '../shared.css'

const jsxBasicCode = `// JSX 看起来像 HTML，但本质是 JavaScript
function Greeting() {
  const name = 'React 学习者'
  const currentTime = new Date().toLocaleTimeString()

  return (
    <div>
      <h1>你好，{name}！</h1>
      <p>当前时间：{currentTime}</p>
    </div>
  )
}`

const jsxExpressionCode = `// 花括号内可以放任何 JavaScript 表达式
function Profile() {
  const user = { name: '小明', age: 25, isStudent: true }
  const hobbies = ['编程', '阅读', '跑步']

  return (
    <div>
      <p>姓名：{user.name}</p>
      <p>年龄：{user.age}</p>
      <p>身份：{user.isStudent ? '学生' : '职场人'}</p>
      <p>爱好数量：{hobbies.length}</p>
      {/* 注意：if/for 不是表达式，不能直接用在 {} 中 */}
    </div>
  )
}`

const jsxAttributesCode = `// JSX 属性使用驼峰命名
function StyledCard() {
  const imgUrl = '/avatar.png'

  return (
    <div className="card" style={{ color: 'blue', fontSize: '16px' }}>
      <img src={imgUrl} alt="头像" />
      <button onClick={() => alert('点击了！')}>点我</button>
      {/* 注意：
          class → className
          style 接收对象而非字符串
          事件用驼峰命名 onClick 而非 onclick */}
    </div>
  )
}`

const jsxListCode = `// 渲染列表
function TodoList() {
  const todos = [
    { id: 1, text: '学习 JSX', done: true },
    { id: 2, text: '理解组件', done: false },
    { id: 3, text: '掌握 Hooks', done: false },
  ]

  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          {todo.done ? '✅' : '⬜'} {todo.text}
        </li>
      ))}
    </ul>
  )
}`

const jsxConditionCode = `// 条件渲染的三种方式
function Notification({ count }) {
  return (
    <div>
      {/* 方式 1：三元运算符 */}
      <p>{count > 0 ? \`你有 \${count} 条消息\` : '暂无消息'}</p>

      {/* 方式 2：逻辑与 */}
      {count > 9 && <span className="badge">99+</span>}

      {/* 方式 3：提前 return */}
      {/* 适合整个组件的条件渲染 */}
    </div>
  )
}`

function Jsx() {
  const [name, setName] = useState('')

  return (
    <div className="rl-page">
      <h1>2. JSX 语法</h1>
      <p className="rl-subtitle">JSX —— 在 JavaScript 中编写 UI 结构的语法扩展</p>

      <SectionPath />

      {/* 概念 */}
      <div className="rl-section concept" id="section-concept">
        <div className="rl-section-header">
          <span className="rl-icon">💡</span> 理解概念 — What & Why
        </div>
        <div className="rl-section-body">
          <h3>JSX 是什么？</h3>
          <p>
            JSX 是 JavaScript 的语法扩展，让你可以在 JS 代码中写类似 HTML 的结构。 它
            <strong>不是</strong>模板语言，而是会被编译为 <code>React.createElement()</code>{' '}
            调用的语法糖。
          </p>

          <h3>为什么需要 JSX？</h3>
          <p>
            传统做法是把 HTML、CSS、JS 分到不同文件。但 UI 的结构、样式和行为本质上紧密耦合。 JSX
            让你把<strong>「UI 长什么样」和「UI 的逻辑」</strong>
            放在同一个组件里，实现真正的组件化。
          </p>

          <div className="rl-concept-cards">
            <div className="rl-concept-card">
              <div className="rl-card-title">🧬 编译产物</div>
              <div className="rl-card-desc">
                JSX 最终被 Babel 编译为 React.createElement() 函数调用，浏览器并不会直接执行 JSX。
              </div>
            </div>
            <div className="rl-concept-card">
              <div className="rl-card-title">🧮 表达式嵌入</div>
              <div className="rl-card-desc">
                花括号 {'{}'} 中可以放任何 JS 表达式：变量、运算、函数调用、三元运算符等。
              </div>
            </div>
            <div className="rl-concept-card">
              <div className="rl-card-title">🛡️ 防 XSS 注入</div>
              <div className="rl-card-desc">
                React 会自动转义嵌入的值，防止恶意脚本注入，这是原生 innerHTML 做不到的。
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 用法 */}
      <div className="rl-section usage" id="section-usage">
        <div className="rl-section-header">
          <span className="rl-icon">⚙️</span> 掌握用法 — How
        </div>
        <div className="rl-section-body">
          <h3>基础语法：嵌入表达式</h3>
          <CodeBlock code={jsxBasicCode} language="jsx" title="JSX 基础" />

          <h3>表达式进阶</h3>
          <CodeBlock
            code={jsxExpressionCode}
            language="jsx"
            title="在 JSX 中使用 JavaScript 表达式"
          />

          <h3>属性与事件</h3>
          <CodeBlock code={jsxAttributesCode} language="jsx" title="JSX 属性差异" />

          <h3>JSX vs HTML 关键差异</h3>
          <table className="rl-compare-table">
            <thead>
              <tr>
                <th>HTML</th>
                <th>JSX</th>
                <th>原因</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>class</td>
                <td>className</td>
                <td>class 是 JS 保留字</td>
              </tr>
              <tr>
                <td>for</td>
                <td>htmlFor</td>
                <td>for 是 JS 保留字</td>
              </tr>
              <tr>
                <td>onclick</td>
                <td>onClick</td>
                <td>JSX 使用驼峰命名</td>
              </tr>
              <tr>
                <td>style="..."</td>
                <td>{'style={{}}'}</td>
                <td>style 接收 JS 对象</td>
              </tr>
              <tr>
                <td>&lt;img&gt;</td>
                <td>&lt;img /&gt;</td>
                <td>自闭合标签必须关闭</td>
              </tr>
            </tbody>
          </table>

          <h3>列表渲染</h3>
          <CodeBlock code={jsxListCode} language="jsx" title="渲染列表数据" />

          <h3>条件渲染</h3>
          <CodeBlock code={jsxConditionCode} language="jsx" title="三种条件渲染方式" />

          <div className="rl-tip warning">
            ⚠️ key 的作用：帮助 React 识别列表项的变化，提升渲染性能。永远不要用 index 作为
            key（除非列表不会变化）。
          </div>
        </div>
      </div>

      {/* 实践 */}
      <div className="rl-section practice" id="section-practice">
        <div className="rl-section-header">
          <span className="rl-icon">🛠️</span> 动手实践 — Do
        </div>
        <div className="rl-section-body">
          <h3>试一试：JSX 表达式实时预览</h3>
          <p>在输入框中输入你的名字，观察 JSX 表达式如何动态渲染：</p>
          <div className="rl-demo-box">
            <div className="rl-demo-title">Interactive Demo</div>
            <input
              type="text"
              placeholder="输入你的名字..."
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <div className="rl-demo-result">
              <p>
                你好，<strong>{name || '______'}</strong>！欢迎来到 JSX 的世界 🎉
              </p>
              <p>
                你输入了 <strong>{name.length}</strong> 个字符
              </p>
              <p>大写：{name.toUpperCase() || '______'}</p>
            </div>
          </div>

          <h3>推荐练习</h3>
          <ul className="rl-exercises">
            <li>
              <span className="rl-ex-num">1</span>
              <div className="rl-ex-content">
                <div className="rl-ex-title">个人信息卡片</div>
                <div className="rl-ex-desc">用 JSX 展示一个包含姓名、头像、简介的人物卡片</div>
              </div>
            </li>
            <li>
              <span className="rl-ex-num">2</span>
              <div className="rl-ex-content">
                <div className="rl-ex-title">待办事项列表</div>
                <div className="rl-ex-desc">用 .map() 渲染一个待办列表，区分已完成和未完成</div>
              </div>
            </li>
            <li>
              <span className="rl-ex-num">3</span>
              <div className="rl-ex-content">
                <div className="rl-ex-title">条件展示通知</div>
                <div className="rl-ex-desc">当未读消息 {'>'} 0 时显示红点，否则隐藏</div>
              </div>
            </li>
          </ul>

          <div className="rl-tip success">
            ✅ JSX 的核心在于：它是 JavaScript，所以你可以利用 JS 的全部能力来控制 UI 结构！
          </div>
        </div>
      </div>

      {/* 扩展 */}
      <div className="rl-section connect" id="section-connect">
        <div className="rl-section-header">
          <span className="rl-icon">🔗</span> 反思与扩展 — Think & Connect
        </div>
        <div className="rl-section-body">
          <h3>JSX vs 模板语法</h3>
          <table className="rl-compare-table">
            <thead>
              <tr>
                <th>特性</th>
                <th>JSX（React）</th>
                <th>模板（Vue）</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>本质</strong>
                </td>
                <td>JavaScript 表达式</td>
                <td>特殊模板语法</td>
              </tr>
              <tr>
                <td>
                  <strong>灵活性</strong>
                </td>
                <td>可用全部 JS 能力</td>
                <td>受限于模板指令</td>
              </tr>
              <tr>
                <td>
                  <strong>学习成本</strong>
                </td>
                <td>需要理解 JS 表达式</td>
                <td>有 v-if / v-for 等专用指令</td>
              </tr>
              <tr>
                <td>
                  <strong>TypeScript 支持</strong>
                </td>
                <td>天然支持</td>
                <td>需要额外配置</td>
              </tr>
            </tbody>
          </table>

          <h3>延伸思考</h3>
          <ul className="rl-think-list">
            <li>
              <details>
                <summary>为什么 JSX 中不能用 if/for？</summary>
                <div className="rl-answer">
                  <p>
                    因为 JSX 中的花括号 <code>&#123;&#125;</code> 内部只能放 <strong>表达式</strong>
                    （Expression），不能放 <strong>语句</strong>（Statement）。
                  </p>
                  <p>
                    <code>if/else</code>、<code>for</code>、<code>switch</code>{' '}
                    都是语句，没有返回值；而三元运算符 <code>? :</code>、<code>&amp;&amp;</code>、
                    <code>||</code>、<code>map()</code> 是表达式，可以在 JSX 中使用。
                  </p>
                  <p>如果逻辑复杂，可以在 JSX 外部用变量或函数处理好，再在 JSX 中引用。</p>
                </div>
              </details>
            </li>
            <li>
              <details>
                <summary>dangerouslySetInnerHTML 是什么？为什么名字这么"吓人"？</summary>
                <div className="rl-answer">
                  <p>
                    它是 React 提供的直接插入 HTML 字符串的 API，相当于原生的 <code>innerHTML</code>
                    。
                  </p>
                  <p>
                    名字之所以“吓人”，是因为直接使用它容易导致 <strong>XSS（跨站脚本攻击）</strong>
                    。如果 HTML 字符串来自用户输入，恶意脚本可能被执行。React
                    用这个冗长的名字提醒你：“这个操作很危险，请确保内容安全”。
                  </p>
                  <p>
                    使用时需配合 <code>__html</code> 对象：
                    {'<div dangerouslySetInnerHTML=&#123;&#123; __html: content &#125;&#125; /&gt;'}
                  </p>
                </div>
              </details>
            </li>
            <li>
              <details>
                <summary>React.Fragment 解决了什么问题？</summary>
                <div className="rl-answer">
                  <p>
                    React 要求组件只能返回 <strong>一个根元素</strong>
                    。如果不想为了包裹多个子元素而额外添加一个无意义的 <code>&lt;div&gt;</code>
                    ，就可以用 <code>&lt;React.Fragment&gt;</code>（简写{' '}
                    <code>&lt;&gt;...&lt;/&gt;</code>）。
                  </p>
                  <p>
                    Fragment 不会在 DOM 中生成任何额外节点，避免了无意义的 DOM 嵌套，对 CSS 布局（如
                    Flex/Grid）也更友好。
                  </p>
                  <p>
                    注意：简写 <code>&lt;&gt;</code> 不支持 <code>key</code> 属性，需要 key 时必须用{' '}
                    <code>&lt;React.Fragment key=&#123;id&#125;&gt;</code>。
                  </p>
                </div>
              </details>
            </li>
          </ul>

          <h3>推荐资源</h3>
          <div className="rl-resources">
            <a
              className="rl-resource"
              href="https://react.dev/learn/writing-markup-with-jsx"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="rl-res-icon">📖</span> JSX 官方教程
            </a>
            <a
              className="rl-resource"
              href="https://react.dev/learn/javascript-in-jsx-with-curly-braces"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="rl-res-icon">📖</span> 在 JSX 中使用花括号
            </a>
          </div>
        </div>
      </div>
      <PageNav currentPath="/react-learning/jsx" />
    </div>
  )
}

export default Jsx
