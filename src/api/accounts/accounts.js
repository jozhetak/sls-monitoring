'use strict'
const AccountModel = require('../../shared/model/account')
const UserAccountModel = require('../../shared/model/userAccount')
const uuid = require('uuid')
const _ = require('lodash')
const passport = require('./../passport/passport')

module.exports.create = (event, context, callback) => {
  console.log('event: ', event)
  return passport.checkAuth(event.headers.Authorization)
    .then((decoded) => {
      const user = decoded.user
      const timestamp = new Date().getTime()
      const data = JSON.parse(event.body)
      const params = {
        _id: uuid.v1(),
        name: data.name,
        key: data.key,
        secret: data.secret,
        region: data.region,
        createdAt: timestamp,
        updatedAt: timestamp,
        isActive: true,
        _user: user._id // createdBy
      }
      const account = new AccountModel(params)
      const accountUser = new UserAccountModel({
        _id: uuid.v1(),
        _user: user._id,
        _account: params._id,
        isAdmin: true
      })
      return Promise.all([
        account.save(),
        accountUser.save()
      ]).then((result) => {
        return result[0]
      })
    })
    .then((result) => {
      return {
        statusCode: 201,
        error: null,
        result: result
      }
    })
    .catch((err) => {
      return {
        statusCode: 500,
        error: err.message,
        result: null
      }
    })
    .then((object) => {
      console.log(object)
      const response = {
        statusCode: object.statusCode,
        body: JSON.stringify({
          error: object.error,
          result: object.result
        })
      }
      callback(null, response)
    })
}

module.exports.list = (event, context, callback) => {
  return passport.checkAuth(event.headers.Authorization)
    .then((decoded) => {
      console.log('user:', decoded.user)
      return UserAccountModel.getAll({
        IndexName: 'UserAccounts',
        KeyConditionExpression: '#user = :user',
        ExpressionAttributeNames: {
          '#user': '_user'
        },
        ExpressionAttributeValues: {
          ':user': decoded.user._id
        }
        // ProjectionExpression: "_account"
      })
    })
    .then((accounts) => {
      console.log('accounts', accounts)
      const accountsList = []
      accounts.forEach((account) => {
        accountsList.push(account._account)
      })
      return AccountModel.getAllScan({
        KeyConditions: {
          _id: {
            'ComparisonOperator': 'IN',
            'AttributeValueList': accountsList
          }
        }
      })
    })
    .then((result) => {
      return {
        statusCode: 200,
        error: null,
        result: result
      }
    })
    .catch((err) => {
      return {
        statusCode: 500,
        error: err,
        result: null
      }
    })
    .then((object) => {
      const response = {
        statusCode: object.statusCode,
        body: JSON.stringify({
          error: object.error,
          result: object.result
        })
      }
      callback(null, response)
    })
}

module.exports.get = (event, context, callback) => {
  return passport.checkAuth(event.headers.Authorization)
    .then((user) => {
      return AccountModel.getById(event.pathParameters.id)
        .then((account) => {
          if (_.indexOf(account._users, user._id) === -1) {
            throw Error('User has no permission')
          }
          return account
        })
        .catch((err) => {
          throw err
        })
    })
    .then((result) => {
      return {
        statusCode: 200,
        error: null,
        result: result
      }
    })
    .catch((err) => {
      return {
        statusCode: 500,
        error: err.message,
        result: null
      }
    })
    .then((object) => {
      const response = {
        statusCode: object.statusCode,
        body: JSON.stringify({
          error: object.error,
          result: object.result
        })
      }
      callback(null, response)
    })
}

module.exports.update = (event, context, callback) => {
  return passport.checkAuth(event.headers.Authorization)
    .then((user) => {
      return AccountModel.getById(event.pathParameters.id)
        .then((account) => {
          if (_.indexOf(account._users, user._id) === -1) {
            throw Error('User has no permission')
          }
          return account
        })
        .catch((err) => {
          throw err
        })
    })
    .then((account) => {
      const data = JSON.parse(event.body)
      return AccountModel.update(account._id, data)
    })
    .then((result) => {
      return {
        statusCode: 200,
        error: null,
        result: result
      }
    })
    .catch((err) => {
      return {
        statusCode: 500,
        error: err.message,
        result: null
      }
    })
    .then((object) => {
      const response = {
        statusCode: object.statusCode,
        body: JSON.stringify({
          error: object.error,
          result: object.result
        })
      }
      callback(null, response)
    })
}

module.exports.delete = (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Go Serverless v1.0! Your function executed successfully!',
      input: event
    })
  }

  callback(null, response)

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
}
