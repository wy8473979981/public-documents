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
        autoFit: 'view',
        modes: {
          default: ['drag-canvas', 'zoom-canvas', 'drag-node']
        },
        layout: {
          type: 'dendrogram',
          direction: 'TB', // 从上到下
          nodeSep: 40,
          rankSep: 100
        },
        node: {
          style: {
            fill: '#DEE9FF',
            stroke: '#5B8FF9',
            lineWidth: 2
          },
          label: {
            style: {
              fill: '#000',
              fontSize: 12,
              textAlign: 'center'
            }
          },
          size: 40
        },
        edge: {
          style: {
            stroke: '#A3B1BF',
            lineWidth: 2
          }
        }
      });

      // 树形结构数据示例
      const data = {
        id: 'root',
        label: '根节点',
        children: [
          {
            id: 'child1',
            label: '子节点1',
            children: [
              { id: 'child1-1', label: '孙节点1-1' },
              { id: 'child1-2', label: '孙节点1-2' }
            ]
          },
          {
            id: 'child2',
            label: '子节点2',
            children: [
              { id: 'child2-1', label: '孙节点2-1' },
              { id: 'child2-2', label: '孙节点2-2' },
              { id: 'child2-3', label: '孙节点2-3' }
            ]
          },
          {
            id: 'child3',
            label: '子节点3'
          }
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
