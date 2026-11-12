import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// 禁用浏览器自动滚动恢复，防止路由切换时浏览器覆盖手动滚动
if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual'
}

export default function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}
