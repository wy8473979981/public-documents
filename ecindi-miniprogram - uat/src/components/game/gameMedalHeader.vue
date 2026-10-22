<template>
  <div class="person-header">
    <img
      src="https://cdn.edesoft.com/cindi/upload/202405/27/046427.png"
      alt=""
      srcset=""
      class="person-header-celebrate"
    />
    <img
      :src="item.medal.icon"
      alt=""
      class="person-header-icon"
      v-if="item && item.medal && item.medal.icon"
    />
    <div>
      <div class="person-header-title">
        排行榜{{ item.x === '1' ? 'TOP1' : `TOP1 - ${item.x}` }}
      </div>
      <div class="person-header-text">
        即可获得【{{
          item && item.medal && item.medal.medalName
            ? item.medal.medalName
            : ''
        }}】活动勋章
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default: () => {}
    }
  }
}
</script>

<style scoped>
.person-header {
  width: calc(100% - 60rpx);
  padding: 0 30rpx;
  box-sizing: border-box;
  margin: 32rpx auto 40rpx;
  border-radius: 32rpx;
  height: 160rpx;
  background-image: linear-gradient(
    to right,
    hsla(24, 100%, 60%, 0.5),
    hsla(24, 100%, 60%, 0.1)
  );
  display: flex;
  align-items: center;
  padding-left: 184rpx;
  padding-right: 30rpx;
}

.person-header-celebrate {
  width: 240rpx;
  height: 160rpx;
  position: absolute;
  left: 6rpx;
  z-index: -1;
}
.person-header-icon {
  width: 128rpx;
  height: 128rpx;
  position: absolute;
  left: 60rpx;
  z-index: 2;
}
.person-header-title {
  font-size: 30rpx;
  font-weight: bold;
  line-height: 42rpx;
  color: #fff;
}
.person-header-text {
  font-size: 28rpx;
  line-height: 40rpx;
  color: #fff;
}
</style>
