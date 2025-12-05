<template>
  <div class="g6-demo">
    <h3>G6 图形可视化示例</h3>
    <div ref="container" class="g6-container"></div>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue';
import { Graph } from '@antv/g6';

export default {
  name: 'G6Demo',
  setup() {
    const container = ref(null);

    onMounted(() => {
      if (!container.value) return;

      const graph = new Graph({
        container: container.value,
        width: 800,
        height: 500,
        autoFit: 'view', // 推荐开启
        modes: {
          default: ['drag-canvas', 'zoom-canvas', 'drag-node']
        },
        layout: {
          type: 'force',
          preventOverlap: true,
          linkDistance: 150
        },
        node: {
          style: {
            fill: '#DEE9FF',
            stroke: '#5B8FF9'
          },
          label: {
            style: {
              fill: '#000',
              fontSize: 12
            }
          },
          size: 40
        },
        edge: {
          style: {
            stroke: '#e2e2e2'
          }
        }
      });

      const data = {
        nodes: [
          { id: 'node1', label: '开始' },
          { id: 'node2', label: '处理' },
          { id: 'node3', label: '决策' },
          { id: 'node4', label: '结束' }
        ],
        edges: [
          { source: 'node1', target: 'node2' },
          { source: 'node2', target: 'node3' },
          { source: 'node3', target: 'node4' }
        ]
      };

      graph.setData(data);
      graph.render();
    });

    return { container };
  }
};
</script>

<style scoped>
.g6-demo {
  padding: 20px;
}

.g6-container {
  height: 500px;
  border: 1px solid #e2e2e2;
  border-radius: 4px;
  background: #fff;
}
</style>
