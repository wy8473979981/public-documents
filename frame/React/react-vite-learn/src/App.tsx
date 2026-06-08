import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home/Home'
import About from './pages/About/About'
import FunctionLifecycle from './pages/Lifecycle/FunctionLifecycle/FunctionLifecycle'
import ClassLifecycle from './pages/Lifecycle/ClassLifecycle/ClassLifecycle'
import AntdDemo from './pages/AntdDemo/AntdDemo'
// React学习路线组件
import Basics from './pages/ReactLearning/Basics/Basics'
import Jsx from './pages/ReactLearning/Jsx/Jsx'
import Components from './pages/ReactLearning/Components/Components'
import PropsState from './pages/ReactLearning/PropsState/PropsState'
import Events from './pages/ReactLearning/Events/Events'
import HooksIntro from './pages/ReactLearning/HooksIntro/HooksIntro'
import UseEffect from './pages/ReactLearning/UseEffect/UseEffect'
import CustomHooks from './pages/ReactLearning/CustomHooks/CustomHooks'
import Context from './pages/ReactLearning/Context/Context'
import Redux from './pages/ReactLearning/Redux/Redux'
import RouterPage from './pages/ReactLearning/Router/Router'
import Forms from './pages/ReactLearning/Forms/Forms'
import Performance from './pages/ReactLearning/Performance/Performance'
import Testing from './pages/ReactLearning/Testing/Testing'
import TypeScriptIntegration from './pages/ReactLearning/TypeScript/TypeScript'
import AdvancedPatterns from './pages/ReactLearning/AdvancedPatterns/AdvancedPatterns'
import SSR from './pages/ReactLearning/SSR/SSR'
import Ecosystem from './pages/ReactLearning/Ecosystem/Ecosystem'
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
      <Routes>
        <Route
          path="/"
          element={
            <MainLayout>
              <Home />
            </MainLayout>
          }
        />
        <Route
          path="/about"
          element={
            <MainLayout>
              <About />
            </MainLayout>
          }
        />
        <Route
          path="/lifecycle/function"
          element={
            <MainLayout>
              <FunctionLifecycle />
            </MainLayout>
          }
        />
        <Route
          path="/lifecycle/class"
          element={
            <MainLayout>
              <ClassLifecycle />
            </MainLayout>
          }
        />
        <Route
          path="/antd-demo"
          element={
            <MainLayout>
              <AntdDemo />
            </MainLayout>
          }
        />
        {/* React学习路线路由 */}
        <Route
          path="/react-learning/basics"
          element={
            <MainLayout>
              <Basics />
            </MainLayout>
          }
        />
        <Route
          path="/react-learning/jsx"
          element={
            <MainLayout>
              <Jsx />
            </MainLayout>
          }
        />
        <Route
          path="/react-learning/components"
          element={
            <MainLayout>
              <Components />
            </MainLayout>
          }
        />
        <Route
          path="/react-learning/props-state"
          element={
            <MainLayout>
              <PropsState />
            </MainLayout>
          }
        />
        <Route
          path="/react-learning/events"
          element={
            <MainLayout>
              <Events />
            </MainLayout>
          }
        />
        <Route
          path="/react-learning/hooks-intro"
          element={
            <MainLayout>
              <HooksIntro />
            </MainLayout>
          }
        />
        <Route
          path="/react-learning/useEffect"
          element={
            <MainLayout>
              <UseEffect />
            </MainLayout>
          }
        />
        <Route
          path="/react-learning/custom-hooks"
          element={
            <MainLayout>
              <CustomHooks />
            </MainLayout>
          }
        />
        <Route
          path="/react-learning/context"
          element={
            <MainLayout>
              <Context />
            </MainLayout>
          }
        />
        <Route
          path="/react-learning/redux"
          element={
            <MainLayout>
              <Redux />
            </MainLayout>
          }
        />
        <Route
          path="/react-learning/router"
          element={
            <MainLayout>
              <RouterPage />
            </MainLayout>
          }
        />
        <Route
          path="/react-learning/forms"
          element={
            <MainLayout>
              <Forms />
            </MainLayout>
          }
        />
        <Route
          path="/react-learning/performance"
          element={
            <MainLayout>
              <Performance />
            </MainLayout>
          }
        />
        <Route
          path="/react-learning/testing"
          element={
            <MainLayout>
              <Testing />
            </MainLayout>
          }
        />
        <Route
          path="/react-learning/typescript"
          element={
            <MainLayout>
              <TypeScriptIntegration />
            </MainLayout>
          }
        />
        <Route
          path="/react-learning/advanced-patterns"
          element={
            <MainLayout>
              <AdvancedPatterns />
            </MainLayout>
          }
        />
        <Route
          path="/react-learning/ssr"
          element={
            <MainLayout>
              <SSR />
            </MainLayout>
          }
        />
        <Route
          path="/react-learning/ecosystem"
          element={
            <MainLayout>
              <Ecosystem />
            </MainLayout>
          }
        />
      </Routes>
    </Router>
  )
}

export default App
