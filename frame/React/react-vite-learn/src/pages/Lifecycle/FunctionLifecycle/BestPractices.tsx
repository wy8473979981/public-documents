import { useState, useEffect } from 'react'
import { Space, Typography, Card, Alert, Button, Tag, Divider } from 'antd'
import CodeBlock from '@/components/CodeBlock'
import './FunctionLifecycle.css'

const { Paragraph, Text } = Typography

// 清理副作用示例代码
const cleanupCode = [
  "import { useState, useEffect } from 'react'",
  '',
  'function TimerComponent() {',
  '  const [seconds, setSeconds] = useState(0)',
  '',
  '  useEffect(() => {',
  '    // 创建定时器',
  '    const timer = setInterval(() => {',
  '      setSeconds(prev => prev + 1)',
  '    }, 1000)',
  '',
  '    // ✅ 清理函数：组件卸载时清除定时器',
  '    return () => {',
  '      clearInterval(timer)',
  "      console.log('定时器已清理')",
  '    }',
  '  }, [])',
  '',
  '  return <div>运行时间: {seconds}秒</div>',
  '}',
].join('\n')

// API 请求取消示例代码
const apiCancelCode = [
  "import { useState, useEffect } from 'react'",
  '',
  'function DataFetcher({ userId }) {',
  '  const [data, setData] = useState(null)',
  '  const [loading, setLoading] = useState(true)',
  '',
  '  useEffect(() => {',
  '    // 创建 AbortController 用于取消请求',
  '    const controller = new AbortController()',
  '',
  '    const fetchData = async () => {',
  '      try {',
  '        setLoading(true)',
  '        const response = await fetch(',
  '          `/api/users/${userId}`,',
  '          { signal: controller.signal }',
  '        )',
  '        const result = await response.json()',
  '        setData(result)',
  '      } catch (error) {',
  "        if (error.name !== 'AbortError') {",
  '          console.error("获取数据失败:", error)',
  '        }',
  '      } finally {',
  '        setLoading(false)',
  '      }',
  '    }',
  '',
  '    fetchData()',
  '',
  '    // ✅ 清理函数：组件卸载或 userId 变化时取消请求',
  '    return () => {',
  '      controller.abort()',
  "      console.log('API 请求已取消')",
  '    }',
  '  }, [userId])',
  '',
  '  if (loading) return <div>加载中...</div>',
  '  return <div>{data?.name}</div>',
  '}',
].join('\n')

// 事件监听器示例代码
const eventListenerCode = [
  "import { useState, useEffect } from 'react'",
  '',
  'function ScrollTracker() {',
  '  const [scrollY, setScrollY] = useState(0)',
  '',
  '  useEffect(() => {',
  '    // 添加滚动事件监听器',
  '    const handleScroll = () => {',
  '      setScrollY(window.scrollY)',
  '    }',
  '',
  '    window.addEventListener("scroll", handleScroll)',
  '',
  '    // ✅ 清理函数：移除事件监听器',
  '    return () => {',
  '      window.removeEventListener("scroll", handleScroll)',
  "      console.log('事件监听器已移除')",
  '    }',
  '  }, [])',
  '',
  '  return <div>滚动位置: {scrollY}px</div>',
  '}',
].join('\n')

// 避免无限循环示例
const infiniteLoopCode = [
  "import { useState, useEffect } from 'react'",
  '',
  '// ❌ 错误示例：会导致无限循环',
  'function BadExample() {',
  '  const [count, setCount] = useState(0)',
  '',
  '  useEffect(() => {',
  '    // ⚠️ 在 effect 中更新状态，但没有依赖数组',
  '    // 这会导致每次渲染都执行，形成无限循环',
  '    setCount(count + 1)',
  '  }) // 没有依赖数组',
  '',
  '  return <div>{count}</div>',
  '}',
  '',
  '// ✅ 正确示例：设置正确的依赖',
  'function GoodExample() {',
  '  const [count, setCount] = useState(0)',
  '',
  '  useEffect(() => {',
  '    // 只在 count 变化时执行',
  '    console.log(`Count 变为: ${count}`)',
  '  }, [count]) // 添加依赖数组',
  '',
  '  return (',
  '    <button onClick={() => setCount(count + 1)}>',
  '      Count: {count}',
  '    </button>',
  '  )',
  '}',
].join('\n')

// 依赖数组最佳实践示例
const dependencyCode = [
  "import { useState, useEffect } from 'react'",
  '',
  'function UserProfile({ userId }) {',
  '  const [user, setUser] = useState(null)',
  '  const [posts, setPosts] = useState([])',
  '',
  '  // ✅ 正确：所有使用的变量都在依赖数组中',
  '  useEffect(() => {',
  '    const fetchUser = async () => {',
  '      const res = await fetch(`/api/users/${userId}`)',
  '      const data = await res.json()',
  '      setUser(data)',
  '    }',
  '    fetchUser()',
  '  }, [userId]) // userId 在依赖数组中',
  '',
  '  // ✅ 正确：多个依赖',
  '  useEffect(() => {',
  '    if (user) {',
  '      const fetchPosts = async () => {',
  '        const res = await fetch(`/api/posts?author=${user.id}`)',
  '        const data = await res.json()',
  '        setPosts(data)',
  '      }',
  '      fetchPosts()',
  '    }',
  '  }, [user]) // user 在依赖数组中',
  '',
  '  return <div>{user?.name}</div>',
  '}',
].join('\n')

// 分离关注点示例
const separationCode = [
  "import { useState, useEffect } from 'react'",
  '',
  'function Dashboard({ userId }) {',
  '  const [user, setUser] = useState(null)',
  '  const [notifications, setNotifications] = useState([])',
  '  const [theme, setTheme] = useState("light")',
  '',
  '  // ✅ 关注点1: 获取用户信息',
  '  useEffect(() => {',
  '    fetch(`/api/users/${userId}`)',
  '      .then(res => res.json())',
  '      .then(setUser)',
  '  }, [userId])',
  '',
  '  // ✅ 关注点2: 获取通知',
  '  useEffect(() => {',
  '    if (user) {',
  '      fetch(`/api/notifications/${user.id}`)',
  '        .then(res => res.json())',
  '        .then(setNotifications)',
  '    }',
  '  }, [user])',
  '',
  '  // ✅ 关注点3: 更新文档标题',
  '  useEffect(() => {',
  '    document.title = user ? `${user.name} - Dashboard` : "Dashboard"',
  '  }, [user])',
  '',
  '  // ✅ 关注点4: 应用主题',
  '  useEffect(() => {',
  '    document.body.className = theme',
  '  }, [theme])',
  '',
  '  return <div>Dashboard</div>',
  '}',
].join('\n')

// localStorage 同步示例
const localStorageCode = [
  "import { useState, useEffect } from 'react'",
  '',
  'function ThemeSelector() {',
  '  const [theme, setTheme] = useState(() => {',
  '    // 从 localStorage 读取初始值',
  '    return localStorage.getItem("theme") || "light"',
  '  })',
  '',
  '  // ✅ 当 theme 变化时，同步到 localStorage',
  '  useEffect(() => {',
  '    localStorage.setItem("theme", theme)',
  '    console.log(`主题已保存: ${theme}`)',
  '  }, [theme])',
  '',
  '  return (',
  '    <div>',
  '      <p>当前主题: {theme}</p>',
  '      <button onClick={() => setTheme("light")}>浅色</button>',
  '      <button onClick={() => setTheme("dark")}>深色</button>',
  '    </div>',
  '  )',
  '}',
].join('\n')

export function BestPractices() {
  const [showCleanupExample, setShowCleanupExample] = useState(false)
  const [showApiExample, setShowApiExample] = useState(false)

  return (
    <Space orientation="vertical" size="large" style={{ width: '100%' }}>
      <Alert
        title="🎯 学习目标"
        description="掌握 useEffect 在实际项目中的正确使用方式，避免常见陷阱，提升代码质量"
        type="info"
        showIcon
      />

      {/* 1. 清理副作用 */}
      <Card title="✅ 最佳实践 1: 始终清理副作用" variant="borderless">
        <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
          <Paragraph>
            <Text strong>为什么需要清理？</Text>
            <br />
            <Text>
              如果不清理副作用，可能会导致内存泄漏、性能问题或意外行为。常见的需要清理的场景包括：
            </Text>
          </Paragraph>

          <ul>
            <li>
              <Text>定时器（setInterval、setTimeout）</Text>
            </li>
            <li>
              <Text>事件监听器（addEventListener）</Text>
            </li>
            <li>
              <Text>WebSocket 连接</Text>
            </li>
            <li>
              <Text>API 请求（使用 AbortController）</Text>
            </li>
            <li>
              <Text>订阅（如 Redux store、RxJS Observable）</Text>
            </li>
          </ul>

          <Divider />

          <CodeBlock code={cleanupCode} language="javascript" title="定时器清理示例" />

          <Button onClick={() => setShowCleanupExample(!showCleanupExample)}>
            {showCleanupExample ? '隐藏' : '查看'} 实时演示
          </Button>

          {showCleanupExample && <TimerDemo />}

          <Alert
            title="关键点"
            description={
              <div>
                <Text type="success">✅ 总是在 useEffect 中返回清理函数来清理资源</Text>
                <br />
                <Text type="secondary">💡 清理函数会在组件卸载或下次 effect 执行前调用</Text>
              </div>
            }
            type="success"
            showIcon
          />
        </Space>
      </Card>

      {/* 2. API 请求管理 */}
      <Card title="🌐 最佳实践 2: 正确处理 API 请求" variant="borderless">
        <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
          <Paragraph>
            <Text strong>常见问题：</Text>
            <br />
            <Text>
              当组件快速卸载或参数快速变化时，之前的 API
              请求可能还在进行中，导致状态更新到已卸载的组件。
            </Text>
          </Paragraph>

          <CodeBlock code={apiCancelCode} language="javascript" title="API 请求取消示例" />

          <Button onClick={() => setShowApiExample(!showApiExample)}>
            {showApiExample ? '隐藏' : '查看'} 实时演示
          </Button>

          {showApiExample && <ApiRequestDemo />}

          <Alert
            title="解决方案"
            description={
              <div>
                <Text type="success">✅ 使用 AbortController 取消未完成的请求</Text>
                <br />
                <Text type="success">✅ 在清理函数中调用 abort()</Text>
                <br />
                <Text type="secondary">💡 也可以使用标志位来判断组件是否已卸载</Text>
              </div>
            }
            type="success"
            showIcon
          />
        </Space>
      </Card>

      {/* 3. 事件监听器 */}
      <Card title="👂 最佳实践 3: 正确管理事件监听器" variant="borderless">
        <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
          <Paragraph>
            <Text strong>常见场景：</Text>
            <br />
            <Text>窗口滚动、键盘事件、鼠标移动、resize 事件等都需要在组件卸载时移除。</Text>
          </Paragraph>

          <CodeBlock code={eventListenerCode} language="javascript" title="事件监听器示例" />

          <ScrollTrackerDemo />

          <Alert
            title="注意事项"
            description={
              <div>
                <Text type="warning">⚠️ 忘记移除事件监听器会导致内存泄漏</Text>
                <br />
                <Text type="success">✅ 确保 addEventListener 和 removeEventListener 配对使用</Text>
                <br />
                <Text type="secondary">💡 对于频繁触发的事件，考虑使用防抖或节流</Text>
              </div>
            }
            type="warning"
            showIcon
          />
        </Space>
      </Card>

      {/* 4. 避免无限循环 */}
      <Card title="🔄 最佳实践 4: 避免无限循环" variant="borderless">
        <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
          <Paragraph>
            <Text strong>无限循环的原因：</Text>
            <br />
            <Text>在 useEffect 中更新状态，但没有正确设置依赖数组，导致 effect 不断重新执行。</Text>
          </Paragraph>

          <CodeBlock code={infiniteLoopCode} language="javascript" title="避免无限循环示例" />

          <Alert
            title="如何避免"
            description={
              <div>
                <Text type="danger">🚫 不要在无依赖的 useEffect 中直接更新状态</Text>
                <br />
                <Text type="success">✅ 如果需要基于某个值更新状态，将其加入依赖数组</Text>
                <br />
                <Text type="success">✅ 使用 useCallback 和 useMemo 优化函数和对象的引用</Text>
                <br />
                <Text type="secondary">💡 启用 ESLint 的 react-hooks/exhaustive-deps 规则</Text>
              </div>
            }
            type="error"
            showIcon
          />
        </Space>
      </Card>

      {/* 5. 正确的依赖数组 */}
      <Card title="📋 最佳实践 5: 使用正确的依赖数组" variant="borderless">
        <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
          <Paragraph>
            <Text strong>依赖数组规则：</Text>
            <br />
            <Text>
              useEffect 中使用的所有响应式值（props、state、函数）都应该在依赖数组中声明。
            </Text>
          </Paragraph>

          <CodeBlock code={dependencyCode} language="javascript" title="依赖数组最佳实践" />

          <Alert
            title="ESLint 规则"
            description={
              <div>
                <Text type="success">
                  ✅ 启用 eslint-plugin-react-hooks 的 exhaustive-deps 规则
                </Text>
                <br />
                <Text type="secondary">💡 这个规则会自动检测缺失的依赖并发出警告</Text>
                <br />
                <Text type="warning">⚠️ 不要随意禁用这个规则，除非你非常确定自己在做什么</Text>
              </div>
            }
            type="info"
            showIcon
          />
        </Space>
      </Card>

      {/* 6. 分离关注点 */}
      <Card title="🎯 最佳实践 6: 分离不同的副作用" variant="borderless">
        <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
          <Paragraph>
            <Text strong>为什么要分离？</Text>
            <br />
            <Text>
              将不同的副作用逻辑放在不同的 useEffect 中，可以让代码更清晰、更易维护、更易测试。
            </Text>
          </Paragraph>

          <CodeBlock code={separationCode} language="javascript" title="分离关注点示例" />

          <Alert
            title="好处"
            description={
              <ul>
                <li>
                  <Text>每个 useEffect 只负责一个功能，职责单一</Text>
                </li>
                <li>
                  <Text>更容易理解和调试</Text>
                </li>
                <li>
                  <Text>可以独立测试每个副作用</Text>
                </li>
                <li>
                  <Text>避免不必要的重复执行</Text>
                </li>
              </ul>
            }
            type="success"
            showIcon
          />
        </Space>
      </Card>

      {/* 7. localStorage 同步 */}
      <Card title="💾 最佳实践 7: 与 localStorage 同步" variant="borderless">
        <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
          <Paragraph>
            <Text strong>应用场景：</Text>
            <br />
            <Text>保存用户偏好设置、表单草稿、主题选择等需要在页面刷新后保持的数据。</Text>
          </Paragraph>

          <CodeBlock code={localStorageCode} language="javascript" title="localStorage 同步示例" />

          <LocalStorageDemo />

          <Alert
            title="注意事项"
            description={
              <div>
                <Text type="success">✅ 使用懒初始化从 localStorage 读取初始值</Text>
                <br />
                <Text type="success">✅ 在 useEffect 中同步更新到 localStorage</Text>
                <br />
                <Text type="warning">⚠️ localStorage 是同步操作，大量数据可能影响性能</Text>
                <br />
                <Text type="secondary">💡 考虑使用 sessionStorage 或 IndexedDB 存储大量数据</Text>
              </div>
            }
            type="info"
            showIcon
          />
        </Space>
      </Card>

      {/* 总结 */}
      <Card title="📊 最佳实践总结" variant="borderless">
        <Space orientation="vertical" style={{ width: '100%' }}>
          <Paragraph>
            <Text strong>核心原则：</Text>
          </Paragraph>

          <ol>
            <li>
              <Text strong>清理资源：</Text>
              <Text> 总是清理定时器、事件监听器、API 请求等资源</Text>
            </li>
            <li>
              <Text strong>正确依赖：</Text>
              <Text> 确保所有使用的响应式值都在依赖数组中</Text>
            </li>
            <li>
              <Text strong>避免循环：</Text>
              <Text> 不要在 effect 中无条件地更新状态</Text>
            </li>
            <li>
              <Text strong>分离关注点：</Text>
              <Text> 将不同的副作用逻辑放在不同的 useEffect 中</Text>
            </li>
            <li>
              <Text strong>性能优化：</Text>
              <Text> 使用 useCallback 和 useMemo 优化依赖项</Text>
            </li>
          </ol>

          <Divider />

          <Alert
            title="🎉 恭喜完成学习！"
            description={
              <div>
                <Text>你现在应该对 React 函数组件的生命周期有了深入的理解。</Text>
                <br />
                <Text strong>建议：</Text>
                <ul>
                  <li>在实际项目中多练习 useEffect 的使用</li>
                  <li>阅读 React 官方文档关于 Hooks 的部分</li>
                  <li>学习自定义 Hook 来复用副作用逻辑</li>
                  <li>关注 React 18 的并发特性和新的 Hooks</li>
                </ul>
              </div>
            }
            type="success"
            showIcon
          />
        </Space>
      </Card>
    </Space>
  )
}

// 定时器演示组件
function TimerDemo() {
  const [seconds, setSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    let timer: number | undefined

    if (isRunning) {
      timer = window.setInterval(() => {
        setSeconds((prev) => prev + 1)
      }, 1000)
    }

    // 清理定时器
    return () => {
      if (timer) {
        clearInterval(timer)
      }
    }
  }, [isRunning])

  return (
    <Card size="small" title="实时演示：定时器清理">
      <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
        <div>
          <Text strong>运行时间：</Text>
          <Tag color="blue">{seconds} 秒</Tag>
        </div>
        <Space>
          <Button type="primary" onClick={() => setIsRunning(true)} disabled={isRunning}>
            ▶️ 开始
          </Button>
          <Button onClick={() => setIsRunning(false)} disabled={!isRunning}>
            ⏸️ 暂停
          </Button>
          <Button danger onClick={() => setSeconds(0)}>
            🔄 重置
          </Button>
        </Space>
        <Text type="secondary">提示：暂停时会清理定时器，再次开始时创建新的定时器</Text>
      </Space>
    </Card>
  )
}

// API 请求演示组件
function ApiRequestDemo() {
  const [userId, setUserId] = useState(1)
  const [userData, setUserData] = useState<{
    id: number
    name: string
    email: string
  } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    const fetchUser = async () => {
      try {
        setLoading(true)
        setError(null)
        // 模拟 API 请求延迟
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // 模拟不同用户的数据
        const mockUsers = {
          1: { id: 1, name: '张三', email: 'zhangsan@example.com' },
          2: { id: 2, name: '李四', email: 'lisi@example.com' },
          3: { id: 3, name: '王五', email: 'wangwu@example.com' },
        }

        const data = mockUsers[userId as keyof typeof mockUsers]
        if (controller.signal.aborted) return
        setUserData(data)
      } catch (err) {
        const error = err as Error
        if (error.name !== 'AbortError') {
          setError('获取数据失败')
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    fetchUser()

    return () => {
      controller.abort()
    }
  }, [userId])

  return (
    <Card size="small" title="实时演示：API 请求取消">
      <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
        <Space>
          <Text strong>选择用户：</Text>
          <Button onClick={() => setUserId(1)} type={userId === 1 ? 'primary' : 'default'}>
            张三
          </Button>
          <Button onClick={() => setUserId(2)} type={userId === 2 ? 'primary' : 'default'}>
            李四
          </Button>
          <Button onClick={() => setUserId(3)} type={userId === 3 ? 'primary' : 'default'}>
            王五
          </Button>
        </Space>

        {loading && <Text type="secondary">加载中...</Text>}
        {error && <Text type="danger">{error}</Text>}
        {userData && (
          <div>
            <Text strong>姓名：</Text>
            <Text>{userData.name}</Text>
            <br />
            <Text strong>邮箱：</Text>
            <Text>{userData.email}</Text>
          </div>
        )}

        <Text type="secondary">提示：快速切换用户时，之前的请求会被取消</Text>
      </Space>
    </Card>
  )
}

// 滚动跟踪演示组件
function ScrollTrackerDemo() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <Card size="small" title="实时演示：滚动位置跟踪">
      <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
        <div>
          <Text strong>当前滚动位置：</Text>
          <Tag color="green">{scrollY}px</Tag>
        </div>
        <Text type="secondary">提示：滚动页面查看数值变化，组件卸载时会自动移除监听器</Text>
      </Space>
    </Card>
  )
}

// localStorage 演示组件
function LocalStorageDemo() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('demo-theme') || 'light'
  })

  useEffect(() => {
    localStorage.setItem('demo-theme', theme)
  }, [theme])

  return (
    <Card size="small" title="实时演示：主题保存到 localStorage">
      <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
        <div>
          <Text strong>当前主题：</Text>
          <Tag color={theme === 'light' ? 'default' : 'purple'}>
            {theme === 'light' ? '☀️ 浅色' : '🌙 深色'}
          </Tag>
        </div>
        <Space>
          <Button
            onClick={() => setTheme('light')}
            type={theme === 'light' ? 'primary' : 'default'}
          >
            ☀️ 浅色主题
          </Button>
          <Button onClick={() => setTheme('dark')} type={theme === 'dark' ? 'primary' : 'default'}>
            🌙 深色主题
          </Button>
        </Space>
        <Text type="secondary">提示：刷新页面后主题会保持，因为已保存到 localStorage</Text>
      </Space>
    </Card>
  )
}
