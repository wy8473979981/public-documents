import { Space, Typography, Card, Alert } from 'antd'
import CodeBlock from '@/components/CodeBlock'
import './FunctionLifecycle.css'

const { Paragraph, Text } = Typography

// 基础概念组件
export function BasicConcepts() {
  // 模式1: 空依赖数组 - 仅在挂载和卸载时执行
  const mountUnmountCode = [
    "import { useState, useEffect } from 'react'",
    '',
    'function Example1() {',
    '  const [count, setCount] = useState(0)',
    '',
    '  // ✅ 空依赖数组 []',
    '  // 只在组件挂载时执行一次',
    '  useEffect(() => {',
    "    console.log('✅ 组件已挂载')",
    "    console.log('🌐 可以在这里发起 API 请求')",
    '',
    '    // 清理函数：在组件卸载时执行',
    '    return () => {',
    "      console.log('❌ 组件即将卸载')",
    "      console.log('🧹 清理定时器、取消订阅等')",
    '    }',
    '  }, []) // 👈 空依赖数组',
    '',
    '  return <button onClick={() => setCount(count + 1)}>Count: {count}</button>',
    '}',
  ].join('\n')

  // 模式2: 有依赖数组 - 依赖变化时执行
  const dependencyCode = [
    "import { useState, useEffect } from 'react'",
    '',
    'function Example2() {',
    '  const [count, setCount] = useState(0)',
    '  const [name, setName] = useState("React")',
    '',
    '  // ✅ 依赖数组 [count]',
    '  // 当 count 变化时执行',
    '  useEffect(() => {',
    '    console.log(`🔄 Count 更新为: ${count}`)',
    "    console.log('💾 可以在这里保存数据到 localStorage')",
    '',
    '    // 可选的清理函数',
    '    return () => {',
    "      console.log('🧹 清理之前的副作用')",
    '    }',
    '  }, [count]) // 👈 依赖 count',
    '',
    '  // ✅ 多个依赖',
    '  useEffect(() => {',
    "    console.log(`📝 Name 或 Count 变化了')",
    '    document.title = `${name} - Count: ${count}`',
    '  }, [count, name]) // 👈 依赖 count 和 name',
    '',
    '  return (',
    '    <div>',
    '      <button onClick={() => setCount(count + 1)}>Count: {count}</button>',
    '      <button onClick={() => setName("Vue")}>Change Name</button>',
    '    </div>',
    '  )',
    '}',
  ].join('\n')

  // 模式3: 无依赖数组 - 每次渲染后都执行
  const everyRenderCode = [
    "import { useState, useEffect } from 'react'",
    '',
    'function Example3() {',
    '  const [count, setCount] = useState(0)',
    '  const [x, setX] = useState(0)',
    '',
    '  // ⚠️ 没有依赖数组',
    '  // 每次渲染后都会执行（包括首次挂载）',
    '  useEffect(() => {',
    "    console.log('🔄 每次渲染后都执行')",
    '    console.log(`当前 count: ${count}, x: ${x}`)',
    '',
    '    // 清理函数会在下次执行前运行',
    '    return () => {',
    "      console.log('🧹 清理上一次的副作用')",
    '    }',
    '  }) // 👈 没有依赖数组',
    '',
    '  return (',
    '    <div>',
    '      <button onClick={() => setCount(count + 1)}>Count: {count}</button>',
    '      <button onClick={() => setX(x + 1)}>X: {x}</button>',
    '    </div>',
    '  )',
    '}',
  ].join('\n')

  return (
    <Space orientation="vertical" size="large" style={{ width: '100%' }}>
      <Paragraph>
        <Text strong>useEffect Hook 是函数组件中处理副作用的主要方式。</Text>
        <br />
        <Text type="secondary">副作用包括：数据获取、订阅、手动修改 DOM、定时器等。</Text>
      </Paragraph>

      {/* 模式1 */}
      <Card title="模式 1: 空依赖数组 [] - 仅在挂载和卸载时执行" variant="borderless">
        <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
          <Alert
            title="使用场景"
            description={
              <ul>
                <li>组件初始化（如发起 API 请求）</li>
                <li>设置事件监听器</li>
                <li>创建定时器</li>
                <li>需要在卸载时清理的资源</li>
              </ul>
            }
            type="info"
            showIcon
          />

          <CodeBlock code={mountUnmountCode} language="javascript" title="代码示例" />

          <Alert
            title="关键点"
            description={
              <div>
                <Text code>{'useEffect(() => {...}, [])'}</Text>
                <br />
                <Text type="success">
                  ✅ 效果等同于类组件的 componentDidMount + componentWillUnmount
                </Text>
                <br />
                <Text type="secondary">💡 返回的清理函数会在组件卸载时执行</Text>
              </div>
            }
            type="success"
            showIcon
          />
        </Space>
      </Card>

      {/* 模式2 */}
      <Card title="模式 2: 有依赖数组 [dep] - 依赖变化时执行" variant="borderless">
        <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
          <Alert
            title="使用场景"
            description={
              <ul>
                <li>响应特定状态变化</li>
                <li>根据 props 变化执行操作</li>
                <li>保存数据到 localStorage</li>
                <li>更新文档标题</li>
              </ul>
            }
            type="info"
            showIcon
          />

          <CodeBlock code={dependencyCode} language="javascript" title="代码示例" />

          <Alert
            title="关键点"
            description={
              <div>
                <Text code>{'useEffect(() => {...}, [count])'}</Text>
                <br />
                <Text type="success">
                  ✅ 效果等同于类组件的 componentDidUpdate（仅当 count 变化时）
                </Text>
                <br />
                <Text type="warning">⚠️ 确保所有在 effect 中使用的变量都在依赖数组中声明</Text>
                <br />
                <Text type="secondary">💡 可以使用多个依赖：{`[count, name, props.id]`}</Text>
              </div>
            }
            type="success"
            showIcon
          />
        </Space>
      </Card>

      {/* 模式3 */}
      <Card title="模式 3: 无依赖数组 - 每次渲染后都执行" variant="borderless">
        <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
          <Alert
            title="使用场景"
            description={
              <ul>
                <li>需要跟踪每次渲染的情况</li>
                <li>调试和日志记录</li>
                <li>某些特殊的同步需求</li>
              </ul>
            }
            type="warning"
            showIcon
          />

          <CodeBlock code={everyRenderCode} language="javascript" title="代码示例" />

          <Alert
            title="关键点"
            description={
              <div>
                <Text code>{'useEffect(() => {...})'}</Text>
                <br />
                <Text type="warning">⚠️ 每次 state 或 props 变化都会执行</Text>
                <br />
                <Text type="danger">🚫 谨慎使用，可能导致性能问题或无限循环</Text>
                <br />
                <Text type="secondary">💡 清理函数会在下次 effect 执行前运行</Text>
              </div>
            }
            type="warning"
            showIcon
          />
        </Space>
      </Card>

      {/* 对比总结 */}
      <Card title="📊 三种模式对比总结" variant="borderless">
        <div className="comparison-table-container">
          <table className="comparison-table">
            <thead>
              <tr>
                <th>模式</th>
                <th>依赖数组</th>
                <th>执行时机</th>
                <th>类组件等价</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <Text strong>模式 1</Text>
                </td>
                <td>
                  <Text code>[]</Text>
                </td>
                <td>挂载 + 卸载</td>
                <td>
                  <Text code>componentDidMount</Text>
                  <br />
                  <Text code>+ componentWillUnmount</Text>
                </td>
              </tr>
              <tr>
                <td>
                  <Text strong>模式 2</Text>
                </td>
                <td>
                  <Text code>[dep]</Text>
                </td>
                <td>依赖变化时</td>
                <td>
                  <Text code>componentDidUpdate</Text>
                </td>
              </tr>
              <tr>
                <td>
                  <Text strong>模式 3</Text>
                </td>
                <td>
                  <Text>无</Text>
                </td>
                <td>每次渲染后</td>
                <td>
                  <Text code>componentDidMount</Text>
                  <br />
                  <Text code>+ componentDidUpdate</Text>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </Space>
  )
}
