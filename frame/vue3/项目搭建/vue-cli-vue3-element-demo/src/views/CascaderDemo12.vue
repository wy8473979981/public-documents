<template>
  <div>
    <el-cascader
      class="custom-cascader"
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

      <!-- 自定义 tag 展示 -->
      <template #tag>
        <!-- 可见标签 -->
        <el-tag
          type="info"
          v-for="(path, idx) in visibleTags"
          :key="idx"
          :closable="hasInSummary(path)"
          @close="removeTag(path)"
          style="margin-right: 4px"
        >
          {{ prefixMap.get(path.join(',')) }}{{ namePathMap.get(path.join(',')).join(' / ') }}
        </el-tag>

        <!-- 折叠标签（tooltip 包裹） -->
        <el-tooltip v-if="hiddenTags.length" placement="top" effect="light">
          <template #content>
            <div style="display: flex; flex-wrap: wrap; gap: 4px">
              <el-tag
                v-for="(path, idx) in hiddenTags"
                :key="idx"
                type="info"
                :closable="hasInSummary(path)"
                @close="removeTag(path)"
              >
                {{ prefixMap.get(path.join(',')) }}{{ namePathMap.get(path.join(',')).join(' / ') }}
              </el-tag>
            </div>
          </template>
          <el-tag type="info">+{{ hiddenTags.length }}</el-tag>
        </el-tooltip>
      </template>

      <!-- 底部清空按钮 -->
      <template #footer>
        <el-button link size="small" @click="handleClear">清空</el-button>
      </template>
    </el-cascader>

    <!-- 调试用 -->
    <pre>{{ selectedOptions }}</pre>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { locationOptions } from '@/data/locationData';

/* -------------------- 基础状态 -------------------- */
const radio = ref('company_knowledge_base'); // 当前智库类型
const props = {
  value: 'id',
  label: 'folderName',
  multiple: true,
  emitPath: true,
  checkStrictly: true
};

const newLocationOptions = ref([]); // 转换后的 options
const summaryMap = new Map(); // 存 summary 信息

// 按智库分开存储选择
const selections = ref({
  company_knowledge_base: [],
  person_knowledge_base: []
});
// 上一次的选择（用于 diff）
const prevSelections = ref({
  company_knowledge_base: [],
  person_knowledge_base: []
});

/* -------------------- 计算属性 -------------------- */
// 当前智库已选项
const selectedOptions = computed({
  get: () => selections.value[radio.value],
  set: (val) => (selections.value[radio.value] = val)
});

// 人/公司选项
const personOptions = computed(() =>
  newLocationOptions.value.filter((i) => i.knowledgeBaseType === 'person_knowledge_base')
);
const companyOptions = computed(() =>
  newLocationOptions.value.filter((i) => i.knowledgeBaseType === 'company_knowledge_base')
);
// 当前选项
const currentOptions = computed(() =>
  radio.value === 'person_knowledge_base' ? personOptions.value : companyOptions.value
);

// 按源数据顺序合并两个智库选择
const mergedSelections = computed(() =>
  sortSelectionsByOptions(
    [...selections.value.company_knowledge_base, ...selections.value.person_knowledge_base],
    newLocationOptions.value
  )
);

// tag 可见 / 折叠
const maxVisible = 1; // 最多显示几个 tag
// 计算属性：可见和折叠的 tag
const visibleTags = computed(() => mergedSelections.value.slice(0, maxVisible));
const hiddenTags = computed(() => mergedSelections.value.slice(maxVisible));

/* -------------------- 生命周期 -------------------- */
onMounted(async () => {
  // 1. 拉取 & 转换数据
  const raw = await fetchLocationOptions();
  newLocationOptions.value = transformOptions(raw);

  // 2. 初始化 summary → selections
  const updatedSummary = updateSummary(summaryFromBackend, newLocationOptions.value);
  selections.value = convertSummaryToPaths(updatedSummary);
  prevSelections.value = deepClone(selections.value);

  // 3. 处理  禁用子孙
  updatedSummary.forEach((item) => {
    const node = findNodeById(newLocationOptions.value, item.id);
    console.log('item:', item);

    if (node) {
      setDisabled(node, true);
    }
  });

  console.log('初始化完成:', updatedSummary, selections.value);
});

/* -------------------- 工具函数 -------------------- */
const serialize = (p) => p.join(','); // 路径数组 → 字符串
const deepClone = (x) => JSON.parse(JSON.stringify(x));

// 构建顺序映射表
function buildOrderMap(options, orderMap = {}, parentPath = []) {
  // 遍历选项数组
  options.forEach((node) => {
    // 拼接路径
    const path = [...parentPath, node.id];
    // 使用路径作为键，将当前路径的长度作为值存储到orderMap中
    orderMap[path.join(',')] = Object.keys(orderMap).length;
    // 如果节点有子节点，则递归调用buildOrderMap函数
    if (node.children?.length) buildOrderMap(node.children, orderMap, path);
  });
  // 返回构建的orderMap
  return orderMap;
}

// 排序 selections
function sortSelectionsByOptions(selections, options) {
  // 构建一个排序映射表
  const orderMap = buildOrderMap(options);
  return [...selections].sort(
    // 排序函数，根据orderMap对selections进行排序
    (a, b) =>
      // 如果orderMap中存在a的键，则返回对应的值，否则返回99999
      (orderMap[a.join(',')] ?? 99999) -
      // 如果orderMap中存在b的键，则返回对应的值，否则返回99999
      (orderMap[b.join(',')] ?? 99999)
  );
}

// 查找节点
function findNodeById(nodes, nodeId) {
  for (const node of nodes) {
    if (node.id === nodeId) return node;
    if (node.children) {
      const res = findNodeById(node.children, nodeId);
      if (res) return res;
    }
  }
  return null;
}

// 设置节点及其子孙 disabled
function setDisabled(node, disabled) {
  if (node.children) {
    node.children.forEach((child) => {
      // 如果子节点有enable属性，则设置其disabled属性为传入的disabled值
      if (child.enable) child.disabled = disabled;
      // 递归调用setDisabled函数，处理子节点的子节点
      setDisabled(child, disabled);
    });
  }
}

// 收集节点及子孙路径（仅 enable=true）
function collectEnabledPaths(node, result = []) {
  if (node.enable) result.push(node.paths);
  node.children?.forEach((child) => collectEnabledPaths(child, result));
  return result;
}

/* -------------------- 业务相关工具 -------------------- */
// 获取路径的名称数组
function calcNamePath(idPath) {
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

// 计算属性：缓存所有已选 path 的 namePath
const namePathMap = computed(() => {
  const map = new Map();
  mergedSelections.value.forEach((path) => {
    map.set(path.join(','), calcNamePath(path));
  });
  console.log('namePathMap:', map);
  return map;
});

// 获取路径的前缀（公司/个人）
function calcPrefix(path) {
  return selections.value.company_knowledge_base.some((p) => p.join() === path.join())
    ? '[公司] '
    : '[个人] ';
}

// 生成缓存 map
const prefixMap = computed(() => {
  const map = new Map();
  mergedSelections.value.forEach((path) => {
    map.set(path.join(','), calcPrefix(path));
  });
  return map;
});

// 判断 path 是否存在于 summaryMap
function hasInSummary(path) {
  return Array.from(summaryMap.values()).some((item) => item.paths.join() === path.join());
}

/* -------------------- 事件处理 -------------------- */
// 切换智库
function handleRadioChange() {
  console.log('切换到:', radio.value, '选中:', selections.value[radio.value]);
}

// 清空
function handleClear() {
  selections.value = { company_knowledge_base: [], person_knowledge_base: [] };
  prevSelections.value = { company_knowledge_base: [], person_knowledge_base: [] };
  newLocationOptions.value.forEach((node) => setDisabled(node, false));
  summaryMap.clear();
  console.log('清空完成:');
  console.log(`summaryMap: ${JSON.stringify(Array.from(summaryMap.values()))}`);
  console.log(`selections: ${JSON.stringify(selections.value)}`);
  console.log(`prevSelections: ${JSON.stringify(prevSelections.value)}`);
}

// 删除 tag
function removeTag(path) {
  const kbType = selections.value.company_knowledge_base.some((p) => p.join() === path.join())
    ? 'company_knowledge_base'
    : 'person_knowledge_base';

  const node = findNodeById(newLocationOptions.value, path[path.length - 1]);
  if (!node) return;

  const enabledPaths = collectEnabledPaths(node);

  // 移除子孙
  selections.value[kbType] = selections.value[kbType].filter(
    (p) => !enabledPaths.some((ap) => ap.join() === p.join())
  );
  prevSelections.value[kbType] = deepClone(selections.value[kbType]);

  // 更新 summaryMap
  enabledPaths.forEach((p) => {
    const childNode = findNodeById(newLocationOptions.value, p[p.length - 1]);
    if (childNode) updateSummaryMap(childNode, 'deselect');
  });

  setDisabled(node, false);
  console.log(
    '删除 tag 后:',
    JSON.parse(JSON.stringify(selections.value)),
    JSON.parse(JSON.stringify(prevSelections.value)),
    JSON.parse(JSON.stringify(selectedOptions.value)),
    Array.from(summaryMap.values())
  );
}

// cascader 选中/取消
function handleChange(paths) {
  const kbType = radio.value;
  const curr = deepClone(paths || []);
  const prev = deepClone(prevSelections.value[kbType] || []);

  const prevSet = new Set(prev.map(serialize));
  const currSet = new Set(curr.map(serialize));
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

  const node = findNodeById(currentOptions.value, toggledPath[toggledPath.length - 1]);
  if (!node) return;

  const enabledPaths = collectEnabledPaths(node);
  console.log('点击:', node.folderName, '操作:', action);

  if (action === 'select') {
    setDisabled(node, true);
    selections.value[kbType] = [
      ...selections.value[kbType],
      ...enabledPaths.filter(
        (p) => !selections.value[kbType].some((sel) => sel.join() === p.join())
      )
    ];
    updateSummaryMap(node, 'select');
  } else {
    setDisabled(node, false);
    selections.value[kbType] = selections.value[kbType].filter(
      (p) => !enabledPaths.some((ap) => ap.join() === p.join())
    );
    updateSummaryMap(node, 'deselect');
  }

  prevSelections.value[kbType] = deepClone(selections.value[kbType]);

  console.log(
    'change:',
    JSON.parse(JSON.stringify(selections.value)),
    JSON.parse(JSON.stringify(prevSelections.value)),
    JSON.parse(JSON.stringify(selectedOptions.value)),
    Array.from(summaryMap.values())
  );
}

/* -------------------- 模拟接口 / summary -------------------- */
// 后端返回的 summary
const summaryFromBackend = [
  {
    id: '16765da19f45455f8ffdfc74d31043e4',
    folderName: 'TEST_0523',
    folderLevel: 0,
    parentFolderId: '',
    enable: true,
    paths: ['16765da19f45455f8ffdfc74d31043e4'],
    name: ['TEST_0523'],
    knowledgeBaseType: 'company_knowledge_base',
    isSelectAll: false
  }
];

// 模拟接口获取原始数据
function fetchLocationOptions() {
  return new Promise((resolve) => setTimeout(() => resolve(locationOptions), 500));
}

// 转换 options 结构
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
      disabled: !item.enable,
      paths: currentPath,
      names: currentName
    };
    if (item.children?.length) {
      newItem.children = transformOptions(item.children, currentPath, currentName);
    }
    return newItem;
  });
}

// 更新 summaryMap
function updateSummary(summary, options) {
  return summary
    .map((item) => {
      const node = findNodeById(options, item.id);
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
    .filter(Boolean);
}

// summary → cascader v-model
function convertSummaryToPaths(summary, defaultKbType = 'company_knowledge_base') {
  if (!summary) return { company_knowledge_base: [], person_knowledge_base: [] };

  const result = { company_knowledge_base: [], person_knowledge_base: [] };
  summary.forEach((item) => {
    const kbType = item.knowledgeBaseType || defaultKbType;
    const paths = collectEnabledPaths(item);

    if (paths.length) {
      result[kbType].push(...paths.filter(Boolean));
    }
  });
  return result;
}

// 更新 summaryMap（选中/取消）
function updateSummaryMap(node, action) {
  if (action === 'select') {
    if (node.children?.length) {
      // 选中父节点 → 移除子孙
      for (const [k, v] of summaryMap.entries()) {
        if (v.paths.join(',').startsWith(node.paths.join(',')) && v.id !== node.id) {
          summaryMap.delete(k);
        }
      }
    } else {
      // 选中子节点 → 若祖先存在则跳过
      for (const v of summaryMap.values()) {
        if (node.paths.join(',').startsWith(v.paths.join(',')) && v.id !== node.id) {
          console.log(`跳过 ${node.folderName}，因祖先 ${v.folderName} 已存在`);
          return;
        }
      }
    }
    summaryMap.set(node, {
      id: node.id,
      folderName: node.folderName,
      folderLevel: node.folderLevel,
      parentFolderId: node.parentFolderId,
      enable: node.enable,
      paths: node.paths,
      name: node.names,
      knowledgeBaseType: node.knowledgeBaseType,
      ...(node.children?.length > 0 ? { isSelectAll: true } : { isSelectAll: false })
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
</script>

<style lang="scss">
.custom-cascader {
  width: 280px;
}
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
