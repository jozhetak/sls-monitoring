/**
 * Created by Mac on 10/28/17.
 */
const uuid = require('uuid')
const _ = require('lodash')
const dynamodb = require('../helper/dynamodb')

module.exports = class Model {
  static getUpdateCondition (params) {
    const timestamp = Math.floor(Date.now() / 1000)
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
      TableName: this.TABLE
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

  static getAllScan (params) {
    const query = this.buildQuery(params)
    console.log(JSON.stringify(query, null, 4))
    return dynamodb.scan(query).promise()
      .then((data) => {
        console.log('data', data)
        return data
      })
  }

  static getByKeys (params) {
    var dbparams = {
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
        console.log(data)

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
      ReturnValues: 'ALL_OLD'
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
}
