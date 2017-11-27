'use strict'
const InvocationModel = require('../../shared/model/invocation')
const _ = require('lodash')
const passport = require('./../passport/passport')
const responses = require('../../shared/helper/responses')

module.exports.list = (event, context, callback) => {
  return passport.checkAuth(event.headers.Authorization)
    .then((user) => {
      return InvocationModel.getAll({
        IndexName: 'FunctionIdIndex',
        KeyConditionExpression: '#function = :function',
        ExpressionAttributeNames: {
          '#function': '_function'
        },
        ExpressionAttributeValues: {
          ':function': event.pathParameters.functionId
        }
      })
    })
    .then(responses.ok)
    .catch(responses.error)
    .then(response => callback(null, response))
}

module.exports.get = (event, context, callback) => {
  return passport.checkAuth(event.headers.Authorization)
    .then((user) => {
      return InvocationModel.getById(event.pathParameters.invocationId)
    })
    .then(responses.ok)
    .catch(responses.error)
    .then(response => callback(null, response))
}
