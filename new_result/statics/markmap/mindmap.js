// mindmap.js
(function () {
  'use strict';

  function init() {
    const markdownScript = document.getElementById('mindmap-markdown');
    if (!markdownScript) {
      console.error('未找到 #mindmap-markdown 脚本标签');
      return;
    }

    const markdown = markdownScript.textContent.trim();

    if (!markdown) {
      console.warn('Markdown 内容为空');
      return;
    }

    if (
      typeof markmap === 'undefined' ||
      typeof markmap.create !== 'function'
    ) {
      console.error('markmap 未加载，请检查资源顺序');
      return;
    }

    try {
      markmap.create('#mindmap', markdown, {
        preset: 'colorful',
      });
      setTimeout(function () {
        var svg = d3.select('#mindmap');
        if (!svg) {
          console.error('未找到 #mindmap 容器元素');
          return;
        }

        var g = svg.select('g');
        if (!g) {
          console.warn('未找到 <g> 元素');
          return;
        }
      }, 100);
    } catch (err) {
      console.error('Markmap 渲染失败:', err);
    }
  }

  // 自适应思维导图到可视区域
  function fitMindmapToView() {
    const svg = d3.select('#mindmap');
    if (!svg.empty()) {
      const g = svg.select('g');
      if (!g.empty()) {
        // 获取SVG容器的尺寸
        const svgElement = document.getElementById('mindmap');
        const svgRect = svgElement.getBoundingClientRect();
        
        // 获取内容的边界框
        try {
          const bbox = g.node().getBBox();
          if (bbox.width > 0 && bbox.height > 0) {
            // 计算缩放比例，留一些边距
            const padding = 40;
            const scaleX = (svgRect.width - padding * 2) / bbox.width;
            const scaleY = (svgRect.height - padding * 2) / bbox.height;
            const scale = Math.min(scaleX, scaleY);
            
            // 计算平移量，使内容居中
            const centerX = svgRect.width / 2;
            const centerY = svgRect.height / 2;
            const contentCenterX = bbox.x + bbox.width / 2;
            const contentCenterY = bbox.y + bbox.height / 2;
            
            const translateX = centerX - contentCenterX * scale;
            const translateY = centerY - contentCenterY * scale;
            
            // 应用变换
            g.attr('transform', `translate(${translateX}, ${translateY}) scale(${scale})`);
            
            console.log('思维导图已自适应到可视区域');
            return true;
          }
        } catch (e) {
          console.warn('获取边界框失败:', e);
        }
      }
    }
    return false;
  }

  // 导出思维导图为PNG图片
  function exportMindmap() {
    const svgElement = document.getElementById('mindmap');
    if (!svgElement) {
      alert('思维导图尚未加载完成,请稍后再试');
      return;
    }
  
    // 获取根节点名称（从Markdown的第一行 # 标题中提取）
    function getRootNodeName() {
      const markdownScript = document.getElementById('mindmap-markdown');
      if (markdownScript) {
        const markdown = markdownScript.textContent.trim();
        const lines = markdown.split('\n');
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim();
          if (line.startsWith('# ')) {
            return line.substring(2).trim();
          }
        }
      }
      return '思维导图';
    }
  
    try {
      console.log('开始导出思维导图...');
      
      // 导出前先自适应到可视区域
      console.log('正在调整思维导图到可视区域...');
      fitMindmapToView();
      
      // 等待渲染更新
      setTimeout(function() {
        // 获取SVG的实际尺寸
        const svgRect = svgElement.getBoundingClientRect();
        console.log('SVG尺寸:', svgRect.width, 'x', svgRect.height);
              
        if (svgRect.width === 0 || svgRect.height === 0) {
          alert('思维导图尚未渲染完成,请稍后再试');
          return;
        }
              
        // 克隆SVG节点
        const clonedSvg = svgElement.cloneNode(true);
              
        // 设置克隆SVG的宽高属性
        clonedSvg.setAttribute('width', svgRect.width);
        clonedSvg.setAttribute('height', svgRect.height);
        clonedSvg.setAttribute('viewBox', `0 0 ${svgRect.width} ${svgRect.height}`);
              
        // 添加xmlns属性
        if (!clonedSvg.getAttribute('xmlns')) {
          clonedSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        }
              
        // 获取所有计算后的样式并内联
        const allElements = clonedSvg.querySelectorAll('*');
        const originalElements = svgElement.querySelectorAll('*');
              
        allElements.forEach((el, index) => {
          if (index < originalElements.length) {
            const originalEl = originalElements[index];
            try {
              const computedStyle = window.getComputedStyle(originalEl);
                    
              // 处理路径元素（连线）
              if (el.tagName === 'path') {
                el.setAttribute('stroke', computedStyle.stroke || computedStyle.getPropertyValue('stroke'));
                el.setAttribute('stroke-width', computedStyle.strokeWidth || computedStyle.getPropertyValue('stroke-width'));
                el.setAttribute('fill', computedStyle.fill || computedStyle.getPropertyValue('fill'));
              }
                    
              // 处理文本元素
              if (el.tagName === 'text' || el.tagName === 'tspan') {
                el.setAttribute('fill', computedStyle.fill || computedStyle.getPropertyValue('fill'));
                el.setAttribute('font-size', computedStyle.fontSize || computedStyle.getPropertyValue('font-size'));
                el.setAttribute('font-family', computedStyle.fontFamily || computedStyle.getPropertyValue('font-family'));
              }
                    
              // 处理圆形元素
              if (el.tagName === 'circle') {
                el.setAttribute('fill', computedStyle.fill || computedStyle.getPropertyValue('fill'));
                el.setAttribute('stroke', computedStyle.stroke || computedStyle.getPropertyValue('stroke'));
                el.setAttribute('stroke-width', computedStyle.strokeWidth || computedStyle.getPropertyValue('stroke-width'));
              }
            } catch (e) {
              console.warn('处理元素样式时出错:', e);
            }
          }
        });
              
        // 序列化SVG
        const serializer = new XMLSerializer();
        let svgString = serializer.serializeToString(clonedSvg);
              
        // 确保XML声明
        if (!svgString.match(/^<\?xml/)) {
          svgString = '<?xml version="1.0" encoding="UTF-8"?>\n' + svgString;
        }
              
        console.log('SVG字符串长度:', svgString.length);
              
        // 创建Canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
              
        // 设置Canvas尺寸（2倍分辨率）
        const scale = 2;
        canvas.width = svgRect.width * scale;
        canvas.height = svgRect.height * scale;
              
        console.log('Canvas尺寸:', canvas.width, 'x', canvas.height);
              
        // 缩放上下文
        ctx.scale(scale, scale);
              
        // 使用encodeURIComponent处理SVG字符串
        const svgBlob = new Blob([svgString], {type: 'image/svg+xml;charset=utf-8'});
        const url = URL.createObjectURL(svgBlob);
              
        console.log('Blob URL已创建');
              
        // 创建Image对象
        const img = new Image();
              
        img.onload = function() {
          console.log('SVG图片加载成功，尺寸:', img.width, 'x', img.height);
          try {
            // 设置白色背景
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, svgRect.width, svgRect.height);
            
            // 绘制到canvas
            ctx.drawImage(img, 0, 0, svgRect.width, svgRect.height);
            console.log('绘制完成');
                  
            // 转换为PNG
            const pngUrl = canvas.toDataURL('image/png');
            console.log('PNG转换完成');
                  
            // 下载
            const downloadLink = document.createElement('a');
            downloadLink.href = pngUrl;
            const rootNodeName = getRootNodeName() || '思维导图';
            downloadLink.download = rootNodeName + '_' + new Date().getTime() + '.png';
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
                  
            console.log('导出成功！');
            URL.revokeObjectURL(url);
          } catch (drawError) {
            console.error('绘制或转换失败:', drawError);
            alert('导出图片失败：' + drawError.message);
            URL.revokeObjectURL(url);
          }
        };
              
        img.onerror = function(event) {
          console.error('SVG图片加载失败');
          console.error('事件对象:', event);
          alert('导出图片失败：SVG图片无法加载\n请查看控制台获取详细信息');
          URL.revokeObjectURL(url);
        };
              
        console.log('开始加载SVG图片...');
        img.src = url;
          
      }, 300); // 等待300ms让自适应调整完成渲染
        
    } catch (error) {
      console.error('导出失败:', error);
      console.error('错误堆栈:', error.stack);
      alert('导出图片失败:' + error.message + '\n请查看控制台获取详细信息');
    }
  }

  // 将导出函数暴露到全局作用域（保留兼容性）
  window.exportMindmap = exportMindmap;

  // 页面加载完成后绑定导出按钮事件
  function bindExportButton() {
    const exportBtn = document.querySelector('.export-btn');
    if (exportBtn) {
      exportBtn.addEventListener('click', exportMindmap);
      console.log('导出按钮事件已绑定');
    } else {
      console.warn('未找到导出按钮元素 (.export-btn)');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      init();
      bindExportButton();
    });
  } else {
    init();
    bindExportButton();
  }
})();
