document.addEventListener('DOMContentLoaded', function () {
  const dataScript = document.getElementById('chart-data');
  if (!dataScript) {
    console.error('未找到图表数据');
    return;
  }

  let chartData;
  try {
    chartData = JSON.parse(dataScript.textContent);
  } catch (e) {
    console.error('JSON 数据解析失败:', e);
    return;
  }

  const myChart = echarts.init(document.getElementById('main'));
  window.myChart = myChart;

  const seriesDataWithColor = chartData.seriesData.map((item) => {
    if (item.color) {
      return {
        ...item,
        itemStyle: { color: item.color },
      };
    }
    return item;
  });

  const option = {
    title: {
      text: chartData.title,
      left: 'center',
      top: '10px',
      textStyle: {
        fontSize: 18,
        fontWeight: 'bold',
      },
    },
    tooltip: {
      trigger: 'item',
      formatter: function (params) {
        return `${params.name}: ${params.value} (${params.percent.toFixed(2)}%)`;
      },
    },
    legend: {
      orient: 'horizontal',
      bottom: '10px',
      left: 'center',
    },
    series: [
      {
        name: '访问来源',
        type: 'pie',
        radius: '50%',
        center: ['50%', '50%'],
        data: seriesDataWithColor,
        label: {
          show: true,
          position: 'outside',
          formatter: (params) =>
            `${params.name}\n${params.percent.toFixed(2)}%`,
          fontSize: 12,
          alignTo: 'none',
          bleedMargin: 10,
        },
        labelLine: {
          show: true,
          length: 20,
          length2: 20,
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  };

  myChart.setOption(option);

  window.addEventListener('resize', () => myChart.resize());

  // 导出按钮功能
  const exportBtn = document.getElementById('export-btn');
  if (exportBtn) {
    exportBtn.addEventListener('click', function() {
      const url = myChart.getDataURL({
        type: 'png',
        pixelRatio: 2,
        backgroundColor: '#fff'
      });
      
      const link = document.createElement('a');
      link.download = (chartData.title || '饼图') + '_' + new Date().getTime() + '.png';
      link.href = url;
      link.click();
    });
  }
});
