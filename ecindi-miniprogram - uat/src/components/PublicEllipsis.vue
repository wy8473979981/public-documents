<template>
  <span class="ellipsis" :style="{ color: color, fontSize: fontSize }"></span>
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      default: '#fff'
    },
    fontSize: {
      type: String,
      default: '32rpx'
    }
  }
}
</script>

<style scoped>
.ellipsis:after {
  overflow: hidden;
  display: inline-block;
  vertical-align: bottom;
  animation: ellipsis steps(4, end) 1000ms infinite;
  content: '\2026'; /* ascii code for the ellipsis character */
  width: 0px;
}
@keyframes ellipsis {
  to {
    width: 1.25em;
  }
}
</style>
