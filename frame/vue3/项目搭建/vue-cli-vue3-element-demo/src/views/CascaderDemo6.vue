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
      <!-- 顶部单选切换企业/个人智库 -->
      <template #header>
        <el-radio-group v-model="radio1" @change="handleRadioChange">
          <el-radio value="company_knowledge_base" size="large">企业智库</el-radio>
          <el-radio value="person_knowledge_base" size="large">个人智库</el-radio>
        </el-radio-group>
      </template>

      <!-- 底部操作按钮 -->
      <template #footer>
        <el-button link size="small" @click="handleClear">清空</el-button>
      </template>
    </el-cascader>
    <pre>{{ selectedOptions }}</pre>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { locationOptions } from '@/data/locationData';

// -------------------- 基础状态 --------------------
const radio1 = ref('company_knowledge_base');
const props = {
  value: 'id',
  label: 'folderName',
  multiple: true,
  emitPath: true,
  checkStrictly: true
};

const prevSelected = ref([]); // 上一次的选择（用于 diff）
const summaryMap = new Map(); // 当前选中项的 Map（存 summary 信息）
const selectedOptions = ref([]); // cascader 的 v-model
const newLocationOptions = ref([]); // 转换后的 options

// -------------------- 模拟接口返回 summary --------------------
const summaryFromBackend = [
  {
    id: '69db896110f64e23bac1d817a8f4ec7d',
    folderName: 'huiqiang001',
    folderLevel: 0,
    parentFolderId: '',
    enable: true,
    paths: ['69db896110f64e23bac1d817a8f4ec7d'],
    knowledgeBaseType: 'company_knowledge_base',
    isSelectAll: true
  },
  {
    id: '2ea7aa62cfd347a8b4f2b0dc18b97610',
    folderName: '111',
    folderLevel: 1,
    parentFolderId: '0169d333562e4a9083815f3a1d8b9084',
    enable: true,
    paths: ['0169d333562e4a9083815f3a1d8b9084', '2ea7aa62cfd347a8b4f2b0dc18b97610'],
    knowledgeBaseType: 'company_knowledge_base',
    isSelectAll: true
  }
];

// -------------------- computed 数据 --------------------
// 拆分出个人/企业选项
const personOptions = computed(() =>
  newLocationOptions.value.filter((item) => item.knowledgeBaseType === 'person_knowledge_base')
);
const companyOptions = computed(() =>
  newLocationOptions.value.filter((item) => item.knowledgeBaseType === 'company_knowledge_base')
);

// 当前展示的数据（根据单选切换）
const currentOptions = computed(() =>
  radio1.value === 'person_knowledge_base' ? personOptions.value : companyOptions.value
);

// -------------------- 事件处理 --------------------
// 切换智库类型时 → 清空选中值
function handleRadioChange() {
  handleClear();
}

// 模拟接口：获取原始数据
function fetchLocationOptions() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(locationOptions), 500);
  });
}

// 转换 options 结构，补充 folderName / folderLevel / paths / disabled
function transformOptions(options, parentPath = [], parentName = []) {
  return options.map((item) => {
    const currentPath = [...parentPath, item.id];
    const currentName = [...parentName, item.folder_name];

    const newItem = {
      ...item,
      folderName: item.folder_name,
      folderLevel: item.folder_level,
      parentFolderId: item.parent_folder_id,
      knowledgeBaseType: item.knowledge_base_type,
      disabled: !item.enable, // enable=false → disabled=true
      paths: currentPath, // 拼接完整路径
      names: currentName
    };
    if (item.children?.length) {
      newItem.children = transformOptions(item.children, currentPath, currentName);
    }
    return newItem;
  });
}

// -------------------- 生命周期 --------------------
onMounted(async () => {
  // 拉取并转换数据
  const raw = await fetchLocationOptions();
  newLocationOptions.value = transformOptions(raw);

  // 1. 更新 summary 的 id/paths
  const updatedSummary = updateSummaryIds(summaryFromBackend, currentOptions.value);

  // 2. 将 summary 转换为 cascader v-model
  selectedOptions.value = convertSummaryToPaths(currentOptions.value, updatedSummary);
  prevSelected.value = selectedOptions.value;

  // 3. 将 isSelectAll 的节点子孙禁用
  updatedSummary.forEach((item) => {
    if (item.isSelectAll) {
      const node = findNode(currentOptions.value, item.id);
      if (node) setDisabled(node, true);
    }
  });

  console.log('初始化 selectedOptions:', JSON.parse(JSON.stringify(selectedOptions.value)));
});

// -------------------- 工具函数 --------------------
const serialize = (p) => p.join(','); // 数组转字符串，用于比较
const deepClone = (x) => JSON.parse(JSON.stringify(x)); // 简单深拷贝

// 根据 id 查找节点
function findPathById(nodes, id) {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.children) {
      const found = findPathById(node.children, id);
      if (found) return found;
    }
  }
  return null;
}

// 更新 summary 的 id，并同步到 summaryMap
function updateSummaryIds(summary, options) {
  return summary.map((item) => {
    const node = findPathById(options, item.id);
    if (node) {
      updateSummaryMap(node, 'select');
      return { ...item, id: node.id, paths: node.paths, children: node.children };
    }
    return item;
  });
}

// 将 summary 转换为 cascader v-model（paths 数组）
function convertSummaryToPaths(options, summary) {
  const paths = [];
  summary.forEach((item) => {
    if (item.isSelectAll) {
      // 父节点全选 → 收集所有启用子孙节点
      const enabledPaths = collectEnabledPaths(item);
      paths.push(...enabledPaths);
    } else if (item.isLeaf) {
      // 叶子节点 → 直接用完整路径
      paths.push(item.paths);
    }
  });
  return paths;
}

// 根据 id 查找节点（递归）
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

// 设置节点及其子孙的 disabled
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

// 收集节点及其子孙的完整路径（只收集 enable=true 的节点）
function collectEnabledPaths(node, result = []) {
  if (node.enable) result.push(node.paths);
  node.children?.forEach((child) => collectEnabledPaths(child, result));
  return result;
}

// -------------------- 清空/更新 --------------------
// 清空已选择的数据
function handleClear() {
  prevSelected.value = [];
  selectedOptions.value = [];
  currentOptions.value.forEach((node) => setDisabled(node, false));
  summaryMap.clear();
  console.log('已清空选择');
}

// 更新 summaryMap（选中/取消选中）
function updateSummaryMap(node, action) {
  if (action === 'select') {
    summaryMap.set(node.id, {
      id: node.id,
      folderName: node.folderName,
      folderLevel: node.folderLevel,
      parentFolderId: node.parentFolderId,
      enable: node.enable,
      paths: node.paths,
      name: node.names,
      knowledgeBaseType: node.knowledgeBaseType,
      ...(node.children?.length ? { isSelectAll: true } : { isLeaf: true })
    });
  } else if (action === 'deselect') {
    summaryMap.delete(node.id);
  }
  console.log('当前 summaryMap:', Array.from(summaryMap.values()));
}

// 处理 cascader change
function handleChange(paths) {
  const curr = deepClone(paths || []);
  const prev = deepClone(prevSelected.value || []);

  const prevSet = new Set(prev.map(serialize));
  const currSet = new Set(curr.map(serialize));

  // 找出新增/移除的路径
  const added = curr.filter((p) => !prevSet.has(serialize(p)));
  const removed = prev.filter((p) => !currSet.has(serialize(p)));

  let toggledPath = null;
  let action = null;

  if (added.length) {
    toggledPath = added.reduce((a, b) => (a.length <= b.length ? a : b));
    action = 'select';
  } else if (removed.length) {
    toggledPath = removed.reduce((a, b) => (a.length <= b.length ? a : b));
    action = 'deselect';
  }

  if (!toggledPath) return;

  // 根据最后一个 id 找到节点
  const nodeId = toggledPath[toggledPath.length - 1];
  const node = findNode(currentOptions.value, nodeId);
  if (!node) return;

  // 收集可用路径
  const enabledPaths = collectEnabledPaths(node);
  console.log('点击节点:', node.folderName, '| 操作:', action);
  console.log('启用路径:', enabledPaths);

  if (action === 'select') {
    // 父节点被选中 → 禁用子孙 + 全部选中
    setDisabled(node, true);
    selectedOptions.value = [
      ...selectedOptions.value,
      ...enabledPaths.filter((p) => !selectedOptions.value.some((sel) => sel.join() === p.join()))
    ];
    updateSummaryMap(node, 'select');
  } else {
    // 父节点被取消 → 解除禁用 + 移除子孙
    setDisabled(node, false);
    selectedOptions.value = selectedOptions.value.filter(
      (p) => !enabledPaths.some((ap) => ap.join() === p.join())
    );
    updateSummaryMap(node, 'deselect');
  }

  prevSelected.value = deepClone(selectedOptions.value);
  console.log('更新后 selectedOptions:', JSON.parse(JSON.stringify(selectedOptions.value)));
}
</script>

<style>
.el-cascader__footer {
  display: flex;
  justify-content: flex-end;
}
</style>
