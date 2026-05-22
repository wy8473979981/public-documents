<template>
  <div class="mindmap-demo">
    <h3>G6 思维导图示例 (无动画 + 隐藏根节点折叠)</h3>
    <div ref="container" class="mindmap-container"></div>
  </div>
</template>

<script>
import { onMounted, onBeforeUnmount, ref } from 'vue';
import { Rect, Text } from '@antv/g';
import {
  Badge,
  BaseBehavior,
  BaseNode,
  BaseTransform,
  CommonEvent,
  CubicHorizontal,
  ExtensionCategory,
  Graph,
  idOf,
  positionOf,
  register,
  treeToGraphData
} from '@antv/g6';

// 测试数据
const algorithmData = {
  id: '算法核心',
  children: [
    {
      id: '数据结构',
      children: [{ id: '数组' }, { id: '链表' }, { id: '树结构' }, { id: '图结构' }]
    },
    {
      id: '基础算法',
      children: [{ id: '排序算法' }, { id: '搜索算法' }]
    },
    {
      id: '进阶思想',
      children: [{ id: '动态规划' }, { id: '贪心算法' }, { id: '回溯法' }]
    }
  ]
};

export default {
  name: 'MindMapDemo',
  setup() {
    const container = ref(null);
    let graph = null;

    onMounted(() => {
      if (!container.value) return;

      const RootNodeStyle = {
        fill: '#EFF0F0',
        labelFill: '#262626',
        labelFontSize: 24,
        labelFontWeight: 600,
        labelOffsetY: 8,
        labelPlacement: 'center',
        ports: [{ placement: 'right' }, { placement: 'left' }],
        radius: 8
      };

      const NodeStyle = {
        fill: 'transparent',
        labelPlacement: 'center',
        labelFontSize: 16,
        ports: [{ placement: 'right-bottom' }, { placement: 'left-bottom' }]
      };

      const TreeEvent = {
        COLLAPSE_EXPAND: 'collapse-expand'
      };

      let textShape;
      const measureText = (textObj) => {
        if (!textShape) textShape = new Text({ style: textObj });
        textShape.attr(textObj);
        return textShape.getBBox().width;
      };

      const getNodeWidth = (nodeId, isRoot) => {
        const padding = isRoot ? 40 : 30;
        const nodeStyle = isRoot ? RootNodeStyle : NodeStyle;
        return (
          measureText({
            text: nodeId,
            fontSize: nodeStyle.labelFontSize,
            fontFamily: 'Gill Sans'
          }) + padding
        );
      };

      const getNodeSize = (nodeId, isRoot) => {
        const width = getNodeWidth(nodeId, isRoot);
        const height = isRoot ? 48 : 32;
        return [width, height];
      };

      class MindmapNode extends BaseNode {
        constructor(options) {
          super(options);
        }

        get childrenData() {
          return this.context.model.getChildrenData(this.id) || [];
        }

        get rootId() {
          return idOf(this.context.model.getRootsData()[0]);
        }

        getCollapseStyle(attributes) {
          // 修改点 2: 如果是根节点，或者没有子节点，直接不渲染折叠按钮
          if (this.id === this.rootId || this.childrenData.length === 0) return false;

          const { color, direction, collapsed } = attributes;
          const [width, height] = this.getSize(attributes);

          return {
            backgroundFill: '#fff',
            backgroundStroke: color,
            backgroundLineWidth: 1.5,
            backgroundHeight: 14,
            backgroundWidth: 14,
            backgroundRadius: 7,
            cursor: 'pointer',
            fill: color,
            fontSize: 12,
            text: collapsed ? '+' : '-',
            textAlign: 'center',
            textBaseline: 'middle',
            x: direction === 'left' ? -7 : width + 7,
            y: height
          };
        }

        drawCollapseShape(attributes, container) {
          const iconStyle = this.getCollapseStyle(attributes);
          const btn = this.upsert('collapse-expand', Badge, iconStyle, container);

          if (btn) {
            this.forwardEvent(btn, CommonEvent.CLICK, (event) => {
              event.stopPropagation();
              this.context.graph.emit(TreeEvent.COLLAPSE_EXPAND, {
                id: this.id,
                collapsed: !attributes.collapsed
              });
            });
          }
        }

        forwardEvent(target, type, listener) {
          if (target && !Reflect.has(target, '__bind__')) {
            Reflect.set(target, '__bind__', true);
            target.addEventListener(type, listener);
          }
        }

        getKeyStyle(attributes) {
          const [width, height] = this.getSize(attributes);
          const keyShape = super.getKeyStyle(attributes);
          return { width, height, ...keyShape };
        }

        drawKeyShape(attributes, container) {
          const keyStyle = this.getKeyStyle(attributes);
          return this.upsert('key', Rect, keyStyle, container);
        }

        render(attributes = this.parsedAttributes, container = this) {
          super.render(attributes, container);
          this.drawCollapseShape(attributes, container);
        }
      }

      class MindmapEdge extends CubicHorizontal {
        get rootId() {
          return idOf(this.context.model.getRootsData()[0]);
        }

        getKeyPath(attributes) {
          const path = super.getKeyPath(attributes);
          const isRoot = this.targetNode.id === this.rootId;
          const labelWidth = getNodeWidth(this.targetNode.id, isRoot);

          const [, tp] = this.getEndpoints(attributes);
          const sign = this.sourceNode.getCenter()[0] < this.targetNode.getCenter()[0] ? 1 : -1;
          return [...path, ['L', tp[0] + labelWidth * sign, tp[1]]];
        }
      }

      class CollapseExpandTree extends BaseBehavior {
        constructor(context, options) {
          super(context, options);
          this.bindEvents();
        }

        update(options) {
          this.unbindEvents();
          super.update(options);
          this.bindEvents();
        }

        bindEvents() {
          const { graph } = this.context;
          graph.on(TreeEvent.COLLAPSE_EXPAND, this.onCollapseExpand);
        }

        unbindEvents() {
          const { graph } = this.context;
          graph.off(TreeEvent.COLLAPSE_EXPAND, this.onCollapseExpand);
        }

        status = 'idle';

        onCollapseExpand = async (event) => {
          if (this.status !== 'idle') return;
          this.status = 'busy';
          const { id, collapsed } = event;
          const { graph } = this.context;
          await graph.frontElement(id);

          // 修改点 1: 在这里通过第二个参数开启/关闭过渡动画
          if (collapsed) {
            await graph.collapseElement(id, { animation: false });
          } else {
            await graph.expandElement(id, { animation: false });
          }
          this.status = 'idle';
        };
      }

      class AssignColorByBranch extends BaseTransform {
        static defaultOptions = {
          colors: [
            '#1783FF',
            '#F08F56',
            '#D580FF',
            '#00C9C9',
            '#7863FF',
            '#DB9D0D',
            '#60C42D',
            '#FF80CA'
          ]
        };

        constructor(context, options) {
          super(context, Object.assign({}, AssignColorByBranch.defaultOptions, options));
        }

        beforeDraw(input) {
          const nodes = this.context.model.getNodeData();
          const edges = this.context.model.getEdgeData();
          if (nodes.length === 0) return input;

          let colorIndex = 0;
          const nodeColorMap = new Map();

          const dfs = (nodeId, color) => {
            const node = nodes.find((datum) => datum.id === nodeId);
            if (!node) return;

            node.style ||= {};
            const nodeColor =
              color || this.options.colors[colorIndex++ % this.options.colors.length];
            node.style.color = nodeColor;
            nodeColorMap.set(nodeId, nodeColor);
            node.children?.forEach((childId) => dfs(childId, nodeColor));
          };

          const roots = this.context.model.getRootsData();
          if (roots && roots.length > 0) {
            roots[0].children?.forEach((childId) => dfs(childId));
          }

          edges.forEach((edge) => {
            edge.style ||= {};
            edge.style.stroke = nodeColorMap.get(edge.target) || '#1783FF';
          });

          return input;
        }
      }

      register(ExtensionCategory.NODE, 'mindmap', MindmapNode);
      register(ExtensionCategory.EDGE, 'mindmap', MindmapEdge);
      register(ExtensionCategory.BEHAVIOR, 'collapse-expand-tree', CollapseExpandTree);
      register(ExtensionCategory.TRANSFORM, 'assign-color-by-branch', AssignColorByBranch);

      const getNodeSide = (nodeData, parentData) => {
        if (!parentData) return 'center';
        const nodePositionX = positionOf(nodeData)?.[0] || 0;
        const parentPositionX = positionOf(parentData)?.[0] || 0;
        return parentPositionX > nodePositionX ? 'left' : 'right';
      };

      const data = algorithmData;
      const rootId = data.id;

      graph = new Graph({
        container: container.value,
        autoFit: 'view',
        data: treeToGraphData(data),
        node: {
          type: 'mindmap',
          style: function (d) {
            const direction = getNodeSide(d, this.getParentData(idOf(d), 'tree'));
            const isRoot = idOf(d) === rootId;
            const style = isRoot ? RootNodeStyle : NodeStyle;
            return {
              ...style,
              labelText: idOf(d),
              size: getNodeSize(idOf(d), isRoot),
              direction,
              color: d.style?.color || '#1783FF'
            };
          }
        },
        edge: {
          type: 'mindmap',
          style: {
            lineWidth: 2
          }
        },
        behaviors: ['drag-canvas', 'zoom-canvas', { type: 'collapse-expand-tree' }],
        transforms: ['assign-color-by-branch'],
        layout: {
          type: 'mindmap',
          direction: 'H',
          getHeight: () => 32,
          getWidth: (node) => getNodeWidth(node.id, node.id === rootId),
          getVGap: () => 16,
          getHGap: () => 60
        }
      });

      graph.render();
    });

    onBeforeUnmount(() => {
      if (graph) {
        graph.destroy();
      }
    });

    return { container };
  }
};
</script>

<style scoped>
.mindmap-demo {
  padding: 20px;
}

.mindmap-container {
  height: 600px;
  border: 1px solid #e2e2e2;
  border-radius: 4px;
  background: #fff;
  overflow: hidden;
}
</style>
