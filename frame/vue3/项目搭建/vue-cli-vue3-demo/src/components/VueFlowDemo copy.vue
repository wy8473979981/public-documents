<template>
  <div class="flow-container">
    <vue-flow
      v-model:nodes="nodes"
      v-model:edges="edges"
      @pane-ready="onPaneReady"
    >
      <background />
      <controls />
      <mini-map />
      <panel position="top-right">
        <button class="layout-btn" @click="optimizeLayout('TB')" :class="{ active: currentDirection === 'TB' }">
          ↓ 垂直布局
        </button>
        <button class="layout-btn" @click="optimizeLayout('LR')" :class="{ active: currentDirection === 'LR' }">
          → 水平布局
        </button>
        <button class="optimize-btn" @click="optimizeLayout(currentDirection)">
          ⚡ 一键优化
        </button>
      </panel>
    </vue-flow>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import { VueFlow, Panel } from '@vue-flow/core'
import { Background, Controls, MiniMap } from '@vue-flow/additional-components'
import dagre from 'dagre'
import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'

// 初始化流程图数据（根据您的图片1结构）
const initialNodes = ref([
  { id: '1', position: { x: 250, y: 50 }, data: { label: '节点1' }, type: 'input' },
  { id: '2', position: { x: 100, y: 150 }, data: { label: '节点2' } },
  { id: '3', position: { x: 400, y: 150 }, data: { label: '节点3' } },
  { id: '4', position: { x: 50, y: 250 }, data: { label: '节点4' } },
  { id: '5', position: { x: 150, y: 250 }, data: { label: '节点5' } },
  { id: '6', position: { x: 100, y: 350 }, data: { label: '节点6' } },
  { id: '7', position: { x: 100, y: 450 }, data: { label: '节点7' } },
  { id: '8', position: { x: 400, y: 250 }, data: { label: '节点8' } },
  { id: '9', position: { x: 350, y: 350 }, data: { label: '节点9' } },
  { id: '10', position: { x: 450, y: 350 }, data: { label: '节点10' } },
  { id: '11', position: { x: 400, y: 450 }, data: { label: '节点11' } },
  { id: '12', position: { x: 400, y: 550 }, data: { label: '节点12' } },
  { id: '13', position: { x: 400, y: 650 }, data: { label: '节点13' } },
  { id: '14', position: { x: 400, y: 750 }, data: { label: '节点14' } }
])

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
  { id: 'e13-14', source: '13', target: '14' }
])

const nodes = ref(initialNodes.value)
const edges = ref(initialEdges.value)
const currentDirection = ref('TB') // TB: 垂直 | LR: 水平
const vueFlowInstance = ref(null)

const onPaneReady = (instance) => {
  vueFlowInstance.value = instance
}

const optimizeLayout = async (direction) => {
  if (!vueFlowInstance.value) return
  
  currentDirection.value = direction || currentDirection.value

  // 使用Dagre自动布局
  const dagreGraph = new dagre.graphlib.Graph()
  dagreGraph.setDefaultEdgeLabel(() => ({}))
  
  // 动态调整布局参数
  dagreGraph.setGraph({
    rankdir: currentDirection.value,
    nodesep: currentDirection.value === 'LR' ? 100 : 50, // 水平布局增加节点间距
    ranksep: currentDirection.value === 'LR' ? 80 : 120, // 垂直布局增加层级间距
    marginx: 30,
    marginy: 30
  })

  // 设置节点尺寸（统一为150x50）
  nodes.value.forEach(node => {
    dagreGraph.setNode(node.id, { 
      width: 150, 
      height: 50 
    })
  })

  edges.value.forEach(edge => {
    dagreGraph.setEdge(edge.source, edge.target)
  })

  dagre.layout(dagreGraph)

  // 更新节点位置
  const updatedNodes = nodes.value.map(node => {
    const nodeWithPosition = dagreGraph.node(node.id)
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - nodeWithPosition.width / 2,
        y: nodeWithPosition.y - nodeWithPosition.height / 2
      }
    }
  })

  nodes.value = updatedNodes

  // 等待渲染完成
  await nextTick()
  await new Promise(resolve => setTimeout(resolve, 50))

  // 适配视口
  vueFlowInstance.value.fitView({
    padding: 0.8,
    duration: 800,
    minZoom: currentDirection.value === 'LR' ? 0.2 : 0.1
  })
}
</script>

<style>
.flow-container {
  width: 100%;
  height: 100vh;
  border: 1px solid #eee;
}

.optimize-btn {
  padding: 8px 16px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 10px;
  font-weight: bold;
  transition: all 0.3s;
}

.layout-btn {
  padding: 8px 12px;
  background: #f0f0f0;
  color: #555;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 5px;
  transition: all 0.3s;
}

.layout-btn.active {
  background: #2196F3;
  color: white;
  border-color: #2196F3;
}

.optimize-btn:hover, .layout-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}

.vue-flow__node {
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
  border-radius: 4px;
  background: white;
  border: 1px solid #ddd;
  font-family: Arial;
}

.vue-flow__node-input {
  border-color: #4CAF50;
}
</style>