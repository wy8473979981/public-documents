<template>
  <div class="flow-container">
    <vue-flow
      v-model:nodes="nodes"
      v-model:edges="edges"
      :min-zoom="minzoom"
      :max-zoom="maxzoom"
      @pane-ready="onPaneReady">
      <background />
      <controls />
      <mini-map />
      <panel position="top-right">
        <button class="optimize-btn" @click="workflow1">流程图1</button>
        <button class="optimize-btn" @click="workflow2">流程图2</button>
        <button class="optimize-btn" @click="optimizeLayout">
          ⚡ 一键优化排版
        </button>
        <button class="optimize-btn" @click="getZoomLevel">
          获取当前缩放值
        </button>
      </panel>
    </vue-flow>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue';
import { useVueFlow ,VueFlow, Panel } from '@vue-flow/core';
import { Background, Controls, MiniMap } from '@vue-flow/additional-components';
import dagre from 'dagre';
import '@vue-flow/core/dist/style.css';
import '@vue-flow/core/dist/theme-default.css';

const { zoomTo, getViewport } = useVueFlow();
const initZoom = 0.8;
const minzoom = 0.5;
const maxzoom = 1.5;
// 初始化流程图数据（配置左右连接点）
const initialNodes = ref([
  {
    id: '1',
    position: { x: 250, y: 50 },
    data: { label: '节点1' },
    type: 'input',
    sourcePosition: 'right',
    targetPosition: 'left',
  },
  {
    id: '2',
    position: { x: 100, y: 150 },
    data: { label: '节点2' },
    sourcePosition: 'right',
    targetPosition: 'left',
  },
  {
    id: '3',
    position: { x: 400, y: 150 },
    data: { label: '节点3' },
    sourcePosition: 'right',
    targetPosition: 'left',
  },
  {
    id: '4',
    position: { x: 50, y: 250 },
    data: { label: '节点4' },
    sourcePosition: 'right',
    targetPosition: 'left',
  },
  {
    id: '5',
    position: { x: 150, y: 250 },
    data: { label: '节点5' },
    sourcePosition: 'right',
    targetPosition: 'left',
  },
  {
    id: '6',
    position: { x: 100, y: 350 },
    data: { label: '节点6' },
    sourcePosition: 'right',
    targetPosition: 'left',
  },
  {
    id: '7',
    position: { x: 100, y: 450 },
    data: { label: '节点7' },
    sourcePosition: 'right',
    targetPosition: 'left',
  },
  {
    id: '8',
    position: { x: 400, y: 250 },
    data: { label: '节点8' },
    sourcePosition: 'right',
    targetPosition: 'left',
  },
  {
    id: '9',
    position: { x: 350, y: 350 },
    data: { label: '节点9' },
    sourcePosition: 'right',
    targetPosition: 'left',
  },
  {
    id: '10',
    position: { x: 450, y: 350 },
    data: { label: '节点10' },
    sourcePosition: 'right',
    targetPosition: 'left',
  },
  {
    id: '11',
    position: { x: 400, y: 450 },
    data: { label: '节点11' },
    sourcePosition: 'right',
    targetPosition: 'left',
  },
  {
    id: '12',
    position: { x: 400, y: 550 },
    data: { label: '节点12' },
    sourcePosition: 'right',
    targetPosition: 'left',
  },
  {
    id: '13',
    position: { x: 400, y: 650 },
    data: { label: '节点13' },
    sourcePosition: 'right',
    targetPosition: 'left',
  },
  {
    id: '14',
    position: { x: 400, y: 750 },
    data: { label: '节点14' },
    type: 'output',
    sourcePosition: 'right',
    targetPosition: 'left',
  },
]);

const initialEdges = ref([
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e1-3', source: '1', target: '3' },
  { id: 'e2-4', source: '2', target: '4' },
  { id: 'e2-5', source: '2', target: '5' },
  { id: 'e2-6', source: '2', target: '6' },
  { id: 'e6-7', source: '6', target: '7' },
  { id: 'e3-8', source: '3', target: '8' },
  { id: 'e8-9', source: '8', target: '9' },
  { id: 'e8-10', source: '8', target: '10' },
  { id: 'e8-11', source: '8', target: '11' },
  { id: 'e11-12', source: '11', target: '12' },
  { id: 'e12-13', source: '12', target: '13' },
  { id: 'e13-14', source: '13', target: '14' },
]);

const nodes = ref(initialNodes.value);
const edges = ref(initialEdges.value);
const vueFlowInstance = ref(null);

const onPaneReady = async (instance) => {
  vueFlowInstance.value = instance;
  await nextTick();
  zoomTo(initZoom, {
    duration: 500,
    minZoom: minzoom,
    maxZoom: maxzoom,
  });
};
const getZoomLevel = () => {
  let viewport = getViewport();
  console.log('当前视口:', viewport);
  // if (!vueFlowInstance.value) return;
  // const { x, y, scale } = vueFlowInstance.value.getTransform();
  // console.log('当前缩放值:', x, y, scale);
};

const workflow1 = async () => {
  nodes.value = initialNodes.value;
  edges.value = initialEdges.value;
  await nextTick();
  vueFlowInstance.value.fitView({
    padding: 0.5,
    // duration: 500,
    minZoom: minzoom,
    maxZoom: maxzoom,
  });
};
const workflow2 = async () => {
  nodes.value = [
    {
      id: '1',
      position: { x: 250, y: 50 },
      data: { label: '节点1' },
      type: 'input',
      sourcePosition: 'right',
      targetPosition: 'left',
    },
    {
      id: '2',
      position: { x: 100, y: 150 },
      data: { label: '节点2' },
      sourcePosition: 'right',
      targetPosition: 'left',
    },
    {
      id: '3',
      position: { x: 400, y: 150 },
      data: { label: '节点3' },
      sourcePosition: 'right',
      targetPosition: 'left',
    },
    {
      id: '4',
      position: { x: 50, y: 250 },
      data: { label: '节点4' },
      sourcePosition: 'right',
      targetPosition: 'left',
    },
    {
      id: '5',
      position: { x: 150, y: 250 },
      data: { label: '节点5' },
      sourcePosition: 'right',
      targetPosition: 'left',
    },
    {
      id: '6',
      position: { x: 100, y: 350 },
      data: { label: '节点6' },
      sourcePosition: 'right',
      targetPosition: 'left',
    },
    {
      id: '7',
      position: { x: 100, y: 450 },
      data: { label: '节点7' },
      sourcePosition: 'right',
      targetPosition: 'left',
    },
    {
      id: '8',
      position: { x: 400, y: 250 },
      data: { label: '节点8' },
      sourcePosition: 'right',
      targetPosition: 'left',
    },
    {
      id: '9',
      position: { x: 350, y: 350 },
      data: { label: '节点9' },
      sourcePosition: 'right',
      targetPosition: 'left',
    },
    {
      id: '10',
      position: { x: 450, y: 350 },
      data: { label: '节点10' },
      sourcePosition: 'right',
      targetPosition: 'left',
    },
    {
      id: '11',
      position: { x: 400, y: 450 },
      data: { label: '节点11' },
      sourcePosition: 'right',
      targetPosition: 'left',
    },
    {
      id: '12',
      position: { x: 400, y: 550 },
      data: { label: '节点12' },
      sourcePosition: 'right',
      targetPosition: 'left',
    },
    {
      id: '13',
      position: { x: 400, y: 650 },
      data: { label: '节点13' },
      sourcePosition: 'right',
      targetPosition: 'left',
    },
    {
      id: '14',
      position: { x: 400, y: 750 },
      data: { label: '节点14' },
      sourcePosition: 'right',
      targetPosition: 'left',
    },
    {
      id: '15',
      position: { x: 400, y: 850 },
      data: { label: '节点15' },
      type: 'output',
      sourcePosition: 'right',
      targetPosition: 'left',
    },
  ];
  edges.value = [
    { id: 'e1-2', source: '1', target: '2' },
    { id: 'e1-3', source: '1', target: '3' },
    { id: 'e2-4', source: '2', target: '4' },
    { id: 'e2-5', source: '2', target: '5' },
    { id: 'e2-6', source: '2', target: '6' },
    { id: 'e6-7', source: '6', target: '7' },
    { id: 'e3-8', source: '3', target: '8' },
    { id: 'e8-9', source: '8', target: '9' },
    { id: 'e8-10', source: '8', target: '10' },
    { id: 'e8-11', source: '8', target: '11' },
    { id: 'e11-12', source: '11', target: '12' },
    { id: 'e12-13', source: '12', target: '13' },
    { id: 'e13-14', source: '13', target: '14' },
    { id: 'e14-15', source: '14', target: '15' },
  ];
  await nextTick();
  vueFlowInstance.value.fitView({
    padding: 0.5,
    // duration: 500,
    minZoom: minzoom,
    maxZoom: maxzoom,
  });
};

const formatNodeData = (data) => {
  return data ? JSON.parse(JSON.stringify(data)) : {};
};

const optimizeLayout = async () => {
  if (!vueFlowInstance.value) return;

  // 确保视图已更新
  await nextTick();

  // 使用Dagre进行水平自动布局
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  // 水平布局专用参数
  dagreGraph.setGraph({
    rankdir: 'LR', // 固定为水平布局
    nodesep: 120, // 节点水平间距
    ranksep: 80, // 层级垂直间距
    marginx: 50,
    marginy: 50,
  });

  // 获取节点真实尺寸
  nodes.value.forEach((node) => {
    let width = 150;
    let height = 50;

    // 优先使用DOM实际尺寸
    const flowNodes = vueFlowInstance.value?.nodes || [];
    const flowNode = flowNodes.find((n) => n.id === node.id);
    console.log('flowNode', formatNodeData(flowNode?.dimensions), formatNodeData(flowNode), node.id);
    if (flowNode?.dimensions) {
      width = flowNode.dimensions.width;
      height = flowNode.dimensions.height;
    }
    // 其次使用自定义尺寸
    else if (node.data.width || node.data.height) {
      width = node.data.width || width;
      height = node.data.height || height;
    }
    // 最后使用标签长度估算
    else {
      const labelLength = node.data.label.length * 8;
      width = Math.max(150, labelLength + 40);
    }

    dagreGraph.setNode(node.id, { width, height });
  });

  edges.value.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  // 更新节点位置（水平居中）
  const updatedNodes = nodes.value.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - nodeWithPosition.width / 2,
        y: nodeWithPosition.y - nodeWithPosition.height / 2,
      },
    };
  });

  nodes.value = updatedNodes;

  // 等待渲染完成
  await nextTick();
  await new Promise((resolve) => setTimeout(resolve, 30));

  // 适配视口（水平布局专用参数）
  vueFlowInstance.value.fitView({
    padding: 0.5,
    duration: 500,
    minZoom: 0.2,
    maxZoom: 1.5,
  });
};
</script>

<style>
.flow-container {
  width: 100%;
  height: 100vh;
  background: #f8f9fa;
}

.optimize-btn {
  padding: 10px 16px;
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  font-size: 14px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.optimize-btn:hover {
  background: #45a049;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.vue-flow__node {
  border-radius: 6px;
  background: white;
  border: 2px solid #4caf50;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  font-family: 'Arial', sans-serif;
  font-size: 14px;
  transition: all 0.3s ease;
}

.vue-flow__node-input {
  border-color: #2196f3;
  background: #e3f2fd;
}

.vue-flow__node-output {
  border-color: #f44336;
  background: #ffebee;
}

.vue-flow__edge-path {
  stroke: #666;
  stroke-width: 2px;
}

/* 自定义连接点样式 */
.vue-flow__handle {
  width: 10px;
  height: 10px;
  background: #555;
}

.vue-flow__handle-left {
  left: -5px;
}

.vue-flow__handle-right {
  right: -5px;
}
</style>
