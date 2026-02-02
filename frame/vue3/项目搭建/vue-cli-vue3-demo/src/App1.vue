<!--
 *poDescription: Description
 * @Author: wangyang
 * @Date: 2025-06-13 15:21:28
 * @LastEditors: wangyang
 * @LastEditTime: 2026-01-28 16:51:57
-->
<!-- <template>
  <img alt="Vue logo" src="./assets/logo.png">
  <HelloWorld msg="Welcome to Your Vue.js App"/>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',
  components: {
    HelloWorld
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style> -->
<!-- <script setup>
import VueFlowDemo from './components/VueFlowDemo.vue'
</script>

<template>
  <VueFlowDemo />
</template>

<style>
body {
  margin: 0;
  padding: 0;
  overflow: hidden;
}
</style> -->
<!-- 
<script setup>
import { ref } from 'vue'
import { VueFlow } from '@vue-flow/core'
import ResizableNode from './components/ResizableNode.vue'


const nodes = ref([
  {
    id: '1',
    type: 'resizable',
    data: { label: 'NodeResizer' },
    position: { x: 0, y: 0 },
    style: { background: '#fff', border: '2px solid black' },
  },
])
</script>

<template>
  <VueFlow :nodes="nodes" fit-view-on-init>
    <template #node-resizable="resizableNodeProps">
      <ResizableNode :data="resizableNodeProps.data" />
    </template>
  </VueFlow>
</template>

<style>
@import '@vue-flow/node-resizer/dist/style.css';
</style> -->

<!-- <script setup>
import { ref, watch } from 'vue';
import FormComponent from './components/FormComponent.vue';

const username = ref('');

watch(username, (newValue) => {
  console.log('Username changed:', newValue);
});
</script>

<template>
  <div>
    <h1>Welcome to Your Vue.js App</h1>
    <FormComponent v-model="username" />
  </div>
</template>

<style></style> -->
<template>
  <div class="mindmap-wrapper">
    <div ref="chartContainer" class="chart-container">
      <svg ref="svgRef"></svg>
    </div>

    <div class="controls">
      <button @click="resetZoom">重置视图</button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import * as d3 from 'd3';

const svgRef = ref(null);
const chartContainer = ref(null);
let zoomBehavior = null;

// 模拟数据结构（参照原图）
const treeData = {
  name: '保险公司分支机构统计信息化建设指引',
  children: [
    {
      name: '文件概况',
      children: [
        { name: '文件编号：保监发〔2005〕44号' },
        { name: '发布日期：2005年5月12日' },
        { name: '发布机构：中国保监会' },
      ],
    },
    {
      name: '总体要求',
      children: [
        { name: '实现主要业务、财务流程信息化' },
        { name: '确保信息及法律安全' },
        { name: '满足监管部门数据采集要求' },
      ],
    },
    {
      name: '验收工作流程',
      children: [
        {
          name: '自查及验收准备',
          children: [{ name: '材料自查' }, { name: '网络安全防护' }],
        },
        {
          name: '现场验收',
          children: [{ name: '系统功能演示' }, { name: '数据一致性核查' }],
        },
      ],
    },
  ],
};

// 预定义分支颜色
const branchColors = ['#5182E4', '#F7B500', '#44D7B6', '#6236FF', '#FA6400'];

onMounted(() => {
  initTree();
});

const initTree = () => {
  if (!svgRef.value) return;

  const width = chartContainer.value.clientWidth;
  const height = chartContainer.value.clientHeight;
  const margin = { top: 20, right: 180, bottom: 20, left: 100 };

  const svg = d3
    .select(svgRef.value)
    .attr('width', '100%')
    .attr('height', '100%')
    .attr('viewBox', [0, 0, width, height]);

  // 1. 创建主绘图层
  const gMain = svg.append('g');

  // 2. 设置缩放行为
  zoomBehavior = d3
    .zoom()
    .scaleExtent([0.2, 3]) // 缩放范围
    .on('zoom', (event) => {
      gMain.attr('transform', event.transform);
    });

  svg.call(zoomBehavior);

  // 3. 构建布局
  const treeLayout = d3.tree().nodeSize([40, 200]); // [节点垂直间距, 节点水平层级间距]

  const root = d3.hierarchy(treeData);
  treeLayout(root);

  // 4. 计算颜色函数
  const getColor = (d) => {
    if (d.depth === 0) return '#333';
    // 找到该节点属于哪一个大分支
    const topAncestor = d.ancestors().reverse()[1];
    const index = root.children.indexOf(topAncestor);
    return branchColors[index % branchColors.length];
  };

  // 5. 绘制连线
  gMain
    .append('g')
    .attr('class', 'links-group')
    .selectAll('path')
    .data(root.links())
    .join('path')
    .attr(
      'd',
      d3
        .linkHorizontal()
        .x((d) => d.y + margin.left)
        .y((d) => d.x + height / 2), // 初始居中
    )
    .attr('fill', 'none')
    .attr('stroke', (d) => getColor(d.target))
    .attr('stroke-opacity', 0.6)
    .attr('stroke-width', 1.5);

  // 6. 绘制节点
  const nodes = gMain
    .append('g')
    .attr('class', 'nodes-group')
    .selectAll('g')
    .data(root.descendants())
    .join('g')
    .attr(
      'transform',
      (d) => `translate(${d.y + margin.left},${d.x + height / 2})`,
    );

  // 绘制空心圆圈
  nodes
  .filter(d => d.children)
    .append('circle')
    .attr('r', 5)
    .attr('fill', '#fff')
    .attr('stroke', (d) => getColor(d))
    .attr('stroke-width', 2)
    .style('cursor', 'pointer');

  // 绘制文字
  nodes
    .append('text')
    .attr('dy', '0.35em')
    .attr('x', (d) => (d.children ? -12 : 12))
    .attr('text-anchor', (d) => (d.children ? 'end' : 'start'))
    .text((d) => d.data.name)
    .style('font-size', '13px')
    .style('font-weight', (d) => (d.depth <= 1 ? 'bold' : 'normal'))
    .clone(true)
    .lower() // 加上文字白底，防止重叠
    .attr('stroke', 'white')
    .attr('stroke-width', 3);

  // 7. 初始视图自动居中
  const initialTransform = d3.zoomIdentity.translate(20, 0).scale(0.9);
  svg.call(zoomBehavior.transform, initialTransform);
};

const resetZoom = () => {
  const svg = d3.select(svgRef.value);
  svg
    .transition()
    .duration(750)
    .call(zoomBehavior.transform, d3.zoomIdentity.translate(20, 0).scale(0.9));
};
</script>

<style scoped>
.mindmap-wrapper {
  position: relative;
  width: 100%;
  height: 600px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fafafa;
  overflow: hidden;
}

.chart-container {
  width: 100%;
  height: 100%;
}

.controls {
  position: absolute;
  bottom: 20px;
  right: 20px;
}

button {
  padding: 8px 16px;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

button:hover {
  background: #f0f0f0;
}

:deep(text) {
  pointer-events: none; /* 防止文字干扰拖拽 */
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
}
</style>
