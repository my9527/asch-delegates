import axios from 'axios'

class ExplorerAPI {
  constructor() {
    this.client = axios.create({
      baseURL: 'http://localhost:5096',
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
