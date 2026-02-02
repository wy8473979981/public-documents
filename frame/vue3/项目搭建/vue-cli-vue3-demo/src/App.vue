<template>
  <div class="mindmap-wrapper">
    <div ref="chartContainer" class="chart-container">
      <svg ref="svgRef"></svg>
    </div>

    <div class="controls">
      <button @click="autoFit">适配视图</button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import * as d3 from 'd3';

const svgRef = ref(null);
const chartContainer = ref(null);
let zoomBehavior = null;
let gMain = null; // 存储主绘图组的引用
let rootData = null; // 存储计算布局后的根节点

// 模拟数据
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
      name: '系统安全规范',
      children: [
        {
          name: '物理安全',
          children: [{ name: '机房环境监测' }, { name: '电力保障系统' }],
        },
        {
          name: '网络安全',
          children: [
            { name: '防火墙策略配置' },
            { name: '入侵检测系统' },
            { name: '数据加密传输' },
          ],
        },
      ],
    },
    {
      name: '数据质量管理',
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
                    {
                      name: '网络安全防护网络安全防护网络安全防护网络安全防护网络安全防护网络安全防护网络安全防护',
                    },
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

  // 清空之前的 SVG 内容，防止热重载重复渲染
  d3.select(svgRef.value).selectAll('*').remove();

  const svg = d3
    .select(svgRef.value)
    .attr('width', width)
    .attr('height', height)
    // 移除 viewBox，完全通过 transform 控制，避免混淆
    .style('background', '#fff');

  gMain = svg.append('g');

  zoomBehavior = d3
    .zoom()
    .scaleExtent([0.1, 5])
    .on('zoom', (e) => gMain.attr('transform', e.transform));

  svg.call(zoomBehavior);
  // 禁止双击缩放
  svg.on('dblclick.zoom', null);

  // 1. 基础布局计算
  // nodeSize([height, width]) -> 这里定义的是节点间的纯间距
  // 垂直间距设为 36，确保紧凑但有空隙
  const treeLayout = d3.tree().nodeSize([36, 100]);
  rootData = d3.hierarchy(treeData);
  treeLayout(rootData);

  // 2. 自动避让逻辑：计算每一层所需的最大宽度（水平方向）
  const maxLineWidths = [];
  const levelPadding = 60; // 层级间的水平留白

  rootData.descendants().forEach((d) => {
    const fontSize = d.depth === 0 ? 16 : 13;
    const textW = getTextWidth(d.data.name, fontSize);
    // 节点总水平占用 = 文字宽 + 线长(10) + 圆圈(10) + 额外Buffer
    const totalNodeW = textW + 25;
    maxLineWidths[d.depth] = Math.max(maxLineWidths[d.depth] || 0, totalNodeW);
  });

  // 3. 计算每一层的绝对 Y (水平) 坐标映射
  // D3 Tree 默认布局是 x 为垂直，y 为水平。我们需要修正 y
  const levelYMap = [0];
  for (let i = 1; i < maxLineWidths.length; i++) {
    levelYMap[i] = levelYMap[i - 1] + maxLineWidths[i - 1] + levelPadding;
  }

  // 应用计算出的水平坐标
  rootData.descendants().forEach((d) => {
    d.y = levelYMap[d.depth]; // d.y 控制水平位置
    // d.x 由 d3.tree() 自动计算，控制垂直位置，不需要动
  });

  const getColor = (d) => {
    if (d.depth === 0) return '#333';

    // 1. 获取当前节点在兄弟中的索引
    const index = d.parent?.children.indexOf(d) || 0;

    // 2. 获取父节点在它那一辈中的索引（增加偏移量）
    // 如果父节点是根节点，偏移量为0；否则取父节点的索引
    const parentIndex =
      d.parent && d.parent.parent
        ? d.parent.parent.children.indexOf(d.parent)
        : 0;

    // 3. 将父节点索引作为种子，影响子节点的取色起始点
    // 这里的 0.2 是一个偏移因子，可以根据需要调整
    const colorSeed =
      index / (d.parent?.children.length || 1) + parentIndex * 0.2;

    return d3.interpolateRainbow(colorSeed % 1);
  };

  const underlineData = new Map();

  // 4. 绘制节点
  // 注意：这里不再加 height/2 的偏移量，位置由 autoFit 控制
  const nodes = gMain
    .append('g')
    .selectAll('g')
    .data(rootData.descendants())
    .join('g')
    .attr('transform', (d) => `translate(${d.y},${d.x})`);

  // 绘制文字
  nodes
    .append('text')
    .attr('dy', '0.35em')
    .attr('text-anchor', 'start')
    .text((d) => d.data.name)
    .style('font-size', '13px')
    .style('font-weight', 'normal')
    .style('fill', '#000000')
    // 添加文字描边，防止线条穿过文字时看不清（虽然这里线在文字下方）
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
    .data(rootData.links())
    .join('path')
    .attr('d', (d) => {
      const sPos = underlineData.get(d.source);
      const tPos = underlineData.get(d.target);

      // 所有的坐标都是相对于组内的 (0,0)，不需要加 margin 或 height/2
      const startX = d.source.y + sPos.circleX;
      const startY = d.source.x + sPos.y;
      const endX = d.target.y;
      const endY = d.target.x + tPos.y;

      const cp1 = startX + (endX - startX) * 0.5;
      return `M${startX},${startY} C${cp1},${startY} ${cp1},${endY} ${endX},${endY}`;
    })
    .attr('fill', 'none')
    .attr('stroke', (d) => getColor(d.target))
    .attr('stroke-width', 2);

  // 6. 初始化时自动适配视图
  autoFit();
};

/**
 * 核心功能：自动计算边界并缩放居中
 */
const autoFit = () => {
  if (!rootData || !svgRef.value || !gMain) return;

  const containerW = chartContainer.value.clientWidth;
  const containerH = chartContainer.value.clientHeight;
  const padding = 40; // 四周留白

  // 1. 遍历计算树的实际边界 (Bounding Box)
  let minX = Infinity; // 垂直方向最小
  let maxX = -Infinity; // 垂直方向最大
  let minY = Infinity; // 水平方向最小
  let maxY = -Infinity; // 水平方向最大

  // 需要考虑节点自身的宽度（文字长度），不能只看坐标点
  rootData.descendants().forEach((d) => {
    // d.x 是垂直坐标
    if (d.x < minX) minX = d.x;
    if (d.x > maxX) maxX = d.x;

    // d.y 是水平坐标
    if (d.y < minY) minY = d.y;

    // 计算右侧边界：d.y + 文字宽度 + 额外留白
    const textW = getTextWidth(d.data.name, d.depth === 0 ? 16 : 13);
    const nodeRightEdge = d.y + textW + 40;
    if (nodeRightEdge > maxY) maxY = nodeRightEdge;
  });

  const treeWidth = maxY - minY;
  const treeHeight = maxX - minX + 60; // 加一点垂直buffer，防止最上/最下的文字被切

  // 2. 计算缩放比例 k
  // 让树的宽或高适应容器，取较小值，保证完全显示
  const scaleX = (containerW - padding * 2) / treeWidth;
  const scaleY = (containerH - padding * 2) / treeHeight;
  let k = Math.min(scaleX, scaleY);

  // 限制最大缩放为 1.2 (如果树很小，不要放得超级大)
  if (k > 1.2) k = 1.2;

  // 3. 计算平移量 x, y
  // 目标：将树的中心点 (treeCenter) 移动到 容器中心点 (viewCenter)

  // 树的中心点坐标（在未缩放的坐标系中）
  const treeCenterX = (minY + maxY) / 2;
  const treeCenterY = (minX + maxX) / 2;

  // 容器中心
  const viewCenterX = containerW / 2;
  const viewCenterY = containerH / 2;

  // 公式：translate = 容器中心 - (树中心 * 缩放)
  const x = viewCenterX - treeCenterX * k;
  // 注意：原图中树的垂直坐标中心可能不是0，需要根据 minX/maxX 修正
  // 实际上因为我们的 d.x 是围绕 0 上下分布或者从 0 开始的，用 min/max 平均值最稳妥
  const y = viewCenterY - treeCenterY * k;

  // 4. 应用变换
  const transform = d3.zoomIdentity.translate(x, y).scale(k);

  d3.select(svgRef.value)
    .transition()
    .duration(750)
    .call(zoomBehavior.transform, transform);
};

const resetZoom = () => {
  autoFit(); // 重置视图其实就是重新Fit
};
</script>

<style scoped>
.mindmap-wrapper {
  position: relative;
  width: 100%;
  height: 800px; /* 容器高度 */
  background: #f8f9fa; /* 稍微给点背景色区分 */
  border: 1px solid #ddd;
  overflow: hidden;
  border-radius: 8px;
}

.chart-container {
  width: 100%;
  height: 100%;
}

.controls {
  position: absolute;
  bottom: 20px;
  right: 20px;
  display: flex;
  gap: 10px;
}

button {
  padding: 8px 16px;
  background: #fff;
  border: 1px solid #ccc;
  cursor: pointer;
  border-radius: 4px;
  font-size: 14px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
}

button:hover {
  background: #f0f0f0;
  border-color: #bbb;
}

:deep(text) {
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
  user-select: none;
}
</style>
