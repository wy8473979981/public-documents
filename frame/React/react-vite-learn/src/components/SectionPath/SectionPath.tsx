import { useState } from 'react'
import { useScrollSpy } from '@/hooks/useScrollSpy'

const SECTIONS = [
  { key: 'concept', icon: '💡', label: '概念' },
  { key: 'usage', icon: '⚙️', label: '用法' },
  { key: 'practice', icon: '🛠️', label: '实践' },
  { key: 'connect', icon: '🔗', label: '扩展' },
]

/**
 * 右侧悬浮学习路径导航条
 * 内部维护 activeSection 状态 + useScrollSpy 滚动监听
 */
function SectionPath() {
  const [activeSection, setActiveSection] = useState('concept')

  const scrollToSection = (section: string) => {
    setActiveSection(section)
    const el = document.getElementById(`section-${section}`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  useScrollSpy(setActiveSection)

  return (
    <div className="rl-path">
      {SECTIONS.map((s) => (
        <div
          key={s.key}
          className={`rl-path-item ${activeSection === s.key ? 'active' : ''}`}
          onClick={() => scrollToSection(s.key)}
        >
          <span className="rl-path-icon">{s.icon}</span>
          {s.label}
        </div>
      ))}
    </div>
  )
}

export default SectionPath
