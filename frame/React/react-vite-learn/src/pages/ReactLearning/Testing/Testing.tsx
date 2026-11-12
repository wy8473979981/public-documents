import { useState } from 'react'
import CodeBlock from '@/components/CodeBlock/CodeBlock'
import SectionPath from '@/components/SectionPath/SectionPath'
import PageNav from '@/components/PageNav/PageNav'
import '../shared.css'

const testBasicCode = `// 使用 React Testing Library 测试组件
import { render, screen, fireEvent } from '@testing-library/react'
import Counter from './Counter'

test('点击按钮后计数增加', () => {
  render(<Counter />)

  // 查询初始状态
  expect(screen.getByText('计数：0')).toBeInTheDocument()

  // 模拟点击
  fireEvent.click(screen.getByRole('button', { name: /增加/i }))

  // 验证更新
  expect(screen.getByText('计数：1')).toBeInTheDocument()
})`

const testAsyncCode = `// 测试异步操作
import { render, screen, waitFor } from '@testing-library/react'
import UserList from './UserList'

// Mock API
jest.mock('./api', () => ({
  fetchUsers: () => Promise.resolve([{ id: 1, name: '小明' }]),
}))

test('加载后显示用户列表', async () => {
  render(<UserList />)

  // 等待异步完成
  await waitFor(() => {
    expect(screen.getByText('小明')).toBeInTheDocument()
  })
})`

function Testing() {
  const [testResults, setTestResults] = useState<{ name: string; passed: boolean }[]>([
    { name: '渲染标题', passed: true },
    { name: '按钮点击', passed: true },
    { name: '输入验证', passed: false },
  ])

  return (
    <div className="rl-page">
      <h1>14. 测试</h1>
      <p className="rl-subtitle">保证代码质量的测试策略 —— 单元测试、集成测试与 E2E 测试</p>
      <SectionPath />
      <div className="rl-section concept" id="section-concept">
        <div className="rl-section-header">
          <span className="rl-icon">💡</span> 理解概念 — What & Why
        </div>
        <div className="rl-section-body">
          <h3>为什么要测试？</h3>
          <p>
            测试是你的代码的"安全网"。它让你在修改代码时有信心不会引入 Bug，也让团队协作更安全。
          </p>
          <h3>测试金字塔</h3>
          <div className="rl-concept-cards">
            <div className="rl-concept-card">
              <div className="rl-card-title">🧪 单元测试</div>
              <div className="rl-card-desc">测试单个函数或组件。最多、最快、最基础</div>
            </div>
            <div className="rl-concept-card">
              <div className="rl-card-title">🔗 集成测试</div>
              <div className="rl-card-desc">测试多个组件协作工作。验证组件间交互</div>
            </div>
            <div className="rl-concept-card">
              <div className="rl-card-title">🌐 E2E 测试</div>
              <div className="rl-card-desc">测试完整用户流程。最少、最慢、最真实</div>
            </div>
          </div>
        </div>
      </div>
      <div className="rl-section usage" id="section-usage">
        <div className="rl-section-header">
          <span className="rl-icon">⚙️</span> 掌握用法 — How
        </div>
        <div className="rl-section-body">
          <h3>组件测试</h3>
          <CodeBlock code={testBasicCode} language="jsx" title="React Testing Library 基本测试" />
          <h3>异步测试</h3>
          <CodeBlock code={testAsyncCode} language="jsx" title="测试异步操作" />
          <h3>测试工具对比</h3>
          <table className="rl-compare-table">
            <thead>
              <tr>
                <th>工具</th>
                <th>类型</th>
                <th>特点</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>Jest</strong>
                </td>
                <td>测试框架</td>
                <td>断言、Mock、覆盖率</td>
              </tr>
              <tr>
                <td>
                  <strong>React Testing Library</strong>
                </td>
                <td>组件测试</td>
                <td>测试用户行为而非实现细节</td>
              </tr>
              <tr>
                <td>
                  <strong>Cypress</strong>
                </td>
                <td>E2E</td>
                <td>可视化调试、时间旅行</td>
              </tr>
              <tr>
                <td>
                  <strong>Playwright</strong>
                </td>
                <td>E2E</td>
                <td>多浏览器支持、更快</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="rl-section practice" id="section-practice">
        <div className="rl-section-header">
          <span className="rl-icon">🛠️</span> 动手实践 — Do
        </div>
        <div className="rl-section-body">
          <h3>试一试：模拟测试报告</h3>
          <div className="rl-demo-box">
            <div className="rl-demo-title">Interactive Demo - 测试报告</div>
            <button
              onClick={() =>
                setTestResults([
                  ...testResults,
                  { name: `新测试 ${testResults.length + 1}`, passed: Math.random() > 0.3 },
                ])
              }
            >
              添加测试
            </button>
            <div className="rl-demo-result">
              {testResults.map((t, i) => (
                <div key={i} style={{ color: t.passed ? 'green' : 'red' }}>
                  {t.passed ? '✅' : '❌'} {t.name}
                </div>
              ))}
              <p style={{ marginTop: 8 }}>
                通过率：
                {Math.round(
                  (testResults.filter((t) => t.passed).length / testResults.length) * 100
                )}
                %
              </p>
            </div>
          </div>
          <h3>推荐练习</h3>
          <ul className="rl-exercises">
            <li>
              <span className="rl-ex-num">1</span>
              <div className="rl-ex-content">
                <div className="rl-ex-title">测试 Counter 组件</div>
                <div className="rl-ex-desc">用 React Testing Library 测试一个计数器组件</div>
              </div>
            </li>
            <li>
              <span className="rl-ex-num">2</span>
              <div className="rl-ex-content">
                <div className="rl-ex-title">测试表单提交</div>
                <div className="rl-ex-desc">测试表单验证逻辑和提交行为</div>
              </div>
            </li>
            <li>
              <span className="rl-ex-num">3</span>
              <div className="rl-ex-content">
                <div className="rl-ex-title">E2E 登录流程</div>
                <div className="rl-ex-desc">用 Playwright 测试完整的登录 → 跳转流程</div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div className="rl-section connect" id="section-connect">
        <div className="rl-section-header">
          <span className="rl-icon">🔗</span> 反思与扩展 — Think & Connect
        </div>
        <div className="rl-section-body">
          <h3>延伸思考</h3>
          <ul className="rl-think-list">
            <li>
              <details>
                <summary>测试用户行为 vs 测试实现细节，为什么推荐前者？</summary>
                <div className="rl-answer">
                  <p>
                    测试用户行为（如“点击按钮后显示结果”）关注的是功能是否正确，与实现方式无关。即使重构组件内部逻辑，测试仍然能通过。
                  </p>
                  <p>
                    测试实现细节（如“state 是否为
                    true”“某个方法是否被调用”）与实现强耦合，任何重构都会导致测试失败。这就是「脆性测试」，维护成本高且给重构带来阻力。React
                    Testing Library 的设计哲学就是引导你测试用户行为。
                  </p>
                </div>
              </details>
            </li>
            <li>
              <details>
                <summary>什么时候该用 snapshot 测试？什么时候不该？</summary>
                <div className="rl-answer">
                  <p>
                    <strong>适合</strong>
                    ：确保组件输出不意外变化（回归测试），适合稳定的、不常改动的组件。
                  </p>
                  <p>
                    <strong>不适合</strong>：频繁变动的组件（每次都要更新
                    snapshot）、大型组件（snapshot 太大难以审查）。
                  </p>
                  <p>
                    注意：snapshot 测试容易被「无脑更新」，当测试失败时开发者倾向于直接{' '}
                    <code>-u</code> 更新而不是检查问题。应该仔细审查每次 snapshot 变化。
                  </p>
                </div>
              </details>
            </li>
            <li>
              <details>
                <summary>测试覆盖率 100% 就一定没有 Bug 吗？</summary>
                <div className="rl-answer">
                  <p>
                    <strong>不一定。</strong>100%
                    覆盖率只意味着每行代码都被执行过，不代表所有边界情况和组合都被测试。
                  </p>
                  <p>
                    例如：<code>add(a, b)</code> 用 <code>add(1, 2)</code> 测试就覆盖了
                    100%，但没测试负数、大数、非数字等边界情况。关注「有意义的测试」比追求覆盖率数字更重要。测试应该覆盖核心流程
                    + 边界场景 + 错误场景。
                  </p>
                </div>
              </details>
            </li>
          </ul>
          <h3>推荐资源</h3>
          <div className="rl-resources">
            <a
              className="rl-resource"
              href="https://testing-library.com/docs/react-testing-library/intro/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="rl-res-icon">📖</span> React Testing Library
            </a>
          </div>
        </div>
      </div>
      <PageNav currentPath="/react-learning/testing" />
    </div>
  )
}

export default Testing
