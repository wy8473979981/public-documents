<template>
  <div class="directory-selector">
    <div
      v-for="dir in directoryTree"
      :key="dir.path"
      class="directory-item"
      :style="{ 'padding-left': `${dir.level * 20}px` }"
    >
      <input
        type="checkbox"
        :id="dir.path"
        v-model="dir.selected"
        :disabled="dir.disabled"
        @change="handleDirectorySelect(dir)"
      />
      <label :for="dir.path">{{ dir.name }}</label>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DirectorySelector',
  props: {
    initialDirectories: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      directoryTree: []
    };
  },
  created() {
    this.buildDirectoryTree(this.initialDirectories);
  },
  methods: {
    buildDirectoryTree(directories, level = 0, parentPath = '') {
      directories.forEach((dir) => {
        const fullPath = parentPath ? `${parentPath}/${dir.name}` : dir.name;
        const directoryNode = {
          name: dir.name,
          path: fullPath,
          level,
          selected: false,
          disabled: false,
          isParent: false,
          children: dir.children ? this.buildDirectoryTree(dir.children, level + 1, fullPath) : []
        };
        this.directoryTree.push(directoryNode);
      });
    },
    handleDirectorySelect(dir) {
      if (dir.selected) {
        // 选中父目录时，自动选中所有子目录并禁用
        this.selectChildren(dir, true);
        dir.isParent = true;
      } else {
        // 取消选中时，如果是父目录模式，则不允许取消
        if (dir.isParent) {
          dir.selected = true; // 保持选中状态
          return;
        }
        // 否则正常取消选中
        this.selectChildren(dir, false);
      }
    },
    selectChildren(dir, selected) {
      dir.children.forEach((child) => {
        child.selected = selected;
        child.disabled = selected;
        if (selected) {
          child.isParent = false;
        }
        if (child.children.length > 0) {
          this.selectChildren(child, selected);
        }
      });
    }
  }
};
</script>

<style scoped>
.directory-selector {
  font-family: Arial, sans-serif;
}
.directory-item {
  margin: 5px 0;
  display: flex;
  align-items: center;
}
input[type='checkbox'] {
  margin-right: 8px;
}
label {
  cursor: pointer;
}
</style>
