import { useEffect } from 'react'

const SECTIONS = ['concept', 'usage', 'practice', 'connect']

/**
 * 滚动监听 Hook：当用户滚动页面时，自动更新导航高亮状态
 * @param setActiveSection - 设置当前激活板块的函数
 */
export function useScrollSpy(setActiveSection: (section: string) => void) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.id.replace('section-', '')
            setActiveSection(id)
          }
        }
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
    )

    SECTIONS.forEach((id) => {
      const el = document.getElementById(`section-${id}`)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [setActiveSection])
}
