import { useState, useEffect, useCallback } from 'react'
import { Card, Space, Typography, Button, Tag, Alert, Divider } from 'antd'
import CodeBlock from '@/components/CodeBlock'
import './FunctionLifecycle.css'

const { Paragraph, Text } = Typography

// 数据获取示例代码
const dataFetchCode = [
  "import { useState, useEffect } from 'react'",
  '',
  'function DataFetchingExample() {',
  '  const [data, setData] = useState(null)',
  '  const [loading, setLoading] = useState(false)',
  '  const [error, setError] = useState(null)',
  '',
  '  useEffect(() => {',
  '    let isMounted = true // 防止组件卸载后更新状态',
  '',
  '    const fetchData = async () => {',
  '      setLoading(true)',
  '      try {',
  '        const response = await fetch("https://api.example.com/data")',
  '        const result = await response.json()',
  '        if (isMounted) {',
  '          setData(result)',
  '          setError(null)',
  '        }',
  '      } catch (err) {',
  '        if (isMounted) {',
  '          setError(err.message)',
  '        }',
  '      } finally {',
  '        if (isMounted) {',
  '          setLoading(false)',
  '        }',
  '      }',
  '    }',
  '',
  '    fetchData()',
  '',
  '    return () => {',
  '      isMounted = false // 清理函数',
  '    }',
  '  }, [])',
  '',
  '  if (loading) return <div>加载中...</div>',
  '  if (error) return <div>错误: {error}</div>',
  '  return <div>{data ? JSON.stringify(data) : "无数据"}</div>',
  '}',
].join('\n')

// 定时器示例代码
const timerCode = [
  "import { useState, useEffect } from 'react'",
  '',
  'function TimerExample() {',
  '  const [count, setCount] = useState(0)',
  '  const [isActive, setIsActive] = useState(false)',
  '',
  '  useEffect(() => {',
  '    let intervalId = null',
  '',
  '    if (isActive) {',
  '      intervalId = setInterval(() => {',
  '        setCount(prev => prev + 1)',
  '      }, 1000)',
  '    }',
  '',
  '    return () => {',
  '      if (intervalId) {',
  '        clearInterval(intervalId)',
  '      }',
  '    }',
  '  }, [isActive])',
  '',
  '  return (',
  '    <div>',
  '      <h3>计时器: {count}秒</h3>',
  '      <button onClick={() => setIsActive(!isActive)}>',
  '        {isActive ? "暂停" : "开始"}',
  '      </button>',
  '      <button onClick={() => setCount(0)}>重置</button>',
  '    </div>',
  '  )',
  '}',
].join('\n')

// 事件监听器示例代码
const eventListenerCode = [
  "import { useState, useEffect } from 'react'",
  '',
  'function EventListenerExample() {',
  '  const [position, setPosition] = useState({ x: 0, y: 0 })',
  '',
  '  useEffect(() => {',
  '    const handleMouseMove = (e) => {',
  '      setPosition({ x: e.clientX, y: e.clientY })',
  '    }',
  '',
  '    window.addEventListener("mousemove", handleMouseMove)',
  '',
  '    return () => {',
  '      window.removeEventListener("mousemove", handleMouseMove)',
  '    }',
  '  }, [])',
  '',
  '  return (',
  '    <div>',
  '      <p>鼠标位置: X={position.x}, Y={position.y}</p>',
  '    </div>',
  '  )',
  '}',
].join('\n')

// API 调用与取消示例代码
const apiCancelCode = [
  "import { useState, useEffect } from 'react'",
  '',
  'function ApiWithCancellation() {',
  '  const [data, setData] = useState(null)',
  '  const [loading, setLoading] = useState(false)',
  '',
  '  useEffect(() => {',
  '    const controller = new AbortController()',
  '    const signal = controller.signal',
  '',
  '    const fetchData = async () => {',
  '      setLoading(true)',
  '      try {',
  '        const response = await fetch(',
  '          "https://jsonplaceholder.typicode.com/posts/1",',
  '          { signal }',
  '        )',
  '        const result = await response.json()',
  '        setData(result)',
  '      } catch (error) {',
  '        if (error.name !== "AbortError") {',
  '          console.error("Fetch error:", error)',
  '        }',
  '      } finally {',
  '        setLoading(false)',
  '      }',
  '    }',
  '',
  '    fetchData()',
  '',
  '    return () => {',
  '      controller.abort() // 取消请求',
  '    }',
  '  }, [])',
  '',
  '  return (',
  '    <div>',
  '      {loading && <p>加载中...</p>}',
  '      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}',
  '    </div>',
  '  )',
  '}',
].join('\n')

// 数据获取示例组件
function DataFetchingDemo({ addLog }: { addLog: (msg: string) => void }) {
  const [data, setData] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const fetchData = async () => {
      setLoading(true)
      setError(null)
      addLog('🌐 开始获取数据...')

      try {
        // 模拟 API 请求延迟
        await new Promise((resolve) => setTimeout(resolve, 1500))

        if (isMounted) {
          const mockData = {
            id: 1,
            title: 'React 学习笔记',
            content: 'useEffect 是处理副作用的核心 Hook',
          }
          setData(JSON.stringify(mockData, null, 2))
          addLog('✅ 数据获取成功')
        }
      } catch {
        if (isMounted) {
          setError('数据获取失败')
          addLog('❌ 数据获取失败')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchData()

    return () => {
      isMounted = false
      addLog('🧹 清理数据获取')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
      <Alert
        title="数据获取示例"
        description="展示如何在 useEffect 中安全地获取数据，并处理组件卸载的情况"
        type="info"
        showIcon
      />

      <CodeBlock code={dataFetchCode} language="javascript" title="数据获取代码示例" />

      <Divider />

      <div>
        <Text strong>数据状态：</Text>
        {loading ? (
          <Tag color="processing">加载中...</Tag>
        ) : error ? (
          <Tag color="error">{error}</Tag>
        ) : (
          <Tag color="success">数据已加载</Tag>
        )}
      </div>

      {data && (
        <Card size="small" title="获取的数据">
          <pre className="code-pre">{data}</pre>
        </Card>
      )}

      <Button onClick={() => window.location.reload()} type="primary">
        🔄 重新加载页面
      </Button>
    </Space>
  )
}

// 定时器示例组件
function TimerDemo({ addLog }: { addLog: (msg: string) => void }) {
  const [count, setCount] = useState(0)
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | null = null

    if (isActive) {
      intervalId = setInterval(() => {
        setCount((prev) => prev + 1)
      }, 1000)
      addLog('⏱️ 定时器启动')
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId)
        addLog('🛑 定时器已清除')
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive])

  return (
    <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
      <Alert
        title="定时器示例"
        description="展示如何正确管理定时器，避免内存泄漏"
        type="info"
        showIcon
      />

      <CodeBlock code={timerCode} language="javascript" title="定时器代码示例" />

      <Divider />

      <div className="timer-display">
        <Text strong className="timer-count">
          {count} 秒
        </Text>
      </div>

      <Space wrap>
        <Button type="primary" onClick={() => setIsActive(!isActive)} danger={isActive}>
          {isActive ? '⏸️ 暂停' : '▶️ 开始'}
        </Button>
        <Button onClick={() => setCount(0)}>🔄 重置</Button>
      </Space>
    </Space>
  )
}

// 事件监听器示例组件
function EventListenerDemo({ addLog }: { addLog: (msg: string) => void }) {
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    addLog('🖱️ 鼠标移动监听器已添加')

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      addLog('🧹 鼠标移动监听器已移除')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
      <Alert
        title="事件监听器示例"
        description="展示如何在 useEffect 中添加和清理事件监听器"
        type="info"
        showIcon
      />

      <CodeBlock code={eventListenerCode} language="javascript" title="事件监听器代码示例" />

      <Divider />

      <Card>
        <Space orientation="vertical">
          <Text strong>鼠标位置追踪</Text>
          <div className="mouse-position-box">
            <Text>X: {position.x}px</Text>
            <br />
            <Text>Y: {position.y}px</Text>
          </div>
        </Space>
      </Card>

      <Alert
        title="注意事项"
        description="记得在清理函数中移除事件监听器，否则会导致内存泄漏"
        type="warning"
        showIcon
      />
    </Space>
  )
}

// API 调用与取消示例组件
function ApiCancellationDemo({ addLog }: { addLog: (msg: string) => void }) {
  interface PostData {
    userId: number
    id: number
    title: string
    body: string
  }

  const [data, setData] = useState<PostData | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    const signal = controller.signal

    const fetchData = async () => {
      setLoading(true)
      addLog('🌐 开始 API 请求...')

      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts/1', {
          signal,
        })
        const result = await response.json()
        setData(result)
        addLog('✅ API 请求成功')
      } catch (error: unknown) {
        if (error instanceof Error && error.name !== 'AbortError') {
          addLog(`❌ API 请求失败: ${error.message}`)
        } else if (!(error instanceof Error && error.name === 'AbortError')) {
          addLog('🚫 API 请求已取消')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    return () => {
      controller.abort()
      addLog('🧹 API 请求已取消')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
      <Alert
        title="API 调用与取消示例"
        description="展示如何使用 AbortController 取消未完成的 API 请求"
        type="info"
        showIcon
      />

      <CodeBlock code={apiCancelCode} language="javascript" title="API 取消代码示例" />

      <Divider />

      {loading && <Tag color="processing">加载中...</Tag>}

      {data && (
        <Card size="small" title="API 响应数据">
          <pre className="code-pre">{JSON.stringify(data, null, 2)}</pre>
        </Card>
      )}

      <Alert
        title="使用场景"
        description={
          <ul>
            <li>用户快速切换标签页时取消前一个请求</li>
            <li>搜索框输入时取消之前的搜索请求</li>
            <li>组件卸载时取消所有 pending 的请求</li>
          </ul>
        }
        type="success"
        showIcon
      />
    </Space>
  )
}

export function ComplexExample() {
  const [activeTab, setActiveTab] = useState<'fetch' | 'timer' | 'event' | 'api'>('fetch')
  const [logs, setLogs] = useState<string[]>([])

  const addLog = useCallback((msg: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setLogs((prev) => [...prev, `[${timestamp}] ${msg}`])
  }, [])

  return (
    <Space orientation="vertical" size="large" style={{ width: '100%' }}>
      <Alert
        title="学习目标"
        description="通过多个复杂场景示例，深入理解 useEffect 在实际项目中的应用"
        type="info"
        showIcon
      />

      {/* 标签页切换 */}
      <Space wrap>
        <Button
          type={activeTab === 'fetch' ? 'primary' : 'default'}
          onClick={() => setActiveTab('fetch')}
        >
          📡 数据获取
        </Button>
        <Button
          type={activeTab === 'timer' ? 'primary' : 'default'}
          onClick={() => setActiveTab('timer')}
        >
          ⏱️ 定时器
        </Button>
        <Button
          type={activeTab === 'event' ? 'primary' : 'default'}
          onClick={() => setActiveTab('event')}
        >
          🖱️ 事件监听
        </Button>
        <Button
          type={activeTab === 'api' ? 'primary' : 'default'}
          onClick={() => setActiveTab('api')}
        >
          🔌 API 取消
        </Button>
        <Button danger onClick={() => setLogs([])}>
          🗑️ 清空日志
        </Button>
      </Space>

      {/* 当前选中的示例 */}
      {activeTab === 'fetch' && <DataFetchingDemo addLog={addLog} />}
      {activeTab === 'timer' && <TimerDemo addLog={addLog} />}
      {activeTab === 'event' && <EventListenerDemo addLog={addLog} />}
      {activeTab === 'api' && <ApiCancellationDemo addLog={addLog} />}

      {/* 生命周期日志 */}
      <Card title="📋 实时生命周期日志" variant="borderless">
        <div className="log-container">
          <div className="log-content">
            {logs.length === 0 ? (
              <Text type="secondary">暂无日志，尝试操作上方按钮...</Text>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="log-item">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
      </Card>

      {/* 总结 */}
      <Card title="💡 关键知识点总结" variant="borderless">
        <Space orientation="vertical" style={{ width: '100%' }}>
          <Paragraph>
            <Text strong>1. 数据获取：</Text>
            <br />
            <Text>使用标志位防止组件卸载后更新状态，避免内存泄漏</Text>
          </Paragraph>

          <Paragraph>
            <Text strong>2. 定时器管理：</Text>
            <br />
            <Text>在清理函数中清除定时器，确保资源正确释放</Text>
          </Paragraph>

          <Paragraph>
            <Text strong>3. 事件监听器：</Text>
            <br />
            <Text>添加监听器后必须在清理函数中移除，防止内存泄漏</Text>
          </Paragraph>

          <Paragraph>
            <Text strong>4. API 请求取消：</Text>
            <br />
            <Text>使用 AbortController 取消未完成的请求，提升用户体验</Text>
          </Paragraph>
        </Space>
      </Card>
    </Space>
  )
}
