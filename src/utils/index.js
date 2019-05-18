import global from './global'

export function log(...args) {
  if (global.isLogEnabled()) {
    console.log(...args)
  }
}
