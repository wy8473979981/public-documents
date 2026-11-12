import { useState } from 'react'
import PageNav from '@/components/PageNav/PageNav'
import { interviewPages } from '../interviewPages'
import '../interview.css'

function InterviewBasics() {
  const [filter, setFilter] = useState<'all' | 'easy' | 'medium' | 'hard'>('all')

  const qas = [
    {
      id: 1,
      level: 'easy' as const,
      question: 'React 是什么？它的主要特点有哪些？',
      answer: (
        <>
          <p>
            React 是由 Meta（Facebook）开发的开源 <strong>JavaScript UI 库</strong>
            ，专注于构建用户界面。
          </p>
          <p>主要特点：</p>
          <ul>
            <li>
              <strong>声明式：</strong>描述"UI 应该长什么样"，而非"怎么创建它"
            </li>
            <li>
              <strong>组件化：</strong>将 UI 拆分为独立、可复用的小块
            </li>
            <li>
              <strong>虚拟 DOM：</strong>在内存中维护 DOM 副本，通过 diff 算法最小化真实 DOM 操作
            </li>
            <li>
              <strong>单向数据流：</strong>数据从父组件通过 Props 流向子组件
            </li>
            <li>
              <strong>JSX 语法：</strong>在 JavaScript 中写类似 HTML 的代码
            </li>
          </ul>
          <div className="iv-key-point">
            <strong>面试关键词：</strong>声明式、组件化、虚拟 DOM、单向数据流、JSX
          </div>
        </>
      ),
    },
    {
      id: 2,
      level: 'easy' as const,
      question: '什么是 JSX？它和 HTML 有什么区别？',
      answer: (
        <>
          <p>
            JSX 是 JavaScript 的语法扩展，允许在 JS 中写类似 HTML 的标记。最终会被 Babel 编译为{' '}
            <code>React.createElement()</code> 调用。
          </p>
          <p>与 HTML 的主要区别：</p>
          <ul>
            <li>
              <strong>className</strong> 替代 <code>class</code>（因 class 是 JS 保留字）
            </li>
            <li>
              <strong>驼峰命名属性：</strong>
              <code>onClick</code>、<code>onChange</code>、<code>tabIndex</code>
            </li>
            <li>
              <strong>style 接收对象：</strong>
              <code>{`style={{ color: 'red', fontSize: '14px' }}`}</code>
            </li>
            <li>
              <strong>自闭合标签：</strong>
              <code>{`<img />`}</code>、<code>{`<br />`}</code>
            </li>
            <li>
              <strong>可嵌入表达式：</strong>
              <code>{`{count + 1}`}</code>、<code>{`{condition && <Comp />}`}</code>
            </li>
          </ul>
        </>
      ),
    },
    {
      id: 3,
      level: 'easy' as const,
      question: '什么是虚拟 DOM？它是如何工作的？',
      answer: (
        <>
          <p>
            虚拟 DOM（Virtual DOM）是真实 DOM 的轻量级 JavaScript 对象表示，是 React
            在内存中维护的一份 DOM 副本。
          </p>
          <p>工作流程：</p>
          <ol>
            <li>
              <strong>状态变化：</strong>组件 state/props 更新
            </li>
            <li>
              <strong>生成新 VDOM：</strong>React 重新执行 render，生成新的虚拟 DOM 树
            </li>
            <li>
              <strong>Diff 对比：</strong>将新 VDOM 与旧 VDOM 逐层对比，找出差异
            </li>
            <li>
              <strong>批量更新：</strong>只将有差异的部分应用到真实 DOM（Reconciliation）
            </li>
          </ol>
          <div className="iv-key-point">
            <strong>核心价值：</strong>虚拟 DOM
            的核心价值不是"更快"，而是用合理的性能开销换取开发效率和跨平台能力。
          </div>
        </>
      ),
    },
    {
      id: 4,
      level: 'medium' as const,
      question: 'React 的 Fiber 架构是什么？解决了什么问题？',
      answer: (
        <>
          <p>
            Fiber 是 React 16 引入的<strong>全新协调引擎</strong>，重写了 React
            的核心算法，将递归渲染改为可中断的迭代渲染。
          </p>
          <p>解决的问题：</p>
          <ul>
            <li>
              <strong>旧架构问题：</strong>
              递归渲染不可中断，大型组件树更新时会长时间阻塞主线程，导致动画卡顿、用户输入无响应
            </li>
            <li>
              <strong>Fiber 方案：</strong>将渲染工作拆分为多个小单元（Fiber
              节点），每个单元完成后可以交还控制权给浏览器
            </li>
          </ul>
          <p>Fiber 的核心能力：</p>
          <ul>
            <li>
              <strong>时间切片（Time Slicing）：</strong>高优先级任务可以打断低优先级任务
            </li>
            <li>
              <strong>可中断渲染：</strong>渲染过程可以暂停、恢复、终止
            </li>
            <li>
              <strong>优先级调度：</strong>用户交互 {'>'} 动画 {'>'} 数据请求 {'>'} 普通渲染
            </li>
          </ul>
        </>
      ),
    },
    {
      id: 5,
      level: 'medium' as const,
      question: 'React 的 diff 算法有什么策略？key 的作用是什么？',
      answer: (
        <>
          <p>React 的 diff 算法采用三个层面的策略，将 O(n³) 复杂度降到 O(n)：</p>
          <ol>
            <li>
              <strong>树层级（Tree Diff）：</strong>只对同层节点进行比较，不跨层移动节点
            </li>
            <li>
              <strong>组件层级（Component Diff）：</strong>
              同类型组件 → 比较子节点；不同类型 → 直接替换整棵子树
            </li>
            <li>
              <strong>元素层级（Element Diff）：</strong>通过 <code>key</code>{' '}
              标识节点，判断是移动、插入还是删除
            </li>
          </ol>
          <p>
            <strong>key 的作用：</strong>
          </p>
          <ul>
            <li>帮助 React 识别列表中哪些元素变了、添加或删除了</li>
            <li>
              必须<strong>唯一且稳定</strong>，避免使用数组 index 作为
              key（列表重新排序时会导致错误复用）
            </li>
          </ul>
          <div className="iv-key-point">
            <strong>常见追问：</strong>为什么不用 index 作为 key？因为当列表顺序改变时，React
            会错误地复用 DOM 节点，导致状态错乱和性能问题。
          </div>
        </>
      ),
    },
    {
      id: 6,
      level: 'medium' as const,
      question: 'React 的严格模式（StrictMode）有什么作用？',
      answer: (
        <>
          <p>
            <code>StrictMode</code> 是一个开发辅助工具，<strong>只在开发环境下生效</strong>
            ，生产环境自动忽略。
          </p>
          <p>主要作用：</p>
          <ul>
            <li>
              <strong>检测不安全生命周期：</strong>警告使用了已弃用的生命周期方法
            </li>
            <li>
              <strong>双重渲染：</strong>故意调用两次 render 函数，帮助发现副作用不纯的组件
            </li>
            <li>
              <strong>双重 useEffect：</strong>React 18 中故意执行两次
              useEffect，检测清理函数是否正确
            </li>
            <li>
              <strong>检测遗留 ref API：</strong>警告使用 string ref 和 findDOMNode
            </li>
          </ul>
          <div className="iv-key-point">
            <strong>注意：</strong>React 18 在开发环境下会 mount → unmount → 再 mount
            组件，这是为了帮助发现 useEffect 清理函数的 bug。
          </div>
        </>
      ),
    },
    {
      id: 7,
      level: 'hard' as const,
      question: 'React 的 reconciliation（协调）过程是怎样的？',
      answer: (
        <>
          <p>
            Reconciliation 是 React 将新的虚拟 DOM 树与旧树进行比较、决定如何更新真实 DOM 的过程。
          </p>
          <p>协调规则：</p>
          <ol>
            <li>
              <strong>不同类型的元素：</strong>直接销毁旧树，从头构建新树（包括组件状态全部丢弃）
            </li>
            <li>
              <strong>相同类型的元素：</strong>保留该节点，只更新变化的属性
            </li>
            <li>
              <strong>相同类型的组件：</strong>保留组件实例，更新 props，触发 render
            </li>
            <li>
              <strong>子节点递归：</strong>对子节点列表进行 diff，利用 key 优化移动/增删操作
            </li>
          </ol>
          <pre>{`// 类型不同 → 整棵子树销毁重建
<div>  →  <span>  // 完全重建

// 类型相同 → 只更新属性
<div className="old">  →  <div className="new">  // 只改 class`}</pre>
        </>
      ),
    },
    {
      id: 8,
      level: 'hard' as const,
      question: 'React 的合成事件（SyntheticEvent）是什么？和原生事件有什么区别？',
      answer: (
        <>
          <p>
            React 将所有浏览器原生事件封装为 <strong>SyntheticEvent</strong>，提供统一的跨浏览器
            API。
          </p>
          <p>与原生事件的区别：</p>
          <table className="iv-table">
            <thead>
              <tr>
                <th>特性</th>
                <th>原生事件</th>
                <th>合成事件</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>绑定方式</td>
                <td>
                  <code>element.addEventListener</code>
                </td>
                <td>JSX 驼峰命名</td>
              </tr>
              <tr>
                <td>事件委托</td>
                <td>手动</td>
                <td>自动委托到 root</td>
              </tr>
              <tr>
                <td>阻止默认</td>
                <td>
                  <code>return false</code>
                </td>
                <td>必须显式调用 preventDefault()</td>
              </tr>
              <tr>
                <td>跨浏览器</td>
                <td>需要 polyfill</td>
                <td>内置兼容</td>
              </tr>
            </tbody>
          </table>
          <div className="iv-key-point">
            <strong>React 17+：</strong>事件委托从 document 改为挂载到 React root
            节点，解决了微前端场景下的事件冲突。
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
      <h1>1. React 基础概念面试题</h1>
      <p className="iv-subtitle">
        涵盖 React 核心原理、虚拟 DOM、Fiber 架构等高频面试题，点击问题查看答案
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

      <PageNav currentPath="/interview/basics" pages={interviewPages} />
    </div>
  )
}

export default InterviewBasics
