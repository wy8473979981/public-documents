<template>
  <div>
    <el-cascader
      v-model="selectedOptions"
      :options="options"
      :props="props"
      clearable
      collapse-tags
      collapse-tags-tooltip
      @change="handleChange"
      @clear="handleClear"
    />
    <pre>{{ selectedOptions }}</pre>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';

const props = { multiple: true, emitPath: true, checkStrictly: true };
const selectedOptions = ref([]);
const summaryFromBackend = [
  { id: 1, label: 'Asia', level: 0, isSelectAll: true },
  { id: 15, label: 'France', level: 1, isSelectAll: true },
  { id: 21, label: 'Birmingham', level: 2, isLeaf: true },
  { id: 23, label: 'North America', level: 0, isSelectAll: true }
];

const options = reactive([
  {
    value: 11111,
    label: 'Asia',
    parentId: '',
    children: [
      {
        value: 2,
        label: 'China',
        parentId: 1,
        children: [
          { value: 3, parentId: 2, label: 'Beijing' },
          { value: 4, parentId: 2, label: 'Shanghai' },
          { value: 5, parentId: 2, label: 'Hangzhou' }
        ]
      },
      {
        value: 6,
        label: 'Japan',
        parentId: 1,
        children: [
          { value: 7, parentId: 6, label: 'Tokyo' },
          { value: 8, parentId: 6, label: 'Osaka' },
          { value: 9, parentId: 6, label: 'Kyoto' }
        ]
      },
      {
        value: 10,
        label: 'Korea',
        parentId: 1,
        children: [
          { value: 11, parentId: 10, label: 'Seoul' },
          { value: 12, parentId: 10, label: 'Busan' },
          { value: 13, parentId: 10, label: 'Taegu' }
        ]
      }
    ]
  },
  {
    value: 14,
    label: 'Europe',
    parentId: '',
    children: [
      {
        value: 15,
        label: 'France',
        parentId: 14,
        children: [
          { value: 16, parentId: 15, label: 'Paris' },
          { value: 17, parentId: 15, label: 'Marseille' },
          { value: 18, parentId: 15, label: 'Lyon' }
        ]
      },
      {
        value: 19,
        label: 'UK',
        parentId: 14,
        children: [
          { value: 20, parentId: 19, label: 'London' },
          { value: 21, parentId: 19, label: 'Birmingham' },
          { value: 22, parentId: 19, label: 'Manchester' }
        ]
      }
    ]
  },
  {
    value: 23,
    label: 'North America',
    parentId: '',
    children: [
      {
        value: 24,
        label: 'US',
        parentId: 23,
        children: [
          { value: 25, parentId: 24, label: 'New York' },
          { value: 26, parentId: 24, label: 'Los Angeles' },
          { value: 27, parentId: 24, label: 'Washington' }
        ]
      },
      {
        value: 28,
        label: 'Canada',
        parentId: 23,
        children: [
          { value: 29, parentId: 28, label: 'Toronto' },
          { value: 30, parentId: 28, label: 'Montreal' },
          { value: 31, parentId: 28, label: 'Ottawa' }
        ]
      }
    ]
  }
]);

onMounted(() => {
  // 1. 更新 summary 的 id
  const updatedSummary = updateSummaryIds(summaryFromBackend, options);

  // 2. 根据新的 summary 生成 cascader v-model
  selectedOptions.value = convertSummaryToPaths(options, updatedSummary);

  // 3. 遍历 summary，把 isSelectAll 的节点子孙禁用
  updatedSummary.forEach((item) => {
    if (item.isSelectAll) {
      const node = findNode(options, item.id);
      if (node) {
        setDisabled(node, true);
      }
    }
  });

  console.log('summaryFromBackend:', summaryFromBackend);
  console.log('updatedSummary:', updatedSummary);
  console.log('selectedOptions:', JSON.stringify(selectedOptions.value));
});

const serialize = (p) => p.join(',');

function deepClone(x) {
  return JSON.parse(JSON.stringify(x));
}

function findPathByLabel(nodes, label, currentPath = []) {
  for (const node of nodes) {
    const newPath = [...currentPath, node.value];
    if (node.label === label) {
      return newPath; // ✅ 找到后返回完整路径
    }
    if (node.children) {
      const found = findPathByLabel(node.children, label, newPath);
      if (found) return found;
    }
  }
  return null;
}

function updateSummaryIds(summary, options) {
  return summary.map((item) => {
    const path = findPathByLabel(options, item.label);
    if (path) {
      return { ...item, id: path[path.length - 1], path };
    }
    return item;
  });
}

function convertSummaryToPaths(options, summary) {
  const paths = [];

  summary.forEach((item) => {
    if (!item.path) return;

    if (item.isSelectAll) {
      const node = findNode(options, item.id);
      if (!node) return;
      const nodePaths = collectPaths(node, item.path.slice(0, -1));
      paths.push(...nodePaths);
    } else if (item.isLeaf) {
      paths.push(item.path); // ✅ 直接用完整路径
    }
  });

  return paths;
}

// 工具函数：找到节点
function findNode(nodes, val) {
  for (const node of nodes) {
    if (node.value === val) return node;
    if (node.children) {
      const res = findNode(node.children, val);
      if (res) return res;
    }
  }
  return null;
}
// 工具函数：收集自己 + 所有子孙路径（包含中间节点）
function collectPaths(node, parentPath = []) {
  const currentPath = [...parentPath, node.value];
  let result = [currentPath]; // 先收自己
  if (node.children) {
    node.children.forEach((child) => {
      result = result.concat(collectPaths(child, currentPath));
    });
  }
  return result;
}

// 工具函数：设置子孙节点 disabled
function setDisabled(node, disabled) {
  if (node.children) {
    node.children.forEach((child) => {
      child.disabled = disabled;
      setDisabled(child, disabled);
    });
  }
}

const prevSelected = ref([]);

function handleClear() {
  debugger;
  prevSelected.value = [];
  selectedOptions.value = [];
  options.forEach((node) => setDisabled(node, false));
  leafCache.clear();
  console.log('已清空选择');
}

function handleChange(paths) {
  debugger;

  const curr = deepClone(paths || []);
  const prev = deepClone(prevSelected.value || []);

  const prevSet = new Set(prev.map(serialize));
  const currSet = new Set(curr.map(serialize));
  debugger;

  // 找出新增和移除的路径
  const added = curr.filter((p) => !prevSet.has(serialize(p)));
  const removed = prev.filter((p) => !currSet.has(serialize(p)));

  let toggledPath = null;
  let action = null;

  if (added.length === 1 && removed.length === 0) {
    toggledPath = added[0];
    action = 'select';
  } else if (removed.length === 1 && added.length === 0) {
    toggledPath = removed[0];
    action = 'deselect';
  } else if (added.length > 0) {
    toggledPath = added.reduce((a, b) => (a.length <= b.length ? a : b));
    action = 'select';
  } else if (removed.length > 0) {
    toggledPath = removed.reduce((a, b) => (a.length <= b.length ? a : b));
    action = 'deselect';
  }

  // 通过最后一个 value 找到节点对象
  const nodeVal = toggledPath[toggledPath.length - 1];
  const node = findNode(options, nodeVal);
  const parentPath = toggledPath.slice(0, -1);
  debugger;

  console.log('点击的节点:', node.label, '| 操作:', action);
  console.log('完整路径:', toggledPath);

  // 递归收集点击节点的自己和子孙节点的所有路径
  const allPaths = collectPaths(node, parentPath);
  console.log(JSON.stringify(allPaths));
  debugger;
  if (action === 'select') {
    // 父节点被选中 → 设置禁用 + 选中所有子孙
    setDisabled(node, true);
    selectedOptions.value = [
      ...selectedOptions.value,
      ...allPaths.filter((p) => !selectedOptions.value.some((sel) => sel.join() === p.join()))
    ];
  } else if (action === 'deselect') {
    // 父节点被取消 → 解除禁用 + 移除子孙
    setDisabled(node, false);
    selectedOptions.value = selectedOptions.value.filter(
      (p) => !allPaths.some((ap) => ap.join() === p.join())
    );
  }

  prevSelected.value = deepClone(selectedOptions.value);

  console.log(
    'selectedOptions',
    JSON.stringify(selectedOptions.value),
    JSON.parse(JSON.stringify(selectedOptions.value)),
    JSON.parse(JSON.stringify(prevSelected.value))
  );

  // 每次变化时重置缓存
  leafCache.clear();

  // 所有选中的叶子节点集合
  const selectedLeafSet = new Set(selectedOptions.value.map((path) => path[path.length - 1]));

  // 遍历所有根节点，生成扁平 summary
  const summary = [];
  for (const root of options) {
    const s = summarizeNode(root, selectedLeafSet);
    if (s.length > 0) summary.push(...s);
  }

  console.log('整理后的结果:', JSON.stringify(summary));
}
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
</script>
