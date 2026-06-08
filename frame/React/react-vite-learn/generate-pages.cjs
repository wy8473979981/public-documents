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

pages.forEach((name) => {
  const dir = path.join(__dirname, 'src/pages/ReactLearning', name)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }

  const tsxContent = `import pageConfigs from '../pageConfigs'
import './${name}.css'

function ${name}() {
  const config = pageConfigs.find((p) => p.name === '${name}')
  if (!config) return <div>页面配置未找到</div>

  return (
    <div className="page-container">
      <h1>{config.title}</h1>
      <div className="content-section">
        {config.content.map((line, index) => (
          <p key={index}>{line}</p>
        ))}
      </div>
    </div>
  )
}

export default ${name}
`

  const cssContent = `.page-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.content-section {
  background: #ffffff;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.content-section h1 {
  color: #1890ff;
  margin-bottom: 20px;
}

.content-section p {
  line-height: 1.8;
  margin-bottom: 10px;
}
`

  fs.writeFileSync(path.join(dir, `${name}.tsx`), tsxContent)
  fs.writeFileSync(path.join(dir, `${name}.css`), cssContent)
  console.log(`Created ${name}`)
})

console.log('All pages created successfully!')
