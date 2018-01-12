'use strict'
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
  const key = query && query.key ? {_function: functionId, _id: query.key} : undefined

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

module.exports.get = (event, context, callback) => {
  const token = event.headers.Authorization
  const accountId = event.pathParameters.id
  const functionId = event.pathparameters.functionId
  const invocationId = event.pathParameters.invocationId

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
