<template>
  <div class="mermaid-demo">
    <h1>Mermaid 图表演示</h1>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <span>流程图示例</span>
            <el-button
              style="float: right; padding: 3px 0"
              type="primary"
              @click="generateNewChart"
            >
              生成新图表
            </el-button>
          </template>
          <MermaidChart :chart="flowChart" />
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <span>序列图示例</span>
          </template>
          <MermaidChart :chart="sequenceChart" />
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <span>状态图示例</span>
            <el-button
              style="float: right; padding: 3px 0"
              type="primary"
              @click="showCustomChart = !showCustomChart"
            >
              自定义图表
            </el-button>
          </template>
          <div v-if="showCustomChart">
            <el-input
              v-model="customChartCode"
              type="textarea"
              :rows="6"
              placeholder="请输入Mermaid图表代码..."
              style="margin-bottom: 20px"
            />
            <MermaidChart :chart="customChartCode" v-if="showCustomChart" />
          </div>
          <div v-else>
            <MermaidChart :chart="stateChart" />
          </div>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <span>思维导图示例</span>
            <el-button
              style="float: right; padding: 3px 0"
              type="primary"
              @click="generateNewMindMap"
            >
              生成新脑图
            </el-button>
          </template>
          <MermaidChart :chart="mindMapChart" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import MermaidChart from '@/components/MermaidChart.vue';

const showCustomChart = ref(false);
const customChartCode = ref(`graph TD
    A[开始] --> B[处理数据]
    B --> C{判断条件}
    C -->|是| D[执行操作A]
    C -->|否| E[执行操作B]
    D --> F[结束]
    E --> F`);

const flowChart = ref(`graph TD
    A[需求分析] --> B[技术选型]
    B --> C[架构设计]
    C --> D[编码实现]
    D --> E[测试验证]
    E --> F[部署上线]`);

const sequenceChart = ref(`sequenceDiagram
    participant U as 用户
    participant F as 前端
    participant B as 后端
    U->>F: 发起请求
    F->>B: 调用API
    B-->>F: 返回数据
    F-->>U: 展示结果`);

const classChart = ref(`classDiagram
    class MermaidChart {
        +String chart
        +Object config
        +mermaidRef Ref
        +renderChart()
    }
    
    class DemoView {
        +Boolean showCustomChart
        +String customChartCode
        +String flowChart
        +String sequenceChart
        +String stateChart
    }
    
    MermaidChart --> DemoView : 使用`);

const stateChart = ref(`stateDiagram-v2
    [*] --> 空闲
    空闲 --> 处理中 : 收到请求
    处理中 --> 成功 : 处理完成
    处理中 --> 失败 : 发生错误
    成功 --> 空闲
    失败 --> 空闲`);

const mindMapChart = ref(`mindmap
  root((项目开发))
    需求分析
      用户调研
      功能规划
      原型设计
    技术选型
      前端技术栈
        Vue 3
        Element Plus
        Mermaid.js
      后端技术栈
        Node.js
        Express
        数据库
    开发实施
      前端开发
      后端开发
      数据库设计
    测试部署
      单元测试
      集成测试
      生产部署
`);

const generateNewChart = () => {
  // 更新流程图
  flowChart.value = `graph TD
    A[步骤1] --> B[步骤2]
    B --> C[步骤3]
    C --> D[完成]
    
    style A fill:#e1f5fe
    style B fill:#f3e5f5
    style C fill:#e8f5e8
    style D fill:#fff3e0`;
};

const generateNewMindMap = () => {
  // 更新思维导图
  mindMapChart.value = `mindmap
  root((Vue项目))
    项目搭建
      环境配置
      Vue CLI
      依赖安装
    页面开发
      路由配置
      组件设计
      状态管理
    功能实现
      图表展示
        Mermaid集成
        思维导图
        流程图
      数据管理
    UI美化
      主题定制
      响应式布局
      动画效果
`;
};
</script>

<style scoped>
.mermaid-demo {
  padding: 20px;
}

.chart-card {
  margin-bottom: 20px;
  min-height: 300px;
}

.el-card :deep(.el-card__body) {
  padding: 20px;
  overflow: visible;
}
</style>
