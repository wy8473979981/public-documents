<template>
  <div>
    <el-cascader
      v-model="selectedOptions"
      :options="currentOptions"
      :props="props"
      clearable
      collapse-tags
      collapse-tags-tooltip
      @change="handleChange"
      @clear="handleClear"
    >
      <template #header>
        <el-radio-group v-model="radio1" @change="handleRadioChange">
          <el-radio value="person_knowledge_base" size="large">个人智库</el-radio>
          <el-radio value="company_knowledge_base" size="large">企业智库</el-radio>
        </el-radio-group>
      </template>
      <template #footer>
        <el-button link size="small" @click="handleClear">清空</el-button>
      </template>
    </el-cascader>
    <pre>{{ selectedOptions }}</pre>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { locationOptions } from '@/data/locationData'; // 导入数据

const radio1 = ref('person_knowledge_base');
const props = {
  value: 'id',
  label: 'folder_name',
  multiple: true,
  emitPath: true,
  checkStrictly: true
};
const selectedOptions = ref([]);
// const summaryFromBackend = [
//   {
//     id: '10ef6d4ffd6d4108af3320e9e43b28e3',
//     folderName: '法查查',
//     folderLevel: 0,
//     parentFolderId: '',
//     enable: false,
//     isLeaf: true
//   },
//   {
//     id: '007b40233fa442abbb9d93e88b4ac110',
//     folderName: 'DH050901',
//     folderLevel: 0,
//     parentFolderId: '',
//     enable: false,
//     isSelectAll: true
//   },
//   {
//     id: 'c838f47003974d618086133147865283',
//     folderName: 'b',
//     folderLevel: 1,
//     parentFolderId: '03ae8e55d3694eb990a1e897df165e21',
//     enable: false,
//     isSelectAll: true
//   }
// ];
const summaryFromBackend = [];
const newLocationOptions = ref([]);

// 按类型拆分数据
const personOptions = computed(() =>
  newLocationOptions.value.filter((item) => item.knowledge_base_type === 'person_knowledge_base')
);

const companyOptions = computed(() =>
  newLocationOptions.value.filter((item) => item.knowledge_base_type === 'company_knowledge_base')
);

// 当前展示的数据（根据单选切换）
const currentOptions = computed(() => {
  return radio1.value === 'person_knowledge_base' ? personOptions.value : companyOptions.value;
});

// 切换时清空选中值
function handleRadioChange() {
  handleClear();
}
// 模拟接口
function fetchLocationOptions() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(locationOptions);
    }, 500);
  });
}

function transformOptions(options) {
  return options.map((item) => {
    const newItem = {
      ...item,
      disabled: !item.enable // 根据 enable 设置 disabled
    };
    if (item.children && item.children.length > 0) {
      newItem.children = transformOptions(item.children); // 递归处理子节点
    }
    return newItem;
  });
}

onMounted(async () => {
  const raw = await fetchLocationOptions();
  newLocationOptions.value = transformOptions(raw);
  // 1. 更新 summary 的 id
  const updatedSummary = updateSummaryIds(summaryFromBackend, currentOptions.value);

  // 2. 根据新的 summary 生成 cascader v-model
  selectedOptions.value = convertSummaryToPaths(currentOptions.value, updatedSummary);

  // 3. 遍历 summary，把 isSelectAll 的节点子孙禁用
  updatedSummary.forEach((item) => {
    if (item.isSelectAll) {
      const node = findNode(currentOptions.value, item.id);
      if (node) {
        setDisabled(node, true);
      }
    }
  });

  console.log('summaryFromBackend:', summaryFromBackend);
  console.log('updatedSummary:', updatedSummary);
  console.log(
    'selectedOptions:',
    JSON.stringify(selectedOptions.value),
    JSON.parse(JSON.stringify(selectedOptions.value))
  );
});

const serialize = (p) => p.join(',');

function deepClone(x) {
  return JSON.parse(JSON.stringify(x));
}

function findPathByLabel(nodes, label, currentPath = []) {
  for (const node of nodes) {
    const newPath = [...currentPath, node.id];
    if (node.folder_name === label) {
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
    const path = findPathByLabel(options, item.folderName);
    if (path) {
      return { ...item, id: path[path.length - 1], path };
    }
    return item;
  });
}

// 根据 summary 转 v-model
function convertSummaryToPaths(options, summary) {
  debugger;
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
function findNode(nodes, nodeId) {
  for (const node of nodes) {
    if (node.id === nodeId) return node;
    if (node.children) {
      const res = findNode(node.children, nodeId);
      if (res) return res;
    }
  }
  return null;
}
// 工具函数：收集自己 + 所有子孙路径（包含中间节点）
function collectPaths(node, parentPath = []) {
  const currentPath = [...parentPath, node.id];
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
      if (child.enable) {
        // 根据enable判断是否修改节点的disabled
        child.disabled = disabled;
      }
      setDisabled(child, disabled);
    });
  }
}

const prevSelected = ref([]);
function handleClear() {
  debugger;
  prevSelected.value = [];
  selectedOptions.value = [];
  currentOptions.value.forEach((node) => setDisabled(node, false));
  leafCache.clear();
  console.log('已清空选择');
}
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
  const nodeId = toggledPath[toggledPath.length - 1];
  const node = findNode(currentOptions.value, nodeId);
  const parentPath = toggledPath.slice(0, -1);
  debugger;

  console.log('点击的节点:', node.folder_name, '| 操作:', action);
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
    debugger;
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
  for (const root of currentOptions.value) {
    const s = summarizeNode(root, selectedLeafSet);
    if (s.length > 0) summary.push(...s);
  }

  console.log('整理后的结果:', JSON.stringify(summary), JSON.parse(JSON.stringify(summary)));
}
let leafCache = new Map();
function getAllLeafIds(node) {
  if (leafCache.has(node)) return leafCache.get(node);
  const ids = [];
  if (!node.children || node.children.length === 0) {
    ids.push(node.id);
  } else {
    for (const c of node.children) {
      ids.push(...getAllLeafIds(c));
    }
  }
  leafCache.set(node, ids);
  return ids;
}
// 递归生成 summary
function summarizeNode(node, selectedLeafSet) {
  const isLeaf = !node.children || node.children.length === 0;

  if (isLeaf) {
    return selectedLeafSet.has(node.id)
      ? [
          {
            id: node.id,
            folderName: node.folder_name,
            folderLevel: node.folder_level,
            parentFolderId: node.parent_folder_id,
            enable: node.enable,
            isLeaf: true
          }
        ]
      : [];
  }

  const res = [];
  for (const child of node.children) {
    res.push(...summarizeNode(child, selectedLeafSet));
  }

  const allLeafIds = getAllLeafIds(node);
  const nodeAllSelected = allLeafIds.every((id) => selectedLeafSet.has(id));

  if (nodeAllSelected) {
    return [
      {
        id: node.id,
        folderName: node.folder_name,
        folderLevel: node.folder_level,
        parentFolderId: node.parent_folder_id,
        enable: node.enable,
        isSelectAll: true
      }
    ];
  }

  return res;
}
</script>
<style>
.el-cascader__footer {
  display: flex;
  justify-content: flex-end;
}
</style>
