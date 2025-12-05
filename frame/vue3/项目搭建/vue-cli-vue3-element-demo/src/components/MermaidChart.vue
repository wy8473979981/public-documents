<!--
 * @Description: Description
 * @Author: wangyang
 * @Date: 2025-12-05 09:45:28
 * @LastEditors: wangyang
 * @LastEditTime: 2025-12-05 09:55:58
-->
<template>
  <div class="mermaid-container">
    <div ref="mermaidRef" class="mermaid-chart"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, defineProps } from 'vue';

const props = defineProps({
  chart: {
    type: String,
    required: true
  },
  config: {
    type: Object,
    default: () => ({})
  }
});

const mermaidRef = ref(null);

const renderChart = async () => {
  if (!mermaidRef.value || !props.chart) return;

  try {
    // 导入Mermaid
    const mermaid = await import('mermaid');

    // 配置Mermaid
    mermaid.default.initialize({
      startOnLoad: true,
      theme: 'default',
      securityLevel: 'loose',
      ...props.config
    });

    // 清空并重新渲染图表
    mermaidRef.value.innerHTML = '';
    mermaidRef.value.innerHTML = props.chart;

    // 使用initAsync替代init以获得更好的兼容性
    await mermaid.default.run({
      nodes: [mermaidRef.value]
    });
  } catch (error) {
    console.error('Mermaid图表渲染失败:', error);
    mermaidRef.value.innerHTML = `<div class="error">图表渲染失败: ${error.message}</div>`;
  }
};

onMounted(() => {
  renderChart();
});

watch(
  () => props.chart,
  () => {
    renderChart();
  }
);
</script>

<style scoped>
.mermaid-container {
  width: 100%;
  overflow: auto;
}

.mermaid-chart {
  min-height: 200px;
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.error {
  color: #f56c6c;
  padding: 20px;
  text-align: center;
  border: 1px dashed #f56c6c;
  border-radius: 4px;
}
</style>
