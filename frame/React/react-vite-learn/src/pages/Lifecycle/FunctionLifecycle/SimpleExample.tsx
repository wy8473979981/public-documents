import { useState, useEffect, useCallback } from 'react'
import { Card, Space, Typography, Button, Tag, Alert, Divider } from 'antd'
import CodeBlock from '@/components/CodeBlock'
import './FunctionLifecycle.css'

const { Paragraph, Text } = Typography

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

// 多状态管理示例代码
const multiStateCode = [
  "import { useState, useEffect } from 'react'",
  '',
  'function CounterWithMultipleStates() {',
  '  const [count, setCount] = useState(0)',
  '  const [name, setName] = useState("React")',
  '  const [color, setColor] = useState("blue")',
  '',
  '  // 监听 count 变化',
  '  useEffect(() => {',
  '    console.log(`计数器的值变为: ${count}`)',
  '    document.title = `计数: ${count}`',
  '  }, [count])',
  '',
  '  // 监听 name 变化',
  '  useEffect(() => {',
  '    console.log(`名称更新为: ${name}`)',
  '  }, [name])',
  '',
  '  return (',
  '    <div>',
  '      <h2>{name} 计数器</h2>',
  '      <p style={{ color }}>当前计数: {count}</p>',
  '      <button onClick={() => setCount(count + 1)}>增加</button>',
  '      <button onClick={() => setName("Vue")}>改名</button>',
  '      <button onClick={() => setColor("red")}>变色</button>',
  '    </div>',
  '  )',
  '}',
].join('\n')

// 条件渲染示例代码
const conditionalRenderCode = [
  "import { useState, useEffect } from 'react'",
  '',
  'function ConditionalExample() {',
  '  const [show, setShow] = useState(true)',
  '  const [data, setData] = useState(null)',
  '',
  '  useEffect(() => {',
  '    if (show) {',
  "      console.log('✅ 组件已显示，开始加载数据')",
  '      // 模拟数据加载',
  '      setTimeout(() => setData("数据加载完成"), 1000)',
  '    } else {',
  "      console.log('❌ 组件已隐藏')",
  '    }',
  '',
  '    return () => {',
  "      console.log('🧹 清理资源')",
  '    }',
  '  }, [show])',
  '',
  '  return (',
  '    <div>',
  '      <button onClick={() => setShow(!show)}>',
  '        {show ? "隐藏" : "显示"}',
  '      </button>',
  '      {show && data && <p>{data}</p>}',
  '    </div>',
  '  )',
  '}',
].join('\n')

export function SimpleExample() {
  const [count, setCount] = useState(0)
  const [name, setName] = useState('React')
  const [logs, setLogs] = useState<string[]>([])

  const addLog = useCallback((msg: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setLogs((prev) => [...prev, `[${timestamp}] ${msg}`])
  }, [])

  // 模拟 componentDidMount + componentWillUnmount
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    addLog('✅ 组件已挂载 - 初始化完成')
    return () => {
      addLog('❌ 组件即将卸载 - 清理资源')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 模拟 componentDidUpdate - 监听 count 变化
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    addLog(`🔄 Count 更新为: ${count}`)
  }, [count, addLog])

  // 监听 name 变化
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    addLog(`📝 名称更新为: ${name}`)
  }, [name, addLog])

  return (
    <Space orientation="vertical" size="large" style={{ width: '100%' }}>
      <Alert
        title="学习目标"
        description="通过实际的交互示例，深入理解 useEffect 在不同场景下的执行时机和作用"
        type="info"
        showIcon
      />

      {/* 基础计数器示例 */}
      <Card title="📊 示例 1: 基础计数器 - 理解挂载和更新" variant="borderless">
        <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
          <Paragraph>
            <Text>这个示例展示了组件挂载时的初始化和状态更新时的副作用处理。</Text>
          </Paragraph>

          <CodeBlock code={functionComponentCode} language="javascript" title="基础代码结构" />

          <Divider />

          <div>
            <Text strong>当前 Count 值：</Text>
            <Tag color="blue" style={{ fontSize: '16px', marginLeft: '8px' }}>
              {count}
            </Tag>
          </div>

          <Space wrap>
            <Button type="primary" onClick={() => setCount((prev) => prev + 1)}>
              ➕ 增加 Count
            </Button>
            <Button onClick={() => setCount(0)}>🔄 重置 Count</Button>
          </Space>

          <Alert
            title="观察要点"
            description={
              <ul>
                <li>首次加载时会触发「组件已挂载」日志</li>
                <li>每次点击增加按钮会触发「Count 更新」日志</li>
                <li>重置操作也会触发更新日志</li>
              </ul>
            }
            type="success"
            showIcon
          />
        </Space>
      </Card>

      {/* 多状态管理示例 */}
      <Card title="🎯 示例 2: 多状态管理 - 多个 useEffect 协同工作" variant="borderless">
        <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
          <Paragraph>
            <Text>
              在实际应用中，一个组件可能有多个状态。我们可以使用多个 useEffect
              来分别处理不同状态的副作用，这样代码更清晰、更易维护。
            </Text>
          </Paragraph>

          <CodeBlock code={multiStateCode} language="javascript" title="多状态管理代码" />

          <Divider />

          <div>
            <Text strong>当前名称：</Text>
            <Tag color="green" style={{ fontSize: '14px', marginLeft: '8px' }}>
              {name}
            </Tag>
          </div>

          <div>
            <Text strong>当前 Count 值：</Text>
            <Tag color="blue" style={{ fontSize: '14px', marginLeft: '8px' }}>
              {count}
            </Tag>
          </div>

          <Space wrap>
            <Button type="primary" onClick={() => setCount((prev) => prev + 1)}>
              ➕ 增加 Count
            </Button>
            <Button onClick={() => setName(name === 'React' ? 'Vue' : 'React')}>🔄 切换名称</Button>
            <Button danger onClick={() => setLogs([])}>
              🗑️ 清空日志
            </Button>
          </Space>

          <Alert
            title="最佳实践"
            description={
              <div>
                <Text>✅ 将不同的副作用逻辑分离到不同的 useEffect 中</Text>
                <br />
                <Text>✅ 每个 useEffect 只关注一个特定的状态或功能</Text>
                <br />
                <Text>✅ 这样可以让代码更易读、易测试、易维护</Text>
              </div>
            }
            type="success"
            showIcon
          />
        </Space>
      </Card>

      {/* 条件渲染示例 */}
      <Card title="🎭 示例 3: 条件渲染 - 控制组件显示/隐藏" variant="borderless">
        <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
          <Paragraph>
            <Text>
              当组件被条件渲染（显示/隐藏）时，useEffect
              的清理函数会被调用。这对于管理资源非常重要。
            </Text>
          </Paragraph>

          <CodeBlock code={conditionalRenderCode} language="javascript" title="条件渲染代码示例" />

          <Divider />

          <Alert
            title="实际应用场景"
            description={
              <ul>
                <li>模态框的打开/关闭</li>
                <li>标签页的切换</li>
                <li>折叠面板的展开/收起</li>
                <li>路由切换时的组件销毁</li>
              </ul>
            }
            type="info"
            showIcon
          />
        </Space>
      </Card>

      {/* 生命周期日志 */}
      <Card title="📋 实时生命周期日志" variant="borderless">
        <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
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

          <Button onClick={() => setLogs([])} style={{ alignSelf: 'flex-end' }}>
            🗑️ 清空所有日志
          </Button>
        </Space>
      </Card>

      {/* 总结 */}
      <Card title="💡 关键知识点总结" variant="borderless">
        <Space orientation="vertical" style={{ width: '100%' }}>
          <Paragraph>
            <Text strong>1. 组件挂载：</Text>
            <br />
            <Text>useEffect 在组件首次渲染后执行，相当于 componentDidMount</Text>
          </Paragraph>

          <Paragraph>
            <Text strong>2. 状态更新：</Text>
            <br />
            <Text>当依赖数组中的状态发生变化时，useEffect 会重新执行</Text>
          </Paragraph>

          <Paragraph>
            <Text strong>3. 清理函数：</Text>
            <br />
            <Text>返回的函数会在组件卸载或下次 effect 执行前调用</Text>
          </Paragraph>

          <Paragraph>
            <Text strong>4. 多个 useEffect：</Text>
            <br />
            <Text>可以使用多个 useEffect 来处理不同的副作用，保持代码清晰</Text>
          </Paragraph>
        </Space>
      </Card>
    </Space>
  )
}
