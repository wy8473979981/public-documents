<template>
  <div class="result-star-page" @touchmove.stop.prevent>
    <div class="result-star-box">
      <div class="result-star-title">
        {{ trainingTips }}
      </div>
      <div class="result-star-total">获得{{ stars }}颗星级</div>
      <div class="result-star-count">
        <template v-if="stars">
          <img
            src="https://cdn.edesoft.com/cindi/upload/202405/27/288544.png"
            alt=""
            class="result-star-count-icon"
            v-for="index in stars"
            :key="index"
          />
        </template>
        <img
          src="https://cdn.edesoft.com/cindi/upload/202405/27/453429.png"
          alt=""
          class="result-star-count-icon"
          v-for="index in 5 - stars"
          :key="index"
        />
        <img
          src="https://cdn.edesoft.com/cindi/upload/202405/27/327386.png"
          alt=""
          class="result-star-count-img"
        />
      </div>
    </div>
    <div class="result-star-butt" @click="knowTrainingNoticeStar">知道了</div>
  </div>
</template>

<script>
export default {
  props: {
    aiHumanName: {
      type: String,
      default: ''
    },
    stars: {
      type: Number,
      default: 0
    },
    trainingType: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      MAPPINGS: {
        kyc: 'KYC',
        precase: 'PRE-CASE'
      }
    }
  },
  computed: {
    trainingTypeObj() {
      return this.trainingType || {}
    },
    // 是否KYC
    isKyc() {
      return this.trainingTypeObj.name === 'KYC'
    },
    // 是否定向训练
    isOrient() {
      return this.trainingTypeObj.isOrient
    },
    // 是否产品知识测试
    isKnowledge() {
      return this.trainingTypeObj.hasPdf
    },
    // 是否PreCase
    isPreCase() {
      return this.trainingTypeObj.isPreCase
    },
    trainingTypeName() {
      return this.trainingTypeObj.name || ''
    },
    // 简化训练类型名称
    trainingTips() {
      // precase
      if (this.isPreCase) {
        return '您在本次的案前准备训练中:'
      }

      // 其他
      let typeName = this.trainingTypeName.replace(/客户/g, '')
      // 去掉训练
      typeName = typeName.replace('训练', '')
      if (this.isPreCase) {
        typeName = '案前准备'
      }
      return `您在本次与客户${this.aiHumanName}的${typeName}训练中:`
    }
  },
  methods: {
    // open() {
    //   this.show = true
    // },
    // close() {
    //   this.show = false
    // },
    async knowTrainingNoticeStar() {
      // this.close()
      this.$emit('knowTrainingNoticeStar')
    }
  }
}
</script>

<style scoped>
.result-star-page {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 333;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9);
}
.result-star-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 30rpx;
  box-sizing: border-box;
  width: 100%;
  margin-top: 420rpx;
}
.result-star-title {
  color: rgba(255, 255, 255, 0.8);
  font-size: 34rpx;
  margin-bottom: 32rpx;
}
.result-star-total {
  font-size: 52rpx;
  color: #fff;
}
.result-star-count {
  position: relative;
  padding: 48rpx 0;
  width: 100%;
  display: flex;
  justify-content: center;
}
.result-star-count-icon {
  width: 76rpx;
  height: 76rpx;
  margin-right: 20rpx;
}
.result-star-count-icon:nth-last-child(1) {
  margin-right: 0rpx;
}
.result-star-count-img {
  position: absolute;
  left: 0;
  right: 0;
  top: -48rpx;
  margin: auto;
  height: 144rpx;
  width: 100%;
}

.result-star-butt {
  position: fixed;
  bottom: 96rpx;
  right: 0;
  left: 0;
  margin: auto;
  z-index: 336;
  height: 112rpx;
  width: calc(100% - 96rpx);
  border-radius: 56rpx;
  background-color: #ed171f;
  color: #fff;
  font-size: 38rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
