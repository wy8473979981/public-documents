import type React from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vs, atomDark, dracula, prism } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Card } from 'antd'

export type CodeTheme = 'vs' | 'atomDark' | 'dracula' | 'prism'

interface CodeBlockProps {
  code: string
  language?: string
  theme?: CodeTheme
  showLineNumbers?: boolean
  wrapLines?: boolean
  title?: string
  customStyle?: React.CSSProperties
}

const themeMap: Record<CodeTheme, { [key: string]: React.CSSProperties }> = {
  vs,
  atomDark,
  dracula,
  prism,
}

export default function CodeBlock({
  code,
  language = 'javascript',
  theme = 'dracula',
  showLineNumbers = true,
  wrapLines = true,
  title,
  customStyle,
}: CodeBlockProps) {
  return (
    <Card
      title={title || `${language.toUpperCase()} 代码`}
      styles={{
        header: { color: '#f8f8f2', borderBottom: '1px solid #44475a' },
        body: { padding: 0 },
      }}
      style={{ backgroundColor: '#282a36', marginBottom: '16px' }}
    >
      <SyntaxHighlighter
        language={language}
        style={themeMap[theme]}
        customStyle={{
          borderRadius: '8px',
          padding: '16px',
          fontSize: '14px',
          lineHeight: '1.6',
          margin: 0,
          ...customStyle,
        }}
        wrapLines={wrapLines}
        showLineNumbers={showLineNumbers}
      >
        {code}
      </SyntaxHighlighter>
    </Card>
  )
}
