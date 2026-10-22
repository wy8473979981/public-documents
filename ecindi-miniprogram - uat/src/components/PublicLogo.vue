<template>
  <image
    src="../static/icons/2132975495.png"
    class="logo"
    mode="aspectFit"
    :style="{ margin: customMargin }"
  ></image>
</template>

<script>
export default {
  props: {
    customMargin: {
      type: String,
      default: '120rpx auto 60rpx'
    }
  }
}
</script>

<style scoped>
.logo {
  display: block;
  width: 158rpx;
  height: 32rpx;
}
</style>
