import React, { Component } from 'react'
import { Card, Space, Typography, Button, Alert } from 'antd'
import './ClassLifecycleDemo.css'

const { Text } = Typography

interface ClassLifecycleDemoState {
  count: number
  name: string
  logs: string[]
}

class ClassLifecycleDemo extends Component<object, ClassLifecycleDemoState> {
  private timerId: ReturnType<typeof setInterval> | null = null

  constructor(props: object) {
    super(props)
    this.state = {
      count: 0,
      name: 'React',
      logs: [`${new Date().toLocaleTimeString()} - 1️⃣ constructor - 初始化状态`],
    }
  }

  static getDerivedStateFromProps(_nextProps: object, _prevState: ClassLifecycleDemoState) {
    // 这里可以基于props更新state
    void _nextProps
    void _prevState
    return null
  }

  shouldComponentUpdate(_nextProps: object, nextState: ClassLifecycleDemoState) {
    // 性能优化：只有当count或name变化时才重新渲染
    const shouldUpdate = nextState.count !== this.state.count || nextState.name !== this.state.name
    return shouldUpdate
  }

  componentDidMount() {
    this.addLog('4️⃣ componentDidMount - 组件挂载完成')
    // 模拟API请求
    setTimeout(() => {
      this.addLog('🌐 模拟API请求完成')
    }, 1000)

    // 启动定时器
    this.timerId = setInterval(() => {
      this.addLog(`⏰ 定时器触发 - ${new Date().toLocaleTimeString()}`)
    }, 5000)
  }

  componentDidUpdate(_prevProps: object, prevState: ClassLifecycleDemoState) {
    if (prevState.count !== this.state.count) {
      this.addLog(`5️⃣ componentDidUpdate - Count从${prevState.count}变为${this.state.count}`)
    }
    if (prevState.name !== this.state.name) {
      this.addLog(`5️⃣ componentDidUpdate - Name从"${prevState.name}"变为"${this.state.name}"`)
    }
  }

  componentWillUnmount() {
    this.addLog('6️⃣ componentWillUnmount - 组件即将卸载')
    // 清理定时器
    if (this.timerId) {
      clearInterval(this.timerId)
    }
  }

  addLog = (message: string) => {
    this.setState((prevState) => ({
      logs: [...prevState.logs, `${new Date().toLocaleTimeString()} - ${message}`],
    }))
  }

  handleIncrement = () => {
    this.setState((prevState) => ({
      count: prevState.count + 1,
    }))
  }

  handleNameChange = () => {
    this.setState((prevState) => ({
      name: prevState.name === 'React' ? 'Vue' : 'React',
    }))
  }

  handleClearLogs = () => {
    this.setState({ logs: [] })
  }

  render() {
    return (
      <div className="class-lifecycle-demo">
        <Space orientation="vertical" size="large" style={{ width: '100%' }}>
          <Card title="📦 类组件生命周期演示" variant="borderless">
            <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
              <div className="demo-controls">
                <Button onClick={this.handleIncrement}>增加计数: {this.state.count}</Button>
                <Button onClick={this.handleNameChange}>切换名称: {this.state.name}</Button>
                <Button onClick={this.handleClearLogs}>清空日志</Button>
              </div>

              <Alert
                title="当前状态"
                description={
                  <div>
                    <Text strong>Count:</Text> {this.state.count}
                    <br />
                    <Text strong>Name:</Text> {this.state.name}
                  </div>
                }
                type="info"
                showIcon
              />
            </Space>
          </Card>

          <Card title="📋 生命周期执行日志" variant="borderless">
            <div className="log-container">
              <div className="log-content">
                {this.state.logs.length > 0 ? (
                  this.state.logs.map((log, index) => (
                    <div key={index} className="log-item">
                      {log}
                    </div>
                  ))
                ) : (
                  <Text type="secondary">暂无日志记录</Text>
                )}
              </div>
            </div>
          </Card>

          <Card title="💡 学习要点" variant="borderless">
            <ul className="lifecycle-list">
              <li>观察constructor在组件创建时只执行一次</li>
              <li>注意componentDidMount在组件挂载后执行</li>
              <li>查看componentDidUpdate在状态变化时的行为</li>
              <li>理解shouldComponentUpdate如何影响渲染</li>
              <li>注意定时器在componentWillUnmount中的清理</li>
            </ul>
          </Card>
        </Space>
      </div>
    )
  }
}

export default ClassLifecycleDemo
