import { useState } from 'react'
import { Card, Space, Typography, Button, Steps } from 'antd'
import { BasicConcepts } from './BasicConcepts'
import { SimpleExample } from './SimpleExample'
import { ComplexExample } from './ComplexExample'
import { BestPractices } from './BestPractices'
import './FunctionLifecycle.css'

const { Title } = Typography

// 分步学习内容
const learningSteps = [
  {
    title: '基础概念',
    description: '了解 useEffect 的基本用法',
    content: <BasicConcepts />,
  },
  {
    title: '简单示例',
    description: '通过计数器理解生命周期',
    content: <SimpleExample />,
  },
  {
    title: '复杂场景',
    description: '定时器、数据获取等实际应用',
    content: <ComplexExample />,
  },
  {
    title: '最佳实践',
    description: '避免常见错误和性能优化',
    content: <BestPractices />,
  },
]

function FunctionLifecycle() {
  const [currentStep, setCurrentStep] = useState(0)

  const nextStep = () => {
    setCurrentStep((prev) => (prev < learningSteps.length - 1 ? prev + 1 : prev))
    // 滚动到页面顶部
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const prevStep = () => {
    setCurrentStep((prev) => (prev > 0 ? prev - 1 : prev))
    // 滚动到页面顶部
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="lifecycle-page">
      <Title level={2}>🔧 函数组件生命周期学习</Title>

      <Space orientation="vertical" size="large" style={{ width: '100%' }}>
        {/* 步骤指示器 */}
        <Steps current={currentStep} items={learningSteps.map((step) => ({ title: step.title }))} />

        {/* 当前步骤内容 */}
        <Card title={learningSteps[currentStep].title} variant="borderless">
          {learningSteps[currentStep].content}
        </Card>

        {/* 导航按钮 */}
        <Space>
          <Button onClick={prevStep} disabled={currentStep === 0}>
            上一步
          </Button>
          <Button
            type="primary"
            onClick={nextStep}
            disabled={currentStep === learningSteps.length - 1}
          >
            下一步
          </Button>
        </Space>
      </Space>
    </div>
  )
}

export default FunctionLifecycle
