<template>
  <div class="about">
    <h1>This is an about page</h1>
    <el-cascader
      v-model="selectedOptions"
      :options="options"
      :props="props"
      collapse-tags
      collapse-tags-tooltip
      clearable
      @change="handleChange"
    />
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';

const selectedOptions = ref([]);
const props = { multiple: true, emitPath: true, checkStrictly: false };

const summaryFromBackend = [
  { id: 1, label: 'Asia', level: 0, isSelectAll: true },
  { id: 15, label: 'France', level: 0, isSelectAll: true },
  { id: 21, label: 'Birmingham', level: 2, isLeaf: true },
  { id: 23, label: 'North America', level: 0, isSelectAll: true }
];

// 示例 options，可按你实际情况替换
const options = [
  {
    value: 11111,
    label: 'Asia',
    children: [
      {
        value: 2,
        label: 'China',
        children: [
          { value: 3, label: 'Beijing' },
          { value: 4, label: 'Shanghai' },
          { value: 5, label: 'Hangzhou' }
        ]
      },
      {
        value: 6,
        label: 'Japan',
        children: [
          { value: 7, label: 'Tokyo' },
          { value: 8, label: 'Osaka' },
          { value: 9, label: 'Kyoto' }
        ]
      },
      {
        value: 10,
        label: 'Korea',
        children: [
          { value: 11, label: 'Seoul' },
          { value: 12, label: 'Busan' },
          { value: 13, label: 'Taegu' }
        ]
      }
    ]
  },
  {
    value: 14,
    label: 'Europe',
    children: [
      {
        value: 15,
        label: 'France',
        children: [
          { value: 16, label: 'Paris' },
          { value: 17, label: 'Marseille' },
          { value: 18, label: 'Lyon' }
        ]
      },
      {
        value: 19,
        label: 'UK',
        children: [
          { value: 20, label: 'London' },
          { value: 21, label: 'Birmingham' },
          { value: 22, label: 'Manchester' }
        ]
      }
    ]
  },
  {
    value: 23,
    label: 'North America',
    children: [
      {
        value: 24,
        label: 'US',
        children: [
          { value: 25, label: 'New York' },
          { value: 26, label: 'Los Angeles' },
          { value: 27, label: 'Washington' }
        ]
      },
      {
        value: 28,
        label: 'Canada',
        children: [
          { value: 29, label: 'Toronto' },
          { value: 30, label: 'Montreal' },
          { value: 31, label: 'Ottawa' }
        ]
      }
    ]
  }
];

onMounted(() => {
  // 1. 更新 summary 的 id
  const updatedSummary = updateSummaryIds(summaryFromBackend, options);

  // 2. 根据新的 summary 生成 cascader v-model
  selectedOptions.value = convertSummaryToPaths(options, updatedSummary);

  console.log('summaryFromBackend:', summaryFromBackend);
  console.log('updatedSummary:', updatedSummary);
  console.log('selectedOptions:', selectedOptions.value);
});

function findNodeIdByLabelAndLevel(nodes, label, level, currentLevel = 0) {
  for (const node of nodes) {
    if (node.label === label && currentLevel === level) return node.value;
    if (node.children) {
      const found = findNodeIdByLabelAndLevel(node.children, label, level, currentLevel + 1);
      if (found !== undefined) return found;
    }
  }
  return undefined;
}

function updateSummaryIds(summary, options) {
  return summary.map((item) => {
    const newId = findNodeIdByLabelAndLevel(options, item.label, item.level);
    if (newId !== undefined) {
      return { ...item, id: newId }; // 替换 id
    }
    return item;
  });
}

// 根据 id 找到节点对象
function findNodeById(nodes, id) {
  for (const node of nodes) {
    if (node.value === id) return node;
    if (node.children) {
      const found = findNodeById(node.children, id);
      if (found) return found;
    }
  }
  return null;
}

// 找叶子节点路径
function findPathsByIdForLeaf(nodes, leafId, currentPath = []) {
  let paths = [];
  for (const node of nodes) {
    const path = [...currentPath, node.value];
    if (!node.children && node.value === leafId) {
      paths.push(path);
    } else if (node.children) {
      paths.push(...findPathsByIdForLeaf(node.children, leafId, path));
    }
  }
  return paths;
}

// 根据 summary 转 v-model
function convertSummaryToPaths(options, summary) {
  const paths = [];

  summary.forEach((item) => {
    if (item.isSelectAll) {
      const node = findNodeById(options, item.id);
      if (!node) return;
      const leafIds = getAllLeafIds(node);
      leafIds.forEach((leafId) => {
        const leafPaths = findPathsByIdForLeaf(options, leafId);
        paths.push(...leafPaths);
      });
    } else if (item.isLeaf) {
      const leafPaths = findPathsByIdForLeaf(options, item.id);
      paths.push(...leafPaths);
    }
  });

  return paths;
}

// 使用 Map 替代 WeakMap，避免 clear() 报错
let leafCache = new Map();
function getAllLeafIds(node) {
  if (leafCache.has(node)) return leafCache.get(node);
  const ids = [];
  if (!node.children || node.children.length === 0) {
    ids.push(node.value);
  } else {
    for (const c of node.children) {
      ids.push(...getAllLeafIds(c));
    }
  }
  leafCache.set(node, ids);
  return ids;
}

// 递归生成 summary
function summarizeNode(node, selectedLeafSet, level = 0) {
  const isLeaf = !node.children || node.children.length === 0;

  if (isLeaf) {
    return selectedLeafSet.has(node.value)
      ? [{ id: node.value, label: node.label, level, isLeaf: true }]
      : [];
  }

  const res = [];
  for (const child of node.children) {
    res.push(...summarizeNode(child, selectedLeafSet, level + 1));
  }

  const allLeafIds = getAllLeafIds(node);
  const nodeAllSelected = allLeafIds.every((id) => selectedLeafSet.has(id));

  if (nodeAllSelected) {
    return [{ id: node.value, label: node.label, level, isSelectAll: true }];
  }

  return res;
}

function handleChange(value) {
  console.log('selectedOptions changed:', value);

  // 每次变化时重置缓存
  leafCache.clear();

  // 所有选中的叶子节点集合
  const selectedLeafSet = new Set(value.map((path) => path[path.length - 1]));

  // 遍历所有根节点，生成扁平 summary
  const summary = [];
  for (const root of options) {
    const s = summarizeNode(root, selectedLeafSet);
    if (s.length > 0) summary.push(...s);
  }

  console.log('整理后的结果:', JSON.stringify(summary));
}
</script>
