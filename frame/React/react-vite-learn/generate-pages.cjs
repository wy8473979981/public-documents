const fs = require('fs')
const path = require('path')

const pages = [
  'Jsx',
  'Components',
  'PropsState',
  'Events',
  'HooksIntro',
  'UseEffect',
  'CustomHooks',
  'Context',
  'Redux',
  'Router',
  'Forms',
  'Performance',
  'Testing',
  'TypeScript',
  'AdvancedPatterns',
  'SSR',
  'Ecosystem',
]

const routePaths = {
  Jsx: '/react-learning/jsx',
  Components: '/react-learning/components',
  PropsState: '/react-learning/props-state',
  Events: '/react-learning/events',
  HooksIntro: '/react-learning/hooks-intro',
  UseEffect: '/react-learning/useEffect',
  CustomHooks: '/react-learning/custom-hooks',
  Context: '/react-learning/context',
  Redux: '/react-learning/redux',
  Router: '/react-learning/router',
  Forms: '/react-learning/forms',
  Performance: '/react-learning/performance',
  Testing: '/react-learning/testing',
  TypeScript: '/react-learning/typescript',
  AdvancedPatterns: '/react-learning/advanced-patterns',
  SSR: '/react-learning/ssr',
  Ecosystem: '/react-learning/ecosystem',
}

pages.forEach((name) => {
  const dir = path.join(__dirname, 'src/pages/ReactLearning', name)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }

  const routePath = routePaths[name] || `/react-learning/${name.toLowerCase()}`

  const tsxContent = `import { useState } from 'react'
import CodeBlock from '@/components/CodeBlock/CodeBlock'
import SectionPath from '@/components/SectionPath/SectionPath'
import PageNav from '@/components/PageNav/PageNav'
import '../shared.css'

const basicCode = \`// ${name} 基础用法示例
function Example() {
  return <div>${name} 示例内容</div>
}\`

function ${name}() {
  const [count, setCount] = useState(0)

  return (
    <div className="rl-page">
      <h1>${name}</h1>
      <p className="rl-subtitle">在此添加 ${name} 的简介描述</p>

      <SectionPath />

      <div className="rl-section concept" id="section-concept">
        <div className="rl-section-header">
          <span className="rl-icon">💡</span> 理解概念 — What & Why
        </div>
        <div className="rl-section-body">
          <h3>${name} 是什么？</h3>
          <p>在此添加概念说明...</p>
        </div>
      </div>

      <div className="rl-section usage" id="section-usage">
        <div className="rl-section-header">
          <span className="rl-icon">⚙️</span> 掌握用法 — How
        </div>
        <div className="rl-section-body">
          <h3>基本用法</h3>
          <CodeBlock code={basicCode} language="jsx" title="${name} 基础用法" />
        </div>
      </div>

      <div className="rl-section practice" id="section-practice">
        <div className="rl-section-header">
          <span className="rl-icon">🛠️</span> 动手实践 — Do
        </div>
        <div className="rl-section-body">
          <h3>试一试</h3>
          <div className="rl-demo-box">
            <div className="rl-demo-title">Interactive Demo</div>
            <button onClick={() => setCount(count + 1)}>点击 +1</button>
            <button onClick={() => setCount(0)}>重置</button>
            <div className="rl-demo-result">
              计数：<strong>{count}</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="rl-section connect" id="section-connect">
        <div className="rl-section-header">
          <span className="rl-icon">🔗</span> 反思与扩展 — Think & Connect
        </div>
        <div className="rl-section-body">
          <h3>延伸思考</h3>
          <p>在此添加延伸思考内容...</p>
        </div>
      </div>

      <PageNav currentPath="${routePath}" />
    </div>
  )
}

export default ${name}
`

  fs.writeFileSync(path.join(dir, `${name}.tsx`), tsxContent)
  console.log(`Created ${name}`)
})

console.log('All pages created successfully!')
