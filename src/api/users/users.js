'use strict'
const UserModel = require('../../shared/model/user')
const uuid = require('uuid')
const _ = require('lodash')
const passport = require('../passport/passport')
const errors = require('../../shared/helper/errors')
const dtoUser = require('../../shared/user.dto')
const responses = require('../../shared/helper/responses')

module.exports.create = (event, context, callback) => {
  const timestamp = new Date().getTime()
  const data = JSON.parse(event.body)
  const params = {
    _id: uuid.v1(),
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    password: passport.encryptPassword(data.password),
    createdAt: timestamp,
    updatedAt: timestamp
  }
  const user = new UserModel(params)
  return user.save()
    .then(dtoUser.makeDto)
    .then(responses.create)
    .catch(responses.error)
    .then((response) => callback(null, response))
}

module.exports.list = (event, context, callback) => {
  Promise.resolve()
    .then(() => {
      if (!event.headers.Authorization) {
        throw errors.unauthorized()
      }
      return passport.checkAuth(event.headers.Authorization)
    })
    .then(decoded => {
      if (!decoded || !decoded.user) {
        throw errors.forbidden()
      }
      return UserModel.getAllScan({})
    })
    .then(users => users.map(dtoUser.makeDto))
    .then(responses.create)
    .catch(responses.error)
    .then((response) => callback(null, response))
}

module.exports.get = (event, context, callback) => {
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

module.exports.update = (event, context, callback) => {
  return passport.checkAuth(event.headers.Authorization)
    .then((user) => {
      if (user._id !== event.pathParameters.id) {
        throw Error('User has no permission')
      }
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
      return UserModel.update(account._id, data)
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
  Promise.resolve()
    .then(() => {
      if (!event.headers.Authorization) {
        throw errors.unauthorized()
      }
      return passport.checkAuth(event.headers.Authorization)
    })
    .then(decoded => {
      if (!decoded || !decoded.user || !decoded.user._id.equals(event.pathParameters.id)) {
        throw errors.forbidden()
      }
      return UserModel.getById(event.pathParameters.id)
    })
    .then(user => {
      user.isActive = false
      let newUser = new UserModel(user)
      return newUser.save()
    })
    .then(dtoUser.makeDto)
    .then(responses.create)
    .catch(responses.error)
    .then((response) => callback(null, response))
}
