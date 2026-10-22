const convertData = (data) => {
  if (typeof data === 'string') {
    return { url: data }
  }

  const url = data.path
  const query = data.query || {}
  let str = ''
  for (var x in query) {
    str = str + (str ? '&' : '?')
    str = str + x + '=' + query[x]
  }

  return {
    url: url + str
  }
}

export default {
  push: (data) => uni.navigateTo(convertData(data)),
  replace: (data) => uni.redirectTo(convertData(data)),
  switch: (data) => uni.switchTab(convertData(data))
}
