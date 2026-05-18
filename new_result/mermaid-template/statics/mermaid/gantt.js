// 初始化 Mermaid
mermaid.initialize({
    startOnLoad: false,
    theme: 'default',
    securityLevel: 'loose',
    flowchart: { useMaxWidth: false },
    fontFamily: '"Segoe UI", sans-serif'
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

// 获取颜色数据
const ganttDataElement = document.getElementById('gantt-data');
const colorData = ganttDataElement ? JSON.parse(ganttDataElement.textContent) : {};

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
            // 应用颜色样式
            applyColorStyles();
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

// 应用颜色样式到SVG元素
function applyColorStyles() {
    if (!currentSvg || !colorData) return;

    // 遍历颜色数据并查找对应的SVG元素
    for (const [taskId, colors] of Object.entries(colorData)) {
        // 查找对应的活动条或文本元素
        // 根据甘特图的结构，通常活动条是rect元素，文本是text元素

        // 尝试根据ID匹配（如果Mermaid为元素分配了ID）
        const activityBar = currentSvg.querySelector(`#${taskId}`) ||
                           currentSvg.querySelector(`rect:contains('${taskId}')`) ||
                           findActivityByLabel(taskId);

        if (activityBar && activityBar.tagName.toLowerCase() === 'rect') {
            if (colors.backgroundColor) {
                activityBar.style.fill = colors.backgroundColor;
            }
            if (colors.textColor) {
                // 找到对应的文本元素
                const textElement = findTextForActivity(activityBar, taskId);
                if (textElement) {
                    textElement.style.fill = colors.textColor;
                }
            }
        }

        // 如果没有找到矩形元素，尝试通过文本内容匹配
        if (!activityBar) {
            const textElements = currentSvg.querySelectorAll('text');
            textElements.forEach(textEl => {
                if (textEl.textContent.includes(taskId) ||
                    textEl.textContent.includes(getTaskNameFromId(taskId))) {
                    if (colors.textColor) {
                        textEl.style.fill = colors.textColor;
                    }

                    // 尝试找到相关的矩形元素
                    const rectElements = currentSvg.querySelectorAll('rect');
                    rectElements.forEach(rectEl => {
                        if (isRelatedElement(rectEl, textEl) && colors.backgroundColor) {
                            rectEl.style.fill = colors.backgroundColor;
                        }
                    });
                }
            });
        }
    }

    // 通用的查找方法，基于元素位置关系
    applyColorsBasedOnPosition();
}

// 基于位置关系查找相关元素
function findTextForActivity(rectElement, taskId) {
    const textElements = currentSvg.querySelectorAll('text');
    const rectBox = rectElement.getBoundingClientRect();

    for (const textEl of textElements) {
        const textBox = textEl.getBoundingClientRect();
        // 检查文本是否靠近矩形元素
        if (Math.abs(textBox.top - rectBox.top) < 20 ||
            Math.abs(textBox.bottom - rectBox.bottom) < 20) {
            if (textEl.textContent.includes(taskId) ||
                textEl.textContent.includes(getTaskNameFromId(taskId))) {
                return textEl;
            }
        }
    }
    return null;
}

// 基于元素位置判断是否相关
function isRelatedElement(rectEl, textEl) {
    const rectBox = rectEl.getBoundingClientRect();
    const textBox = textEl.getBoundingClientRect();

    // 检查元素是否在相近位置
    return Math.abs(textBox.top - rectBox.top) < 20 ||
           Math.abs(textBox.bottom - rectBox.bottom) < 20;
}

// 通过标签查找活动元素
function findActivityByLabel(taskId) {
    const label = getTaskNameFromId(taskId);
    const elements = currentSvg.querySelectorAll('rect, text');

    for (const el of elements) {
        if (el.textContent && el.textContent.includes(label)) {
            // 如果找到文本元素，尝试找到其父级或相邻的rect元素
            if (el.tagName.toLowerCase() === 'text') {
                // 查找附近的矩形元素
                const rectElements = currentSvg.querySelectorAll('rect');
                for (const rectEl of rectElements) {
                    if (isRelatedElement(rectEl, el)) {
                        return rectEl;
                    }
                }
            } else if (el.tagName.toLowerCase() === 'rect') {
                return el;
            }
        }
    }
    return null;
}

// 从ID获取任务名称
function getTaskNameFromId(taskId) {
    // 从HTML中获取任务名称的映射
    const mermaidCode = defaultCode;
    const lines = mermaidCode.split('\n');

    for (const line of lines) {
        if (line.includes(taskId) && line.includes(':')) {
            // 提取任务名称部分
            const colonIndex = line.indexOf(':');
            const taskDesc = line.substring(0, colonIndex).trim();

            // 移除可能的前缀如 "section"
            if (taskDesc.startsWith('section')) {
                continue;
            }

            // 提取描述部分
            const descParts = taskDesc.split(',');
            if (descParts.length > 0) {
                return descParts[0].replace(/^\s*["']?|["']?\s*$/g, '').trim();
            }
        }
    }
    return taskId;
}

// 基于位置应用颜色
function applyColorsBasedOnPosition() {
    if (!currentSvg || !colorData) return;

    // 获取所有矩形元素（代表任务条）
    const rectElements = currentSvg.querySelectorAll('rect');

    // 解析Mermaid代码以建立任务ID与任务名称的映射
    const taskMap = {};
    const lines = defaultCode.split('\n');

    for (const line of lines) {
        if (line.includes(':') && !line.trim().startsWith('section')) {
            const parts = line.split(':');
            if (parts.length >= 2) {
                const description = parts[0].trim();
                const taskDetails = parts[1].split(',');

                if (taskDetails.length >= 2) {
                    const taskId = taskDetails[0].trim();
                    if (taskId) {
                        taskMap[taskId] = description.replace(/^\s*["']?|["']?\s*$/g, '');
                    }
                }
            }
        }
    }

    // 遍历矩形元素并应用颜色
    rectElements.forEach(rectEl => {
        // 检查是否有文本元素与之关联
        const relatedText = findClosestText(rectEl);
        if (relatedText) {
            // 根据文本内容匹配任务ID
            for (const [taskId, colors] of Object.entries(colorData)) {
                if (relatedText.textContent.includes(taskId) ||
                    (taskMap[taskId] && relatedText.textContent.includes(taskMap[taskId]))) {
                    if (colors.backgroundColor) {
                        rectEl.style.fill = colors.backgroundColor;
                    }

                    // 同时更新文本颜色
                    if (colors.textColor) {
                        relatedText.style.fill = colors.textColor;
                    }
                }
            }
        }
    });
}

// 查找最近的文本元素
function findClosestText(rectEl) {
    const textElements = currentSvg.querySelectorAll('text');
    const rectBox = rectEl.getBoundingClientRect();
    let closestText = null;
    let minDistance = Infinity;

    for (const textEl of textElements) {
        const textBox = textEl.getBoundingClientRect();

        // 计算两个元素之间的距离
        const distance = Math.sqrt(
            Math.pow(textBox.left - rectBox.left, 2) +
            Math.pow(textBox.top - rectBox.top, 2)
        );

        if (distance < minDistance) {
            minDistance = distance;
            closestText = textEl;
        }
    }

    return minDistance < 100 ? closestText : null; // 只返回距离小于100像素的文本
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