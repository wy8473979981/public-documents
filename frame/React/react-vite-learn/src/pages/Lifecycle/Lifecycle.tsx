import { useState, useEffect, useCallback } from 'react'
import { Card, Space, Typography, Button, Tag, Alert, Divider, Tabs } from 'antd'
import CodeBlock from '../../components/CodeBlock'
import './Lifecycle.css'

const { Title, Paragraph, Text } = Typography

// 函数组件生命周期代码示例
const functionComponentCode = [
  "import { useState, useEffect } from 'react'",
  '',
  'function MyComponent() {',
  '  const [count, setCount] = useState(0)',
  '',
  '  // componentDidMount + componentWillUnmount',
  '  useEffect(() => {',
  "    console.log('组件已挂载')",
  '',
  '    return () => {',
  "      console.log('组件即将卸载')",
  '    }',
  '  }, []) // 空依赖数组',
  '',
  '  // componentDidUpdate - 当 count 变化时执行',
  '  useEffect(() => {',
  "    console.log('Count 更新了:', count)",
  '  }, [count]) // 依赖 count',
  '',
  '  return <div>{count}</div>',
  '}',
].join('\n')

// 类组件生命周期代码示例
const classComponentCode = [
  "import React, { Component } from 'react'",
  '',
  'class MyComponent extends Component {',
  '  constructor(props) {',
  '    super(props)',
  '    this.state = { count: 0 }',
  '  }',
  '',
  '  // 组件挂载时执行',
  '  componentDidMount() {',
  "    console.log('组件已挂载')",
  '  }',
  '',
  '  // 组件更新时执行',
  '  componentDidUpdate(prevProps, prevState) {',
  '    if (prevState.count !== this.state.count) {',
  "      console.log('Count 更新了:', this.state.count)",
  '    }',
  '  }',
  '',
  '  // 组件卸载时执行',
  '  componentWillUnmount() {',
  "    console.log('组件即将卸载')",
  '  }',
  '',
  '  render() {',
  '    return <div>{this.state.count}</div>',
  '  }',
  '}',
].join('\n')

function Lifecycle() {
  const [activeTab, setActiveTab] = useState('function')

  const tabs = [
    {
      key: 'function',
      label: '🔧 函数组件生命周期',
      children: <FunctionComponentDemo />,
    },
    {
      key: 'class',
      label: '📦 类组件生命周期',
      children: <ClassComponentDemo />,
    },
  ]

  return (
    <div className="lifecycle-page">
      <Title level={2}>⚛️ React 组件生命周期学习</Title>

      <Space orientation="vertical" size="large" style={{ width: '100%' }}>
        <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabs} size="large" type="card" />
      </Space>
    </div>
  )
}

// 函数组件演示
function FunctionComponentDemo() {
  const [count, setCount] = useState(0)
  const [message, setMessage] = useState<string[]>([])
  const [showChild, setShowChild] = useState(true)

  // 添加日志消息
  const addLog = useCallback((msg: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setMessage((prev) => [...prev, `[${timestamp}] ${msg}`])
  }, [])

  // 模拟 componentDidMount - 组件挂载时执行
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    addLog('✅ 组件已挂载 (componentDidMount)')

    // 模拟 componentWillUnmount - 组件卸载时执行
    return () => {
      addLog('❌ 组件即将卸载 (componentWillUnmount)')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // 空依赖数组，只在挂载和卸载时执行

  // 模拟 componentDidUpdate - count 变化时执行
  useEffect(() => {
    if (count > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      addLog(`🔄 Count 更新为: ${count} (componentDidUpdate)`)
    }
  }, [count, addLog]) // 依赖 count，当 count 变化时执行

  // 模拟 componentDidUpdate - message 变化时执行
  useEffect(() => {
    if (message.length > 1) {
      console.log(`📝 日志数量: ${message.length}`)
    }
  }, [message])

  const handleIncrement = () => {
    setCount((prev) => prev + 1)
  }

  const handleToggleChild = () => {
    setShowChild((prev) => !prev)
  }

  const handleClearLogs = () => {
    setMessage([])
    addLog('🗑️ 日志已清空')
  }

  return (
    <Space orientation="vertical" size="large" style={{ width: '100%' }}>
      {/* 代码示例卡片 */}
      <CodeBlock
        code={functionComponentCode}
        language="javascript"
        title="🔧 函数组件生命周期代码"
      />

      {/* 生命周期说明卡片 */}
      <Card title="📚 函数组件生命周期概念" variant="borderless">
        <Paragraph>
          <Text strong>React 函数组件使用 Hooks 来模拟类组件的生命周期：</Text>
        </Paragraph>

        <Space orientation="vertical" style={{ width: '100%' }}>
          <Alert
            title="useEffect(() => {}, [])"
            description={
              <div>
                <Text code>componentDidMount</Text> + <Text code>componentWillUnmount</Text>
                <br />
                <Text type="secondary">空依赖数组，只在组件挂载和卸载时执行</Text>
              </div>
            }
            type="info"
            showIcon
          />

          <Alert
            title="useEffect(() => {}, [dependency])"
            description={
              <div>
                <Text code>componentDidUpdate</Text>
                <br />
                <Text type="secondary">有依赖数组，当依赖变化时执行</Text>
              </div>
            }
            type="success"
            showIcon
          />

          <Alert
            title="useEffect(() => {})"
            description={
              <div>
                <Text code>componentDidMount</Text> + <Text code>componentDidUpdate</Text>
                <br />
                <Text type="secondary">无依赖数组，每次渲染后都执行</Text>
              </div>
            }
            type="warning"
            showIcon
          />
        </Space>
      </Card>

      {/* 交互式演示卡片 */}
      <Card title="🎮 交互式生命周期演示" variant="borderless">
        <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
          <div>
            <Text strong>当前 Count 值：</Text>
            <Tag color="blue" style={{ fontSize: '16px', marginLeft: '8px' }}>
              {count}
            </Tag>
          </div>

          <Space wrap>
            <Button type="primary" onClick={handleIncrement}>
              ➕ 增加 Count（触发更新）
            </Button>
            <Button onClick={handleToggleChild}>
              {showChild ? '❌' : '✅'} {showChild ? '卸载' : '挂载'}子组件
            </Button>
            <Button danger onClick={handleClearLogs}>
              🗑️ 清空日志
            </Button>
          </Space>

          <Divider />

          {/* 子组件演示挂载/卸载 */}
          {showChild && <ChildComponent onLog={addLog} />}

          <Divider />

          {/* 日志显示区域 */}
          <div className="log-container">
            <Title level={5}>📋 生命周期日志</Title>
            <div className="log-content">
              {message.length === 0 ? (
                <Text type="secondary">暂无日志，尝试操作上方按钮...</Text>
              ) : (
                message.map((log, index) => (
                  <div key={index} className="log-item">
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>
        </Space>
      </Card>

      {/* 最佳实践卡片 */}
      <Card title="💡 最佳实践" variant="borderless">
        <Space orientation="vertical" style={{ width: '100%' }}>
          <Paragraph>
            <Text strong>1. 清理副作用：</Text>
            <br />
            <Text code>{`useEffect(() => {`}</Text>
            <br />
            <Text code>{`  const timer = setInterval(() => {}, 1000)`}</Text>
            <br />
            <Text code>{`  return () => clearInterval(timer) // 清理定时器`}</Text>
            <br />
            <Text code>{`}, [])`}</Text>
          </Paragraph>

          <Paragraph>
            <Text strong>2. 避免无限循环：</Text>
            <br />
            <Text type="danger">
              ⚠️ 不要在 useEffect 中直接更新状态而不设置依赖，会导致无限循环
            </Text>
          </Paragraph>

          <Paragraph>
            <Text strong>3. 正确的依赖数组：</Text>
            <br />
            <Text type="success">✅ 确保 useEffect 中使用的所有变量都在依赖数组中声明</Text>
          </Paragraph>
        </Space>
      </Card>
    </Space>
  )
}

// 类组件演示
function ClassComponentDemo() {
  return (
    <Space orientation="vertical" size="large" style={{ width: '100%' }}>
      {/* 代码示例卡片 */}
      <CodeBlock code={classComponentCode} language="javascript" title="💻 类组件生命周期代码" />

      {/* 生命周期说明卡片 */}
      <Card title="📚 类组件生命周期概念" variant="borderless">
        <Paragraph>
          <Text strong>React 类组件有明确的生命周期方法：</Text>
        </Paragraph>

        <Space orientation="vertical" style={{ width: '100%' }}>
          <Alert
            title="componentDidMount()"
            description={
              <div>
                <Text type="secondary">
                  组件挂载完成后立即调用，适合进行数据请求、订阅等初始化操作
                </Text>
              </div>
            }
            type="info"
            showIcon
          />

          <Alert
            title="componentDidUpdate(prevProps, prevState)"
            description={
              <div>
                <Text type="secondary">
                  组件更新后立即调用，可以比较前后的 props 和 state 来决定是否执行某些操作
                </Text>
              </div>
            }
            type="success"
            showIcon
          />

          <Alert
            title="componentWillUnmount()"
            description={
              <div>
                <Text type="secondary">
                  组件卸载前调用，适合进行清理工作，如取消订阅、清除定时器等
                </Text>
              </div>
            }
            type="warning"
            showIcon
          />

          <Alert
            title="其他常用生命周期"
            description={
              <div>
                <Text code>constructor()</Text> - 初始化 state 和绑定方法
                <br />
                <Text code>render()</Text> - 渲染 UI（必需）
                <br />
                <Text code>shouldComponentUpdate()</Text> - 性能优化，控制是否重新渲染
                <br />
                <Text code>getDerivedStateFromProps()</Text> - 根据 props 更新 state
              </div>
            }
            type="info"
            showIcon
          />
        </Space>
      </Card>

      {/* 对比说明卡片 */}
      <Card title="🔄 函数组件 vs 类组件" variant="borderless">
        <Space orientation="vertical" style={{ width: '100%' }}>
          <Paragraph>
            <Text strong>主要区别：</Text>
          </Paragraph>

          <ul className="lifecycle-list">
            <li>
              <Text>函数组件更简洁，易于理解和测试</Text>
            </li>
            <li>
              <Text>类组件需要理解 this 关键字和绑定方法</Text>
            </li>
            <li>
              <Text>函数组件使用 Hooks 管理状态和副作用</Text>
            </li>
            <li>
              <Text>类组件有明确的生命周期方法</Text>
            </li>
            <li>
              <Text>React 官方推荐使用函数组件 + Hooks</Text>
            </li>
          </ul>

          <Alert
            message="💡 建议"
            description="新项目建议使用函数组件 + Hooks，旧项目中的类组件可以逐步迁移"
            type="info"
            showIcon
          />
        </Space>
      </Card>
    </Space>
  )
}

// 子组件 - 用于演示挂载和卸载
function ChildComponent({ onLog }: { onLog: (msg: string) => void }) {
  useEffect(() => {
    onLog('🟢 子组件已挂载')

    return () => {
      onLog('🔴 子组件即将卸载')
    }
  }, [onLog])

  return (
    <Card size="small" style={{ background: '#f0f5ff' }}>
      <Text strong>👶 子组件</Text>
      <Paragraph style={{ marginTop: '8px' }}>这个组件用于演示挂载和卸载时的生命周期</Paragraph>
    </Card>
  )
}

export default Lifecycle
