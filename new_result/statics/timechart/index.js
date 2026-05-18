// 导出时间线图为PNG图片
async function exportTimelineToPng() {
    const timelineElement = document.querySelector('.timeline');
    const titleElement = document.querySelector('h1');

    if (!timelineElement) {
        alert('时间线尚未加载完成，请稍后再试');
        return;
    }

    try {
        console.log('开始导出时间线图...');
        
        // 检查 html2canvas 是否加载
        if (typeof html2canvas === 'undefined') {
            alert('html2canvas 库未加载，请检查文件是否存在');
            return;
        }

        console.log('开始使用 html2canvas 渲染...');

        // 使用 ignoreElements 选项排除导出按钮，无需隐藏按钮
        const exportBtn = document.getElementById('export-btn');
        const canvas = await html2canvas(document.body, {
            backgroundColor: '#ffffff',
            scale: 2, // 2倍分辨率
            useCORS: true,
            logging: true,
            windowWidth: document.body.scrollWidth,
            windowHeight: document.body.scrollHeight,
            ignoreElements: (element) => {
                // 忽略导出按钮元素
                return element === exportBtn;
            }
        });

        console.log('Canvas 生成成功，尺寸:', canvas.width, 'x', canvas.height);

        // 转换为 PNG 并下载
        const pngUrl = canvas.toDataURL('image/png');
        
        const downloadLink = document.createElement('a');
        downloadLink.href = pngUrl;
        const title = titleElement ? titleElement.textContent.trim() : '时间线图';
        downloadLink.download = title + '_' + new Date().getTime() + '.png';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

        console.log('导出成功！');
    } catch (error) {
        console.error('导出失败:', error);
        console.error('错误堆栈:', error.stack);
        
        alert('导出图片失败：' + error.message + '\n请查看控制台获取详细信息');
    }
}

// 绑定按钮事件
document.addEventListener('DOMContentLoaded', function () {
    const exportBtn = document.getElementById('export-btn');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportTimelineToPng);
    }
});
