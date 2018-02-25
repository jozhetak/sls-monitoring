'use strict'

global.Promise = require('bluebird')

const InvocationModel = require('../../shared/model/invocation')
const AccountModel = require('../../shared/model/account')
const UserModel = require('../../shared/model/user')
const UserAccountModel = require('../../shared/model/userAccount')
const FunctionModel = require('../../shared/model/function')
const errors = require('../../shared/helper/errors')
const _ = require('lodash')
const passport = require('./../passport/passport')
const responses = require('../../shared/helper/responses')

module.exports.list = (event, context, callback) => {
  const query = event.queryStringParameters
  const token = event.headers.Authorization
  const accountId = event.pathParameters.id
  const functionId = event.pathParameters.functionId
  const limit = query && query.limit ? query.limit : 50
  const key = query && query.key
    ? {
      _function: functionId,
      _id: query.key
    }
    : undefined

  return Promise.all([
      passport.checkAuth(token)
        .then(decoded => UserModel.isActiveOrThrow(decoded)),
      AccountModel.getActiveByIdrOrThrow(accountId),
      UserAccountModel.getUsersByAccount(accountId),
      FunctionModel.getById(functionId)
    ]
  )
    .then(([id, account, accountUsers, func]) => {
      let accountUsersIds = accountUsers.map(user => user._user)
      if (!(accountUsersIds.includes(id))) {
        throw errors.forbidden()
      }
      if (func._account !== accountId) {
        throw errors.forbidden()
      }

      return InvocationModel.getAll({
        IndexName: 'FunctionIdIndex',
        KeyConditionExpression: '#function = :function',
        ExpressionAttributeNames: {
          '#function': '_function'
        },
        ExpressionAttributeValues: {
          ':function': functionId
        },
        ExclusiveStartKey: key,
        Limit: limit,
        ScanIndexForward: false
      })
    })
    .then(responses.ok)
    .catch(responses.error)
    .then(response => callback(null, response))
}

module.exports.listOfAccount = (event, context, callback) => {
  const query = event.queryStringParameters
  const token = event.headers.Authorization
  const accountId = event.pathParameters.id
  const limit = query && query.limit ? query.limit : 50

  const promises = [
    passport.checkAuth(token)
      .then(decoded => UserModel.isActiveOrThrow(decoded)),
    AccountModel.getActiveByIdrOrThrow(accountId),
    UserAccountModel.getUsersByAccount(accountId)
  ]
  if (query && query.key) {
    promises.push(InvocationModel.getById(query.key))
  }
  return Promise.all(promises)
    .spread((id, account, accountUsers, lastReturnedInvocation) => {
      const exclusiveStartKey = lastReturnedInvocation ? {
        _account: lastReturnedInvocation._account,
        _id: lastReturnedInvocation._id,
        startTime: lastReturnedInvocation.startTime
      } : undefined

      let accountUsersIds = accountUsers.map(user => user._user)
      if (!(accountUsersIds.includes(id))) {
        throw errors.forbidden()
      }

      return InvocationModel.getAll({
        IndexName: 'AccountIdIndex',
        KeyConditionExpression: '#account = :account',
        ExpressionAttributeNames: {
          '#account': '_account'
        },
        ExpressionAttributeValues: {
          ':account': accountId
        },
        ExclusiveStartKey: exclusiveStartKey,
        Limit: limit,
        ScanIndexForward: false
      })
    })
    .then(responses.ok)
    .catch(responses.error)
    .then(response => callback(null, response))
}

module.exports.get = (event, context, callback) => {
  const token = event.headers.Authorization
  const accountId = event.pathParameters.id
  const functionId = event.pathParameters.functionId
  const invocationId = event.pathParameters.invocationId

  return Promise.all([
      passport.checkAuth(token)
        .then(decoded => UserModel.isActiveOrThrow(decoded)),
      AccountModel.getActiveByIdrOrThrow(accountId),
      UserAccountModel.getUsersByAccount(accountId),
      FunctionModel.getById(functionId)
    ]
  )
    .then(([id, account, accountUsers, func]) => {
      let accountUsersIds = accountUsers.map(user => user._user)
      if (!(accountUsersIds.includes(id))) {
        throw errors.forbidden()
      }
      if (func._account !== accountId) throw errors.forbidden()
      return InvocationModel.getById(invocationId)
    })
    .then(invocation => {
      if (invocation._function !== functionId) {
        throw errors.forbidden()
      }
      return invocation
    })
    .then(responses.ok)
    .catch(responses.error)
    .then(response => callback(null, response))
}
// TODO: support endTime
module.exports.chartFunctionInvocations = (event, context, callback) => {
  const query = event.queryStringParameters
  const token = event.headers.Authorization
  const accountId = event.pathParameters.id
  const functionId = event.pathParameters.functionId
  const limit = query && query.limit ? query.limit : 100
  const key = query && query.key ? {_function: functionId, _id: query.key} : undefined
  const startTime = query && query.startTime ? query.startTime : (new Date()).getTime() - 60 * 60 * 60 * 1000
  const endTime =  query && query.endTime ? query.endTime : (new Date()).getTime()
  return Promise.all([
      passport.checkAuth(token).then(decoded => UserModel.isActiveOrThrow(decoded)),
      AccountModel.getActiveByIdrOrThrow(accountId),
      UserAccountModel.getUsersByAccount(accountId),
      FunctionModel.getById(functionId)
    ]
  )
    .then(([id, account, accountUsers, func]) => {
      let accountUsersIds = accountUsers.map(user => user._user)
      if (!(accountUsersIds.includes(id))) {
        throw errors.forbidden()
      }
      if (func._account !== accountId) {
        throw errors.forbidden()
      }

      return InvocationModel.getAll({
        IndexName: 'FunctionIdIndex',
        KeyConditionExpression: '#function = :function AND #startTime >= :startTime',
        FilterExpression: '',
        ExpressionAttributeNames: {
          '#function': '_function',
          '#startTime': 'startTime'
        },
        ExpressionAttributeValues: {
          ':function': functionId,
          ':startTime': startTime
        },
        ExclusiveStartKey: key,
        Limit: limit,
        ScanIndexForward: false
      })
    })
    .then(responses.ok)
    .catch(responses.error)
    .then(response => callback(null, response))
}
