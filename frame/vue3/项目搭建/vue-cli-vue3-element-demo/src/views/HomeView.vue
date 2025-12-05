<!--
 * @Description: Description
 * @Author: wangyang
 * @Date: 2025-09-15 23:21:22
 * @LastEditors: wangyang
 * @LastEditTime: 2025-09-15 23:43:09
-->
<template>
  <div>
    <h1>Count: {{ counter.count }}</h1>
    <el-button @click="counter.increment">Increment</el-button>
  </div>
</template>

<script>
import { useCounterStore } from '@/stores/counter';
import { ElButton } from 'element-plus';

export default {
  setup() {
    const counter = useCounterStore();
    return { counter };
  }
};
</script>
