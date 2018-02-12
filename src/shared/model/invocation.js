/**
 * Created by Mac on 10/28/17.
 */
const Model = require('./model')
const dynamodb = require('../helper/dynamodb')
const RateLimiter = require('limiter').RateLimiter

module.exports = class Invocation extends Model {
  constructor (opts) {
    super(opts)
  }

  static get TABLE () {
    return process.env.INVOCATIONS_TABLE
  }

  static batchWrite (items) {
    const batchWriteQueue = this._formBatchWriteQueue(items.slice())
    return Promise.all(batchWriteQueue)
  }

  static _formBatchWriteQueue (items) {
    const batchLimit = 25
    const requestsCount = Math.ceil(items.length / batchLimit)
    const batchWriteQueue = []
    for (let i = 0; i < requestsCount; i++) {
      const putRequestItems = items.splice(0, batchLimit).map(item => {
        return {
          PutRequest: {
            Item: item
          }
        }
      })
      const dbparams = {
        RequestItems: {
          [this.TABLE]: putRequestItems
        }
      }
      batchWriteQueue.push(dynamodb.batchWrite(dbparams).promise())
    }
    return batchWriteQueue
  }
}
