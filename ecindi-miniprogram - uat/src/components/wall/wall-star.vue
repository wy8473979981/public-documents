<template>
  <swiper class="wall-star" next-margin="130rpx" :display-multiple-items="2">
    <swiper-item v-for="(item, index) in userAiHumans" :key="index">
      <div class="wall-star-item">
        <div class="wall-star-item-img-box">
          <div
            class="wall-star-item-img"
            :style="{
              backgroundImage: `url(${item.avatarURL})`
            }"
          ></div>
        </div>
        <div class="wall-star-item-name">{{ item.aiHumanName }}</div>
        <div class="wall-star-item-text">最高达成成绩</div>
        <div class="wall-star-item-box">
          <template v-if="item.maxStars">
            <img
              src="https://cdn.edesoft.com/cindi/upload/202405/27/288544.png"
              alt=""
              class="wall-star-item-star"
              v-for="indx in item.maxStars"
              :key="indx"
            />
          </template>
          <img
            src="https://cdn.edesoft.com/cindi/upload/202405/27/453429.png"
            alt=""
            class="wall-star-item-star"
            v-for="indx in 5 - item.maxStars"
            :key="indx"
          />
        </div>
        <div class="wall-star-item-butt" @click="openMoreInvite">去刷星</div>
      </div>
    </swiper-item>
  </swiper>
</template>

<script>
export default {
  props: {
    userAiHumans: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    openMoreInvite() {
      uni.navigateTo({
        url: `/pages/training/targeted`
      })
    }
  }
}
</script>

<style scoped>
.wall-star {
  width: 100vw;
  box-sizing: border-box;
  margin-top: 32rpx;
  height: 474rpx;
  padding-left: 30rpx;
}
.wall-star-item {
  width: 260rpx;
  height: 474rpx;
  border-radius: 32rpx;
  background-color: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 16rpx;
  padding: 0 10rpx;
  box-sizing: border-box;
}
.wall-star-item-img-box {
  width: 176rpx;
  height: 176rpx;
  margin-top: 40rpx;
  border-radius: 16rpx;
  flex-shrink: 0;
  position: relative;
}

.wall-star-item-img {
  position: absolute;
  inset: 0 0 0 0;
  z-index: 0;
  height: 100%;
  border-radius: 16rpx;
  background: no-repeat center;
  background-size: cover;
}

.wall-star-item-name {
  width: 100%;
  color: #ffffff;
  font-size: 28rpx;
  margin-top: 24rpx;
  font-weight: bold;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  text-align: center;
}
.wall-star-item-text {
  color: rgba(255, 255, 255, 0.8);
  font-size: 18rpx;
  margin-top: 16rpx;
}
.wall-star-item-box {
  display: flex;
  align-items: center;
  margin-top: 16rpx;
  margin-bottom: 32rpx;
}
.wall-star-item-star {
  width: 28rpx;
  height: 28rpx;
  margin-right: 8rpx;
}
.wall-star-item-butt {
  width: 128rpx;
  height: 56rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 28rpx;
  background-color: #ed171f;
  color: #fff;
  font-size: 26rpx;
  margin-bottom: 40rpx;
}
</style>
