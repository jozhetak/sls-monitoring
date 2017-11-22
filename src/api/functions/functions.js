'use strict'
const FunctionModel = require('../../shared/model/function')
const _ = require('lodash')
const passport = require('./../passport/passport')

module.exports.list = (event, context, callback) => {
  return passport.checkAuth(event.headers.Authorization)
    .then((user) => {
      return FunctionModel.getAll()
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

module.exports.get = (event, context, callback) => {
  return passport.checkAuth(event.headers.Authorization)
    .then((user) => {
      return FunctionModel.getById(event.pathParameters.id)
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