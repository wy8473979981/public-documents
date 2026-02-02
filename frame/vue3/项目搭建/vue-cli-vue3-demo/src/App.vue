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

// 模拟数据（包含长短不一的文字以测试避让效果）
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
          children: [
            { name: '材料自查' },
            { name: '网络安全防护' },
            { name: '材料自查2' },
            { name: '网络安全防护3' },
          ],
        },
        {
          name: '现场验收',
          children: [
            { name: '系统功能演示' },
            { name: '数据一致性核查' },
            { name: '系统功能演示1' },
            { name: '数据一致性核查2' },
          ],
        },
      ],
    },
    {
      name: '验收工作流程',
      children: [
        {
          name: '自查及验收准备',
          children: [
            { name: '材料自查' },
            { name: '网络安全防护' },
            { name: '材料自查2' },
            { name: '网络安全防护3' },
          ],
        },
        {
          name: '现场验收',
          children: [
            { name: '系统功能演示' },
            { name: '数据一致性核查' },
            { name: '系统功能演示1' },
            { name: '数据一致性核查2' },
          ],
        },
      ],
    },
    {
      name: '验收工作流程',
      children: [
        {
          name: '自查及验收准备',
          children: [
            { name: '材料自查' },
            { name: '网络安全防护' },
            { name: '材料自查1' },
            { name: '网络安全防护2' },
          ],
        },
        {
          name: '现场验收',
          children: [
            { name: '系统功能演示' },
            { name: '数据一致性核查' },
            { name: '系统功能演示1' },
            { name: '数据一致性核查2' },
          ],
        },
      ],
    },
    {
      name: '验收工作流程',
      children: [
        {
          name: '自查及验收准备',
          children: [
            {
              name: '材料自查',
              children: [
                { name: '材料自查' },
                { name: '网络安全防护' },
                { name: '材料自查1' },
                {
                  name: '网络安全防护2',
                  children: [
                    { name: '材料自查' },
                    { name: '网络安全防护网络安全防护网络安全防护网络安全防护网络安全防护网络安全防护网络安全防护' },
                    { name: '材料自查1' },
                    { name: '网络安全防护2' },
                  ],
                },
              ],
            },
            { name: '网络安全防护' },
            { name: '材料自查1' },
            { name: '网络安全防护2' },
          ],
        },
        {
          name: '现场验收',
          children: [
            { name: '系统功能演示' },
            { name: '数据一致性核查' },
            { name: '系统功能演示1' },
            { name: '数据一致性核查2' },
          ],
        },
      ],
    },
  ],
};

const colorSchemes = {
  1: ['#5182E4', '#F7B500', '#44D7B6', '#6236FF', '#FA6400'],
  2: ['#3498DB', '#9B59B6', '#1ABC9C', '#F39C12', '#E74C3C'],
  3: ['#2980B9', '#8E44AD', '#16A085', '#D35400', '#C0392B'],
};

onMounted(() => {
  initTree();
});

// 辅助函数：精确计算文字宽度
const getTextWidth = (text, fontSize) => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  context.font = `${fontSize}px sans-serif`;
  return context.measureText(text).width;
};

const initTree = () => {
  if (!svgRef.value) return;

  const width = chartContainer.value.clientWidth;
  const height = chartContainer.value.clientHeight;
  const margin = { top: 20, right: 180, bottom: 20, left: 50 };

  const svg = d3
    .select(svgRef.value)
    .attr('width', '100%')
    .attr('height', '100%')
    .attr('viewBox', [0, 0, width, height]);

  const gMain = svg.append('g');

  zoomBehavior = d3
    .zoom()
    .scaleExtent([0.1, 3])
    .on('zoom', (e) => gMain.attr('transform', e.transform));
  svg.call(zoomBehavior);

  // 1. 基础布局计算（垂直间距设为 30）
  const treeLayout = d3.tree().nodeSize([30, 100]);
  const root = d3.hierarchy(treeData);
  treeLayout(root);

  // 2. 自动避让逻辑：计算每一层所需的最大宽度
  const maxLineWidths = []; // 存储每一层（含文字、横线、圆圈）的总宽度
  const levelPadding = 80; // 层级间的纯空白间距

  root.descendants().forEach((d) => {
    const fontSize = d.depth === 0 ? 16 : 13;
    const textW = getTextWidth(d.data.name, fontSize);
    // 节点总宽度 = 文字宽 + 文字到圆圈的padding(10) + 圆圈直径(10)
    const totalNodeW = textW + 20;

    maxLineWidths[d.depth] = Math.max(maxLineWidths[d.depth] || 0, totalNodeW);
  });

  // 3. 计算每一层的绝对 Y 坐标坐标映射
  const levelYMap = [0];
  for (let i = 1; i < maxLineWidths.length; i++) {
    // 当前层位置 = 上一层位置 + 上一层最宽节点的宽度 + 固定留白
    levelYMap[i] = levelYMap[i - 1] + maxLineWidths[i - 1] + levelPadding;
  }

  // 应用计算出的坐标
  root.descendants().forEach((d) => {
    d.y = levelYMap[d.depth];
  });

  // 颜色获取
  /**
   * 根据节点深度和位置获取对应的颜色
   *
   * @param {Object} d - 树节点对象，包含深度、父节点和子节点信息
   * @returns {string} 返回对应的颜色值
   */
  const getColor = (d) => {
    console.log(d.name, d.depth);
    // 根据节点深度返回不同颜色
    if (d.depth === 0) return '#333';
    // 获取当前深度的配色方案，默认使用深度1的方案
    const scheme = colorSchemes[d.depth] || colorSchemes[1];
    // 根据节点在兄弟节点中的位置选择颜色
    return scheme[(d.parent?.children.indexOf(d) || 0) % scheme.length];
  };

  const underlineData = new Map();

  // 4. 绘制节点
  const nodes = gMain
    .append('g')
    .selectAll('g')
    .data(root.descendants())
    .join('g')
    .attr(
      'transform',
      (d) => `translate(${d.y + margin.left},${d.x + height / 2})`,
    );

  // 绘制文字 (左对齐)
  nodes
    .append('text')
    .attr('dy', '0.35em')
    .attr('text-anchor', 'start')
    .text((d) => d.data.name)
    // .style('font-size', (d) => (d.depth === 0 ? '16px' : '13px'))
    // .style('font-weight', (d) => (d.depth <= 1 ? 'bold' : 'normal'))
    .style('font-size', '13px')
    .style('font-weight', 'normal')
    .style('fill', (d) => '#000000')
    .clone(true)
    .lower()
    .attr('stroke', 'white')
    .attr('stroke-width', 3);

  // 绘制横线和圆圈信息记录
  nodes.each(function (d) {
    const el = d3.select(this);
    const textW = getTextWidth(d.data.name, d.depth === 0 ? 16 : 13);
    const lineX2 = textW + 10;

    underlineData.set(d, {
      startX: 0,
      circleX: lineX2 + 6,
      y: 10, // 线在文字下方一点
    });

    el.append('line')
      .attr('x1', 0)
      .attr('y1', 10)
      .attr('x2', lineX2)
      .attr('y2', 10)
      .attr('stroke', getColor(d))
      .attr('stroke-width', 2);

    if (d.children) {
      el.append('circle')
        .attr('cx', lineX2 + 6)
        .attr('cy', 10)
        .attr('r', 4)
        .attr('fill', '#fff')
        .attr('stroke', getColor(d))
        .attr('stroke-width', 2);
    }
  });

  // 5. 绘制连线
  gMain
    .append('g')
    .lower()
    .selectAll('path')
    .data(root.links())
    .join('path')
    .attr('d', (d) => {
      const sPos = underlineData.get(d.source);
      const tPos = underlineData.get(d.target);

      const startX = d.source.y + margin.left + sPos.circleX;
      const startY = d.source.x + height / 2 + sPos.y;
      const endX = d.target.y + margin.left;
      const endY = d.target.x + height / 2 + tPos.y;

      const cp1 = startX + (endX - startX) * 0.5;
      return `M${startX},${startY} C${cp1},${startY} ${cp1},${endY} ${endX},${endY}`;
    })
    .attr('fill', 'none')
    .attr('stroke', (d) => getColor(d.target))
    .attr('stroke-width', 2)
    .attr('stroke-opacity', 1);

  const initialTransform = d3.zoomIdentity.translate(margin.left, 0).scale(0.8);
  svg.call(zoomBehavior.transform, initialTransform);
};

const resetZoom = () => {
  const svg = d3.select(svgRef.value);
  svg
    .transition()
    .duration(750)
    .call(zoomBehavior.transform, d3.zoomIdentity.translate(50, 0).scale(0.8));
};
</script>

<style scoped>
.mindmap-wrapper {
  position: relative;
  width: 100%;
  height: 800px;
  background: #fff;
  border: 1px solid #ddd;
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
  padding: 8px 15px;
  background: #fff;
  border: 1px solid #ccc;
  cursor: pointer;
  border-radius: 4px;
}
:deep(text) {
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
  user-select: none;
}
</style>
