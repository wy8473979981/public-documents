<template>
  <el-form-item label="用户名">
    <el-input v-model="model" />
  </el-form-item>
</template>

<script setup>
import { defineModel, onMounted } from 'vue';
import { ElFormItem, ElInput } from 'element-plus';

const model = defineModel()

onMounted(() => {
  model.value = 1111
});
</script>
