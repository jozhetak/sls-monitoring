/**
 * Created by Mac on 10/28/17.
 */

const Model = require('./model')
const dynamodb = require('../helper/dynamodb')
const RateLimiter = require('limiter').RateLimiter

module.exports = class Function extends Model {
  constructor (opts) {
    super(opts)
  }

  static get TABLE () {
    return process.env.FUNCTIONS_TABLE
  }

  static batchWrite (items) {
    const batchWriteQueue = this._formBatchWriteQueue(items)
    return Promise.all(batchWriteQueue)
  }

  static _formBatchWriteQueue (items) {
    const batchLimit = 25
    const requestsCount = Math.floor(items.length / batchLimit) + 1
    const batchWriteQueue = []
    for (let i = 0; i < requestsCount; i++) {
      batchWriteQueue[i] = items.splice(0, batchLimit).map(item => {
        return {
          PutRequest: {
            Item: item
          }
        }
      })
    }
    const dbparams = {
      RequestItems: {
        [this.TABLE]: batchWriteQueue
      }
    }
    return dynamodb.batchWrite(dbparams).promise()
  }
}
