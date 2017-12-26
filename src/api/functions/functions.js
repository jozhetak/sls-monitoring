'use strict'
const FunctionModel = require('../../shared/model/function')
const _ = require('lodash')
const passport = require('./../passport/passport')
const responses = require('../../shared/helper/responses')
const faker = require('faker')

module.exports.list = (event, context, callback) => {
  return passport.checkAuth(event.headers.Authorization)
    .then((user) => {
      return FunctionModel.getAll({
        IndexName: 'AccountIdIndex',
        KeyConditionExpression: '#account = :account',
        ExpressionAttributeNames: {
          '#account': '_account'
        },
        ExpressionAttributeValues: {
          ':account': event.pathParameters.id
        }
      })
    })
    // .then((accounts) => accounts.map(dtoAccount.public))
    .then(responses.ok)
    .catch(responses.error)
    .then(response => callback(null, response))
}

module.exports.get = (event, context, callback) => {
  return passport.checkAuth(event.headers.Authorization)
    .then((user) => {
      return FunctionModel.getById(event.pathParameters.functionId)
    })
    .then(responses.ok)
    .catch(responses.error)
    .then(response => callback(null, response))
}

module.exports.populate = (event, context, callback) => {
  Promise.resolve()
    .then(() => faker.hacker.abbreviation())
    .then(responses.ok)
    .catch(responses.error)
    .then(response => callback(null, response))
}
