import dayjs from 'dayjs'

export const formatNumber = (n) => {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}

export function uuid16() {
  return 'xxxxxxxx4xxxyxxx'.replace(/[xy]/g, (c) => {
    var r = (Math.random() * 16) | 0
    var v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/**
 * date => yyyy-MM-dd
 * @param {Date} date
 */
export function CNDate(date) {
  if (typeof date !== 'object') {
    date = new Date(date)
  }
  // console.log('typeof date', date, typeof date)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return [year, month, day].map(formatNumber).join('-')
}

export function CNTime(date) {
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [hour, minute, second].map(formatNumber).join('-')
}

export function CNTime2(date) {
  const hour = date.getHours()
  const minute = date.getMinutes()

  return [hour, minute].map(formatNumber).join(':')
}

/**
 * 800 => 8:00
 * @param {int} value
 */
export function intToTime(value) {
  const hour = parseInt(value / 100)
  const minutes = value % 100

  return `${hour}:${minutes === 0 ? '00' : minutes}`
}

export function intToTime2(value) {
  const arr = String(value).match(/\d/g)
  if (arr.length === 3) return `${arr[0]}:${arr[1]}${arr[2]}`
  else return `${arr[0]}${arr[1]}:${arr[2]}${arr[3]}`
}

export const formatTime = (date) => {
  return `${CNDate(date)} ${CNTime(date)}`
}

export const formatTime2 = (date) => {
  return `${CNDate(date)} ${CNTime2(date)}`
}

export const getFullURL = (appOptions) => {
  if (!appOptions) return null
  var url = appOptions.path || ''
  var params = []
  var query = appOptions.query || {}
  for (var x in query) {
    params.push(x + '=' + query[x])
  }
  if (params.length > 0) {
    url = url + '?' + params.join('&')
  }
  if (url && !url.startsWith('/')) {
    url = `/${url}`
  }
  return url
}

// hh:mm => yyyy-mm-ddThh:mm:00+08:00
export const convertToFullTimeFormat = (time) => {
  // time is hh:mm format
  const arr = time.split(':')
  const hours = arr[0]
  const minutes = arr[1]
  const now = new Date()
  const year = now.getFullYear()
  let month, day
  if (now.getMonth() + 1 < 10) {
    month = `0${now.getMonth() + 1}`
  } else {
    month = `${now.getMonth() + 1}`
  }
  if (now.getDate() < 10) {
    day = `0${now.getDate()}`
  } else {
    day = now.getDate()
  }
  return `${year}-${month}-${day}T${hours}:${minutes}:00+08:00`
}

// yyyy-mm-ddThh:mm:00+08:00 => hh:mm
export const convertToHourMinuteFormat = (time) => {
  // time is yyyy-mm-ddThh:mm:00+08:00 format
  const newTime = new Date(time)
  let hours, minutes
  if (newTime.getHours() < 10) {
    hours = `0${newTime.getHours()}`
  } else {
    hours = newTime.getHours()
  }
  if (newTime.getMinutes() < 10) {
    minutes = `0${newTime.getMinutes()}`
  } else {
    minutes = newTime.getMinutes()
  }
  return `${hours}:${minutes}`
}

// yyyy-mm-ddThh:mm:00+08:00 => YYYY.M.D HH:mm-HH:mm
export const formatBeginEndDate = (dateTime1, dateTime2) => {
  const day1 = dateTime1 ? dayjs(dateTime1).format('YYYY.M.D') : ''
  const day2 = dateTime2 ? dayjs(dateTime2).format('YYYY.M.D') : ''
  if (day1 && day1 === day2) {
    const time1 = dateTime1 ? dayjs(dateTime1).format('HH:mm') : ''
    const time2 = dateTime1 ? dayjs(dateTime2).format('HH:mm') : ''
    return `${day1} ${time1}-${time2}`
  }

  return `${day1}-${day2}`
}

// yyyy-mm-ddThh:mm:00+08:00 => YYYY.M.D HH:mm-HH:mm
export const formatMyTime = (dateTime, type) => {
  const time = dayjs(dateTime).format(type)

  return time
}

export const formatDistance = (distance) => {
  if (distance < 1) {
    return Math.floor(distance * 1000) + '米'
  } else {
    return Math.floor(distance) + '公里'
  }
}

export const getLaunchOptions = (options) => {
  options = options || wx.getStorageSync('appOptions') || {}
  if (options.query) {
    options = options.query
  }

  let params = options
  if (options.q) {
    params = {
      ...params,
      ...extractQuery(options.q)
    }
  }

  if (options.scene) {
    params = {
      ...params,
      ...extractQuery(options.scene)
    }
  }

  return params
}

export const extractQuery = (url) => {
  let params = {}
  const arr = decodeURIComponent(url).match(/([\w\d_]+)=([\w\d_,:]+)/g) || []
  for (let item of arr) {
    let key = item.split('=')[0]
    let value = item.split('=')[1]
    params[key] = value
  }
  return params
}
