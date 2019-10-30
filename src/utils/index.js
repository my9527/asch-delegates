import global from './global'

export function log(...args) {
  if (global.isLogEnabled()) {
    console.log(...args)
  }
}

function _formatNum(num) {
  return ('0' + num).slice(-2)
}

export function formatTime(timestamp, format = 'YYYY-MM-DD HH:mm:ss') {
  const _date = new Date(timestamp)
  // console.log('timestamp', _date)

  if(!_date.getDate()) {
    return ''
  }
  const _y = _date.getFullYear()
  const _m = _formatNum(_date.getMonth() + 1)
  const _d = _formatNum(_date.getDate())
  const _h = _formatNum(_date.getHours())
  const _min = _formatNum(_date.getMinutes())
  const _s = _formatNum(_date.getSeconds())
  return format
  .replace('YYYY', _y)
  .replace('MM', _m)
  .replace('DD', _d)
  .replace('HH', _h)
  .replace('mm', _min)
  .replace('ss', _s)
}

// export function numToPrecision(num, precision = 8) {
//   const _pre = 10 ** precision
//   return (Math.floor(num * _pre) / _pre).toFixed(precision)
// }

export function xasToPrecision(num) {
  return window.parseFloat((num * 1e-8).toFixed(8))
}


export function getLockedDurationDay(fromHeight, toHeight) {
  return (fromHeight - toHeight) / 8640
}


// 领事会选举获取 transction 构造
export function getUnsignedTrx({ type, fee, args}){
  return {
    type, fee, args,
    timestamp: 0,
    message: '',
    senderPublicKey: '',
    senderId: ''
  }
}
