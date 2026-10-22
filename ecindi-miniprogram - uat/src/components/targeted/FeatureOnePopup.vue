<template>
  <div class="training-targeted-picker-box">
    <div class="training-targeted-picker" @click="openPopup">
      <div class="training-targeted-picker-label">{{ selectLabel }}</div>
      <img
        src="/static/icons/up-white.png"
        alt=""
        class="training-targeted-picker-value-icon"
        :style="{
          transform: showPopup ? '' : 'rotate(180deg)'
        }"
      />
    </div>
    <!-- 浮层 -->
    <div
      :style="{ height: pickerHeight, top: showPopup ? '80rpx' : '-100vh' }"
      :class="['training-targeted-picker-float']"
      @click.stop="closePopup"
    >
      <div class="training-targeted-picker-float-box">
        <div
          class="training-targeted-picker-float-item"
          :class="[
            handleSelected(item)
              ? 'training-targeted-picker-float-item-active '
              : ''
          ]"
          v-for="(item, index) in showFeatures"
          :key="index"
          @click="submitFeature(item)"
        >
          <div>{{ item.label }}</div>
          <div v-if="handleSelected(item)">✓</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    showPopup: {
      type: Boolean,
      default: false
    },
    pickerHeight: {
      type: String,
      default: ''
    },
    features: {
      type: Array,
      default: () => []
    },
    selectFeatures: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    showFeatures() {
      if (this.features && this.features.length > 0) {
        return this.features[0].children || []
      }
      return []
    },
    selectLabel() {
      let findData = this.showFeatures.find((item) =>
        this.selectFeatures.includes(item.value)
      )
      if (findData && findData.label) return findData.label
      return this.showFeatures[0].label || ''
    }
  },
  methods: {
    openPopup() {
      this.$emit('openPopup')
    },
    closePopup() {
      this.$emit('closePopup')
    },
    handleSelected(item) {
      if (this.selectFeatures.length === 0 && item.value === 0) return true
      let isSelect = this.selectFeatures.includes(item.value)
      return isSelect
    },
    submitFeature(item) {
      this.$emit('submitFeature', [item.value])
    }
  }
}
</script>

<style>
/* picker */
.training-targeted-picker-box {
  position: relative;
  width: 100%;
}
.training-targeted-picker {
  width: 100%;
  height: 80rpx;
  background-color: #31313c;
  display: flex;
  align-items: center;
  padding: 0 32rpx;
  box-sizing: border-box;
  border-top: 2rpx solid rgba(255, 255, 255, 0.1);
  border-bottom: 2rpx solid rgba(255, 255, 255, 0.1);
}
.training-targeted-picker-label {
  color: rgba(255, 255, 255, 0.8);
  font-size: 26rpx;
}

.training-targeted-picker-value-icon {
  width: 24rpx;
  height: 24rpx;
  margin-left: 12rpx;
}
/* 弹出层 */
.training-targeted-picker-float {
  position: absolute;
  z-index: 11;
  left: 0;
  top: -100vh;
  background-color: rgba(0, 0, 0, 0.8);
  width: 100%;
  overflow-y: auto;
  transition: 0.5s left linear;
}
.training-targeted-picker-float-box {
  width: 100%;
  background-color: #38353c;
}
.training-targeted-picker-float-item {
  position: relative;
  width: 100%;
  height: 100rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32rpx;
  box-sizing: border-box;
  color: rgba(255, 255, 255, 0.8);
  font-size: 26rpx;
  cursor: pointer;
}

.training-targeted-picker-float-item-active {
  color: #ff8433;
  font-weight: bold;
  background-color: rgba(255, 255, 255, 0.1);
}
</style>
