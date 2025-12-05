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
          <el-radio value="company_knowledge_base" size="large">企业智库</el-radio>
          <el-radio value="person_knowledge_base" size="large">个人智库</el-radio>
        </el-radio-group>
      </template>
      <template #footer>
        <el-button link size="small" @click="handleClear">清空</el-button>
      </template>
    </el-cascader>
    <pre>{{ selections }}</pre>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { locationOptions } from '@/data/locationData'; // 模拟数据

const radio1 = ref('company_knowledge_base');
const props = {
  value: 'id',
  label: 'folderName',
  multiple: true,
  emitPath: true,
  checkStrictly: true
};

// ✅ 改造：分开存储两个智库的选择
const selections = ref({
  company_knowledge_base: [],
  person_knowledge_base: []
});
const prevSelections = ref({
  company_knowledge_base: [],
  person_knowledge_base: []
});

// 选中的 options：只映射当前智库
const selectedOptions = computed({
  get() {
    return selections.value[radio1.value];
  },
  set(val) {
    selections.value[radio1.value] = val;
  }
});

const summaryMap = new Map();
const summaryFromBackend = [
  {
    id: '16765da19f45455f8ffdfc74d31043e4',
    folderName: 'TEST_0523',
    folderLevel: 0,
    parentFolderId: '',
    enable: true,
    paths: ['16765da19f45455f8ffdfc74d31043e4'],
    knowledgeBaseType: 'company_knowledge_base',
    isSelectAll: true
  }
];
const newLocationOptions = ref([]);

// 按类型拆分数据
const personOptions = computed(() =>
  newLocationOptions.value.filter((item) => item.knowledgeBaseType === 'person_knowledge_base')
);

const companyOptions = computed(() =>
  newLocationOptions.value.filter((item) => item.knowledgeBaseType === 'company_knowledge_base')
);

// 当前展示的数据（根据单选切换）
const currentOptions = computed(() => {
  return radio1.value === 'person_knowledge_base' ? personOptions.value : companyOptions.value;
});

// 切换时不清空（如果需要清空，可以在这里调用 handleClear）
function handleRadioChange() {
  console.log('切换到:', radio1.value, '当前选中:', selections.value[radio1.value]);
}

// 模拟接口
function fetchLocationOptions() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(locationOptions);
    }, 500);
  });
}

function transformOptions(options, parentPath = []) {
  return options.map((item) => {
    const currentPath = [...parentPath, item.id];
    const newItem = {
      ...item,
      folderName: item.folder_name,
      folderLevel: item.folder_level,
      parentFolderId: item.parent_folder_id,
      knowledgeBaseType: item.knowledge_base_type,
      disabled: !item.enable,
      paths: currentPath
    };
    if (item.children && item.children.length > 0) {
      newItem.children = transformOptions(item.children, currentPath);
    }
    return newItem;
  });
}

onMounted(async () => {
  const raw = await fetchLocationOptions();
  newLocationOptions.value = transformOptions(raw);

  console.log('newLocationOptions:', newLocationOptions.value);

  // 初始化：只处理公司智库
  const updatedSummary = updateSummaryIds(summaryFromBackend, companyOptions.value);
  selections.value.company_knowledge_base = convertSummaryToPaths(
    companyOptions.value,
    updatedSummary
  );
  prevSelections.value.company_knowledge_base = selections.value.company_knowledge_base;
});

// ---------------- 工具函数 ----------------
const serialize = (p) => p.join(',');
function deepClone(x) {
  return JSON.parse(JSON.stringify(x));
}
function findPathByLabel(nodes, folderName, folderLevel, knowledgeBaseType) {
  for (const node of nodes) {
    if (
      node.folderName === folderName &&
      node.folderLevel === folderLevel &&
      node.knowledgeBaseType === knowledgeBaseType
    ) {
      return node;
    }
    if (node.children) {
      const found = findPathByLabel(node.children, folderName, folderLevel, knowledgeBaseType);
      if (found) return found;
    }
  }
  return null;
}
function updateSummaryIds(summary, options) {
  return summary.map((item) => {
    const node = findPathByLabel(
      options,
      item.folderName,
      item.folderLevel,
      item.knowledgeBaseType
    );
    if (node) {
      updateSummaryMap(node, 'select');
      return { ...item, id: node.id, paths: node.paths, children: node.children };
    }
    return item;
  });
}
function convertSummaryToPaths(options, summary) {
  const paths = [];
  summary.forEach((item) => {
    if (item.isSelectAll) {
      const enabledPaths = collectEnabledPaths(item);
      paths.push(...enabledPaths);
    } else if (item.isLeaf) {
      paths.push(item.paths);
    }
  });
  return paths;
}
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
function setDisabled(node, disabled) {
  if (node.children) {
    node.children.forEach((child) => {
      if (child.enable) child.disabled = disabled;
      setDisabled(child, disabled);
    });
  } else {
    if (node.enable && node.parentFolderId) node.disabled = disabled;
  }
}
function collectEnabledPaths(node, result = []) {
  if (node.enable) result.push(node.paths);
  if (node.children && node.children.length > 0) {
    node.children.forEach((child) => collectEnabledPaths(child, result));
  }
  return result;
}
function updateSummaryMap(node, action) {
  if (action === 'select') {
    if (node.children && node.children.length > 0) {
      summaryMap.set(node.id, { ...node, isSelectAll: true });
    } else {
      summaryMap.set(node.id, { ...node, isLeaf: true });
    }
  } else if (action === 'deselect') {
    summaryMap.delete(node.id);
  }
  console.log('当前 summaryMap:', Array.from(summaryMap.values()));
}

// ---------------- 事件 ----------------
function handleClear() {
  const kbType = radio1.value;
  selections.value[kbType] = [];
  prevSelections.value[kbType] = [];
  currentOptions.value.forEach((node) => setDisabled(node, false));
  summaryMap.clear();
  console.log('已清空', kbType);
}

function handleChange(paths) {
  const kbType = radio1.value;
  const curr = deepClone(paths || []);
  const prev = deepClone(prevSelections.value[kbType] || []);

  const prevSet = new Set(prev.map(serialize));
  const currSet = new Set(curr.map(serialize));

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

  if (!toggledPath) return;
  const nodeId = toggledPath[toggledPath.length - 1];
  const node = findNode(currentOptions.value, nodeId);
  const enabledPaths = collectEnabledPaths(node);

  console.log('点击节点:', node.folderName, '| 操作:', action);

  if (action === 'select') {
    setDisabled(node, true);
    selections.value[kbType] = [
      ...selections.value[kbType],
      ...enabledPaths.filter(
        (p) => !selections.value[kbType].some((sel) => sel.join() === p.join())
      )
    ];
    updateSummaryMap(node, 'select');
  } else if (action === 'deselect') {
    setDisabled(node, false);
    selections.value[kbType] = selections.value[kbType].filter(
      (p) => !enabledPaths.some((ap) => ap.join() === p.join())
    );
    updateSummaryMap(node, 'deselect');
  }

  prevSelections.value[kbType] = deepClone(selections.value[kbType]);
}
</script>

<style>
.el-cascader__footer {
  display: flex;
  justify-content: flex-end;
}
</style>
