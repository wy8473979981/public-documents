const ossProcessKey = 'x-oss-process=style/'
const ossWebpProcessKey = 'x-oss-process=image/format,webp'
export const ossProcess = (url, name) => {
  if (!url) return url
  if (!name) return url
  if (url.includes(ossProcessKey)) return url

  if (!url.includes('?')) {
    return `${url}?${ossProcessKey}${name}`
  }

  return `${url}&${ossProcessKey}${name}`
}
export const ossWebpProcess = (url, name) => {
  if (!url) return url
  if (url.includes(ossWebpProcessKey)) return url

  let resizePart = ''
  if (name === 'small') {
    resizePart = 'image/resize,w_240'
  } else if (name === 'large') {
    resizePart = 'image/resize,w_1080'
  } else {
    // 默认尺寸
    // resizePart = 'image/resize,w_720'
    resizePart = 'image/resize,m_lfit,w_647,limit_0'
  }

  if (!url.includes('?')) {
    return `${url}?${ossWebpProcessKey},${resizePart}`
  }
  return `${url}&${ossWebpProcessKey},${resizePart}`
}
export const smallImg = (url) => ossProcess(url, 'small')
export const normalImg = (url) => ossProcess(url, 'normal')
export const webpImg = (url) => ossWebpProcess(url)
