/**
 * Created by Mac on 10/28/17.
 */

const Model = require('./model')
const dynamodb = require('../helper/dynamodb')
const _ = require('lodash')
const errors = require('../../shared/helper/errors')

module.exports = class User extends Model {
  constructor (opts) {
    super(opts)
  }

  static get TABLE () {
    return process.env.USERS_TABLE
  }

  static getUsersOfAccount (params) {
    const dbparams = {
      RequestItems: {}
    }
    dbparams.RequestItems[this.TABLE] = {
      Keys: params.Keys
    }
    const userAccounts = []
    params.Keys.forEach((v) => {
      userAccounts.push({
        _user: v._id,
        _account: params._account
      })
    })
    dbparams.RequestItems['user-accounts-dev'] = {
      Keys: userAccounts
    }
    return dynamodb.batchGet(dbparams).promise()
      .then((data) => {
        const result = []
        // return data
        if (data.Responses[this.TABLE].length > 0) {
          //  return data.Responses[this.TABLE]
        }
        data.Responses['user-accounts-dev'].forEach((account) => {
          let _user = account._user
          account._user = _.find(data.Responses[this.TABLE], {_id: _user})
          result.push(account)
        })
        return result
      })
  }

  static getByEmail (email) {
    const params = {
      TableName: this.TABLE,
      IndexName: 'emailIndex',
      KeyConditionExpression: 'email = :email and isActive = :isActive',
      ExpressionAttributeValues: {
        ':email': email,
        ':isActive': 1
      }
    }

    return dynamodb.query(params)
      .promise()
      .then((data) => {
        return data.Items[0]
      })
  }

  static getActiveByIdrOrThrow (id) {
    return User.getById(id)
      .then(user => {
        if (!user) {
          throw errors.notFound()
        }
        if (!user.hasOwnProperty('isActive')) throw errors.notFound()
        return user
      })
  }

  static isActiveOrThrow ({user}) {
    console.log(user)
    return User.getById(user._id)
      .then(user => {
        if (!user) {
          throw errors.unauthorized()
        }
        if (!user.hasOwnProperty('isActive')) throw errors.forbidden()
        return user._id
      })
  }
}
