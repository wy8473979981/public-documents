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

const selectedOptions = ref([]);
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
  console.log('paths', JSON.stringify(paths), JSON.stringify(prevSelected.value));

  if (prevSelected.value.length > paths.length) {
    const nodeVal = difference(prevSelected.value, paths);
    console.log('nodeVal', nodeVal);
  }
  debugger;
  // 取最后一次操作的那个节点
  const lastPath = paths[paths.length - 1];
  if (!lastPath) return;
  const nodeVal = lastPath[lastPath.length - 1];
  const node = findNode(options, nodeVal);
  if (!node) return;

  const allPaths = collectPaths(node, lastPath.slice(0, -1));
  debugger;
  if (selectedOptions.value.some((p) => p[p.length - 1] === node.value)) {
    // 父节点被选中 → 设置禁用 + 选中所有子孙
    setDisabled(node, true);
    selectedOptions.value = [
      ...selectedOptions.value,
      ...allPaths.filter((p) => !selectedOptions.value.some((sel) => sel.join() === p.join()))
    ];
  } else {
    // 父节点被取消 → 解除禁用 + 移除子孙
    setDisabled(node, false);
    selectedOptions.value = selectedOptions.value.filter(
      (p) => !allPaths.some((ap) => ap.join() === p.join())
    );
  }

  prevSelected.value = selectedOptions.value;
  console.log('selected', selectedOptions.value);
}

// 序列化数组为字符串
const serialize = (arr) => arr.map((a) => a.join(','));

// 找差集
// keys1 中有而 keys2 没有
function difference(arr1, arr2) {
  const set2 = new Set(serialize(arr2));
  const arr = arr1.filter((a) => !set2.has(a.join(',')));

  const lastPath = arr[arr.length - 1];
  if (!lastPath) return;
  const nodeVal = lastPath[lastPath.length - 1];
  return nodeVal;
}
</script>
