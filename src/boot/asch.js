import { log } from '../utils'

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
    log('entry setAschPay')
    this.aschPay = aschPay
    this.account = Object.assign({}, aschPay.defaultAccount)
    this.AschWeb = aschPay.AschWeb
    this._contract = await aschPay.createContractFromName(this.contractName)
    this._contract.gasLimit = this.gasLimit
    this._contract.enablePayGasInXAS = this.enablePayGasInXAS
    log('setAschPay', aschPay.defaultAccount)
    log('contract', this._contract)
    this.ready = true
    this.emit('ready')
    setInterval(this.checkAccountChange.bind(this), 1000)
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
    return this.signedAndBroadcast(trs)
  }

  async registerDelegate() {
    const trs = this.AschWeb.TransactionBuilder.registerDelegate()
    return this.signedAndBroadcast(trs)
  }

  async lock(height, amount) {
    const trs = this.AschWeb.TransactionBuilder.setLock(height, amount)
    return this.signedAndBroadcast(trs)
  }

  async unlock() {
    const trs = this.AschWeb.TransactionBuilder.unlock()
    return this.signedAndBroadcast(trs)
  }

  async vote(delegate) {
    const trs = this.AschWeb.TransactionBuilder.voteDelegates([delegate])
    return this.signedAndBroadcast(trs)
  }

  async unvote(delegate) {
    const trs = this.AschWeb.TransactionBuilder.cleanVote([delegate])
    return this.signedAndBroadcast(trs)
  }

  // 理事会投票
  async signedForCouncil(delegate) {
    const trs = this.buildTransactionForCouncil(delegate)
    return this.signedAndBroadcast(trs)
  }

  async sign(trs) {
    return new Promise((resolve, reject) => {
      this.aschPay.sign(trs, (e, trs) => {
        if (e) reject(e)
        else resolve(trs)
      })
    })
  }

  async signedAndBroadcast(trs) {
    const signedTrs = await this.sign(trs)
    console.log(signedTrs)
    return this.aschPay.api.broadcastTransaction(signedTrs)
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
  checkAccountChange() {
    if (this.aschPay.defaultAccount.address !== this.account.address) {
      const oldAccount = this.account
      this.account = Object.assign({}, this.aschPay.defaultAccount)
      this.emit('accountChanged', this.aschPay.defaultAccount, oldAccount)
    }
  }

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

   buildTransactionForCouncil({ type, args, fee }) {
    let transaction = {
      type,
      timestamp: this.AschWeb.Utils.getTime() - 5,
      fee,
      args,
      senderPublicKey: '',
      senderId: '',
      // signatures: [],
      // secondSecret: params.secondSecret || '',
      message:  ''
    }
    return transaction
  }

}

export default async ({ Vue }) => {
  Vue.prototype.$asch = new Asch
}
