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

const themeMap: Record<CodeTheme, object> = {
  vs,
  atomDark,
  dracula,
  prism,
}

export default function CodeBlock({
  code,
  language = 'javascript',
  theme = 'vs',
  showLineNumbers = false,
  wrapLines = true,
  title,
  customStyle,
}: CodeBlockProps) {
  return (
    <Card
      title={title || `${language.toUpperCase()} 代码`}
      variant="borderless"
      style={{ backgroundColor: '#f5f5f5', marginBottom: '16px' }}
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
