<template>
  <div class="directory-demo">
    <h1>目录选择器演示</h1>
    <directory-selector :initial-directories="sampleDirectories" />
  </div>
</template>

<script>
import DirectorySelector from '@/components/DirectorySelector.vue';

export default {
  name: 'DirectoryDemo',
  components: {
    DirectorySelector
  },
  data() {
    return {
      sampleDirectories: [
        {
          name: 'src',
          children: [
            {
              name: 'components',
              children: [{ name: 'subcomponent1' }, { name: 'subcomponent2' }]
            },
            {
              name: 'views',
              children: [{ name: 'page1' }, { name: 'page2' }]
            }
          ]
        },
        {
          name: 'public',
          children: [{ name: 'images' }, { name: 'fonts' }]
        }
      ]
    };
  }
};
</script>

<style scoped>
.directory-demo {
  padding: 20px;
}
</style>
