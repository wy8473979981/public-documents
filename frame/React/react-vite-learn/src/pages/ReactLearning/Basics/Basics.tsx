import './Basics.css'

function Basics() {
  return (
    <div className="page-container">
      <h1>1. React 基础概念</h1>
      <div className="content-section">
        <h2>什么是 React？</h2>
        <p>
          React 是一个用于构建用户界面的 JavaScript 库，由 Facebook（现 Meta）开发和维护。
          它采用组件化的架构，让开发者可以构建可复用的 UI 组件。
        </p>

        <h2>核心概念</h2>
        <ul>
          <li>
            <strong>组件化：</strong>将 UI 拆分为独立、可复用的组件
          </li>
          <li>
            <strong>声明式编程：</strong>描述 UI 应该是什么样子，而不是如何创建它
          </li>
          <li>
            <strong>虚拟 DOM：</strong>提高性能的关键机制
          </li>
          <li>
            <strong>单向数据流：</strong>数据从父组件流向子组件
          </li>
          <li>
            <strong>JSX：</strong>JavaScript 的语法扩展，用于描述 UI
          </li>
        </ul>

        <h2>为什么选择 React？</h2>
        <ul>
          <li>
            🚀 <strong>高性能：</strong>虚拟 DOM 优化了渲染性能
          </li>
          <li>
            🔄 <strong>可复用性：</strong>组件可以在不同项目中复用
          </li>
          <li>
            🌐 <strong>生态系统：</strong>丰富的第三方库和工具
          </li>
          <li>
            👥 <strong>社区支持：</strong>庞大的开发者社区
          </li>
          <li>
            📱 <strong>跨平台：</strong>React Native 可用于移动应用开发
          </li>
        </ul>

        <h2>学习建议</h2>
        <div className="tip-box">
          <p>
            💡 <strong>提示：</strong>
            建议按照本学习路线的顺序逐步学习，每个知识点都有对应的实践示例。
          </p>
        </div>
      </div>
    </div>
  )
}

export default Basics
