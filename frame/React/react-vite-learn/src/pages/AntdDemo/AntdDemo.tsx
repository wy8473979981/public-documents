import {
  Button,
  Card,
  Space,
  Typography,
  Tag,
  Alert,
  message,
  Input,
  Form,
  Switch,
  DatePicker,
  Select,
  Table,
  Badge,
} from 'antd'
import {
  HomeOutlined,
  InfoCircleOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  SmileOutlined,
  StarOutlined,
} from '@ant-design/icons'
import './AntdDemo.css'

const { Title, Paragraph, Text } = Typography
const { Option } = Select

function AntdDemo() {
  const [form] = Form.useForm()

  const handleButtonClick = () => {
    message.success('按钮点击成功！')
  }

  const onFinish = (values: Record<string, unknown>) => {
    console.log('表单数据:', values)
    message.success('表单提交成功！')
  }

  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: '状态',
      key: 'status',
      render: () => <Badge status="success" text="活跃" />,
    },
  ]

  const data = [
    {
      key: '1',
      name: '张三',
      age: 25,
      address: '北京市朝阳区',
    },
    {
      key: '2',
      name: '李四',
      age: 30,
      address: '上海市浦东新区',
    },
    {
      key: '3',
      name: '王五',
      age: 28,
      address: '广州市天河区',
    },
  ]

  return (
    <div className="antd-demo-page">
      <Title level={2}>
        <SmileOutlined /> Ant Design 组件演示
      </Title>

      <Space orientation="vertical" size="large" style={{ width: '100%' }}>
        {/* 官网链接 */}
        <Alert
          title="🌐 Ant Design 官网"
          description={
            <span>
              访问{' '}
              <a
                href="https://ant.design"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#1890ff' }}
              >
                https://ant.design
              </a>{' '}
              了解更多组件和用法
            </span>
          }
          type="info"
          showIcon
        />

        {/* 按钮组件 */}
        <Card title="按钮组件" variant="outlined">
          <Space wrap>
            <Button type="primary" onClick={handleButtonClick}>
              主要按钮
            </Button>
            <Button type="default">默认按钮</Button>
            <Button type="dashed">虚线按钮</Button>
            <Button type="text">文本按钮</Button>
            <Button type="link">链接按钮</Button>
            <Button danger>危险按钮</Button>
            <Button icon={<HomeOutlined />} type="primary">
              带图标
            </Button>
          </Space>
        </Card>

        {/* 标签组件 */}
        <Card title="标签组件" variant="outlined">
          <Space wrap>
            <Tag color="blue">蓝色标签</Tag>
            <Tag color="green">绿色标签</Tag>
            <Tag color="red">红色标签</Tag>
            <Tag color="orange">橙色标签</Tag>
            <Tag icon={<StarOutlined />} color="gold">
              带图标
            </Tag>
          </Space>
        </Card>

        {/* 警告提示 */}
        <Card title="警告提示" variant="outlined">
          <Space orientation="vertical" style={{ width: '100%' }}>
            <Alert title="成功提示" description="这是一条成功的消息提示" type="success" showIcon />
            <Alert title="信息提示" description="这是一条普通的信息提示" type="info" showIcon />
            <Alert title="警告提示" description="这是一条警告消息提示" type="warning" showIcon />
            <Alert title="错误提示" description="这是一条错误消息提示" type="error" showIcon />
          </Space>
        </Card>

        {/* 表单组件 */}
        <Card title="表单组件" variant="outlined">
          <Form form={form} layout="vertical" onFinish={onFinish} style={{ maxWidth: 600 }}>
            <Form.Item
              label="用户名"
              name="username"
              rules={[{ required: true, message: '请输入用户名！' }]}
            >
              <Input placeholder="请输入用户名" prefix={<HomeOutlined />} />
            </Form.Item>

            <Form.Item
              label="邮箱"
              name="email"
              rules={[
                { required: true, message: '请输入邮箱！' },
                { type: 'email', message: '请输入有效的邮箱地址！' },
              ]}
            >
              <Input placeholder="请输入邮箱" prefix={<MailOutlined />} />
            </Form.Item>

            <Form.Item
              label="选择器"
              name="select"
              rules={[{ required: true, message: '请选择！' }]}
            >
              <Select placeholder="请选择">
                <Option value="option1">选项1</Option>
                <Option value="option2">选项2</Option>
                <Option value="option3">选项3</Option>
              </Select>
            </Form.Item>

            <Form.Item label="开关" name="switch" valuePropName="checked">
              <Switch />
            </Form.Item>

            <Form.Item label="日期选择" name="date">
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                提交
              </Button>
            </Form.Item>
          </Form>
        </Card>

        {/* 表格组件 */}
        <Card title="表格组件" variant="outlined">
          <Table columns={columns} dataSource={data} pagination={{ pageSize: 5 }} />
        </Card>

        {/* 联系信息卡片 */}
        <Card title="联系信息" variant="outlined">
          <Space orientation="vertical" size="middle">
            <Paragraph>
              <PhoneOutlined /> <Text strong>电话：</Text>+86 123 4567 8900
            </Paragraph>
            <Paragraph>
              <MailOutlined /> <Text strong>邮箱：</Text>contact@example.com
            </Paragraph>
            <Paragraph>
              <EnvironmentOutlined /> <Text strong>地址：</Text>中国北京市朝阳区xxx街道
            </Paragraph>
            <Paragraph>
              <InfoCircleOutlined />{' '}
              <Text type="secondary">这是一个使用 Ant Design 构建的演示页面</Text>
            </Paragraph>
          </Space>
        </Card>
      </Space>
    </div>
  )
}

export default AntdDemo
