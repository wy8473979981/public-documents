<template>
  <div class="wall-medal">
    <div class="medal-content" v-for="(item, index) in userMedals" :key="index">
      <div class="medal-content-top">
        <div class="medal-content-top-line"></div>
        <div class="medal-content-top-title">{{ item.medalCateName }}</div>
        <div class="medal-content-top-line"></div>
      </div>
      <div class="medal-content-list">
        <div
          class="medal-content-list-item"
          v-for="(medal, idx) in item.list"
          :key="idx"
        >
          <img :src="medal.icon" alt="" class="medal-content-list-item-img" />
          <div class="medal-content-list-item-title">
            {{ medal.medalName || '' }}
          </div>
          <div class="medal-content-list-item-text">
            {{ medal.shortReason || medal.reason || '' }}
          </div>
          <div class="medal-content-list-item-butt1" v-if="medal.isWearing">
            已佩戴
          </div>
          <div
            class="medal-content-list-item-butt2"
            v-else
            @click="clickWearing(medal.id)"
          >
            佩戴
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    userMedals: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    clickWearing(id) {
      this.$emit('clickWearing', id)
    }
  }
}
</script>

<style scoped>
.wall-medal {
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30rpx;
  box-sizing: border-box;
}
.medal-content {
  width: 100%;
  border-radius: 32rpx;
  background-color: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.5);
  margin-bottom: 30rpx;
}
.medal-content-top {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40rpx;
  width: 100%;
  box-sizing: border-box;
}
.medal-content-top-title {
  font-size: 34rpx;
  font-weight: bold;
  color: #fff;
  margin: 0 40rpx;
  flex: 1;
  display: flex;
  justify-content: center;
}
.medal-content-top-line {
  width: 160rpx;
  height: 2rpx;
  background-color: rgba(255, 255, 255, 0.5);
}
.medal-content-list {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  padding-left: 42rpx;
  box-sizing: border-box;
}
.medal-content-list-item {
  width: 176rpx;
  margin-right: 40rpx;
  margin-bottom: 40rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 432rpx;
}
.medal-content-list-item-img {
  width: 176rpx;
  height: 176rpx;
  flex-shrink: 0;
}
.medal-content-list-item-title {
  margin-top: 24rpx;
  margin-bottom: 16rpx;
  font-weight: bold;
  color: #fff;
  font-size: 26rpx;
  width: 100%;
  height: 72rpx;
  text-align: center;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  word-break: break-all;
  line-height: 36rpx;
}
.medal-content-list-item-text {
  color: #787878;
  font-size: 18rpx;
  margin-bottom: 32rpx;
  width: 100%;
  height: 56rpx;
  text-align: center;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  word-break: break-all;
  line-height: 28rpx;
}
.medal-content-list-item-butt1 {
  width: 128rpx;
  height: 56rpx;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 28rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.3);
  font-size: 26rpx;
}
.medal-content-list-item-butt2 {
  width: 128rpx;
  height: 56rpx;
  border: 1px solid #ed171f;
  box-sizing: border-box;
  border-radius: 28rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ed171f;
  font-size: 26rpx;
}
</style>
