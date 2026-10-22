<template>
  <span>
    <span
      v-for="(item, index) in nodes"
      :key="index"
      :class="{ bold: item.isBold }"
    >
      {{ item.text }}
    </span>
  </span>
</template>

<script>
export default {
  name: 'BoldParser',
  props: {
    content: {
      type: String,
      default: ''
    }
    // boldClass: {
    //   type: String,
    //   default: ''
    // },
    // normalClass: {
    //   type: String,
    //   default: ''
    // }
  },
  data() {
    return {}
  },
  computed: {
    nodes() {
      const result = []

      // split text by **
      const parts = this.content.split('**')
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i]
        if (i % 2 === 0) {
          // normal text
          result.push({
            text: part,
            isBold: false
          })
        } else {
          // bold text
          result.push({
            text: part,
            isBold: true
          })
        }
      }

      return result
    }
  }
}
</script>

<style scoped>
.bold {
  font-weight: bold;
  color: #ff8433;
}
</style>
