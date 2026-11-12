import { Suspense } from 'react'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from '@/components/Navbar/Navbar'
import ScrollToTop from '@/components/ScrollToTop/ScrollToTop'
import { routeComponents } from '@/types/routes'
import './App.css'

function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content">{children}</main>
    </div>
  )
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <MainLayout>
        <Suspense
          fallback={
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '60vh',
                color: '#999',
              }}
            >
              加载中...
            </div>
          }
        >
          <Routes>
            {routeComponents.map(({ path, component: Component }) => (
              <Route key={path} path={path} element={<Component />} />
            ))}
          </Routes>
        </Suspense>
      </MainLayout>
    </Router>
  )
}

export default App
