const GENESIS_TIME = new Date(Date.UTC(2016, 5, 27, 20, 0, 0, 0))

class Asch {
  constructor() {
    this.aschPay = null
    this.AschWeb = null
    this.account = {}
    this.gasLimit = 100000
    this.enablePayGasInXAS = true
    this.contractName = 'super-node-profile'
    this._contract = null
    this.listenerMap = new Map()
    this.ready = false
    this._cachedAccountInfo = null
    this._latestBlock = null
  }

  get defaultAccount() {
    return this.account
  }

  get contract() {
    return this._contract
  }

  set cachedAccountInfo(accountInfo) {
    this._cachedAccountInfo = accountInfo
  }

  get cachedAccountInfo() {
    return this._cachedAccountInfo
  }

  set latestBlock(block) {
    this._latestBlock = block
  }

  get latestBlock() {
    return this._latestBlock
  }

  async setAschPay(aschPay) {
    console.log('entry setAschPay')
    this.aschPay = aschPay
    this.account = aschPay.defaultAccount
    this.AschWeb = aschPay.AschWeb
    this._contract = await aschPay.createContractFromName(this.contractName)
    this._contract.gasLimit = this.gasLimit
    this._contract.enablePayGasInXAS = this.enablePayGasInXAS
    console.log('setAschPay', aschPay.defaultAccount)
    console.log('contract', this._contract)
    this.ready = true
    this.emit('ready')
  }

  on(event, handler) {
    if (this.listenerMap.has(event)) {
      this.listenerMap.get(event).push(handler)
    } else {
      this.listenerMap.set(event, [handler])
    }
  }

  emit(event, ...args) {
    setImmediate(() => {
      const listeners = this.listenerMap.get(event)
      if (!listeners) return
      for (const l of listeners) {
        l(...args)
      }
    })
  }

  async readyAsync() {
    if (!this.ready) {
      return new Promise(resolve => {
        this.on('ready', () => {
          resolve()
        })
      })
    }
  }

  isLogin() {
    return this.aschPay !== null
  }

  async setAccountName(name) {
    const trs = this.AschWeb.TransactionBuilder.setName(name)
    const signedTrs = await this.sign(trs)
    return this.aschPay.api.broadcastTransaction(signedTrs)
  }

  async registerDelegate() {
    const trs = this.AschWeb.TransactionBuilder.registerDelegate()
    const signedTrs = await this.sign(trs)
    return this.aschPay.api.broadcastTransaction(signedTrs)
  }

  async lock(height, amount) {
    const trs = this.AschWeb.TransactionBuilder.setLock(height, amount)
    const signedTrs = await this.sign(trs)
    return this.aschPay.api.broadcastTransaction(signedTrs)
  }

  async sign(trs) {
    return new Promise((resolve, reject) => {
      this.aschPay.sign(trs, (e, trs) => {
        if (e) reject(e)
        else resolve(trs)
      })
    })
  }

  getTransactionId(trx) {
    const id = this.AschWeb.Utils.getId(trx)
    return this.AschWeb.Utils.toHex(id)
  }

  fromSatoshi(amount) {
    return amount / (10 ** 8)
  }

  toSatoshi(amount) {
    return amount * (10 ** 8)
  }

  getRealTime(chainTime) {
    const t = Math.floor(GENESIS_TIME.getTime() / 1000) * 1000
    return this.getFormedTime(t + (chainTime * 1000))
  }

  //============================================================================
  // Private
  //============================================================================
  getFormedTime(timestamp) {
    let time = new Date(timestamp)
    let month = time.getMonth() + 1
    let day = time.getDate()
    if (day < 10) {
      day = '0' + day
    }
    let h = time.getHours()
    let m = time.getMinutes()
    let s = time.getSeconds()
    if (h < 10) {
      h = '0' + h
    }

    if (m < 10) {
      m = '0' + m
    }

    if (s < 10) {
      s = '0' + s
    }
    return time.getFullYear() + '/' + month + '/' + day + ' ' + h + ':' + m + ':' + s
  }

}

export default async ({ Vue }) => {
  Vue.prototype.$asch = new Asch
}
