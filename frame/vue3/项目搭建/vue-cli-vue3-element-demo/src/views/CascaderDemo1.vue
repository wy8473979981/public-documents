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

/* ------------------ state ------------------ */
const selectedOptions = ref([]);
const prevSelected = ref([]);

const props = { multiple: true, emitPath: true, checkStrictly: true };

/* ------------------ 树数据 ------------------ */
const options = reactive([
  {
    value: 1,
    label: 'Asia',
    children: [
      { value: 2, label: 'China' },
      { value: 3, label: 'Japan' }
    ]
  },
  {
    value: 4,
    label: 'Europe',
    children: [
      { value: 5, label: 'France' },
      { value: 6, label: 'UK' }
    ]
  }
]);

/* ------------------ 工具函数 ------------------ */
const serialize = (p) => p.join(',');

function deepClone(x) {
  return JSON.parse(JSON.stringify(x));
}

// 根据 value 查找节点对象
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

/* ------------------ change 处理 ------------------ */
function handleChange(paths) {
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

  console.log('点击的节点:', node.label, '| 操作:', action);
  console.log('完整路径:', toggledPath);

  // 这里可以加你父子联动的逻辑，比如：
  // if (node.children) { ... 禁用子节点 / 选中子节点 ... }

  prevSelected.value = deepClone(curr);
}
</script>
