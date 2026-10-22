<template>
  <div class="training-targeted-picker-box">
    <div class="training-targeted-picker" @click="openPopup">
      <div class="training-targeted-picker-label">{{ trainingTypeName }}</div>
      <div class="training-targeted-picker-right">
        <span>筛选({{ selectFeatures.length }})</span>
        <img
          src="/static/icons/filter.png"
          alt=""
          class="training-targeted-picker-value-icon"
        />
      </div>
    </div>
    <!-- 浮层 -->
    <div
      :style="{ height: pickerHeight, top: showPopup ? '80rpx' : '-100vh' }"
      :class="['training-targeted-picker-float']"
    >
      <div
        class="training-targeted-picker-float-box"
        :style="{ height: pickerHeight }"
      >
        <div class="training-targeted-picker-float-left">
          <div
            v-for="(item, index) in features"
            :key="index"
            :class="[
              'training-targeted-picker-float-left-item',
              featureIndex === index
                ? 'training-targeted-picker-float-left-item-active'
                : ''
            ]"
            @click="changeFeature(index)"
          >
            {{ item.label }}
          </div>
        </div>
        <div class="training-targeted-picker-float-right">
          <div
            v-for="(item, index) in features"
            :key="index"
            class="training-targeted-picker-float-right-item"
          >
            <div class="training-targeted-picker-float-right-item-title">
              {{ item.label }}
            </div>
            <div
              class="raining-targeted-picker-float-right-item-son"
              v-if="item.children && item.children.length > 0"
            >
              <div
                v-for="(son, sonIndex) in item.children"
                :key="sonIndex"
                class="raining-targeted-picker-float-right-item-son-item"
                :class="[
                  handleSelected(son)
                    ? 'raining-targeted-picker-float-right-item-son-item-active'
                    : ''
                ]"
                @click="changeFeatureChildren(item.children, son)"
              >
                {{ son.label }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="training-targeted-picker-butt-box" v-if="showPopup">
        <div class="training-targeted-picker-butt-clear" @click="clearFeature">
          清空
        </div>
        <div class="training-targeted-picker-butt" @click="submitFeature">
          确认筛选({{ featureIds.length }})
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
    trainingTypeName: {
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
  data() {
    return {
      featureIndex: 0,
      featureIds: []
    }
  },
  computed: {
    selectLen() {
      return this.selectFeatures.length || 0
    }
  },
  watch: {
    selectLen(oldVal, newVal) {
      if (oldVal !== newVal) {
        this.featureIds = this.selectFeatures
      }
    }
  },
  methods: {
    openPopup() {
      this.featureIds = this.selectFeatures
      this.$emit('openPopup')
    },
    closePopup() {
      this.$emit('closePopup')
    },
    handleSelected(item) {
      let isSelect = this.featureIds.includes(item.value)
      return isSelect
    },
    changeFeatureChildren(children, son) {
      let values = children.map((item) => item.value)
      let nowValue = son.value
      values.forEach((val) => {
        if (val !== nowValue && this.featureIds.includes(val)) {
          this.featureIds = this.featureIds.filter((item) => item != val)
        }
      })
      if (this.featureIds.includes(nowValue)) {
        this.featureIds = this.featureIds.filter((item) => item != nowValue)
      } else {
        this.featureIds = [...this.featureIds, nowValue]
      }
    },
    clearFeature() {
      this.featureIds = []
    },
    submitFeature() {
      this.closePopup()
      this.$emit('submitFeature', this.featureIds)
    },
    changeFeature(index) {
      this.featureIndex = index
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
  justify-content: space-between;
  padding: 0 32rpx;
  box-sizing: border-box;
  border-top: 2rpx solid rgba(255, 255, 255, 0.1);
  border-bottom: 2rpx solid rgba(255, 255, 255, 0.1);
}
.training-targeted-picker-label {
  color: rgba(255, 255, 255, 0.8);
  font-size: 26rpx;
}

.training-targeted-picker-right {
  display: flex;
  align-items: center;
  font-weight: 500;
  font-size: 26rpx;
  color: #ff8433;
}

.training-targeted-picker-value-icon {
  width: 26rpx;
  height: 26rpx;
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
  transition: 0.5s bottom linear;
}
.training-targeted-picker-float-box {
  width: 100%;
  background-color: #38353c;
  flex: 1;
  display: flex;
  padding-bottom: 176rpx;
  box-sizing: border-box;
}
.training-targeted-picker-float-left {
  width: 246rpx;
  height: 100%;
  display: flex;
  flex-direction: column;
  border-right: 2rpx solid rgba(255, 255, 255, 0.1);
  overflow-y: auto;
}

.training-targeted-picker-float-left-item {
  width: 100%;
  min-height: 100rpx;
  display: flex;
  align-items: center;
  padding: 0 16rpx;
  box-sizing: border-box;
  color: rgba(255, 255, 255, 0.8);
  font-size: 26rpx;
  cursor: pointer;
}

.training-targeted-picker-float-left-item-active {
  color: #ff8433;
  font-weight: bold;
  background-color: rgba(255, 255, 255, 0.1);
}

.training-targeted-picker-float-right {
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}
.training-targeted-picker-float-right-item {
  width: 100%;
  display: flex;
  flex-direction: column;
  padding-left: 32rpx;
  padding-right: 16rpx;
  padding-top: 14rpx;
  box-sizing: border-box;
}
.training-targeted-picker-float-right-item-title {
  font-weight: 600;
  font-size: 30rpx;
  color: #fff;
  padding-top: 16rpx;
  padding-bottom: 24rpx;
}
.raining-targeted-picker-float-right-item-son {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}
.raining-targeted-picker-float-right-item-son-item {
  margin-right: 16rpx;
  margin-bottom: 24rpx;
  min-width: 136rpx;
  height: 48rpx;
  border-radius: 32rpx;
  background-color: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.75);
}
.raining-targeted-picker-float-right-item-son-item-active {
  color: #fff;
  background-image: linear-gradient(to right, #f32159, #f15116, #f15116);
}
/* 按钮 */
.training-targeted-picker-butt-box {
  position: fixed;
  z-index: 999;
  left: 0;
  bottom: 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 176rpx;
  padding: 24rpx 32rpx;
  box-sizing: border-box;
  background-color: #38353c;
}
.training-targeted-picker-butt-clear {
  color: #ed171f;
  font-size: 30rpx;
}
.training-targeted-picker-butt {
  width: 594rpx;
  height: 72rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ed171f;
  border-radius: 36rpx;
  color: #ffffff;
  font-size: 30rpx;
}
</style>
