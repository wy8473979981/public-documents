<script setup>
import { defineProps, ref, reactive, computed } from 'vue';
import { Handle, Position } from '@vue-flow/core';
import { NodeResizer } from '@vue-flow/node-resizer';

defineProps(['data']);

const initSize = 500; // 设计初始尺寸
const width = ref(initSize + 'px');
const height = ref(initSize + 'px');

const scale = computed(() => {
  // 取宽高比例中的较小值，确保内容均匀缩放
  const widthScale = parseFloat(width.value) / initSize;
  const heightScale = parseFloat(height.value) / initSize;
  return Math.min(widthScale, heightScale);
});

function onResize(event) {
  width.value = `${event.params.width}px`;
  height.value = `${event.params.height}px`;
}

const form = reactive({
  name: '',
  region: '',
  date1: '',
  date2: '',
  delivery: false,
  type: [],
  resource: '',
  desc: '',
});

const onSubmit = () => {
  console.log('submit!', form);
};
</script>

<template>
  <!-- <NodeResizer
    min-width="100"
    min-height="100"
    @resize="onResize"
    :is-visible="true" /> -->
  <div class="node-container" :style="{ width, height }">
    <Handle type="target" :position="Position.Left" />

    <!-- 这里用一个容器包裹内容，用scale缩放 -->
    <div
      class="box"
      :style="{
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
        width: initSize + 'px',
        height: initSize + 'px',
      }">
      <NodeResizer
        min-width="100"
        min-height="100"
        @resize="onResize"
        :is-visible="true"
        :handle-style="{
          width: '8px',
          height: '8px',
        }" />
      <h1>{{ data.label }}</h1>
      <el-form :model="form" label-width="auto">
        <!-- 你的表单内容 -->
        <el-form-item label="Activity name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="Activity zone">
          <el-select
            v-model="form.region"
            placeholder="please select your zone">
            <el-option label="Zone one" value="shanghai" />
            <el-option label="Zone two" value="beijing" />
          </el-select>
        </el-form-item>
        <!-- 其他项略 -->
        <el-form-item>
          <el-button type="primary" @click="onSubmit">Create</el-button>
          <el-button>Cancel</el-button>
        </el-form-item>
      </el-form>
    </div>

    <Handle type="source" :position="Position.Right" />
  </div>
</template>

<style scoped>
.node-container {
  position: relative;
  border: 1px solid #ccc;
}

.box {
  box-sizing: border-box;
  overflow: hidden;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  background-color: red;
}
</style>
