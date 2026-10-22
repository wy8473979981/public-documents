<template>
  <div class="card-list">
    <training-item
      v-for="(item, index) in list"
      :key="index"
      :item="item"
      @openExplain="openExplain"
    />
    <div v-if="list.length === 0" class="card-list-no">暂无数据</div>
    <explain-popup ref="explainRef"></explain-popup>
  </div>
</template>

<script>
import TrainingItem from './trainingItem.vue'
import ExplainPopup from '@/components/wall/explain-popup.vue'

export default {
  components: {
    TrainingItem,
    ExplainPopup
  },
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    openExplain() {
      this.$refs.explainRef.open()
    }
  }
}
</script>

<style scoped>
.card-list {
  margin-top: 24rpx;
  padding: 0 30rpx;
  min-height: 50vh;
}
.card-list-no {
  width: 100%;
  height: 50vh;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #888888;
  font-size: 32rpx;
}
</style>
