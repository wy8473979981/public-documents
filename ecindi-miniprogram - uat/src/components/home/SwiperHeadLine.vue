<template>
  <div class="card4" v-if="headlines.length > 0">
    <swiper
      class="card4-swiper"
      autoplay
      :interval="5000"
      :duration="500"
      circular
    >
      <swiper-item
        v-for="(item, index) in headlines"
        :key="index"
        class="card4-swiper-item"
      >
        <div class="card4_text">{{ item.title }}</div>
        <div class="card4_bullet_item">
          {{ item.content }}
        </div>
      </swiper-item>
    </swiper>
  </div>
</template>
<script>
export default {
  props: {
    headlines: {
      type: Array,
      default: () => []
    }
  }
}
</script>
<style scoped>
.card4 {
  display: flex;
  flex-direction: column;
  height: 186rpx;
  border-radius: 32rpx;
  background-image: linear-gradient(
    to bottom right,
    rgba(201, 159, 66, 0.5),
    rgba(127, 124, 117, 0.5)
  );
}

.card4-swiper {
  width: 100%;
}
.card4-swiper-item {
  padding: 0 32rpx;
  box-sizing: border-box;
  width: 100%;
}
.card4_text {
  padding: 0 0;
  margin-top: 24rpx;
  margin-bottom: 16rpx;
  font-size: 34rpx;
  font-weight: 500;
  color: #fff;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 646rpx;
}
.card4_bullet_item {
  width: 100%;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  font-size: 22rpx;
  line-height: 34rpx;
  color: rgba(255, 255, 255, 0.8);
}
</style>
