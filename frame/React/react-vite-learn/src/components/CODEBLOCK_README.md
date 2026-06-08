# CodeBlock 组件使用指南

## 📦 简介

`CodeBlock` 是一个通用的代码展示组件，基于 `react-syntax-highlighter` 构建，支持多种编程语言和主题。

## ✨ 特性

- ✅ 语法高亮
- ✅ 多种主题选择
- ✅ 可选行号显示
- ✅ 自动换行
- ✅ 自定义样式
- ✅ TypeScript 支持

## 🚀 安装依赖

项目已预装 `react-syntax-highlighter`，无需额外安装。

## 📖 基本用法

```tsx
import CodeBlock from '../components/CodeBlock'

function MyComponent() {
  const code = `function hello() {
  console.log("Hello, World!")
}`

  return <CodeBlock code={code} language="javascript" />
}
```

## ⚙️ Props 属性

| 属性              | 类型                                         | 默认值         | 说明                                   |
| ----------------- | -------------------------------------------- | -------------- | -------------------------------------- |
| `code`            | `string`                                     | -              | 要显示的代码字符串（必需）             |
| `language`        | `string`                                     | `'javascript'` | 编程语言（js/ts/jsx/tsx/json/bash 等） |
| `theme`           | `'vs' \| 'atomDark' \| 'dracula' \| 'prism'` | `'vs'`         | 高亮主题                               |
| `showLineNumbers` | `boolean`                                    | `false`        | 是否显示行号                           |
| `wrapLines`       | `boolean`                                    | `true`         | 是否自动换行                           |
| `title`           | `string`                                     | -              | 卡片标题                               |
| `customStyle`     | `React.CSSProperties`                        | -              | 自定义样式                             |

## 🎨 主题示例

### VS 主题（默认）

```tsx
<CodeBlock code={code} theme="vs" />
```

### Atom Dark 主题

```tsx
<CodeBlock code={code} theme="atomDark" />
```

### Dracula 主题

```tsx
<CodeBlock code={code} theme="dracula" />
```

### Prism 主题

```tsx
<CodeBlock code={code} theme="prism" />
```

## 💡 完整示例

```tsx
import CodeBlock from '../components/CodeBlock'

export default function Example() {
  const reactCode = `import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)
  
  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  )
}`

  return (
    <div>
      {/* 基础用法 */}
      <CodeBlock code={reactCode} language="jsx" title="React 组件示例" />

      {/* 带行号 */}
      <CodeBlock code={reactCode} language="jsx" showLineNumbers={true} />

      {/* 自定义主题 */}
      <CodeBlock code={reactCode} language="jsx" theme="dracula" title="Dracula 主题" />

      {/* 自定义样式 */}
      <CodeBlock
        code={reactCode}
        language="jsx"
        customStyle={{
          fontSize: '16px',
          padding: '24px',
        }}
      />
    </div>
  )
}
```

## 🌐 支持的语言

- JavaScript (`javascript`, `js`)
- TypeScript (`typescript`, `ts`)
- JSX (`jsx`)
- TSX (`tsx`)
- JSON (`json`)
- Bash/Shell (`bash`, `shell`)
- Python (`python`)
- Java (`java`)
- CSS (`css`)
- HTML (`html`)
- 以及更多 Prism.js 支持的语言...

## 📝 注意事项

1. **代码字符串格式**：建议使用模板字符串或多行字符串来保持代码格式
2. **特殊字符转义**：如果代码中包含反引号，需要适当转义
3. **性能考虑**：对于超长代码，建议启用虚拟滚动或分页显示

## 🔗 相关资源

- [react-syntax-highlighter 官方文档](https://github.com/react-syntax-highlighter/react-syntax-highlighter)
- [Prism.js 主题预览](https://github.com/react-syntax-highlighter/react-syntax-highlighter/blob/master/STYLES.md)
