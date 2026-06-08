import { useState } from 'react'
import { Card, Space, Typography, Alert, Button, Steps } from 'antd'
import CodeBlock from '@/components/CodeBlock'
import ClassLifecycleDemo from './ClassLifecycleDemo'
import './ClassLifecycle.css'

const { Title, Paragraph, Text } = Typography

// 类组件生命周期代码示例 - 基础概念
const basicLifecycleCode = [
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
  "    console.log('✅ 组件已挂载')",
  '  }',
  '',
  '  // 组件更新时执行',
  '  componentDidUpdate(prevProps, prevState) {',
  '    if (prevState.count !== this.state.count) {',
  "      console.log('🔄 Count 更新了:', this.state.count)",
  '    }',
  '  }',
  '',
  '  // 组件卸载时执行',
  '  componentWillUnmount() {',
  "    console.log('❌ 组件即将卸载')",
  '  }',
  '',
  '  render() {',
  '    return <div>{this.state.count}</div>',
  '  }',
  '}',
].join('\n')

// 完整的生命周期方法代码示例
const fullLifecycleCode = [
  "import React, { Component } from 'react'",
  '',
  'class FullLifecycleComponent extends Component {',
  '  constructor(props) {',
  '    super(props)',
  '    this.state = {',
  '      count: 0,',
  '      name: props.initialName || "Default"',
  '    }',
  '    console.log("1️⃣ constructor - 初始化状态")',
  '  }',
  '',
  '  static getDerivedStateFromProps(nextProps, prevState) {',
  '    console.log("2️⃣ getDerivedStateFromProps - 根据props更新state")',
  '    if (nextProps.initialName !== prevState.name) {',
  '      return { name: nextProps.initialName }',
  '    }',
  '    return null',
  '  }',
  '',
  '  shouldComponentUpdate(nextProps, nextState) {',
  '    console.log("3️⃣ shouldComponentUpdate - 决定是否重新渲染")',
  '    // 性能优化：只有当count变化时才重新渲染',
  '    return nextState.count !== this.state.count',
  '  }',
  '',
  '  componentDidMount() {',
  '    console.log("4️⃣ componentDidMount - 组件挂载完成")',
  '    // 适合进行API请求、订阅等操作',
  '  }',
  '',
  '  componentDidUpdate(prevProps, prevState) {',
  '    console.log("5️⃣ componentDidUpdate - 组件更新完成")',
  '    if (prevState.count !== this.state.count) {',
  '      console.log(`   Count从${prevState.count}变为${this.state.count}`)',
  '    }',
  '  }',
  '',
  '  componentWillUnmount() {',
  '    console.log("6️⃣ componentWillUnmount - 组件即将卸载")',
  '    // 清理定时器、取消订阅等',
  '  }',
  '',
  '  handleClick = () => {',
  '    this.setState({ count: this.state.count + 1 })',
  '  }',
  '',
  '  render() {',
  '    console.log("7️⃣ render - 渲染UI")',
  '    return (',
  '      <div>',
  '        <h2>{this.state.name}</h2>',
  '        <p>Count: {this.state.count}</p>',
  '        <button onClick={this.handleClick}>增加计数</button>',
  '      </div>',
  '    )',
  '  }',
  '}',
].join('\n')

// 与函数组件对比的代码示例
const comparisonCode = [
  '// 类组件版本',
  "import React, { Component } from 'react'",
  '',
  'class CounterClass extends Component {',
  '  state = { count: 0 }',
  '',
  '  componentDidMount() {',
  '    console.log("类组件: 挂载")',
  '  }',
  '',
  '  componentDidUpdate(prevProps, prevState) {',
  '    if (prevState.count !== this.state.count) {',
  '      console.log("类组件: 更新")',
  '    }',
  '  }',
  '',
  '  componentWillUnmount() {',
  '    console.log("类组件: 卸载")',
  '  }',
  '',
  '  render() {',
  '    return <button onClick={() => this.setState({count: this.state.count + 1})}>',
  '      Count: {this.state.count}',
  '    </button>',
  '  }',
  '}',
  '',
  '// 函数组件版本 (等效)',
  "import React, { useState, useEffect } from 'react'",
  '',
  'function CounterFunction() {',
  '  const [count, setCount] = useState(0)',
  '',
  '  useEffect(() => {',
  '    console.log("函数组件: 挂载/更新")',
  '    return () => console.log("函数组件: 清理/卸载")',
  '  }, [count])',
  '',
  '  return <button onClick={() => setCount(count + 1)}>Count: {count}</button>',
  '}',
].join('\n')

// 分步学习内容
const learningSteps = [
  {
    title: '基础概念',
    description: '了解类组件的基本生命周期方法',
    content: (
      <Space orientation="vertical" size="large" style={{ width: '100%' }}>
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

        <CodeBlock code={basicLifecycleCode} language="javascript" title="💻 基础生命周期代码" />
      </Space>
    ),
  },
  {
    title: '完整生命周期',
    description: '深入了解所有生命周期方法的执行顺序',
    content: (
      <Space orientation="vertical" size="large" style={{ width: '100%' }}>
        <Paragraph>
          <Text strong>类组件的完整生命周期流程：</Text>
        </Paragraph>

        <Alert
          title="生命周期执行顺序"
          description={
            <ol>
              <li>
                <Text code>constructor()</Text> - 初始化组件
              </li>
              <li>
                <Text code>getDerivedStateFromProps()</Text> - 派生状态
              </li>
              <li>
                <Text code>render()</Text> - 渲染UI
              </li>
              <li>
                <Text code>componentDidMount()</Text> - 挂载完成
              </li>
              <li>
                <Text code>componentDidUpdate()</Text> - 更新完成
              </li>
              <li>
                <Text code>componentWillUnmount()</Text> - 卸载前
              </li>
            </ol>
          }
          type="info"
          showIcon
        />

        <CodeBlock code={fullLifecycleCode} language="javascript" title="💻 完整生命周期代码" />

        <Alert
          title="💡 注意事项"
          description={
            <ul>
              <li>
                <Text code>render()</Text> 应该是纯函数,不应包含副作用
              </li>
              <li>
                <Text code>componentDidMount()</Text> 是唯一可以安全执行副作用的地方
              </li>
              <li>
                <Text code>shouldComponentUpdate()</Text> 可用于性能优化
              </li>
              <li>
                避免在 <Text code>componentDidUpdate()</Text> 中无条件调用 setState
              </li>
            </ul>
          }
          type="warning"
          showIcon
        />
      </Space>
    ),
  },
  {
    title: '实际应用场景',
    description: '通过实例理解生命周期的实际应用',
    content: (
      <Space orientation="vertical" size="large" style={{ width: '100%' }}>
        <Paragraph>
          <Text strong>常见的使用场景：</Text>
        </Paragraph>

        <Card title="数据获取" variant="borderless">
          <Paragraph>
            在 <Text code>componentDidMount</Text> 中获取数据是最常见的做法：
          </Paragraph>
          <CodeBlock
            code={`componentDidMount() {
  fetch('/api/data')
    .then(response => response.json())
    .then(data => this.setState({ data }))
    .catch(error => console.error('Error:', error));
}`}
            language="javascript"
            title="数据获取示例"
          />
        </Card>

        <Card title="事件监听器" variant="borderless">
          <Paragraph>
            在 <Text code>componentDidMount</Text> 中添加事件监听器，在{' '}
            <Text code>componentWillUnmount</Text> 中移除：
          </Paragraph>
          <CodeBlock
            code={`componentDidMount() {
  window.addEventListener('resize', this.handleResize);
}

componentWillUnmount() {
  window.removeEventListener('resize', this.handleResize);
}

handleResize = () => {
  this.setState({ windowWidth: window.innerWidth });
}`}
            language="javascript"
            title="事件监听器示例"
          />
        </Card>

        <Card title="定时器管理" variant="borderless">
          <Paragraph>使用定时器时需要在卸载时清理：</Paragraph>
          <CodeBlock
            code={`componentDidMount() {
  this.timerId = setInterval(() => {
    this.setState({ time: new Date().toLocaleTimeString() });
  }, 1000);
}

componentWillUnmount() {
  clearInterval(this.timerId);
}`}
            language="javascript"
            title="定时器管理示例"
          />
        </Card>

        <Card title="🎮 交互式演示" variant="borderless">
          <Paragraph>
            <Text strong>下面是一个完整的类组件生命周期演示：</Text>
          </Paragraph>
          <ClassLifecycleDemo />
        </Card>
      </Space>
    ),
  },
  {
    title: '与函数组件对比',
    description: '理解类组件与函数组件的区别',
    content: (
      <Space orientation="vertical" size="large" style={{ width: '100%' }}>
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

        <CodeBlock code={comparisonCode} language="javascript" title="💻 类组件 vs 函数组件对比" />

        <Alert
          title="💡 建议"
          description="新项目建议使用函数组件 + Hooks,旧项目中的类组件可以逐步迁移"
          type="info"
          showIcon
        />

        <Card title="何时仍需要使用类组件？" variant="borderless">
          <ul className="lifecycle-list">
            <li>维护遗留代码库</li>
            <li>使用不支持 Hooks 的第三方库</li>
            <li>团队尚未熟悉 Hooks 概念</li>
            <li>特定的错误边界需求（目前只能用类组件实现）</li>
          </ul>
        </Card>
      </Space>
    ),
  },
]

function ClassLifecycle() {
  const [currentStep, setCurrentStep] = useState(0)

  const nextStep = () => {
    setCurrentStep((prev) => (prev < learningSteps.length - 1 ? prev + 1 : prev))
    // 滚动到页面顶部
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const prevStep = () => {
    setCurrentStep((prev) => (prev > 0 ? prev - 1 : prev))
    // 滚动到页面顶部
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="lifecycle-page">
      <Title level={2}>📦 类组件生命周期学习</Title>

      <Space orientation="vertical" size="large" style={{ width: '100%' }}>
        {/* 步骤指示器 */}
        <Steps current={currentStep} items={learningSteps.map((step) => ({ title: step.title }))} />

        {/* 当前步骤内容 */}
        <Card title={learningSteps[currentStep].title} variant="borderless">
          {learningSteps[currentStep].content}
        </Card>

        {/* 导航按钮 */}
        <Space>
          <Button onClick={prevStep} disabled={currentStep === 0}>
            上一步
          </Button>
          <Button
            type="primary"
            onClick={nextStep}
            disabled={currentStep === learningSteps.length - 1}
          >
            下一步
          </Button>
        </Space>
      </Space>
    </div>
  )
}

export default ClassLifecycle
