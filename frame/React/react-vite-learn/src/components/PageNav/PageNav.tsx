import { Link } from 'react-router-dom'
import { learningPages } from '@/pages/ReactLearning/learningPages'

interface NavPage {
  path: string
  title: string
}

interface PageNavProps {
  /** 当前页面路径，如 '/react-learning/basics' */
  currentPath: string
  /** 可选的页面列表，默认使用 learningPages */
  pages?: NavPage[]
}

/**
 * 上下页导航组件
 * 根据当前页面路径，自动显示"上一篇"和"下一篇"按钮
 */
export default function PageNav({ currentPath, pages }: PageNavProps) {
  const pageList = pages ?? learningPages
  const currentIndex = pageList.findIndex((p) => p.path === currentPath)
  const prev = currentIndex > 0 ? pageList[currentIndex - 1] : null
  const next = currentIndex < pageList.length - 1 ? pageList[currentIndex + 1] : null

  return (
    <div className="rl-page-nav">
      {prev ? (
        <Link to={prev.path} className="rl-page-nav-btn rl-page-nav-prev">
          <span className="rl-page-nav-arrow">←</span>
          <div className="rl-page-nav-info">
            <span className="rl-page-nav-label">上一篇</span>
            <span className="rl-page-nav-title">{prev.title}</span>
          </div>
        </Link>
      ) : (
        <div className="rl-page-nav-btn rl-page-nav-disabled">
          <span className="rl-page-nav-arrow">←</span>
          <div className="rl-page-nav-info">
            <span className="rl-page-nav-label">上一篇</span>
            <span className="rl-page-nav-title">已是第一篇</span>
          </div>
        </div>
      )}
      {next ? (
        <Link to={next.path} className="rl-page-nav-btn rl-page-nav-next">
          <div className="rl-page-nav-info">
            <span className="rl-page-nav-label">下一篇</span>
            <span className="rl-page-nav-title">{next.title}</span>
          </div>
          <span className="rl-page-nav-arrow">→</span>
        </Link>
      ) : (
        <div className="rl-page-nav-btn rl-page-nav-disabled">
          <div className="rl-page-nav-info">
            <span className="rl-page-nav-label">下一篇</span>
            <span className="rl-page-nav-title">已是最后一篇</span>
          </div>
          <span className="rl-page-nav-arrow">→</span>
        </div>
      )}
    </div>
  )
}
