import { Space, Typography } from 'antd'
import CodeBlock from '../../components/CodeBlock'
import './CodeBlockDemo.css'

const { Title, Paragraph } = Typography

// 示例代码
const reactExample = `import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)
  
  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  )
}`

const typescriptExample = `interface User {
  id: number
  name: string
  email: string
}

function getUser(id: number): User {
  return {
    id,
    name: "John Doe",
    email: "john@example.com"
  }
}`

const jsonExample = `{
  "name": "React Learn Project",
  "version": "1.0.0",
  "dependencies": {
    "react": "^19.2.6",
    "react-dom": "^19.2.6"
  }
}`

export default function CodeBlockDemo() {
  return (
    <div className="codeblock-demo">
      <Title level={2}>📝 CodeBlock 组件演示</Title>
      <Paragraph>这是一个通用的代码展示组件，支持多种语言和主题。</Paragraph>

      <Space orientation="vertical" size="large" style={{ width: '100%' }}>
        {/* 默认用法 */}
        <CodeBlock code={reactExample} language="jsx" title="⚛️ React 组件示例" />

        {/* TypeScript 示例 */}
        <CodeBlock code={typescriptExample} language="typescript" title="📘 TypeScript 接口示例" />

        {/* JSON 示例 */}
        <CodeBlock code={jsonExample} language="json" title="📄 JSON 数据示例" />

        {/* 带行号的示例 */}
        <CodeBlock
          code={reactExample}
          language="jsx"
          title="🔢 带行号的代码"
          showLineNumbers={true}
        />

        {/* 不同主题示例 */}
        <CodeBlock code={reactExample} language="jsx" title="🎨 Atom Dark 主题" theme="atomDark" />

        <CodeBlock code={reactExample} language="jsx" title="🎨 Dracula 主题" theme="dracula" />

        <CodeBlock code={reactExample} language="jsx" title="🎨 Prism 主题" theme="prism" />
      </Space>
    </div>
  )
}
