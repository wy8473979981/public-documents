import { Link, useLocation } from 'react-router-dom'
import { Menu } from 'antd'
import type { MenuProps } from 'antd'
import { routes } from '../types/routes'
import './Navbar.css'

function Navbar() {
  const location = useLocation()

  // 将路由配置转换为 Ant Design Menu 格式
  const menuItems: MenuProps['items'] = routes.map((route) => {
    if (route.children && route.children.length > 0) {
      // 有子菜单的情况
      return {
        key: route.path,
        label: route.name,
        icon: getRouteIcon(route.path),
        children: route.children.map((child) => ({
          key: child.path,
          label: <Link to={child.path!}>{child.name}</Link>,
        })),
      }
    } else {
      // 没有子菜单的情况
      return {
        key: route.path,
        label: <Link to={route.path}>{route.name}</Link>,
        icon: getRouteIcon(route.path),
      }
    }
  })

  // 根据路径获取图标
  function getRouteIcon(path: string) {
    const iconMap: Record<string, React.ReactNode> = {
      '/': '🏠',
      '/about': 'ℹ️',
      '/lifecycle': '⚛️',
      '/antd-demo': '🎨',
    }
    return iconMap[path]
  }

  // 确定当前选中的菜单项
  const selectedKeys = (() => {
    // 检查是否是子路由
    for (const route of routes) {
      if (route.children) {
        const child = route.children.find((c) => c.path === location.pathname)
        if (child) {
          return [child.path!]
        }
      }
    }
    return [location.pathname]
  })()

  // 确定当前打开的子菜单
  const openKeys = (() => {
    for (const route of routes) {
      if (route.children) {
        const child = route.children.find((c) => c.path === location.pathname)
        if (child) {
          return [route.path]
        }
      }
    }
    return []
  })()

  return (
    <nav className="sidebar">
      <div className="sidebar-header">
        <Link to="/" className="sidebar-brand">
          React Vite App
        </Link>
      </div>
      <Menu
        mode="inline"
        selectedKeys={selectedKeys}
        defaultOpenKeys={openKeys}
        items={menuItems}
        className="sidebar-menu"
      />
    </nav>
  )
}

export default Navbar
