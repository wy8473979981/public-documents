<template>
  <view v-if="!initDone" class="top-top">
    <view class="middle-text"> 加载中... </view>
  </view>
</template>

<script>
import pageCommon from '@/mixins/page.common.js'
export default {
  mixins: [pageCommon]
}
</script>

<style>
.top-top {
  background: #fff;
  z-index: 999999;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  height: 100vh;
  min-height: 100vh;
  width: 100%;
  min-width: 100%;
  flex-direction: column;
  justify-content: center;
  align-content: center;
}

.middle-text {
  display: flex;
  width: 100%;
  margin: auto auto;
  justify-content: center;
  color: white;
}
</style>
