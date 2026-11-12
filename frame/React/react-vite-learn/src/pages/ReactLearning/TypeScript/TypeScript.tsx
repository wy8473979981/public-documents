import CodeBlock from '@/components/CodeBlock/CodeBlock'
import SectionPath from '@/components/SectionPath/SectionPath'
import PageNav from '@/components/PageNav/PageNav'
import '../shared.css'

const propsTypeCode = `// Props 类型定义
interface ButtonProps {
  label: string
  variant?: 'primary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  onClick: () => void
}

function Button({ label, variant = 'primary', size = 'md', disabled, onClick }: ButtonProps) {
  return (
    <button className={\`btn btn-\${variant} btn-\${size}\`} disabled={disabled} onClick={onClick}>
      {label}
    </button>
  )
}`

const hooksTypeCode = `// Hooks 类型
const [count, setCount] = useState<number>(0)
const [user, setUser] = useState<User | null>(null)

const inputRef = useRef<HTMLInputElement>(null)
const timerRef = useRef<number | null>(null)

// 事件类型
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { ... }
const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => { ... }
const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => { ... }`

function TypeScriptIntegration() {
  return (
    <div className="rl-page">
      <h1>15. TypeScript 集成</h1>
      <p className="rl-subtitle">为 React 添加类型安全 —— 在编译期捕获错误</p>
      <SectionPath />
      <div className="rl-section concept" id="section-concept">
        <div className="rl-section-header">
          <span className="rl-icon">💡</span> 理解概念 — What & Why
        </div>
        <div className="rl-section-body">
          <h3>为什么 React + TypeScript？</h3>
          <p>
            TypeScript 为 React 添加静态类型检查，在编译期就能发现错误，而不是等到运行时才暴露问题。
          </p>
          <div className="rl-concept-cards">
            <div className="rl-concept-card">
              <div className="rl-card-title">🛡️ 类型安全</div>
              <div className="rl-card-desc">Props 传错类型、拼写错误在编译时就能发现</div>
            </div>
            <div className="rl-concept-card">
              <div className="rl-card-title">📝 自动文档</div>
              <div className="rl-card-desc">接口定义就是最好的文档，IDE 智能提示更准确</div>
            </div>
            <div className="rl-concept-card">
              <div className="rl-card-title">🔄 安全重构</div>
              <div className="rl-card-desc">重命名属性时，TS 会标记所有需要更新的地方</div>
            </div>
          </div>
        </div>
      </div>
      <div className="rl-section usage" id="section-usage">
        <div className="rl-section-header">
          <span className="rl-icon">⚙️</span> 掌握用法 — How
        </div>
        <div className="rl-section-body">
          <h3>Props 类型定义</h3>
          <CodeBlock code={propsTypeCode} language="tsx" title="组件 Props 类型" />
          <h3>Hooks 与事件类型</h3>
          <CodeBlock code={hooksTypeCode} language="tsx" title="Hooks 和事件类型" />
          <h3>常用 React 类型速查</h3>
          <table className="rl-compare-table">
            <thead>
              <tr>
                <th>类型</th>
                <th>用途</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <code>React.ReactNode</code>
                </td>
                <td>children 类型</td>
              </tr>
              <tr>
                <td>
                  <code>React.CSSProperties</code>
                </td>
                <td>style 对象类型</td>
              </tr>
              <tr>
                <td>
                  <code>React.RefObject&lt;T&gt;</code>
                </td>
                <td>useRef 返回值类型</td>
              </tr>
              <tr>
                <td>
                  <code>React.ChangeEvent&lt;T&gt;</code>
                </td>
                <td>onChange 事件类型</td>
              </tr>
              <tr>
                <td>
                  <code>React.FormEvent</code>
                </td>
                <td>表单提交事件</td>
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
          <h3>推荐练习</h3>
          <ul className="rl-exercises">
            <li>
              <span className="rl-ex-num">1</span>
              <div className="rl-ex-content">
                <div className="rl-ex-title">类型化 TodoList</div>
                <div className="rl-ex-desc">为 Todo 应用定义完整的 TypeScript 类型</div>
              </div>
            </li>
            <li>
              <span className="rl-ex-num">2</span>
              <div className="rl-ex-content">
                <div className="rl-ex-title">泛型组件</div>
                <div className="rl-ex-desc">
                  创建一个泛型 List&lt;T&gt; 组件，支持不同类型的列表项
                </div>
              </div>
            </li>
            <li>
              <span className="rl-ex-num">3</span>
              <div className="rl-ex-content">
                <div className="rl-ex-title">类型安全的 API</div>
                <div className="rl-ex-desc">
                  定义 API 响应类型，用联合类型处理 loading/success/error 状态
                </div>
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
                <summary>interface vs type，什么时候用哪个？</summary>
                <div className="rl-answer">
                  <p>
                    <code>interface</code>
                    ：支持声明合并（多次定义会自动合并），适合定义对象结构和组件 Props，可以被{' '}
                    <code>implements</code>。
                  </p>
                  <p>
                    <code>type</code>：更灵活，可以定义联合类型、交叉类型、元组等。不支持声明合并。
                  </p>
                  <p>
                    推荐：组件 Props 用 interface，其他复杂类型（联合、工具类型等）用
                    type。团队保持一致即可。
                  </p>
                </div>
              </details>
            </li>
            <li>
              <details>
                <summary>泛型组件什么时候需要？什么时候过度设计？</summary>
                <div className="rl-answer">
                  <p>
                    <strong>需要泛型</strong>：组件处理的类型不确定且影响使用时类型安全。如{' '}
                    <code>
                      &lt;Select&lt;T&gt; options=&#123;T[]&#125; onSelect=&#123;(v: T) =&gt;
                      void&#125; /&gt;
                    </code>
                    ，T 可以是 string 也可以是对象。
                  </p>
                  <p>
                    <strong>过度设计</strong>
                    ：如果类型固定或只有两三种，直接用联合类型即可。泛型适合「通用组件库」，业务组件通常不需要。
                  </p>
                </div>
              </details>
            </li>
            <li>
              <details>
                <summary>React.FC 是否推荐使用？</summary>
                <div className="rl-answer">
                  <p>
                    React 18 之前，<code>React.FC</code> 会自动添加 <code>children</code>{' '}
                    属性。React 18 移除了这个行为。
                  </p>
                  <p>
                    现在<code>React.FC</code> 的问题：① 不支持泛型；② 无法声明 defaultProps
                    的类型；③ 返回值被固定为 JSX.Element，不能返回 null。
                  </p>
                  <p>
                    推荐：直接声明函数组件{' '}
                    <code>function MyComponent(props: MyProps) &#123; ... &#125;</code>
                    ，更灵活且无上述问题。
                  </p>
                </div>
              </details>
            </li>
          </ul>
          <h3>推荐资源</h3>
          <div className="rl-resources">
            <a
              className="rl-resource"
              href="https://react-typescript-cheatsheet.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="rl-res-icon">📖</span> React TypeScript Cheatsheet
            </a>
          </div>
        </div>
      </div>
      <PageNav currentPath="/react-learning/typescript" />
    </div>
  )
}

export default TypeScriptIntegration
