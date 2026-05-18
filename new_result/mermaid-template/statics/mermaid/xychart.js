// 初始化 Mermaid
mermaid.initialize({
    startOnLoad: false,
    theme: 'default',
    securityLevel: 'loose',
    flowchart: { useMaxWidth: false },
    fontFamily: '"Segoe UI", sans-serif',
    themeVariables: {
        xyChart: {
          plotColorPalette: "#8979FF, #FF928A",
          backgroundColor: "#ffffff",
          xAxisLabelColor: "#828898",
          xAxisTitleColor: "#828898",
          xAxisTickColor: "#828898",
          xAxisLineColor: "#828898",
          yAxisLabelColor: "#828898",
          yAxisTitleColor: "#828898",
          yAxisTickColor: "#828898",
          yAxisLineColor: "#828898",
        },
      },
      xyChart: {
        yAxis: {
          axisLineWidth: 1,
        },
        xAxis: {
          axisLineWidth: 1,
        },
      },
});

const chartContainer = document.getElementById('mermaid-chart');
const fullscreenBtn = document.getElementById('fullscreen-btn');
const fitViewBtn = document.getElementById('fit-view-btn');
const zoomInBtn = document.getElementById('zoom-in-btn');
const zoomOutBtn = document.getElementById('zoom-out-btn');
const chartTitle = document.getElementById('chart-title');

let currentSvg = null;
let scale = 1;
let translateX = 0;
let translateY = 0;
let initialScale = 1;
let initialTranslateX = 0;
let initialTranslateY = 0;

// 获取 Mermaid 代码和标题
const mermaidDataElement = document.getElementById('mermaid-data');
const defaultCode = mermaidDataElement ? mermaidDataElement.textContent.trim() : '';
const chartTitleText = mermaidDataElement ? mermaidDataElement.getAttribute('data-title') || '' : '';

if (chartTitleText) {
    chartTitle.textContent = chartTitleText;
} else {
    chartTitle.style.display = 'none';
}

// 渲染函数
function renderMermaid() {
    const code = defaultCode.trim();
    if (!code) {
        chartContainer.innerHTML = '';
        currentSvg = null;
        return;
    }

    chartContainer.innerHTML = '<p style="padding:12px;color:#666;">渲染中...</p>';
    mermaid.render('mermaid-svg', code).then(({ svg }) => {
        chartContainer.innerHTML = svg;
        currentSvg = chartContainer.querySelector('svg');
        if (currentSvg) {
            setupZoomAndPan();
            fitView();
            saveInitialView();
        }
    }).catch(err => {
        console.error('Mermaid 渲染错误:', err);
        console.error('错误堆栈:', err.stack || '无堆栈信息');
        console.error('Mermaid 代码:', code);

        chartContainer.innerHTML = `
      <div class="error-container">
        <div class="error-icon">⚠️</div>
        <div style="font-size: 20px; color: #333; font-weight: 500;">图表渲染失败</div>
        <div class="error-message">Mermaid 语法可能存在错误，请检查代码格式</div>
        <div class="error-hint">💡 提示：详细错误信息已输出到浏览器控制台 (F12)</div>
      </div>
    `;
        currentSvg = null;
    });
}

// 绑定缩放和平移
function setupZoomAndPan() {
    if (!currentSvg) return;

    let isDragging = false;
    let startX, startY;

    chartContainer.addEventListener('wheel', (e) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        const rect = chartContainer.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const newScale = Math.max(0.1, Math.min(scale * delta, 5));
        const zoomFactor = newScale / scale;

        translateX = mouseX - (mouseX - translateX) * zoomFactor;
        translateY = mouseY - (mouseY - translateY) * zoomFactor;
        scale = newScale;

        applyTransform();
    }, { passive: false });

    chartContainer.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return;
        isDragging = true;
        startX = e.clientX - translateX;
        startY = e.clientY - translateY;
        chartContainer.style.cursor = 'grabbing';
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        translateX = e.clientX - startX;
        translateY = e.clientY - startY;
        applyTransform();
    });

    window.addEventListener('mouseup', () => {
        isDragging = false;
        chartContainer.style.cursor = 'grab';
    });

    function applyTransform() {
        if (!currentSvg) return;
        currentSvg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
        currentSvg.style.transformOrigin = '0 0';
    }

    chartContainer.style.cursor = 'grab';
    applyTransform();
}

// 适应屏幕
function fitView() {
    if (!currentSvg) return;

    const containerRect = chartContainer.getBoundingClientRect();
    const svgRect = currentSvg.getBoundingClientRect();

    const scaleX = containerRect.width / svgRect.width;
    const scaleY = containerRect.height / svgRect.height;
    scale = Math.min(scaleX, scaleY) * 0.9;

    translateX = (containerRect.width - svgRect.width * scale) / 2;
    translateY = (containerRect.height - svgRect.height * scale) / 2;

    applyTransform();
}

function applyTransform() {
    if (!currentSvg) return;
    currentSvg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
    currentSvg.style.transformOrigin = '0 0';
}

// 保存初始视图状态
function saveInitialView() {
    initialScale = scale;
    initialTranslateX = translateX;
    initialTranslateY = translateY;
}

// 重置视图
function resetView() {
    scale = initialScale;
    translateX = initialTranslateX;
    translateY = initialTranslateY;
    applyTransform();
}

// 放大
function zoomIn() {
    const rect = chartContainer.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const newScale = Math.min(scale * 1.2, 5);
    const zoomFactor = newScale / scale;

    translateX = centerX - (centerX - translateX) * zoomFactor;
    translateY = centerY - (centerY - translateY) * zoomFactor;
    scale = newScale;

    applyTransform();
}

// 缩小
function zoomOut() {
    const rect = chartContainer.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const newScale = Math.max(scale * 0.8, 0.1);
    const zoomFactor = newScale / scale;

    translateX = centerX - (centerX - translateX) * zoomFactor;
    translateY = centerY - (centerY - translateY) * zoomFactor;
    scale = newScale;

    applyTransform();
}

// 全屏切换
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        chartContainer.requestFullscreen().catch(err => {
            alert('全屏失败：' + err.message);
        });
    } else {
        document.exitFullscreen();
    }
}

// 绑定事件
fullscreenBtn.addEventListener('click', toggleFullscreen);
fitViewBtn.addEventListener('click', resetView);
zoomInBtn.addEventListener('click', zoomIn);
zoomOutBtn.addEventListener('click', zoomOut);

// 初始渲染
renderMermaid();
