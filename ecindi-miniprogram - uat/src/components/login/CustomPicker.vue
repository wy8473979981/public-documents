<template>
  <uni-popup ref="popup" type="bottom">
    <div class="custom-popup-box">
      <div class="custom-picker-title">{{ title }}</div>
      <div class="custom-picker-list">
        <div
          class="custom-picker-list-item"
          v-for="(item, index) in list"
          :key="index"
          @click="selectItem(item)"
          :class="[
            item.id === currentID ? 'custom-picker-list-item-active' : ''
          ]"
        >
          <div
            class="custom-picker-list-item-son"
            :class="[
              item.id === currentID ? 'custom-picker-list-item-son-active' : ''
            ]"
          >
            {{ item[labelKey] ? item[labelKey] : '' }}
          </div>
        </div>
      </div>
      <div class="custom-picker-space"></div>
      <div class="custom-picker-butt" @click="cancel">取消</div>
    </div>
  </uni-popup>
</template>

<script>
import { uniPopup } from '@dcloudio/uni-ui'
export default {
  components: { uniPopup },
  props: {
    title: {
      type: String,
      default: '请选择'
    },
    list: {
      type: Array,
      default: () => []
    },
    labelKey: {
      type: String,
      default: 'name'
    },
    currentID: {
      type: Number,
      default: 0
    }
  },
  methods: {
    open() {
      this.$refs.popup.open()
    },
    cancel() {
      this.$refs.popup.close()
    },
    selectItem(item) {
      this.cancel()
      this.$emit('selectItem', item.id)
    }
  }
}
</script>

<style scoped>
.custom-popup-box {
  width: 100vw;
  border-radius: 24rpx 24rpx 0 0;
  background-color: #fff;
  padding-bottom: 50rpx;
}
.custom-picker-title {
  width: 100%;
  height: 110rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #000000;
  font-size: 34rpx;
  font-weight: bold;
  border-bottom: 1rpx solid #dcdcdc;
  box-sizing: border-box;
}

.custom-picker-list {
  width: 100%;
  overflow-y: auto;
  max-height: 256rpx;
}
.custom-picker-list-item {
  width: 100%;
  padding: 0 48rpx;
  box-sizing: border-box;
}

.custom-picker-list-item-active {
  background-color: rgba(243, 33, 89, 0.1);
}

.custom-picker-list-item-son {
  width: 100%;
  height: 102rpx;
  border-bottom: 1rpx solid #dcdcdc;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #000000;
  font-size: 26rpx;
}

.custom-picker-list-item-son-active {
  border: none;
  color: #ed171f;
}
.custom-picker-space {
  width: 100%;
  height: 20rpx;
  background-color: #f5f5f4;
}
.custom-picker-butt {
  width: 100%;
  height: 110rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #000000;
  font-size: 34rpx;
}
</style>
