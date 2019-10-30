
// import { } from 'asch-'

const CLIENT_DRIFT_SECONDS = 5



function convertBigintMemberToString(obj) {
    if (typeof obj !== 'object' || obj === null) return
    let bint = 'bigint'
    Object.keys(obj).forEach(key => {
      const value = obj[key]
      const type = typeof value
      if (type === bint) {
        obj[key] = String(value)
      }
      else if (type === 'object') {
        convertBigintMemberToString(value)
      }
    })
  }


  


 function buildTransaction(
    type,
    args = [],
    message='',
    options = {}
  ) {
    convertBigintMemberToString(args)
    let transaction = {
      type: type,
      fee: 0,
      args: args,
      timestamp: 0,
      message: message,
      senderPublicKey: '',
      senderId: ''
      //mode: 0
    }
    // transaction = calFee(transaction)
    transaction.timestamp = this.AschWeb.Utils.getTime() - CLIENT_DRIFT_SECONDS
    return transaction
  }

  export default buildTransaction