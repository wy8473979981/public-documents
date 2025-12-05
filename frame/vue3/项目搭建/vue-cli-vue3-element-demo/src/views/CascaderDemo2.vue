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
    />
    <pre>{{ selectedOptions }}</pre>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';

const selectedOptions = ref([
  [1],
  [1, 2],
  [1, 2, 3],
  [1, 2, 4],
  [1, 2, 5],
  [1, 6],
  [1, 6, 7],
  [1, 6, 8],
  [1, 6, 9],
  [1, 10],
  [1, 10, 11],
  [1, 10, 12],
  [1, 10, 13],
  [14, 15],
  [14, 15, 16],
  [14, 15, 17],
  [14, 15, 18],
  [14, 19],
  [14, 19, 20],
  [14, 19, 21],
  [14, 19, 22]
]);
const props = { multiple: true, emitPath: true, checkStrictly: true };

// 给每个节点加 disabled 字段（必须响应式）
function markTree(nodes) {
  return nodes.map((n) => ({
    ...n,
    disabled: false,
    children: n.children ? markTree(n.children) : undefined
  }));
}

const options = reactive(
  markTree([
    {
      value: 1,
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
    }
  ])
);

const serialize = (p) => p.join(',');

function deepClone(x) {
  return JSON.parse(JSON.stringify(x));
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

function handleChange(paths) {
  if (paths.length === 0) {
    // 重置
    prevSelected.value = [];
    selectedOptions.value = [];
    options.forEach((node) => {
      setDisabled(node, false);
    });
    return;
  }

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
}
</script>
