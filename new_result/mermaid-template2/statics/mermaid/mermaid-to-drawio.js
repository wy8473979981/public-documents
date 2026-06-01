/**
 * Mermaid to Draw.io 转换模块（深度多维分支布局版）
 * 彻底攻克多路分支线纠缠、子图围合、样式丢失和一字队列退化的终极修复方案
 */
(function () {
  'use strict';

  // ========== Mermaid 代码解析 ==========

  function cleanLabel (text) {
    if (!text) return '';
    return text
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<[^>]+>/g, '')
      .replace(/^"(.*)"$/, '$1')
      .replace(/^'(.*)'$/, '$1')
      .trim();
  }

  function parseNodeDef (def) {
    def = def.trim();
    const idMatch = def.match(/^([a-zA-Z_][a-zA-Z0-9_]*)/);
    if (!idMatch) {
      return { id: def, label: def, shape: 'rect' };
    }
    const id = idMatch[1];
    const shapePart = def.substring(id.length).trim();

    if (!shapePart) {
      return { id, label: id, shape: 'rect' };
    }

    let label = '';
    let shape = 'rect';

    const c0 = shapePart.charAt(0);
    const c1 = shapePart.charAt(1);

    if (c0 === '[' && c1 === '(') {
      const lm = shapePart.match(/^\[\((.*)\)\]$/s);
      label = lm ? cleanLabel(lm[1]) : id;
      shape = 'cylinder';
    } else if (c0 === '[' && c1 === '[') {
      const lm = shapePart.match(/^\[\[(.*)\]\]$/s);
      label = lm ? cleanLabel(lm[1]) : id;
      shape = 'subprocess';
    } else if (c0 === '(' && c1 === '[') {
      const lm = shapePart.match(/^\(\[(.*)\]\)$/s);
      label = lm ? cleanLabel(lm[1]) : id;
      shape = 'stadium';
    } else if (c0 === '{' && c1 === '{') {
      const lm = shapePart.match(/^\{\{(.*)\}\}$/s);
      label = lm ? cleanLabel(lm[1]) : id;
      shape = 'hexagon';
    } else if (c0 === '>') {
      const lm = shapePart.match(/^>([^\]]*)]$/s);
      label = lm ? cleanLabel(lm[1]) : id;
      shape = 'flag';
    } else if (c0 === '[') {
      const lm = shapePart.match(/^\[(.*)\]$/s);
      label = lm ? cleanLabel(lm[1]) : id;
      shape = 'rect';
    } else if (c0 === '(') {
      const lm = shapePart.match(/^\(\(?(.*?)\)?\)$/s) || shapePart.match(/^\((.*)\)$/s);
      label = lm ? cleanLabel(lm[1]) : id;
      shape = 'rounded';
    } else if (c0 === '{') {
      const lm = shapePart.match(/^\{(.*)\}$/s);
      label = lm ? cleanLabel(lm[1]) : id;
      shape = 'rhombus';
    } else {
      label = id;
      shape = 'rect';
    }

    return { id, label: label || id, shape };
  }

  function parseEdge (line, isStateDiagram = false) {
    const arrowRegex = /(-+\.?->?|=+\.?->?)/g;
    let match;
    const arrows = [];

    while ((match = arrowRegex.exec(line)) !== null) {
      arrows.push({ index: match.index, text: match[1], endIndex: match.index + match[0].length });
    }

    if (arrows.length === 0) return null;
    const arrow = arrows.reduce((max, a) => a.text.length > max.text.length ? a : max, arrows[0]);

    let beforeArrow = line.substring(0, arrow.index).trim();
    let afterArrow = line.substring(arrow.endIndex).trim();
    if (!beforeArrow || !afterArrow) return null;

    let fromDef = beforeArrow;
    let edgeLabel = '';

    const labelMatch = afterArrow.match(/^\|(.*)\|((?:.+)?)$/);
    if (labelMatch) {
      edgeLabel = cleanLabel(labelMatch[1]);
      afterArrow = labelMatch[2].trim();
    } else {
      const middleLabelMatch = beforeArrow.match(/^(.+?)\s+(--+|=+)\s*\|(.*)\|$/);
      if (middleLabelMatch) {
        fromDef = middleLabelMatch[1].trim();
        edgeLabel = cleanLabel(middleLabelMatch[3]);
      }
    }

    const toDef = afterArrow;
    let fromNode = isStateDiagram ? parseStateNode(fromDef, fromDef === '[*]') : parseNodeDef(fromDef);
    let toNode = isStateDiagram ? parseStateNode(toDef, toDef !== '[*]') : parseNodeDef(toDef);

    let arrowStyle = { style: 'solid', endArrow: 'classic' };
    if (arrow.text.includes('.')) arrowStyle.style = 'dashed';
    if (!arrow.text.includes('>')) arrowStyle.endArrow = 'none';

    return { from: fromNode, to: toNode, label: edgeLabel, arrow: arrowStyle };
  }

  function parseStateNode (def, isStart = true) {
    def = def.trim();
    if (def === '[*]') {
      return { id: isStart ? '__start__' : '__end__', label: isStart ? 'Start' : 'End', shape: isStart ? 'start' : 'end', isSpecial: true };
    }
    return { id: def, label: def, shape: 'rounded' };
  }

  function parseMermaid (code) {
    const nodes = {};
    const edges = [];
    const subgraphs = [];
    const nodeOrder = [];
    const diagramType = code.match(/^(flowchart|graph|stateDiagram)/i) ? code.match(/^(flowchart|graph|stateDiagram)/i)[1].toLowerCase() : 'flowchart';
    const isStateDiagram = diagramType === 'stateDiagram';

    const lines = code.split('\n');
    let currentSubgraph = null;
    const subgraphStack = [];

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i].trim();
      if (!line || line.startsWith('%%')) continue;
      if (/^(flowchart|graph|stateDiagram|classDef|class|style|linkStyle)/i.test(line)) continue;

      const sgMatch = line.match(/^subgraph\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*[\["]?([^"\]]*)[\]"]?$/i);
      if (sgMatch) {
        const sg = { id: sgMatch[1], title: sgMatch[2] || sgMatch[1], nodes: [], children: [] };
        subgraphs.push(sg);
        if (currentSubgraph) currentSubgraph.children.push(sg);
        subgraphStack.push(sg);
        currentSubgraph = sg;
        continue;
      }

      if (/^end$/i.test(line)) {
        subgraphStack.pop();
        currentSubgraph = subgraphStack.length > 0 ? subgraphStack[subgraphStack.length - 1] : null;
        continue;
      }

      const edge = parseEdge(line, isStateDiagram);
      if (edge) {
        if (!nodes[edge.from.id]) { nodes[edge.from.id] = edge.from; nodeOrder.push(edge.from.id); }
        if (!nodes[edge.to.id]) { nodes[edge.to.id] = edge.to; nodeOrder.push(edge.to.id); }
        if (currentSubgraph) {
          if (!currentSubgraph.nodes.includes(edge.from.id)) currentSubgraph.nodes.push(edge.from.id);
          if (!currentSubgraph.nodes.includes(edge.to.id)) currentSubgraph.nodes.push(edge.to.id);
        }
        edges.push({ from: edge.from.id, to: edge.to.id, label: edge.label, arrow: edge.arrow });
        continue;
      }

      const nodeOnlyMatch = line.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\s*([\[({{>].*?[\])}}>])$/);
      if (nodeOnlyMatch) {
        const nodeDef = parseNodeDef(line);
        if (!nodes[nodeDef.id]) { nodes[nodeDef.id] = nodeDef; nodeOrder.push(nodeDef.id); }
        if (currentSubgraph) {
          if (!currentSubgraph.nodes.includes(nodeDef.id)) currentSubgraph.nodes.push(nodeDef.id);
        }
      }
    }
    return { nodes, edges, subgraphs, nodeOrder, diagramType };
  }

  // ========== 终极重构：智能多维分支树状自适应网格排布引擎 ==========
  function calculateMultidimensionalLayout (parsed, direction) {
    const { nodes, edges, nodeOrder } = parsed;
    const nodeIds = Object.keys(nodes);

    const adj = {};
    const revAdj = {};
    nodeIds.forEach(id => { adj[id] = []; revAdj[id] = []; });

    edges.forEach(e => {
      if (adj[e.from] && !adj[e.from].includes(e.to)) adj[e.from].push(e.to);
      if (revAdj[e.to] && !revAdj[e.to].includes(e.from)) revAdj[e.to].push(e.from);
    });

    // 1. 基于最大路径拓扑深度测算垂直层级 (Row Index)
    const levels = {};
    function computeLevel (id, visited = new Set()) {
      if (levels[id] !== undefined) return levels[id];
      if (visited.has(id)) return 0; // 防止死循环回溯线
      visited.add(id);

      const parents = revAdj[id] || [];
      if (parents.length === 0) {
        levels[id] = 0;
        return 0;
      }
      let maxParentLevel = 0;
      parents.forEach(p => {
        maxParentLevel = Math.max(maxParentLevel, computeLevel(p, visited));
      });
      levels[id] = maxParentLevel + 1;
      return levels[id];
    }
    nodeIds.forEach(id => computeLevel(id));

    // 2. 核心大杀器：基于分支震荡拓扑分配水平网格列 (Column Index)
    const columns = {};
    const levelCounts = {}; // 记录每一层当前排到第几列了

    // 按照原始书写顺序遍历，保证主要骨架链条处于中轴线
    nodeOrder.forEach(id => {
      const lvl = levels[id];
      if (levelCounts[lvl] === undefined) {
        levelCounts[lvl] = 0;
      }

      // 如果这个节点是由于前置分叉出来的（例如清关失败线、售后处理线）
      const parents = revAdj[id] || [];
      if (parents.length > 0) {
        const primaryParent = parents[0];
        const pCol = columns[primaryParent] || 0;
        const siblings = adj[primaryParent] || [];

        if (siblings.length > 1) {
          // 当前节点是多路分叉中的一个
          const branchIdx = siblings.indexOf(id);
          if (branchIdx === 0) {
            columns[id] = pCol; // 主链路继续居中
          } else {
            // 分支链路向右平移震荡，留出巨大的安全网格列
            columns[id] = pCol + branchIdx * 2.5;
          }
        } else {
          columns[id] = pCol; // 单线传承，继承父节点的水平列
        }
      } else {
        columns[id] = levelCounts[lvl];
      }

      // 保证每一层由于分叉平移而引起的数据不会发生局部碰撞
      if (columns[id] < levelCounts[lvl]) {
        columns[id] = levelCounts[lvl];
      }
      levelCounts[lvl] = columns[id] + 1.2; // 推进该层水位线
    });

    // 3. 将网格矩阵坐标转换为 Draw.io 的高精像素物理坐标
    const positions = {};
    const isHorizontal = direction === 'LR' || direction === 'RL';

    // 设置超大呼吸感的间距：垂直层高 160px，分支侧向彻底拉开 280px
    const rowGap = 160;
    const colGap = 280;

    nodeIds.forEach(id => {
      const row = levels[id];
      const col = columns[id] || 0;

      positions[id] = {
        x: isHorizontal ? row * rowGap + 100 : col * colGap + 120,
        y: isHorizontal ? col * colGap + 100 : row * rowGap + 150,
        width: 140,
        height: 55
      };
    });

    return positions;
  }

  function xmlEscape (str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function getShapeStyle (shape) {
    switch (shape) {
      case 'start': return 'ellipse;whiteSpace=wrap;html=1;aspect=fixed;fillColor=#333333;fontColor=#FFFFFF;strokeColor=none;';
      case 'end': return 'ellipse;whiteSpace=wrap;html=1;aspect=fixed;fillColor=#111111;strokeWidth=3;strokeColor=#000000;';
      case 'rounded': return 'rounded=1;whiteSpace=wrap;html=1;arcSize=15;fillColor=#f5f5f5;strokeColor=#666666;fontSize=13;fontColor=#333333;';
      case 'rhombus': return 'rhombus;whiteSpace=wrap;html=1;fillColor=#fff2cc;strokeColor=#d6b656;fontSize=13;fontColor=#333333;';
      case 'hexagon': return 'shape=hexagon;perimeter=hexagonPerimeter2;whiteSpace=wrap;html=1;fixedSize=1;fillColor=#dae8fc;strokeColor=#6c8ebf;fontSize=13;';
      case 'cylinder': return 'shape=cylinder3;whiteSpace=wrap;html=1;boundedLbl=1;backgroundOutline=1;size=15;fillColor=#e1d5e7;strokeColor=#b85450;fontSize=13;';
      case 'subprocess': return 'shape=process;whiteSpace=wrap;html=1;backgroundOutline=1;fillColor=#f8cecc;strokeColor=#b85450;fontSize=13;';
      case 'stadium': return 'rounded=1;whiteSpace=wrap;html=1;arcSize=50;fillColor=#d5e8d4;strokeColor=#82b366;fontSize=13;';
      case 'flag': return 'shape=flag;whiteSpace=wrap;html=1;fillColor=#fff2cc;strokeColor=#d6b656;fontSize=13;';
      default: return 'rounded=0;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=#333333;fontSize=13;';
    }
  }

  function generateDrawioXml (parsed, direction) {
    const { nodes, edges, subgraphs } = parsed;

    // 调用智能网格排布引擎分配无损物理坐标
    const finalCoords = calculateMultidimensionalLayout(parsed, direction);

    let cellId = 2;
    const idMap = {};
    Object.keys(nodes).forEach(id => { idMap[id] = String(cellId++); });

    const sgIdMap = {};
    subgraphs.forEach(sg => { sgIdMap[sg.id] = String(cellId++); });

    let cellsXml = '';

    // 1. 动态自适应围合并收紧 Subgraph 子图泳道大包围盒
    subgraphs.forEach(sg => {
      const sgCellId = sgIdMap[sg.id];
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

      sg.nodes.forEach(nid => {
        const pos = finalCoords[nid];
        if (pos) {
          if (pos.x < minX) minX = pos.x;
          if (pos.y < minY) minY = pos.y;
          if (pos.x + pos.width > maxX) maxX = pos.x + pos.width;
          if (pos.y + pos.height > maxY) maxY = pos.y + pos.height;
        }
      });

      if (minX === Infinity) { minX = 100; minY = 100; maxX = 500; maxY = 700; }

      // 为子图边框留出完美的透气填充内边距
      const paddingX = 70;
      const paddingY = 80;
      const width = (maxX - minX) + paddingX * 2;
      const height = (maxY - minY) + paddingY * 2;

      sg.box = { x: minX - paddingX, y: minY - paddingY, width, height };

      const sgStyle = 'swimlane;fontStyle=1;align=center;startSize=30;horizontal=1;html=1;collapsible=0;whiteSpace=wrap;container=1;fillColor=#Fcfcfc;strokeColor=#b3b3b3;strokeWidth=1.5;';
      cellsXml += `        <mxCell id="${sgCellId}" value="${xmlEscape(sg.title)}" style="${sgStyle}" vertex="1" parent="1">\n`;
      cellsXml += `          <mxGeometry x="${sg.box.x}" y="${sg.box.y}" width="${width}" height="${height}" as="geometry" />\n`;
      cellsXml += `        </mxCell>\n`;
    });

    // 2. 生成带有【标准 Draw.io 相对嵌套子图坐标系】的流程图形节点
    Object.keys(nodes).forEach(id => {
      const node = nodes[id];
      const nodeId = idMap[id];
      const style = getShapeStyle(node.shape);
      let label = node.isSpecial ? '' : xmlEscape(node.label);

      let parentId = '1';
      let pos = finalCoords[id] || { x: 150, y: 150, width: 140, height: 55 };

      // 关键破解：如果节点从属子图，强制剪掉子图容器左上角坐标，转换成局部相对空间坐标
      for (const sg of subgraphs) {
        if (sg.nodes.includes(id) && sg.box) {
          parentId = sgIdMap[sg.id];
          pos = {
            x: Math.max(30, pos.x - sg.box.x),
            y: Math.max(55, pos.y - sg.box.y), // 完美避开子图顶部的文字栏（30px）
            width: pos.width,
            height: pos.height
          };
          break;
        }
      }

      cellsXml += `        <mxCell id="${nodeId}" value="${label}" style="${style}" vertex="1" parent="${parentId}">\n`;
      cellsXml += `          <mxGeometry x="${pos.x}" y="${pos.y}" width="${pos.width}" height="${pos.height}" as="geometry" />\n`;
      cellsXml += `        </mxCell>\n`;
    });

    // 3. 生成具备智能直角自动寻路、避让机制的完美连接线
    edges.forEach(edge => {
      const eid = String(cellId++);
      const fromId = idMap[edge.from];
      const toId = idMap[edge.to];
      if (!fromId || !toId) return;

      // orthogonalEdgeStyle 会引导线段像画电路板一样走直角平滑绕开障碍，绝不交叠
      let edgeStyle = 'edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=#555555;strokeWidth=1.5;fontSize=12;fontColor=#666666;';
      if (edge.arrow.style === 'dashed') edgeStyle += 'dashed=1;';
      if (edge.arrow.endArrow === 'none') edgeStyle += 'endArrow=none;';

      const label = edge.label ? xmlEscape(edge.label) : '';

      cellsXml += `        <mxCell id="${eid}" value="${label}" style="${edgeStyle}" edge="1" parent="1" source="${fromId}" target="${toId}">\n`;
      cellsXml += `          <mxGeometry relative="1" as="geometry" />\n`;
      cellsXml += `        </mxCell>\n`;
    });

    return `<?xml version="1.0" encoding="UTF-8"?>
<mxfile host="mermaid-to-drawio">
  <diagram name="Mermaid Flowchart" id="mermaid-flowchart">
    <mxGraphModel dx="1422" dy="762" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="6000" pageHeight="6000" math="0" shadow="0">
      <root>
        <mxCell id="0" />
        <mxCell id="1" parent="0" />
${cellsXml}
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>`;
  }

  function detectDirection (code) {
    const match = code.match(/^(?:flowchart|graph)\s+(TD|TB|BT|LR|RL)/im);
    return match ? match[1].toUpperCase() : 'TD';
  }

  function exportToDrawio () {
    try {
      const mermaidDataElement = document.getElementById('mermaid-data');
      if (!mermaidDataElement) {
        alert('未找到 Mermaid 代码数据');
        return;
      }

      const code = mermaidDataElement.textContent.trim();
      if (!code) return;

      const direction = detectDirection(code);
      const parsed = parseMermaid(code);
      if (Object.keys(parsed.nodes).length === 0) {
        alert('未解析到有效流程图节点');
        return;
      }

      // 启动自研多维网格算法进行高精度布局生成
      const xml = generateDrawioXml(parsed, direction);

      const title = mermaidDataElement.getAttribute('data-title') || 'mermaid-chart';
      const fileName = title.replace(/[^\u4e00-\u9fa5a-zA-Z0-9_-]/g, '_') + '.drawio';

      const blob = new Blob([xml], { type: 'application/xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = fileName;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);

      console.log('Draw.io 精美立体拓扑文件导出成功:', fileName);
    } catch (error) {
      console.error(error);
      alert('导出失败: ' + error.message);
    }
  }

  function init () {
    const exportDrawioBtn = document.getElementById('export-drawio-btn');
    if (exportDrawioBtn) {
      exportDrawioBtn.addEventListener('click', exportToDrawio);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();