let logEnabled = true

export default {
  isLogEnabled() {
    return logEnabled
  },

  enableLog() {
    logEnabled = true
  },

  disableLog() {
    logEnabled = false
  }
}
