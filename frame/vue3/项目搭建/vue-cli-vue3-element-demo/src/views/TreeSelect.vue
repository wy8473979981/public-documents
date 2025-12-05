<template>
  <el-tree-select
    v-model="valueStrictly"
    :data="data"
    multiple
    show-checkbox
    check-strictly
    check-on-click-node
    style="width: 300px"
    clearable
    @check-change="handleCheckChange"
  />
</template>

<script setup>
import { ref, reactive } from 'vue';

const valueStrictly = ref([]);

// 响应式节点，带 disabled
function makeReactiveTree(nodes) {
  return nodes.map((node) => {
    const newNode = reactive({ ...node, disabled: false });
    if (node.children) newNode.children = makeReactiveTree(node.children);
    return newNode;
  });
}

const data = ref(
  makeReactiveTree([
    {
      value: '1',
      label: 'Level one 1',
      children: [
        {
          value: '1-1',
          label: 'Level two 1-1',
          children: [
            { value: '1-1-1', label: 'Level three 1-1-1' },
            { value: '1-1-2', label: 'Level three 1-1-2' }
          ]
        }
      ]
    },
    {
      value: '2',
      label: 'Level one 2',
      children: [
        {
          value: '2-1',
          label: 'Level two 2-1',
          children: [{ value: '2-1-1', label: 'Level three 2-1-1' }]
        },
        {
          value: '2-2',
          label: 'Level two 2-2',
          children: [{ value: '2-2-1', label: 'Level three 2-2-1' }]
        }
      ]
    }
  ])
);

// 遍历树
function traverseTree(nodes, callback) {
  nodes.forEach((node) => {
    callback(node);
    if (node.children) traverseTree(node.children, callback);
  });
}

// 根据 value 查找节点
function findNodeByValue(nodes, select) {
  for (let node of nodes) {
    if (node.value === select.value) return node;
    if (node.children) {
      const found = findNodeByValue(node.children, select);
      if (found) return found;
    }
  }
  return null;
}

// 处理选中变化
function handleCheckChange(select, checked) {
  const node = findNodeByValue(data.value, select);
  if (!node) return;

  // 如果父节点有子节点
  if (node.children && node.children.length > 0) {
    traverseTree(node.children, (child) => {
      // 设置子节点禁用状态
      child.disabled = checked;

      if (checked) {
        // 父选中 → 子节点加入 v-model
        if (!valueStrictly.value.includes(child.value)) valueStrictly.value.push(child.value);
      } else {
        // 父取消 → 子节点从 v-model 移除
        valueStrictly.value = valueStrictly.value.filter((v) => v !== child.value);
        child.disabled = false;
      }
    });

    // 强制刷新 v-model，使组件渲染更新选中状态
    valueStrictly.value = [...valueStrictly.value];

    console.log(valueStrictly.value);
  }
}
</script>
