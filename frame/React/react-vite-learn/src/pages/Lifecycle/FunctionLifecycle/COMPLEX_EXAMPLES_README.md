# 复杂场景示例说明

本文件包含了 React useEffect Hook 在复杂场景下的多个实际应用示例，帮助开发者深入理解副作用管理的最佳实践。

## 📋 目录

1. [数据获取示例](#数据获取示例)
2. [定时器管理示例](#定时器管理示例)
3. [事件监听器示例](#事件监听器示例)
4. [API 请求取消示例](#api-请求取消示例)

---

## 📡 数据获取示例

### 学习目标

- 理解如何在 useEffect 中安全地获取数据
- 掌握防止组件卸载后更新状态的技巧
- 学习错误处理和加载状态管理

### 核心概念

```javascript
useEffect(() => {
  let isMounted = true // 防止组件卸载后更新状态

  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await fetch('https://api.example.com/data')
      const result = await response.json()
      if (isMounted) {
        setData(result)
        setError(null)
      }
    } catch (err) {
      if (isMounted) {
        setError(err.message)
      }
    } finally {
      if (isMounted) {
        setLoading(false)
      }
    }
  }

  fetchData()

  return () => {
    isMounted = false // 清理函数
  }
}, [])
```

### 关键点

- ✅ 使用 `isMounted` 标志位防止内存泄漏
- ✅ 正确处理加载、成功、错误三种状态
- ✅ 在清理函数中标记组件已卸载

---

## ⏱️ 定时器管理示例

### 学习目标

- 掌握定时器的创建和清理
- 理解如何避免定时器导致的内存泄漏
- 学习条件性启动定时器的方法

### 核心概念

```javascript
useEffect(() => {
  let intervalId = null

  if (isActive) {
    intervalId = setInterval(() => {
      setCount((prev) => prev + 1)
    }, 1000)
  }

  return () => {
    if (intervalId) {
      clearInterval(intervalId)
    }
  }
}, [isActive])
```

### 关键点

- ✅ 在清理函数中清除定时器
- ✅ 根据状态条件性启动定时器
- ✅ 保存定时器 ID 以便后续清理

---

## 🖱️ 事件监听器示例

### 学习目标

- 学习如何在 useEffect 中添加事件监听器
- 掌握事件监听器的正确清理方法
- 理解内存泄漏的预防

### 核心概念

```javascript
useEffect(() => {
  const handleMouseMove = (e) => {
    setPosition({ x: e.clientX, y: e.clientY })
  }

  window.addEventListener('mousemove', handleMouseMove)

  return () => {
    window.removeEventListener('mousemove', handleMouseMove)
  }
}, [])
```

### 关键点

- ✅ 添加监听器后必须在清理函数中移除
- ✅ 使用相同的函数引用进行添加和移除
- ✅ 避免在每次渲染时重复添加监听器

---

## 🔌 API 请求取消示例

### 学习目标

- 掌握使用 AbortController 取消 API 请求
- 理解竞态条件的处理
- 学习提升用户体验的技巧

### 核心概念

```javascript
useEffect(() => {
  const controller = new AbortController()
  const signal = controller.signal

  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts/1', { signal })
      const result = await response.json()
      setData(result)
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Fetch error:', error)
      }
    } finally {
      setLoading(false)
    }
  }

  fetchData()

  return () => {
    controller.abort() // 取消请求
  }
}, [])
```

### 关键点

- ✅ 使用 AbortController 实现请求取消
- ✅ 区分正常错误和取消错误
- ✅ 在组件卸载或依赖变化时取消请求

### 使用场景

- 用户快速切换标签页时取消前一个请求
- 搜索框输入时取消之前的搜索请求
- 组件卸载时取消所有 pending 的请求

---

## 💡 最佳实践总结

### 1. 始终清理副作用

- 定时器、事件监听器、订阅等都需要在清理函数中处理
- 避免内存泄漏和意外行为

### 2. 防止竞态条件

- 使用标志位或 AbortController 处理异步操作
- 确保只有最新的请求会更新状态

### 3. 正确的依赖数组

- 确保 useEffect 中使用的所有变量都在依赖数组中
- 避免遗漏依赖导致的问题

### 4. 分离关注点

- 将不同的副作用逻辑放在不同的 useEffect 中
- 每个 useEffect 只负责一个特定的功能

### 5. 错误处理

- 始终处理异步操作可能的错误
- 提供友好的错误提示给用户

---

## 🎯 学习建议

1. **逐个学习**：先理解每个示例的核心概念
2. **动手实践**：修改代码观察不同行为
3. **查看日志**：通过实时日志理解执行顺序
4. **结合实际**：思考如何在自己的项目中应用

---

## 🔗 相关资源

- [React 官方文档 - useEffect](https://react.dev/reference/react/useEffect)
- [React Hooks 最佳实践](https://react.dev/learn/reusing-logic-with-custom-hooks)
- [清理副作用](https://react.dev/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)
