import { useState } from 'react'
import { Card, Typography, Input, Space, Alert, Tag, Splitter } from 'antd'
import { EditOutlined, EyeOutlined } from '@ant-design/icons'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import './ReactMarkdownDemo.css'

const { Title } = Typography
const { TextArea } = Input

// 默认 Markdown 示例内容
const defaultMarkdown = `# React Markdown 演示

## 基本语法

### 文本样式

这是 **加粗文本**，这是 *斜体文本*，这是 ~~删除线文本~~，这是 \`行内代码\`。

### 引用

> 学而不思则罔，思而不学则殆。
> —— 孔子

### 无序列表

- React 是一个用于构建用户界面的 JavaScript 库
- Vue 是一个渐进式 JavaScript 框架
- Angular 是一个完整的前端框架

### 有序列表

1. 安装依赖
2. 配置项目
3. 编写代码
4. 测试运行

---

## 代码块

\`\`\`javascript
function greet(name) {
  console.log(\`Hello, \${name}!\`)
}

greet('React')
\`\`\`

\`\`\`typescript
interface User {
  name: string
  age: number
  email?: string
}

const user: User = {
  name: '张三',
  age: 25,
}
\`\`\`

---

## 表格（GFM）

| 库名 | 类型 | GitHub Stars | 特点 |
|------|------|-------------|------|
| React | UI 库 | 220k+ | 灵活、生态丰富 |
| Vue | 渐进式框架 | 210k+ | 易上手、文档好 |
| Angular | 完整框架 | 95k+ | 企业级、强约束 |
| Svelte | 编译器 | 80k+ | 无虚拟 DOM、轻量 |

---

## 任务列表（GFM）

- [x] 安装 react-markdown
- [x] 安装 remark-gfm
- [x] 创建 Demo 页面
- [ ] 添加代码高亮支持
- [ ] 支持自定义组件渲染

---

## 链接和图片

[访问 React 官网](https://react.dev)

![React Logo](https://react.dev/images/og-home.png)

---

## 数学公式（行内）

这是一个行内公式示例：E = mc²

---

*使用 react-markdown + remark-gfm 渲染*
`

function ReactMarkdownDemo() {
  const [markdownText, setMarkdownText] = useState(defaultMarkdown)

  return (
    <div className="react-markdown-demo">
      <Title level={2}>📝 React Markdown 演示</Title>

      <Space orientation="vertical" size="large" style={{ width: '100%' }}>
        {/* 说明提示 */}
        <Alert
          message="react-markdown 简介"
          description={
            <span>
              <Tag color="blue">react-markdown</Tag> 是一个用于在 React 中安全渲染 Markdown
              内容的组件。它支持自定义渲染器、插件扩展（如 <Tag color="green">remark-gfm</Tag> 支持
              GitHub 风格 Markdown），并且通过 AST 解析确保内容安全，不会直接
              dangerouslySetInnerHTML。
            </span>
          }
          type="info"
          showIcon
        />

        {/* 编辑器和预览区域 */}
        <Card title="实时编辑器" variant="outlined">
          <Splitter style={{ minHeight: 500 }}>
            <Splitter.Panel defaultSize="50%" min="30%">
              <div style={{ padding: '0 16px 0 0' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    marginBottom: 12,
                  }}
                >
                  <EditOutlined />
                  <strong>Markdown 源码</strong>
                </div>
                <TextArea
                  className="markdown-editor"
                  value={markdownText}
                  onChange={(e) => setMarkdownText(e.target.value)}
                  autoSize={{ minRows: 20, maxRows: 30 }}
                  style={{ resize: 'none' }}
                />
              </div>
            </Splitter.Panel>
            <Splitter.Panel defaultSize="50%" min="30%">
              <div style={{ padding: '0 0 0 16px' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    marginBottom: 12,
                  }}
                >
                  <EyeOutlined />
                  <strong>渲染预览</strong>
                </div>
                <div className="markdown-content">
                  <Markdown remarkPlugins={[remarkGfm]}>{markdownText}</Markdown>
                </div>
              </div>
            </Splitter.Panel>
          </Splitter>
        </Card>

        {/* 基础用法示例 */}
        <Card title="基础用法" variant="outlined">
          <Space orientation="vertical" style={{ width: '100%' }}>
            <p>最简单的使用方式：直接传入 Markdown 字符串</p>
            <pre
              style={{
                background: '#f6f8fa',
                padding: 16,
                borderRadius: 6,
                overflow: 'auto',
              }}
            >
              <code>{`import Markdown from 'react-markdown'

function App() {
  return <Markdown>{'# Hello World'}</Markdown>
}`}</code>
            </pre>
            <div className="markdown-content">
              <Markdown>
                {`**渲染结果：**

# Hello World`}
              </Markdown>
            </div>
          </Space>
        </Card>

        {/* GFM 插件示例 */}
        <Card title="使用 remark-gfm 插件" variant="outlined">
          <Space orientation="vertical" style={{ width: '100%' }}>
            <p>
              <Tag color="green">remark-gfm</Tag> 插件支持 GitHub Flavored Markdown
              语法，包括表格、任务列表、删除线等。
            </p>
            <pre
              style={{
                background: '#f6f8fa',
                padding: 16,
                borderRadius: 6,
                overflow: 'auto',
              }}
            >
              <code>{`import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

function App() {
  return (
    <Markdown remarkPlugins={[remarkGfm]}>
      {'| 列1 | 列2 |\\n|-----|-----|\\n| A   | B   |'}
    </Markdown>
  )
}`}</code>
            </pre>
          </Space>
        </Card>
      </Space>
    </div>
  )
}

export default ReactMarkdownDemo
