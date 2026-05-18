# G6 思维导图示例使用说明

## 概述

本项目已成功安装并配置了 AntV G6 图形可视化库，并创建了一个完整的思维导图（MindMap）示例。

## 已完成的工作

### 1. G6 库安装
- 项目中已安装 `@antv/g6` 版本 5.0.50
- 位置：`package.json` 中的 dependencies

### 2. 创建思维导图组件
- **文件路径**：`src/components/MindMapDemo.vue`
- **功能特性**：
  - 自定义思维导图节点样式（根节点和普通节点）
  - 支持节点展开/折叠功能
  - 支持动态添加子节点
  - 自动为不同分支分配颜色
  - 鼠标悬停显示操作图标
  - 显示折叠节点的子节点数量
  - 支持画布拖拽和缩放

### 3. 路由配置
- **路由路径**：`/mindmap-demo`
- **路由名称**：`mindmap-demo`
- 已在 `src/router/index.js` 中配置
- 已在 `src/App.vue` 中添加导航链接

### 4. 核心功能实现

#### 自定义节点（MindmapNode）
- 继承自 `BaseNode`
- 支持根节点和普通节点的不同样式
- 包含折叠/展开按钮
- 包含添加子节点按钮
- 显示折叠节点的子节点计数

#### 自定义边（MindmapEdge）
- 继承自 `CubicHorizontal`
- 使用水平三次贝塞尔曲线
- 根据目标节点调整边的长度

#### 交互行为（CollapseExpandTree）
- 鼠标进入节点时显示操作图标
- 鼠标离开节点时隐藏操作图标
- 支持点击折叠/展开节点
- 支持点击添加子节点

#### 数据转换（AssignColorByBranch）
- 自动为不同分支分配不同的颜色
- 使用预定义的颜色 palette

## 使用方法

### 访问方式
1. 启动开发服务器：
   ```bash
   npm run serve
   ```

2. 在浏览器中访问：
   - 本地地址：http://localhost:8081/
   - 点击导航栏中的 "MindMap Demo" 链接
   - 或直接访问：http://localhost:8081/mindmap-demo

### 交互操作
- **拖拽画布**：按住鼠标左键拖动
- **缩放画布**：使用鼠标滚轮
- **展开/折叠节点**：点击节点右侧/左侧的圆形按钮
- **查看子节点数量**：折叠状态下，按钮上会显示子节点数量
- **添加子节点**：鼠标悬停在节点上，点击 "+" 按钮
- **悬停显示图标**：鼠标移动到节点上会显示操作图标

## 数据来源

示例从以下 URL 加载测试数据：
```
https://assets.antv.antgroup.com/g6/algorithm-category.json
```

这是一个算法分类的树形结构数据。

## 技术要点

### 注册的扩展
```javascript
register(ExtensionCategory.NODE, 'mindmap', MindmapNode);
register(ExtensionCategory.EDGE, 'mindmap', MindmapEdge);
register(ExtensionCategory.BEHAVIOR, 'collapse-expand-tree', CollapseExpandTree);
register(ExtensionCategory.TRANSFORM, 'assign-color-by-branch', AssignColorByBranch);
```

### 布局配置
- 类型：`indented`（缩进布局）
- 方向：`LR`（从左到右）
- 节点间距：30px
- 垂直间距：10px

### 样式配置
- **根节点**：
  - 背景色：#EFF0F0
  - 字体大小：24px
  - 高度：48px
  
- **普通节点**：
  - 背景透明
  - 字体大小：16px
  - 高度：32px

## 注意事项

1. **Iconfont 依赖**：组件会自动加载 AntV 的 iconfont 样式
2. **数据加载**：首次加载需要从网络获取数据，请确保网络连接正常
3. **性能优化**：组件在卸载时会自动销毁 Graph 实例，避免内存泄漏
4. **浏览器兼容性**：建议使用现代浏览器（Chrome、Firefox、Edge 等）

## 相关文件

- 组件文件：`src/components/MindMapDemo.vue`
- 路由配置：`src/router/index.js`
- 应用入口：`src/App.vue`
- 原有 G6 示例：`src/components/G6Demo.vue`

## 扩展建议

如果需要进一步定制，可以：
1. 修改颜色方案：调整 `AssignColorByBranch` 中的 colors 数组
2. 自定义节点样式：修改 `RootNodeStyle` 和 `NodeStyle`
3. 更改布局方式：修改 layout 配置
4. 添加更多交互行为：在 behaviors 数组中添加
5. 使用本地数据：替换 fetch 调用为本地数据
