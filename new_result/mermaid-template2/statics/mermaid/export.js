/**
 * GitGraph 图表导出模块
 * 使用 html-to-image 实现图表导出为图片功能
 */

(function () {
  'use strict';

  // 导出按钮
  const exportBtn = document.getElementById('export-btn');

  // 重置视图按钮
  const fitViewBtn = document.getElementById('fit-view-btn');

  /**
   * 评估图表复杂度并返回合适的 quality 值
   * 复杂度越低，quality 越高（图片小，可以提高质量）
   * 复杂度越高，quality 越低（图片大，需要降低质量控制体积）
   * @returns {number} 推荐的 quality 值 (0.5-0.8)
   */
  function calculateDynamicQuality() {
    // 获取 SVG 图表元素
    const svgElement = document.querySelector('#mermaid-chart svg');
    if (!svgElement) {
      return 0.8; // 默认高质量
    }

    // 获取图表尺寸
    const svgRect = svgElement.getBoundingClientRect();
    const area = svgRect.width * svgRect.height;

    // 计算 SVG 中的元素数量作为复杂度指标
    const allElements = svgElement.querySelectorAll('*');
    const elementCount = allElements.length;

    // 计算路径和形状的数量（更复杂的图形元素）
    const pathCount = svgElement.querySelectorAll('path').length;
    const textCount = svgElement.querySelectorAll('text').length;
    const groupCount = svgElement.querySelectorAll('g').length;

    // 综合复杂度评分
    let complexityScore = 0;

    // 基于元素数量的评分
    complexityScore += elementCount * 0.5;

    // 基于面积的评分 (每 100000 像素面积加 1 分)
    complexityScore += area / 100000;

    // 基于特定元素类型的加权评分
    complexityScore += pathCount * 0.3; // 路径通常更复杂
    complexityScore += textCount * 0.2; // 文本元素
    complexityScore += groupCount * 0.1; // 分组元素

    // 根据复杂度评分确定 quality (范围: 0.5-0.8)
    // 复杂度低 -> 高质量(0.8)，复杂度高 -> 低质量(0.5)
    if (complexityScore < 50) {
      return 0.8; // 简单图表，使用最高质量
    } else if (complexityScore < 100) {
      return 0.75; // 较简单图表
    } else if (complexityScore < 150) {
      return 0.7; // 中等复杂度
    } else if (complexityScore < 200) {
      return 0.65; // 中等偏复杂
    } else if (complexityScore < 250) {
      return 0.6; // 较复杂图表
    } else if (complexityScore < 300) {
      return 0.55; // 复杂图表
    } else {
      return 0.5; // 非常复杂图表，使用最低质量控制体积
    }
  }

  /**
   * 评估图表复杂度并返回合适的 pixelRatio 值
   * @returns {number} 推荐的 pixelRatio 值 (1-6, 间隔: 0.5)
   */
  function calculateDynamicPixelRatio() {
    // 获取 SVG 图表元素
    const svgElement = document.querySelector('#mermaid-chart svg');
    if (!svgElement) {
      return 2; // 默认值
    }

    // 获取图表尺寸
    const svgRect = svgElement.getBoundingClientRect();
    const area = svgRect.width * svgRect.height;

    // 计算 SVG 中的元素数量作为复杂度指标
    const allElements = svgElement.querySelectorAll('*');
    const elementCount = allElements.length;

    // 计算路径和形状的数量（更复杂的图形元素）
    const pathCount = svgElement.querySelectorAll('path').length;
    const textCount = svgElement.querySelectorAll('text').length;
    const groupCount = svgElement.querySelectorAll('g').length;

    // 综合复杂度评分
    let complexityScore = 0;

    // 基于元素数量的评分
    complexityScore += elementCount * 0.5;

    // 基于面积的评分 (每 100000 像素面积加 1 分)
    complexityScore += area / 100000;

    // 基于特定元素类型的加权评分
    complexityScore += pathCount * 0.3; // 路径通常更复杂
    complexityScore += textCount * 0.2; // 文本元素
    complexityScore += groupCount * 0.1; // 分组元素

    // 根据复杂度评分确定 pixelRatio (范围: 1-6, 间隔: 0.5)
    if (complexityScore < 20) {
      return 2; // 简单图表
    } else if (complexityScore < 60) {
      return 2.5; // 较简单图表
    } else if (complexityScore < 100) {
      return 3; // 中等复杂度
    } else if (complexityScore < 140) {
      return 4.5; // 中等偏复杂
    } else if (complexityScore < 180) {
      return 5; // 较复杂图表
    } else if (complexityScore < 220) {
      return 5.5; // 复杂图表
    } else if (complexityScore < 260) {
      return 6; // 很复杂图表
    } else if (complexityScore < 300) {
      return 6.5; // 非常复杂图表
    } else if (complexityScore < 340) {
      return 7; // 极复杂图表
    } else if (complexityScore < 380) {
      return 7.5; // 超级复杂图表
    } else {
      return 8; // 极其复杂图表
    }
  }

  /**
   * 导出整个页面为图片
   */
  async function exportChart() {
    if (!window.htmlToImage) {
      console.error('导出功能初始化失败:缺少html-to-image库');
      return;
    }

    try {
      // 显示加载状态
      exportBtn.textContent = '导出中...';
      exportBtn.disabled = true;

      // 先重置视图到合适大小
      if (fitViewBtn) {
        fitViewBtn.click();
        // 等待视图重置完成
        await new Promise((resolve) => setTimeout(resolve, 300));
      }

      console.log('开始导出整个页面...');

      // 获取图表标题作为文件名
      const chartTitleElement = document.getElementById('chart-title');
      const chartTitle = chartTitleElement
        ? chartTitleElement.textContent.trim()
        : 'chart';
      // 清理文件名，移除特殊字符
      const fileName =
        chartTitle.replace(/[^\u4e00-\u9fa5a-zA-Z0-9_-]/g, '_') || 'chart';

      // 使用 html-to-image 导出整个页面，排除导出按钮和toolbar
      // 动态计算 pixelRatio 和 quality 基于图表复杂度
      const dynamicPixelRatio = calculateDynamicPixelRatio();
      const dynamicQuality = calculateDynamicQuality();
      console.log(`图表复杂度评估: pixelRatio=${dynamicPixelRatio}, quality=${dynamicQuality}`);

      const dataUrl = await htmlToImage.toJpeg(document.body, {
        backgroundColor: '#f9f9f9',
        quality: dynamicQuality,
        pixelRatio: dynamicPixelRatio,
        cacheBust: true,
        // 跳过字体嵌入，避免本地文件的 CORS 问题
        skipFonts: true,
        fontEmbedCSS: '',
        filter: (node) => {
          // 排除导出按钮和toolbar
          return (
            node !== exportBtn &&
            !(node.classList && node.classList.contains('toolbar'))
          );
        },
      });

      // 下载图片
      const link = document.createElement('a');
      link.download = `${fileName}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('导出图片失败:', error);
      alert(`导出图片失败: ${error.message}`);
    } finally {
      // 恢复按钮状态
      exportBtn.textContent = '导出图片';
      exportBtn.disabled = false;
    }
  }

  /**
   * 初始化导出功能
   */
  function initExport() {
    if (exportBtn) {
      exportBtn.addEventListener('click', exportChart);
    }
  }

  // 页面加载完成后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initExport);
  } else {
    initExport();
  }

  // 暴露到全局作用域
  window.exportChart = exportChart;
})();
