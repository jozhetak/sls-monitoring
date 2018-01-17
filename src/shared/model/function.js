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
    return new Promise(resolve => {
      const dbparams = {
        RequestItems: {}
      }
      const batchSize = 25
      let promises = []
      let requestItems = items.splice(0, batchSize)

      dbparams.RequestItems[this.TABLE] = requestItems.map(item => {
        return {
          PutRequest: {
            Item: item
          }
        }
      })

      promises.push(dynamodb.batchWrite(dbparams).promise())
      const timer = setInterval(() => {
        let requestItems = items.splice(0, batchSize)

        dbparams.RequestItems[this.TABLE] = requestItems.map(item => {
          return {
            PutRequest: {
              Item: item
            }
          }
        })

        promises.push(dynamodb.batchWrite(dbparams).promise())
        if (items.length === 0) {
          clearInterval(timer)
          resolve(Promise.all(promises))
          console.log(items)
        }
      }, 600)
    })
  }
}
