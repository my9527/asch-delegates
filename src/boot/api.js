import axios from 'axios'
import global from '../utils/global'



class ExplorerAPI {
  constructor() {
    const host = window.location.host
    let baseURL = 'http://localhost:5096'
    // let baseURL = 'http://testnet.asch.io'

    if (/localhost/.test(host)) {
      global.enableLog()
    } else {
      global.disableLog()
      baseURL = window.location.origin
    }
    this.client = axios.create({
      baseURL,
      timeout: 4000,
      headers: {
        'content-type': 'application/json'
      }
    })
  }

  async getForgedBlocks(name, offset, limit) {
    return this.get('/api/v2/misc/blocksForgedBy', { name, offset, limit, reverse: 1 })
  }

  async getDelegatesWithProfile(offset, limit) {
    return this.get('/api/v2/misc/delegatesWithProfile', { offset, limit })
  }

  async getDelegateDetail(name) {
    return this.get(`/api/v2/misc/delegateDetail/${name}`)
  }

  async getAccount(address) {
    return this.get(`/api/v2/accounts/${address}`)
  }

  async getVotedDelegate(address) {
    return this.get('/api/accounts/delegates', { address })
  }

  async getVotingSummary() {
    return this.get('/api/v2/misc/votingSummary', {})
  }

  async get(url, params) {
    return this.handleError(this.client.get(url, { params }))
  }

  /**
   * 获取当前区块高度
   *
   * @return  {[type]}  [return description]
   */
  async getBlockHeight() {
    return this.get('/api/blocks/getHeight')
  }

  /**
   * 根据区块高度或id 获取区块信息
   */
  async getBlockDetail(heigthOrId){
    return this.get(`/api/v2/blocks/${heigthOrId}`)
  }

  /**
   * 根据地址获取账号信息
   *
   * @param   {[type]}  address  [address description]
   *
   * @return  {[type]}           [return description]
   */
  async getAccountInfo(address) {
    return this.get(`/api/v2/accounts/${address}`)
  }

  async getAccountShare(lockHeight, weight) {
    return this.get('/api/v2/accounts/', {lockHeight, weight})
  }


  // 获取领事会选举概况
  async getCouncilInfo() {
    return this.get('/api/v2/council/info')
  }

  // 理事会成员列表
  async getCouncilMember() {
    return this.get('/api/v2/council/members')
  }

  // 待支出列表
  async getPendingList({offset, limit}) {
    return this.get('/api/v2/council/payments', {
      orderBy: 'timestamp:desc',
      pending: 1,
      offset, 
      limit
    })
  }

  // 理事会资金明细
  async getFinanceRecords({offset, limit}) {
    return this.get('/api/v2/council/payments', {
      orderBy: 'timestamp:desc',
      offset, 
      limit
    })
  }


  // 支出款项详情
  async getPendingPaymentDetail(id) {
    return this.get('/api/v2/council/payments', {
      id,
      orderBy: 'timestamp:desc'
    })
  }

  // 账户余额
  async getRestAmount(address) {
    return this.get( '/api/v2/accounts/' + address)
  }

  // private methods

  async handleError(promise) {
    return promise.then(response => {
      if (response.data.success) return Promise.resolve(response.data)
      return Promise.reject(response.data)
    }).catch(error => {
      return Promise.reject(this.parseError(error))
    })
  }

  parseError(error) {
    if (error.response) {
      const serverError = error.response.data ? error.response.data.error : 'unknow response'
      return `Server error: ${serverError}`
    } else if (error.request) {
      return 'No response'
    } else {
      return `Other error: ${error.message || error.error}`
    }
  }
}

export default async ({ Vue }) => {
  Vue.prototype.$api = new ExplorerAPI()
}
