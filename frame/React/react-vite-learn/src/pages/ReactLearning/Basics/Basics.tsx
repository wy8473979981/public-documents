import { useState } from 'react'
import CodeBlock from '@/components/CodeBlock/CodeBlock'
import SectionPath from '@/components/SectionPath/SectionPath'
import PageNav from '@/components/PageNav/PageNav'
import '../shared.css'

const reactBasicCode = `import React from 'react'
import ReactDOM from 'react-dom/client'

// 创建一个 React 组件
function App() {
  return <h1>Hello, React!</h1>
}

// 渲染到页面
const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(<App />)`

const declarativeVsImperative = `// ❌ 命令式（告诉浏览器每一步怎么做）
const container = document.getElementById('app')
const h1 = document.createElement('h1')
h1.textContent = 'Hello'
h1.style.color = 'blue'
h1.addEventListener('click', () => alert('Hi!'))
container.appendChild(h1)

// ✅ 声明式（告诉 React 你想要什么样的 UI）
function App() {
  return <h1 style={{ color: 'blue' }} onClick={() => alert('Hi!')}>Hello</h1>
}`

const virtualDOMCode = `// React 的更新机制：
// 1. 状态变化 → 生成新的虚拟 DOM 树
// 2. 与旧的虚拟 DOM 对比（Diffing）
// 3. 只更新有变化的真实 DOM 节点（Reconciliation）

// 你只需要关心状态变化，React 负责高效更新
function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>点击了 {count} 次</button>
}`

function Basics() {
  const [clickCount, setClickCount] = useState(0)
  return (
    <div className="rl-page">
      <h1>1. React 基础概念</h1>
      <p className="rl-subtitle">从零开始理解 React —— 一个用于构建用户界面的 JavaScript 库</p>

      <SectionPath />

      {/* 概念板块 */}
      <div className="rl-section concept" id="section-concept">
        <div className="rl-section-header">
          <span className="rl-icon">💡</span> 理解概念 — What & Why
        </div>
        <div className="rl-section-body">
          <h3>React 是什么？</h3>
          <p>
            React 是由 Meta（Facebook）开发的开源 JavaScript 库，专注于<strong>构建用户界面</strong>
            。 它不关心你的数据来自哪里，只关心如何将数据<strong>渲染成页面</strong>。
          </p>
          <p>
            一个直观的比喻：如果传统 DOM 操作像是<strong>手动拼装乐高</strong>
            （每次都要找到正确的积木并放到正确位置）， 那 React 就像<strong>画蓝图</strong> ——
            你只需要描述最终的样子，React 自动帮你搭建。
          </p>

          <h3>五大核心概念</h3>
          <div className="rl-concept-cards">
            <div className="rl-concept-card">
              <div className="rl-card-title">🧩 组件化</div>
              <div className="rl-card-desc">
                把 UI 拆成独立、可复用的小块。就像搭积木一样，用小组件拼出大页面。
              </div>
            </div>
            <div className="rl-concept-card">
              <div className="rl-card-title">📝 声明式编程</div>
              <div className="rl-card-desc">
                你描述"UI 应该长什么样"，而不是"怎么一步步创建它"。代码更直观、更易维护。
              </div>
            </div>
            <div className="rl-concept-card">
              <div className="rl-card-title">⚡ 虚拟 DOM</div>
              <div className="rl-card-desc">
                React 在内存中维护一份 DOM 副本，通过对比差异来最小化真实 DOM 操作，提升性能。
              </div>
            </div>
            <div className="rl-concept-card">
              <div className="rl-card-title">⬇️ 单向数据流</div>
              <div className="rl-card-desc">
                数据从父组件通过 Props 流向子组件，简单可预测，便于调试。
              </div>
            </div>
            <div className="rl-concept-card">
              <div className="rl-card-title">🏷️ JSX</div>
              <div className="rl-card-desc">
                JavaScript 的语法扩展，让你在 JS 中写类似 HTML 的代码来描述 UI 结构。
              </div>
            </div>
            <div className="rl-concept-card">
              <div className="rl-card-title">🔄 状态驱动</div>
              <div className="rl-card-desc">
                UI 是状态的映射。状态变化 → UI 自动更新，你不需要手动操作 DOM。
              </div>
            </div>
          </div>

          <h3>为什么选择 React？</h3>
          <ul>
            <li>
              <strong>生态丰富</strong> —— 海量的第三方库（路由、状态管理、UI 组件库等）
            </li>
            <li>
              <strong>就业市场大</strong> —— 全球使用最广泛的前端框架之一
            </li>
            <li>
              <strong>跨平台能力</strong> —— React Native 可以用同一套知识开发移动端 App
            </li>
            <li>
              <strong>社区活跃</strong> —— 遇到问题很容易找到解决方案
            </li>
          </ul>
        </div>
      </div>

      {/* 用法板块 */}
      <div className="rl-section usage" id="section-usage">
        <div className="rl-section-header">
          <span className="rl-icon">⚙️</span> 掌握用法 — How
        </div>
        <div className="rl-section-body">
          <h3>最简 React 应用</h3>
          <p>一个 React 应用由组件树构成，最终挂载到页面的一个 DOM 节点上：</p>
          <CodeBlock code={reactBasicCode} language="jsx" title="React 应用入口" />

          <h3>声明式 vs 命令式</h3>
          <p>这是 React 与传统 DOM 操作最本质的区别：</p>
          <CodeBlock code={declarativeVsImperative} language="jsx" title="两种编程范式对比" />

          <h3>关键规则</h3>
          <table className="rl-compare-table">
            <thead>
              <tr>
                <th>规则</th>
                <th>说明</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>组件名大写开头</strong>
                </td>
                <td>React 用小写开头的标签名识别原生 HTML 元素</td>
              </tr>
              <tr>
                <td>
                  <strong>返回单一根元素</strong>
                </td>
                <td>组件必须返回一个根元素（可用 &lt;&gt;...&lt;/&gt; 包裹）</td>
              </tr>
              <tr>
                <td>
                  <strong>className 代替 class</strong>
                </td>
                <td>因为 class 是 JavaScript 保留字</td>
              </tr>
              <tr>
                <td>
                  <strong>驼峰命名属性</strong>
                </td>
                <td>onClick, onChange, style 属性用对象等</td>
              </tr>
            </tbody>
          </table>

          <div className="rl-tip info">
            💡 React 的更新机制：状态变化 → 生成新虚拟 DOM → Diff 对比 → 最小化更新真实 DOM
          </div>

          <CodeBlock code={virtualDOMCode} language="jsx" title="虚拟 DOM 工作原理" />
        </div>
      </div>

      {/* 实践板块 */}
      <div className="rl-section practice" id="section-practice">
        <div className="rl-section-header">
          <span className="rl-icon">🛠️</span> 动手实践 — Do
        </div>
        <div className="rl-section-body">
          <h3>试一试：状态驱动的 UI</h3>
          <p>下面是一个最简的 React 交互示例。点击按钮观察数字变化，体会"状态驱动 UI"的概念：</p>
          <div className="rl-demo-box">
            <div className="rl-demo-title">Interactive Demo</div>
            <button onClick={() => setClickCount(clickCount + 1)}>👆 点击 +1</button>
            <button onClick={() => setClickCount(0)}>🔄 重置</button>
            <div className="rl-demo-result">
              你点击了 <strong>{clickCount}</strong> 次{clickCount >= 10 && ' 🎉 厉害！继续点击！'}
              {clickCount >= 50 && ' 🏆 你是点击之王！'}
            </div>
          </div>

          <h3>推荐练习</h3>
          <ul className="rl-exercises">
            <li>
              <span className="rl-ex-num">1</span>
              <div className="rl-ex-content">
                <div className="rl-ex-title">Hello World 组件</div>
                <div className="rl-ex-desc">创建一个显示 "Hello, [你的名字]" 的组件</div>
              </div>
            </li>
            <li>
              <span className="rl-ex-num">2</span>
              <div className="rl-ex-content">
                <div className="rl-ex-title">简单计数器</div>
                <div className="rl-ex-desc">实现带 +1、-1、重置功能的计数器</div>
              </div>
            </li>
            <li>
              <span className="rl-ex-num">3</span>
              <div className="rl-ex-content">
                <div className="rl-ex-title">条件渲染</div>
                <div className="rl-ex-desc">根据状态显示/隐藏一段文字（如：展开/折叠）</div>
              </div>
            </li>
          </ul>

          <div className="rl-tip success">
            ✅ 完成以上练习后，你就掌握了 React 最核心的"组件 + 状态"思维模式！
          </div>
        </div>
      </div>

      {/* 扩展板块 */}
      <div className="rl-section connect" id="section-connect">
        <div className="rl-section-header">
          <span className="rl-icon">🔗</span> 反思与扩展 — Think & Connect
        </div>
        <div className="rl-section-body">
          <h3>React 与其他框架对比</h3>
          <table className="rl-compare-table">
            <thead>
              <tr>
                <th>特性</th>
                <th>React</th>
                <th>Vue</th>
                <th>Angular</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>类型</strong>
                </td>
                <td>UI 库</td>
                <td>渐进式框架</td>
                <td>完整框架</td>
              </tr>
              <tr>
                <td>
                  <strong>语法</strong>
                </td>
                <td>JSX</td>
                <td>模板 + JSX</td>
                <td>TypeScript + 模板</td>
              </tr>
              <tr>
                <td>
                  <strong>状态管理</strong>
                </td>
                <td>Hooks / Redux</td>
                <td>响应式 / Pinia</td>
                <td>Services / NgRx</td>
              </tr>
              <tr>
                <td>
                  <strong>学习曲线</strong>
                </td>
                <td>中等</td>
                <td>较低</td>
                <td>较高</td>
              </tr>
            </tbody>
          </table>

          <h3>延伸思考</h3>
          <ul className="rl-think-list">
            <li>
              <details>
                <summary>
                  React 只负责 UI 层，路由和状态管理需要额外引入 —— 这带来灵活性也带来选择成本
                </summary>
                <div className="rl-answer">
                  <p>
                    是的。React 的定位是「用于构建用户界面的 JavaScript
                    库」，它专注于视图层（View）。路由需要 React Router，状态管理需要 Redux /
                    Zustand / Context 等，表单处理需要 React Hook Form 等。
                  </p>
                  <p>
                    这种「只做一件事」的设计哲学带来了极大的灵活性：你可以根据项目规模选择最合适的工具，而不是被迫接受一个大而全的框架。但代价是「选择成本」——
                    新手面对众多生态工具时容易迷茫。推荐的学习路径是：先掌握 React
                    本身，再按需引入生态工具。
                  </p>
                </div>
              </details>
            </li>
            <li>
              <details>
                <summary>虚拟 DOM 一定比直接操作 DOM 快吗？</summary>
                <div className="rl-answer">
                  <p>
                    <strong>不一定。</strong>虚拟 DOM
                    的核心价值不是「更快」，而是「用合理的性能开销换取开发效率」。
                  </p>
                  <p>
                    直接手动操作 DOM（如 <code>document.getElementById</code>）在简单场景下比虚拟
                    DOM 更快，因为虚拟 DOM 需要额外的 diff 计算。
                  </p>
                  <p>
                    虚拟 DOM 真正的优势在于：① <strong>批量优化</strong> —— React
                    将多次状态更新合并为一次 DOM 操作；② <strong>跨平台</strong> —— 虚拟 DOM
                    可以渲染到 Native（React Native）、Canvas 等非浏览器环境；③{' '}
                    <strong>声明式开发</strong> —— 开发者只需描述「UI
                    应该是什么样子」，不需要手动管理 DOM 更新。
                  </p>
                </div>
              </details>
            </li>
            <li>
              <details>
                <summary>声明式编程的优势在团队协作中更加明显 —— 代码即文档</summary>
                <div className="rl-answer">
                  <p>
                    声明式编程描述「做什么」（What），命令式编程描述「怎么做」（How）。在 React
                    中，你写的是 <code>&#60;Button color="blue" /&#62;</code>，而不是{' '}
                    <code>btn.style.color = 'blue'</code>。
                  </p>
                  <p>
                    团队协作时，声明式代码更容易被阅读和理解 ——
                    代码本身就描述了意图，相当于自带文档。新成员加入时，不需要逐行追踪 DOM
                    操作逻辑，只需看组件结构就能理解 UI
                    构成。这在大型项目中尤其重要，能显著降低沟通成本和维护难度。
                  </p>
                </div>
              </details>
            </li>
          </ul>

          <h3>推荐资源</h3>
          <div className="rl-resources">
            <a
              className="rl-resource"
              href="https://react.dev/learn"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="rl-res-icon">📖</span> React 官方教程（新版）
            </a>
            <a
              className="rl-resource"
              href="https://react.dev/reference/react"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="rl-res-icon">📋</span> React API 参考
            </a>
            <a
              className="rl-resource"
              href="https://react.dev/learn/thinking-in-react"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="rl-res-icon">🧠</span> React 设计思维
            </a>
          </div>
        </div>
      </div>
      <PageNav currentPath="/react-learning/basics" />
    </div>
  )
}

export default Basics
