/**
 * Created by Mac on 10/28/17.
 */
const uuid = require('uuid')
const _ = require('lodash')
const dynamodb = require('../helper/dynamodb')
const RateLimiter = require('limiter').RateLimiter
const limiter = new RateLimiter(1, 'second')

module.exports = class Model {
  // TEST FOR SEVERLESS 1.25.0
  static getUpdateCondition (params) {
    const timestamp = Date.now()
    let UpdateExpression = 'SET '
    const ExpressionAttributeValues = {
      ':updatedAt': timestamp
    }
    const ExpressionAttributeNames = {
      '#updatedAt': 'updatedAt'
    }
    _.forOwn(params, (value, key) => {
      UpdateExpression += '#' + key + ' = ' + ':' + key + ', '
      ExpressionAttributeValues[':' + key] = value
      ExpressionAttributeNames['#' + key] = key
    })
    UpdateExpression += '#updatedAt = :updatedAt'
    return {
      ExpressionAttributeNames: ExpressionAttributeNames,
      ExpressionAttributeValues: ExpressionAttributeValues,
      UpdateExpression: UpdateExpression
    }
  }

  static buildQuery (params) {
    const result = {
      TableName: params.TableName || this.TABLE
    }
    if (params.Key) {
      result.Key = params.Key
    }
    if (params.KeyConditions) {
      result.KeyConditions = params.KeyConditions
    }
    if (params.KeyConditionExpression) {
      result.KeyConditionExpression = params.KeyConditionExpression
    }
    if (params.ExpressionAttributeNames) {
      result.ExpressionAttributeNames = params.ExpressionAttributeNames
    }
    if (params.ExpressionAttributeValues) {
      result.ExpressionAttributeValues = params.ExpressionAttributeValues
    }
    if (params.IndexName) {
      result.IndexName = params.IndexName
    }
    if (params.FilterExpression) {
      result.FilterExpression = params.FilterExpression
    }
    if (params.ProjectionExpression) {
      result.ProjectionExpression = params.ProjectionExpression
    }
    if (params.Limit) {
      result.Limit = params.Limit
    }
    if (params.hasOwnProperty('ScanIndexForward')) {
      result.ScanIndexForward = params.ScanIndexForward
    }
    if (params.ExclusiveStartKey) {
      result.ExclusiveStartKey = params.ExclusiveStartKey
    }
    return result
  }

  constructor (opts) {
    this.data = opts || {}
    if (!this.data._id) {
      this.data._id = uuid.v1()
    }
  }

  static get TABLE () {
  }

  save () {
    const params = {
      TableName: this.constructor.TABLE, // process.env.FUNCTIONS_TABLE,
      Item: this.data
    }
    return dynamodb.put(params).promise()
      .then(() => {
        return this.data
      })
      .catch(err => {
        console.log(err)
      })
  }

  static getById (id) {
    const params = {
      TableName: this.TABLE,
      Key: {
        _id: id
      }
    }

    return dynamodb.get(params)
      .promise()
      .then((data) => {
        return data.Item
      })
  }

  static getAll (params) {
    const query = this.buildQuery(params)
    return dynamodb.query(query).promise()
      .then((data) => {
        return data
      })
  }

  static _recursiveScan (query) {
    const results = {
      Items: []
    }

    return dynamodb.scan(query).promise()
      .then((data) => {
        if (data.LastEvaluatedKey) {
          query.ExclusiveStartKey = data.LastEvaluatedKey
          return this._recursiveScan(query).then(({Items}) => {
            results.Items.push(...Items, ...data.Items)
            return results
          })
        }
        return data
      })
  }

  static getAllScan (params) {
    const query = this.buildQuery(params)
    return this._recursiveScan(query)
  }

  static getScan (params) {
    const query = this.buildQuery(params)
    return dynamodb.scan(query).promise()
      .then((data) => {
        return data
      })
  }

  static getByKeys (params) {
    const dbparams = {
      RequestItems: {}
    }
    dbparams.RequestItems[this.TABLE] = {
      Keys: params.Keys
    }
    return dynamodb.batchGet(dbparams).promise()
      .then((data) => {
        if (data.Responses[this.TABLE].length > 0) {
          return data.Responses[this.TABLE]
        }
        return []
      })
  }

  static getOne (keyConditionExpression, expressionAttributeValues) {
    const query = {
      TableName: this.TABLE, // process.env.FUNCTIONS_TABLE,
      IndexName: 'FunctionArnIndex',
      KeyConditionExpression: keyConditionExpression,
      ExpressionAttributeValues: expressionAttributeValues
    }

    return dynamodb.query(query).promise()
      .then((data) => {
        if (data.Count > 0) {
          return data.Items[0]
        }

        return null
      })
  }

  static update (id, data) {
    const {ExpressionAttributeNames, ExpressionAttributeValues, UpdateExpression} = this.getUpdateCondition(
      data)
    const params = {
      TableName: this.TABLE,
      Key: {
        _id: id
      },
      ExpressionAttributeNames: ExpressionAttributeNames,
      ExpressionAttributeValues: ExpressionAttributeValues,
      UpdateExpression: UpdateExpression,
      ReturnValues: 'ALL_NEW'
    }
    return dynamodb.update(params).promise()
      .then((data) => {
        if (data) {
          return data.Attributes
        }
        return null
      })
  }

  static remove (id) {
    const params = {
      TableName: this.TABLE,
      Key: {
        _id: id
      },
      UpdateExpression: 'REMOVE isActive',
      ReturnValues: 'ALL_NEW'
    }
    return dynamodb.update(params).promise()
      .then((data) => {
        if (data) {
          return data.Attributes
        }
        return null
      })
  }

  static delete (params) {
    return dynamodb.delete(
      {
        TableName: this.TABLE,
        Key: params.Key,
        ReturnValues: 'ALL_OLD'
      }
    ).promise()
      .then((data) => {
        if (data) {
          return data
        }
        return null
      })
  }

  static bulkDelete (params) {
    const dbparams = {
      RequestItems: {}
    }

    while (params.Keys.length > 25) {
      let keys = params.Keys.splice(0, 25)
      dbparams.RequestItems[this.TABLE] = keys.map(key => {
        return {
          DeleteRequest: {
            Key: key
          }
        }
      })
      dynamodb.batchWrite(dbparams)
        .promise()
        .then(result => {
          return result
        })
    }
    dbparams.RequestItems[this.TABLE] = params.Keys.map(key => {
      return {
        DeleteRequest: {
          Key: key
        }
      }
    })

    return dynamodb.batchWrite(dbparams)
      .promise()
      .then(result => {
        return result
      })
  }

  static batchWrite (items) {
    const dbparams = {
      RequestItems: {}
    }
    let promises = []
    while (items.length !== 0) {
      let requestItems = items.splice(0, 25)
      console.log(requestItems)

      dbparams.RequestItems[this.TABLE] = requestItems.map(item => {
        return {
          PutRequest: {
            Item: item
          }
        }
      })

      promises.push(dynamodb.batchWrite(dbparams).promise())
    }
    return Promise.all(promises)
  }
}
