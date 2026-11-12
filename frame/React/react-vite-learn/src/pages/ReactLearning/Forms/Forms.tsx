import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useFormik } from 'formik'
import CodeBlock from '@/components/CodeBlock/CodeBlock'
import SectionPath from '@/components/SectionPath/SectionPath'
import PageNav from '@/components/PageNav/PageNav'
import '../shared.css'

const controlledCode = `// 受控组件
function LoginForm() {
  const [form, setForm] = useState({ email: '', password: '' })

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('提交：', form)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" value={form.email} onChange={handleChange} placeholder="邮箱" />
      <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="密码" />
      <button type="submit">登录</button>
    </form>
  )
}`

const uncontrolledCode = `// 非受控组件
function FileUpload() {
  const fileRef = useRef(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    const file = fileRef.current.files[0]
    console.log('选择的文件：', file?.name)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" ref={fileRef} />
      <button type="submit">上传</button>
    </form>
  )
}`

const reactHookFormCode = `// React Hook Form —— 基于非受控组件，高性能
import { useForm } from 'react-hook-form'

function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = (data) => {
    console.log('提交数据：', data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('username', { required: '用户名不能为空' })} placeholder="用户名" />
      {errors.username && <span>{errors.username.message}</span>}

      <input {...register('email', {
        required: '邮箱不能为空',
        pattern: { value: /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/, message: '邮箱格式不正确' }
      })} placeholder="邮箱" />
      {errors.email && <span>{errors.email.message}</span>}

      <input type="password" {...register('password', {
        required: '密码不能为空',
        minLength: { value: 6, message: '密码至少6位' }
      })} placeholder="密码" />
      {errors.password && <span>{errors.password.message}</span>}

      <button type="submit">注册</button>
    </form>
  )
}`

const formikCode = `// Formik —— 基于受控组件，功能丰富
import { useFormik } from 'formik'

function ContactForm() {
  const formik = useFormik({
    initialValues: { name: '', email: '', message: '' },
    validate: (values) => {
      const errors = {}
      if (!values.name) errors.name = '姓名不能为空'
      if (!values.email) {
        errors.email = '邮箱不能为空'
      } else if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(values.email)) {
        errors.email = '邮箱格式不正确'
      }
      if (!values.message) errors.message = '留言不能为空'
      return errors
    },
    onSubmit: (values) => {
      console.log('提交数据：', values)
    },
  })

  return (
    <form onSubmit={formik.handleSubmit}>
      <input name="name" value={formik.values.name}
        onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="姓名" />
      {formik.touched.name && formik.errors.name && <span>{formik.errors.name}</span>}

      <input name="email" value={formik.values.email}
        onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="邮箱" />
      {formik.touched.email && formik.errors.email && <span>{formik.errors.email}</span>}

      <textarea name="message" value={formik.values.message}
        onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="留言" />
      {formik.touched.message && formik.errors.message && <span>{formik.errors.message}</span>}

      <button type="submit">提交</button>
    </form>
  )
}`

// ---- React Hook Form 可交互 Demo ----
interface RHFFormData {
  username: string
  email: string
  password: string
}

function ReactHookFormDemo() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm<RHFFormData>()
  const [submittedData, setSubmittedData] = useState<RHFFormData | null>(null)

  const onSubmit = (data: RHFFormData) => {
    setSubmittedData(data)
  }

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
      >
        <div>
          <input {...register('username', { required: '用户名不能为空' })} placeholder="用户名" />
          {errors.username && (
            <span style={{ color: '#ff4d4f', fontSize: 12, marginLeft: 8 }}>
              {errors.username.message}
            </span>
          )}
        </div>
        <div>
          <input
            {...register('email', {
              required: '邮箱不能为空',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: '邮箱格式不正确',
              },
            })}
            placeholder="邮箱"
          />
          {errors.email && (
            <span style={{ color: '#ff4d4f', fontSize: 12, marginLeft: 8 }}>
              {errors.email.message}
            </span>
          )}
        </div>
        <div>
          <input
            type="password"
            {...register('password', {
              required: '密码不能为空',
              minLength: { value: 6, message: '密码至少 6 位' },
            })}
            placeholder="密码"
          />
          {errors.password && (
            <span style={{ color: '#ff4d4f', fontSize: 12, marginLeft: 8 }}>
              {errors.password.message}
            </span>
          )}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="submit">注册</button>
          <button
            type="button"
            onClick={() => {
              reset()
              setSubmittedData(null)
            }}
          >
            重置
          </button>
        </div>
      </form>
      {isSubmitSuccessful && submittedData && (
        <div className="rl-demo-result">
          <p>
            <strong>提交数据（React Hook Form）：</strong>
          </p>
          <p>用户名：{submittedData.username}</p>
          <p>邮箱：{submittedData.email}</p>
          <p>密码：{submittedData.password}</p>
        </div>
      )}
    </div>
  )
}

// ---- Formik 可交互 Demo ----
function FormikDemo() {
  const [submittedData, setSubmittedData] = useState<{
    name: string
    email: string
    message: string
  } | null>(null)

  const formik = useFormik({
    initialValues: { name: '', email: '', message: '' },
    validate: (values) => {
      const errors: Record<string, string> = {}
      if (!values.name) errors.name = '姓名不能为空'
      if (!values.email) {
        errors.email = '邮箱不能为空'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
        errors.email = '邮箱格式不正确'
      }
      if (!values.message) errors.message = '留言不能为空'
      return errors
    },
    onSubmit: (values, { resetForm }) => {
      setSubmittedData(values)
      resetForm()
    },
  })

  return (
    <div>
      <form
        onSubmit={formik.handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
      >
        <div>
          <input
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="姓名"
          />
          {formik.touched.name && formik.errors.name && (
            <span style={{ color: '#ff4d4f', fontSize: 12, marginLeft: 8 }}>
              {formik.errors.name}
            </span>
          )}
        </div>
        <div>
          <input
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="邮箱"
          />
          {formik.touched.email && formik.errors.email && (
            <span style={{ color: '#ff4d4f', fontSize: 12, marginLeft: 8 }}>
              {formik.errors.email}
            </span>
          )}
        </div>
        <div>
          <textarea
            name="message"
            value={formik.values.message}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="留言"
            rows={3}
            style={{ resize: 'vertical' }}
          />
          {formik.touched.message && formik.errors.message && (
            <span style={{ color: '#ff4d4f', fontSize: 12, marginLeft: 8, display: 'block' }}>
              {formik.errors.message}
            </span>
          )}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="submit">提交</button>
          <button
            type="button"
            onClick={() => {
              formik.resetForm()
              setSubmittedData(null)
            }}
          >
            重置
          </button>
        </div>
      </form>
      {submittedData && (
        <div className="rl-demo-result">
          <p>
            <strong>提交数据（Formik）：</strong>
          </p>
          <p>姓名：{submittedData.name}</p>
          <p>邮箱：{submittedData.email}</p>
          <p>留言：{submittedData.message}</p>
        </div>
      )}
    </div>
  )
}

function Forms() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  return (
    <div className="rl-page">
      <h1>12. 表单处理</h1>
      <p className="rl-subtitle">受控与非受控组件 —— React 中处理表单的两种方式</p>
      <SectionPath />
      <div className="rl-section concept" id="section-concept">
        <div className="rl-section-header">
          <span className="rl-icon">💡</span> 理解概念 — What & Why
        </div>
        <div className="rl-section-body">
          <h3>两种表单模式</h3>
          <table className="rl-compare-table">
            <thead>
              <tr>
                <th>特性</th>
                <th>受控组件</th>
                <th>非受控组件</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>数据来源</strong>
                </td>
                <td>React State</td>
                <td>DOM (ref)</td>
              </tr>
              <tr>
                <td>
                  <strong>验证时机</strong>
                </td>
                <td>实时（每次输入）</td>
                <td>提交时</td>
              </tr>
              <tr>
                <td>
                  <strong>复杂度</strong>
                </td>
                <td>较高</td>
                <td>较低</td>
              </tr>
              <tr>
                <td>
                  <strong>推荐场景</strong>
                </td>
                <td>复杂表单、实时验证</td>
                <td>简单表单、文件上传</td>
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
          <h3>受控组件</h3>
          <CodeBlock code={controlledCode} language="jsx" title="受控表单" />
          <h3>非受控组件</h3>
          <CodeBlock code={uncontrolledCode} language="jsx" title="非受控表单" />
          <h3>React Hook Form</h3>
          <CodeBlock code={reactHookFormCode} language="jsx" title="React Hook Form 注册表单" />
          <h3>Formik</h3>
          <CodeBlock code={formikCode} language="jsx" title="Formik 联系表单" />
        </div>
      </div>
      <div className="rl-section practice" id="section-practice">
        <div className="rl-section-header">
          <span className="rl-icon">🛠️</span> 动手实践 — Do
        </div>
        <div className="rl-section-body">
          <h3>试一试：联系表单（受控组件）</h3>
          <div className="rl-demo-box">
            <div className="rl-demo-title">Interactive Demo - 受控表单</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <input
                placeholder="姓名"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <input
                placeholder="邮箱"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <input
                placeholder="留言"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
              <button onClick={() => setSubmitted(true)}>提交</button>
              <button
                onClick={() => {
                  setForm({ name: '', email: '', message: '' })
                  setSubmitted(false)
                }}
              >
                重置
              </button>
            </div>
            {submitted && (
              <div className="rl-demo-result">
                <p>
                  <strong>提交数据：</strong>
                </p>
                <p>姓名：{form.name || '(空)'}</p>
                <p>邮箱：{form.email || '(空)'}</p>
                <p>留言：{form.message || '(空)'}</p>
              </div>
            )}
          </div>
          <h3>试一试：React Hook Form 注册表单</h3>
          <div className="rl-demo-box">
            <div className="rl-demo-title">Interactive Demo - React Hook Form</div>
            <ReactHookFormDemo />
          </div>

          <h3>试一试：Formik 联系表单</h3>
          <div className="rl-demo-box">
            <div className="rl-demo-title">Interactive Demo - Formik</div>
            <FormikDemo />
          </div>

          <h3>推荐练习</h3>
          <ul className="rl-exercises">
            <li>
              <span className="rl-ex-num">1</span>
              <div className="rl-ex-content">
                <div className="rl-ex-title">注册表单验证</div>
                <div className="rl-ex-desc">实现邮箱格式验证、密码强度提示</div>
              </div>
            </li>
            <li>
              <span className="rl-ex-num">2</span>
              <div className="rl-ex-content">
                <div className="rl-ex-title">多步骤表单</div>
                <div className="rl-ex-desc">实现分步填写的向导表单</div>
              </div>
            </li>
            <li>
              <span className="rl-ex-num">3</span>
              <div className="rl-ex-content">
                <div className="rl-ex-title">React Hook Form</div>
                <div className="rl-ex-desc">使用 react-hook-form 库重构上面的表单</div>
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
          <h3>表单库对比</h3>
          <table className="rl-compare-table">
            <thead>
              <tr>
                <th>库</th>
                <th>特点</th>
                <th>适合</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>React Hook Form</strong>
                </td>
                <td>高性能、最小重渲染</td>
                <td>大部分项目</td>
              </tr>
              <tr>
                <td>
                  <strong>Formik</strong>
                </td>
                <td>功能丰富、社区大</td>
                <td>复杂企业表单</td>
              </tr>
              <tr>
                <td>
                  <strong>原生</strong>
                </td>
                <td>无依赖</td>
                <td>简单表单</td>
              </tr>
            </tbody>
          </table>

          <h3>延伸思考</h3>
          <ul className="rl-think-list">
            <li>
              <details>
                <summary>受控组件 vs 非受控组件，实际项目中该怎么选？</summary>
                <div className="rl-answer">
                  <p>
                    <strong>受控组件</strong>（值由 React state
                    控制）适合需要实时验证、联动、动态禁用等场景，是 React 推荐的方式。
                  </p>
                  <p>
                    <strong>非受控组件</strong>（值由 DOM 自己管理，用 ref
                    获取）适合简单表单、文件上传（<code>&lt;input type="file"&gt;</code>{' '}
                    只能用非受控），以及集成非 React 的第三方库时。
                  </p>
                  <p>
                    实际项目中，复杂表单推荐用 React Hook
                    Form（基于非受控组件，性能更好），简单表单用受控组件即可。
                  </p>
                </div>
              </details>
            </li>
            <li>
              <details>
                <summary>为什么 React Hook Form 性能比 Formik 好？</summary>
                <div className="rl-answer">
                  <p>
                    Formik 基于受控组件，每次输入都会触发整个表单组件的 re-render。React Hook Form
                    基于非受控组件 + ref，输入时不会触发重渲染，只在提交时统一读取值。
                  </p>
                  <p>
                    对于大表单（几十个字段），这个差异非常明显。React Hook Form
                    还内置了验证、错误管理等能力，是目前社区最推荐的表单库。
                  </p>
                </div>
              </details>
            </li>
            <li>
              <details>
                <summary>表单验证应该在前端做还是后端做？</summary>
                <div className="rl-answer">
                  <p>
                    <strong>两者都需要。</strong>
                    前端验证提升用户体验（即时反馈、减少无效请求），但可以被绕过；后端验证是安全底线，保证数据完整性。
                  </p>
                  <p>
                    最佳实践：前端做格式校验（必填、邮箱格式、长度等），后端做业务校验（用户名是否已存在、权限是否足够等）。可以用
                    Zod / Yup 定义 Schema，前后端共享同一套验证规则。
                  </p>
                </div>
              </details>
            </li>
          </ul>

          <h3>推荐资源</h3>
          <div className="rl-resources">
            <a
              className="rl-resource"
              href="https://react-hook-form.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="rl-res-icon">📦</span> React Hook Form
            </a>
          </div>
        </div>
      </div>
      <PageNav currentPath="/react-learning/forms" />
    </div>
  )
}

export default Forms
