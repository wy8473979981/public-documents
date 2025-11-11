<template>
  <div class="demo-image__preview">
    <el-image style="width: 100px; height: 100px" :src="url" :preview-src-list="srcList" fit="cover"
      @click="onPreviewOpen" />
  </div>
</template>

<script setup lang="ts">
import { nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { Download } from '@element-plus/icons-vue'

// 图片列表
const srcList = [
  'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
  'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',
  'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg',
]
const url = srcList[0]

// 监听打开预览
const onPreviewOpen = async () => {
  await nextTick()
  setTimeout(() => {
    insertDownloadButton()
  }, 300)
}

// 插入自定义下载按钮
const insertDownloadButton = () => {
  const toolbar = document.querySelector('.el-image-viewer__actions__inner')
  if (!toolbar) return

  // 避免重复添加
  if (toolbar.querySelector('.custom-download')) return

  // 创建下载按钮
  const btn = document.createElement('div')
  btn.className = 'custom-download'
  btn.title = '下载'
  btn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" 
         viewBox="0 0 1024 1024" 
         width="22" height="22">
      <path fill="currentColor"
        d="M480 64a32 32 0 0164 0v512l173.248-173.248a32 32 0 0145.504 45.504l-224 224a32 32 0 01-45.504 0l-224-224a32 32 0 0145.504-45.504L480 576V64zM192 832a32 32 0 0132-32h576a32 32 0 0132 32v64H192v-64z" />
    </svg>
  `
  btn.addEventListener('click', () => {
    const img = document.querySelector('.el-image-viewer__canvas img')
    if (img && img.src) {
      const link = document.createElement('a')
      link.href = img.src
      link.download = img.src.split('/').pop() || 'image.jpg'
      link.click()
      ElMessage.success('图片已开始下载')
    }
  })

  // 插入到操作栏中
  toolbar.appendChild(btn)
}
</script>

<style scoped>
/* 调整下载按钮间距，使其与默认按钮风格统一 */
.custom-download {
  height: 100%;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.custom-download:hover {
  opacity: 1;
}
</style>
