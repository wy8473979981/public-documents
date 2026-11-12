import { useState } from 'react'
import CodeBlock from '@/components/CodeBlock/CodeBlock'
import SectionPath from '@/components/SectionPath/SectionPath'
import PageNav from '@/components/PageNav/PageNav'
import '../shared.css'

const ssrBasicCode = `// Next.js 中的 SSR（服务端渲染）
// pages/index.tsx

export async function getServerSideProps() {
  const res = await fetch('https://api.example.com/posts')
  const posts = await res.json()
  return { props: { posts } } // 传给组件
}

function Home({ posts }) {
  return (
    <ul>
      {posts.map(post => <li key={post.id}>{post.title}</li>)}
    </ul>
  )
}`

const ssgCode = `// 静态生成（SSG）—— 构建时生成 HTML
export async function getStaticProps() {
  const posts = await fetchPosts()
  return {
    props: { posts },
    revalidate: 60, // ISR：每 60 秒重新生成
  }
}

export async function getStaticPaths() {
  const posts = await fetchPosts()
  return {
    paths: posts.map(p => ({ params: { id: String(p.id) } })),
    fallback: false,
  }
}`

function SSR() {
  const [renderMode, setRenderMode] = useState('csr')

  return (
    <div className="rl-page">
      <h1>17. 服务端渲染 (SSR)</h1>
      <p className="rl-subtitle">理解不同渲染模式的差异 —— CSR、SSR、SSG、ISR</p>
      <SectionPath />
      <div className="rl-section concept" id="section-concept">
        <div className="rl-section-header">
          <span className="rl-icon">💡</span> 理解概念 — What & Why
        </div>
        <div className="rl-section-body">
          <h3>为什么需要 SSR？</h3>
          <p>
            传统 React SPA（CSR）在浏览器中渲染，首屏需要下载 JS 后才能看到内容。SSR 在服务器生成
            HTML，用户能更快看到内容，对 SEO 也更友好。
          </p>
          <h3>渲染模式对比</h3>
          <table className="rl-compare-table">
            <thead>
              <tr>
                <th>模式</th>
                <th>生成时机</th>
                <th>适合场景</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>CSR</strong>
                </td>
                <td>浏览器中</td>
                <td>后台管理系统、内部工具</td>
              </tr>
              <tr>
                <td>
                  <strong>SSR</strong>
                </td>
                <td>每次请求时</td>
                <td>个性化内容、实时数据</td>
              </tr>
              <tr>
                <td>
                  <strong>SSG</strong>
                </td>
                <td>构建时</td>
                <td>博客、文档、营销页</td>
              </tr>
              <tr>
                <td>
                  <strong>ISR</strong>
                </td>
                <td>构建 + 定时更新</td>
                <td>电商产品页</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="rl-section usage" id="section-usage">
        <div className="rl-section-header">
          <span className="rl-icon">⚙️</span> 掌握用法 — How
        </div>
        <div className="rl-section-body">
          <h3>SSR（Next.js）</h3>
          <CodeBlock code={ssrBasicCode} language="jsx" title="getServerSideProps" />
          <h3>SSG + ISR</h3>
          <CodeBlock code={ssgCode} language="jsx" title="getStaticProps + getStaticPaths" />
          <h3>SSR 框架对比</h3>
          <table className="rl-compare-table">
            <thead>
              <tr>
                <th>框架</th>
                <th>特点</th>
                <th>适合</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>Next.js</strong>
                </td>
                <td>最流行、生态最丰富</td>
                <td>大部分 React SSR 项目</td>
              </tr>
              <tr>
                <td>
                  <strong>Remix</strong>
                </td>
                <td>Web 标准优先、嵌套路由</td>
                <td>注重 Web 体验的项目</td>
              </tr>
              <tr>
                <td>
                  <strong>Astro</strong>
                </td>
                <td>内容优先、岛屿架构</td>
                <td>内容型网站（博客、文档）</td>
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
          <h3>试一试：渲染模式对比</h3>
          <div className="rl-demo-box">
            <div className="rl-demo-title">Interactive Demo - 选择渲染模式</div>
            <div style={{ display: 'flex', gap: 4 }}>
              {['csr', 'ssr', 'ssg'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setRenderMode(mode)}
                  style={{
                    fontWeight: renderMode === mode ? 'bold' : 'normal',
                    textTransform: 'uppercase',
                  }}
                >
                  {mode}
                </button>
              ))}
            </div>
            <div className="rl-demo-result">
              {renderMode === 'csr' && (
                <p>
                  🖥️ <strong>CSR</strong>：浏览器下载 JS → 执行 React → 渲染
                  UI。首屏较慢，但交互流畅。
                </p>
              )}
              {renderMode === 'ssr' && (
                <p>
                  🌐 <strong>SSR</strong>：服务器生成 HTML → 发送给浏览器 →
                  水合(Hydration)。首屏快，SEO 好。
                </p>
              )}
              {renderMode === 'ssg' && (
                <p>
                  📄 <strong>SSG</strong>：构建时生成静态 HTML → CDN
                  分发。速度最快，适合内容不常变化的页面。
                </p>
              )}
            </div>
          </div>
          <h3>推荐练习</h3>
          <ul className="rl-exercises">
            <li>
              <span className="rl-ex-num">1</span>
              <div className="rl-ex-content">
                <div className="rl-ex-title">Next.js 博客</div>
                <div className="rl-ex-desc">用 SSG 创建一个简单的博客</div>
              </div>
            </li>
            <li>
              <span className="rl-ex-num">2</span>
              <div className="rl-ex-content">
                <div className="rl-ex-title">SSR 数据获取</div>
                <div className="rl-ex-desc">用 getServerSideProps 实现服务端数据预取</div>
              </div>
            </li>
            <li>
              <span className="rl-ex-num">3</span>
              <div className="rl-ex-content">
                <div className="rl-ex-title">性能对比</div>
                <div className="rl-ex-desc">对比 CSR 和 SSR 页面的 Lighthouse 分数</div>
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
                <summary>什么是水合（Hydration）？为什么 SSR 后还需要 JS？</summary>
                <div className="rl-answer">
                  <p>
                    SSR 生成的 HTML 是「静态」的，没有交互能力（按钮不能点、状态不会更新）。
                    <strong>水合</strong>是 React 在客户端接管服务器生成的
                    HTML，绑定事件监听器和状态的过程。
                  </p>
                  <p>
                    SSR 解决的是「首屏渲染」和 SEO，但应用仍然需要 JS 来提供交互能力。水合时 React
                    会复用服务器生成的
                    DOM，而不是重新创建，这样性能更好且不会丢失用户已进行的操作（如已展开的折叠）。
                  </p>
                </div>
              </details>
            </li>
            <li>
              <details>
                <summary>React Server Components（RSC）和 SSR 有什么区别？</summary>
                <div className="rl-answer">
                  <p>
                    <strong>SSR</strong>：在服务器将组件渲染为 HTML
                    字符串，客户端仍需要下载完整组件代码进行水合。
                  </p>
                  <p>
                    <strong>RSC</strong>
                    ：组件直接在服务器执行，只将渲染结果（而不是组件代码）发送到客户端。这意味着 RSC
                    组件的代码永远不会发送到浏览器，减少了 JS 包体积。
                  </p>
                  <p>
                    RSC 是 Next.js App Router 的核心，它让服务器组件和客户端组件可以混合使用，是目前
                    React 服务端渲染的前沿方向。
                  </p>
                </div>
              </details>
            </li>
            <li>
              <details>
                <summary>Streaming SSR 是什么？React 18 带来了哪些变化？</summary>
                <div className="rl-answer">
                  <p>
                    传统 SSR 需要等整个页面渲染完才发送 HTML。Streaming SSR
                    可以分段发送：先发已完成的 HTML，后续部分逐步追加。
                  </p>
                  <p>
                    React 18 的 <code>renderToPipeableStream</code> 支持流式 SSR，配合{' '}
                    <code>&lt;Suspense&gt;</code> 可以实现：① 先发送页面框架，慢速内容用 fallback
                    占位；② 内容准备好后自动替换 fallback。用户能更快看到页面，体验更好。
                  </p>
                  <p>
                    配合 React 18 的 Selective Hydration，React
                    可以优先水合用户正在交互的部分，而不是等待整个页面水合完成。
                  </p>
                </div>
              </details>
            </li>
          </ul>
          <h3>推荐资源</h3>
          <div className="rl-resources">
            <a
              className="rl-resource"
              href="https://nextjs.org/learn"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="rl-res-icon">📖</span> Next.js Learn 教程
            </a>
            <a
              className="rl-resource"
              href="https://remix.run/docs/en/main/start/tutorial"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="rl-res-icon">📖</span> Remix Tutorial
            </a>
          </div>
        </div>
      </div>
      <PageNav currentPath="/react-learning/ssr" />
    </div>
  )
}

export default SSR
