<template>
  <div>
    <el-cascader
      popper-class="custom-header"
      v-model="selectedOptions"
      :options="currentOptions"
      :props="props"
      clearable
      collapse-tags
      collapse-tags-tooltip
      @change="handleChange"
      @clear="handleClear"
    >
      <!-- 顶部单选切换公司/个人智库 -->
      <template #header>
        <el-radio-group v-model="radio" @change="handleRadioChange">
          <el-radio value="company_knowledge_base" size="large">公司智库</el-radio>
          <el-radio value="person_knowledge_base" size="large">个人智库</el-radio>
        </el-radio-group>
      </template>

      <!-- 自定义 tag 插槽 -->
      <template #tag>
        <!-- 可见的标签 -->
        <template v-for="(path, idx) in visibleTags" :key="idx">
          <el-tag type="info" closable @close="removeTag(path)" style="margin-right: 4px">
            {{ getPrefix(path) }}{{ getNamePath(path).join(' / ') }}
          </el-tag>
        </template>

        <!-- 折叠标签 -->
        <el-tooltip v-if="hiddenTags.length" placement="top" effect="light">
          <template #content>
            <div v-for="(path, idx) in hiddenTags" :key="idx" style="margin: 2px 0">
              {{ getPrefix(path) }}{{ getNamePath(path).join(' / ') }}
            </div>
          </template>
          <el-tag type="info">+{{ hiddenTags.length }}</el-tag>
        </el-tooltip>
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
const radio = ref('company_knowledge_base');
const props = {
  value: 'id',
  label: 'folderName',
  multiple: true,
  emitPath: true,
  checkStrictly: true
};

const summaryMap = new Map(); // 当前选中项的 Map（存 summary 信息）
const newLocationOptions = ref([]); // 转换后的 options

// 分开存储两个智库的选择
const selections = ref({
  company_knowledge_base: [],
  person_knowledge_base: []
});
// 上一次的选择（用于 diff）
const prevSelections = ref({
  company_knowledge_base: [],
  person_knowledge_base: []
});

// 选中的 options：只映射当前智库
const selectedOptions = computed({
  get() {
    return selections.value[radio.value];
  },
  set(val) {
    selections.value[radio.value] = val;
  }
});

// 计算属性：合并两种智库的选择
const mergedSelections = computed(() => [
  ...selections.value.company_knowledge_base,
  ...selections.value.person_knowledge_base
]);

// 最多显示几个 tag
const maxVisible = 1;

// 计算属性：可见和折叠的 tag
const visibleTags = computed(() => mergedSelections.value.slice(0, maxVisible));
const hiddenTags = computed(() => mergedSelections.value.slice(maxVisible));

// 根据 id path 获取名称路径
function getNamePath(idPath) {
  const names = [];
  let nodes = newLocationOptions.value;

  for (const id of idPath) {
    const node = nodes.find((n) => n.id === id);
    if (!node) break;
    names.push(node.folderName);
    nodes = node.children || [];
  }

  return names;
}

// 根据 path 判断属于哪个智库，加前缀
function getPrefix(path) {
  const isCompany = selections.value.company_knowledge_base.some((p) => p.join() === path.join());
  return isCompany ? '[公司] ' : '[个人] ';
}

// 删除 tag
function removeTag(path) {
  // 判断这个 path 属于哪个智库
  const kbType = selections.value.company_knowledge_base.some((p) => p.join() === path.join())
    ? 'company_knowledge_base'
    : 'person_knowledge_base';

  // 删除对应的 path
  selections.value[kbType] = selections.value[kbType].filter((p) => p.join() !== path.join());

  // 同步到 prevSelections
  prevSelections.value[kbType] = deepClone(selections.value[kbType]);

  // 找到对应节点，从 summaryMap 移除
  const nodeId = path[path.length - 1];
  const node = findNode(newLocationOptions.value, nodeId);
  if (node) {
    updateSummaryMap(node, 'deselect');
    setDisabled(node, false); // 删除后解除禁用
  }

  console.log(
    '删除 tag 后:',
    JSON.parse(JSON.stringify(selections.value)),
    JSON.parse(JSON.stringify(prevSelections.value)),
    Array.from(summaryMap.values())
  );
}

// -------------------- 模拟接口返回 summary --------------------
const summaryFromBackend = [
  {
    id: '69db896110f64e23bac1d817a8f4ec7d',
    folderName: 'huiqiang001',
    folderLevel: 0,
    parentFolderId: '',
    enable: true,
    paths: ['69db896110f64e23bac1d817a8f4ec7d'],
    name: ['huiqiang001'],
    knowledgeBaseType: 'company_knowledge_base',
    isSelectAll: true
  },
  {
    id: '007b40233fa442abbb9d93e88b4ac110',
    folderName: 'DH050901',
    folderLevel: 0,
    parentFolderId: '',
    enable: true,
    paths: ['007b40233fa442abbb9d93e88b4ac110'],
    name: ['DH050901'],
    knowledgeBaseType: 'person_knowledge_base',
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
  radio.value === 'person_knowledge_base' ? personOptions.value : companyOptions.value
);

// -------------------- 事件处理 --------------------
// 切换智库类型时 → 清空选中值
function handleRadioChange() {
  console.log('切换到:', radio.value, '当前选中:', selections.value[radio.value]);
  // handleClear();
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
  // 1. 拉取并转换数据
  const raw = await fetchLocationOptions();
  newLocationOptions.value = transformOptions(raw);

  // 2. 更新 summary 的 paths
  const updatedSummary = updateSummaryIds(summaryFromBackend, newLocationOptions.value);
  debugger;
  // 3. 将 summaryFromBackend 转换为 cascader v-model
  selections.value = convertSummaryToPaths(updatedSummary);
  prevSelections.value = selections.value;

  // 4. 将 isSelectAll 的节点子孙禁用
  updatedSummary.forEach((item) => {
    if (item.isSelectAll) {
      const node = findNode(newLocationOptions.value, item.id);
      if (node && node.enable) {
        setDisabled(node, true);
      } else {
        node.children.forEach((child) => {
          child.enable && setDisabled(child, true);
        });
      }
    }
  });

  console.log(
    '初始化 selectedOptions:',
    updatedSummary,
    JSON.parse(JSON.stringify(selections.value)),
    JSON.parse(JSON.stringify(selectedOptions.value))
  );
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

// 更新 summary 的 数据，并同步到 summaryMap
function updateSummaryIds(summary, options) {
  return summary
    .map((item) => {
      const node = findPathById(options, item.id);
      if (node) {
        updateSummaryMap(node, 'select');
        return {
          ...item,
          enable: node.enable,
          id: node.id,
          paths: node.paths,
          children: node.children
        };
      }
      return null;
    })
    .filter(Boolean); // 过滤掉undefined/null;
}

// 将 summary 转换为 cascader v-model 的格式
// 返回结构：{ company_knowledge_base: [...], person_knowledge_base: [...] }
function convertSummaryToPaths(summary) {
  // 初始化两个智库的存储容器
  const result = {
    company_knowledge_base: [],
    person_knowledge_base: []
  };

  summary.forEach((item) => {
    const kbType = item.knowledgeBaseType || 'company_knowledge_base'; // 默认归类到公司智库

    if (item.isSelectAll) {
      // 【父节点全选】→ 收集所有可用的子孙节点 paths
      const enabledPaths = collectEnabledPaths(item);
      result[kbType].push(...enabledPaths);
    } else if (item.isLeaf) {
      // 【叶子节点】→ 直接推入完整路径
      result[kbType].push(item.paths);
    }
  });

  return result;
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
  selections.value = {
    company_knowledge_base: [],
    person_knowledge_base: []
  };
  prevSelections.value = {
    company_knowledge_base: [],
    person_knowledge_base: []
  };
  newLocationOptions.value.forEach((node) => setDisabled(node, false));
  summaryMap.clear();
  console.log(`summaryMap: ${JSON.stringify(Array.from(summaryMap.values()))}`);
  console.log(`selections: ${JSON.stringify(selections.value)}`);
  console.log(`prevSelections: ${JSON.stringify(prevSelections.value)}`);
}

// 更新 summaryMap（选中/取消选中）
function updateSummaryMap(node, action) {
  if (action === 'select') {
    if (node.children?.length) {
      // 1. 选中父节点 → 移除所有子孙
      for (const [k, v] of summaryMap.entries()) {
        debugger;
        if (v.paths.join(',').startsWith(node.paths.join(',')) && v.id !== node.id) {
          summaryMap.delete(k);
        }
      }
    } else {
      // 2. 选中子节点 → 如果祖先存在，跳过
      for (const v of summaryMap.values()) {
        debugger;
        if (node.paths.join(',').startsWith(v.paths.join(',')) && v.id !== node.id) {
          console.log(`跳过 ${node.folderName}，因为祖先 ${v.folderName} 已存在`);
          return;
        }
      }
    }

    // ✅ 最后再加自己
    summaryMap.set(node, {
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
    summaryMap.delete(node);
  }

  console.log(
    '当前 summaryMap:',
    Array.from(summaryMap.values()),
    JSON.stringify(Array.from(summaryMap.values()))
  );
}

// 处理 cascader change
function handleChange(paths) {
  const kbType = radio.value;
  const curr = deepClone(paths || []);
  const prev = deepClone(prevSelections.value[kbType] || []);

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
    selections.value[kbType] = [
      ...selections.value[kbType],
      ...enabledPaths.filter(
        (p) => !selections.value[kbType].some((sel) => sel.join() === p.join())
      )
    ];
    updateSummaryMap(node, 'select');
  } else {
    // 父节点被取消 → 解除禁用 + 移除子孙
    setDisabled(node, false);
    selections.value[kbType] = selections.value[kbType].filter(
      (p) => !enabledPaths.some((ap) => ap.join() === p.join())
    );
    updateSummaryMap(node, 'deselect');
  }

  prevSelections.value[kbType] = deepClone(selections.value[kbType]);
  debugger;
  console.log(
    '更新后 selectedOptions:',
    JSON.parse(JSON.stringify(selections.value)),
    JSON.parse(JSON.stringify(prevSelections.value)),
    JSON.parse(JSON.stringify(selectedOptions.value))
  );
}
</script>

<style lang="scss">
.custom-header {
  .el-radio {
    display: flex;
    height: unset;
  }
  .el-cascader__footer {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
