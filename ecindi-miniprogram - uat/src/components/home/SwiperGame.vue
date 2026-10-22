<template>
  <div class="card2" v-if="headlines.length > 0">
    <swiper
      class="card2-swiper"
      autoplay
      :interval="5000"
      :duration="500"
      circular
    >
      <swiper-item
        v-for="(item, index) in headlines"
        :key="index"
        class="card2-swiper-item"
        @click="goNavPage(item)"
      >
        <div class="card2_text">{{ handleHeadLine(item) }}</div>
        <img
          :src="item.bannerURL"
          alt=""
          srcset=""
          v-if="item.bannerURL"
          class="card2_bullet_item"
        />
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
  },
  methods: {
    goNavPage(item) {
      uni.navigateTo({
        url: `/pages/game/index?id=${item.id}`
      })
    },
    handleHeadLine(item) {
      let nowDate = this.$dayjs().format('YYYY-MM-DD')
      // 未开始 、进行中、已完成
      let openDate = this.$dayjs(item.openDate).format('YYYY-MM-DD')
      let closeDate = this.$dayjs(item.closeDate).format('YYYY-MM-DD')
      if (nowDate < openDate) return '未开始'
      if (nowDate >= openDate && nowDate <= closeDate) return '进行中'
      if (nowDate > closeDate) return '已完成'
      return '-'
    }
  }
}
</script>
<style scoped>
/* 第二个card */
.card2 {
  display: flex;
  flex-direction: column;
  height: 186rpx;
  border-radius: 32rpx;
  background-image: linear-gradient(
    to bottom right,
    rgba(243, 33, 89, 0.5),
    rgba(241, 81, 22, 0.5)
  );
}

.card2-swiper {
  width: 100%;
}
.card2-swiper-item {
  position: relative;
  width: 100%;
}
.card2_text {
  position: absolute;
  top: 12rpx;
  left: 12rpx;
  border-radius: 12rpx;
  background-color: rgba(255, 255, 255, 0.12);
  border: 1rpx solid rgba(255, 255, 255, 0.2);
  box-sizing: border-box;
  padding: 6rpx 12rpx;
  font-size: 22rpx;
  color: #fff;
}
.card2_bullet_item {
  width: 100%;
  height: 186rpx;
  border-radius: 32rpx;
}
</style>
