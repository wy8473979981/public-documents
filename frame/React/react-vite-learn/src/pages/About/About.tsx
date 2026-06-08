import './About.css'

function About() {
  return (
    <div className="about-page">
      <div className="about-container">
        <h1>关于我们</h1>
        <p>这是一个使用 React + Vite + TypeScript 构建的现代化 Web 应用。</p>

        <div className="about-content">
          <section className="about-section">
            <h2>技术栈</h2>
            <ul>
              <li>
                <strong>React 19</strong> - 用于构建用户界面的 JavaScript 库
              </li>
              <li>
                <strong>Vite 8</strong> - 下一代前端构建工具
              </li>
              <li>
                <strong>TypeScript</strong> - JavaScript 的超集，提供类型安全
              </li>
              <li>
                <strong>React Router</strong> - 声明式路由解决方案
              </li>
            </ul>
          </section>

          <section className="about-section">
            <h2>项目特点</h2>
            <ul>
              <li>⚡ 极速的开发服务器启动和热更新</li>
              <li>📦 开箱即用的 TypeScript 支持</li>
              <li>🎨 现代化的 CSS 支持</li>
              <li>🔧 丰富的插件生态系统</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}

export default About
