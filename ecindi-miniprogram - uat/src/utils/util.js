function formatDate(timeStr) {
  var date = new Date(timeStr)

  var year = date.getFullYear(),
    month = date.getMonth() + 1,
    day = date.getDate(),
    hour = date.getHours(),
    min = date.getMinutes(),
    sec = date.getSeconds()

  return `${year}-${month}-${day} ${hour}:${min}:${sec}`
}

// 防止处理多次点击
function noMultipleClicks(methods, info) {
  // methods是点击后需要执行的函数， info是函数需要传的参数
  let that = this;
  if (that.noClick) {
      // 第一次点击
      that.noClick= false;
      if((info && info !== '') || info ==0) {
          // info是执行函数需要传的参数
          methods(info);
      } else {
          methods();
      }
      setTimeout(()=> {
          that.noClick= true;
      }, 2000)
  } else {
      //  这里是重复点击的判断
  }
}

module.exports = {
  formatDate: formatDate,
  noMultipleClicks: noMultipleClicks
}
