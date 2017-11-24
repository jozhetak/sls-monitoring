'use strict'
const UserModel = require('../../shared/model/user')
const helper = require('./user.helper')
const uuid = require('uuid')
const passport = require('../passport/passport')
const errors = require('../../shared/helper/errors')
const dtoUser = require('../../shared/user.dto')
const responses = require('../../shared/helper/responses')

module.exports.create = (event, context, callback) => {
  helper.validateCreate(JSON.parse(event.body))
    .then(data => {
      const timestamp = new Date().getTime()
      const params = {
        _id: uuid.v1(),
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: passport.encryptPassword(data.password),
        createdAt: timestamp,
        updatedAt: timestamp,
        isActive: true
      }
      const user = new UserModel(params)
      return user.save()
    })
    .then(dtoUser.makeDto)
    .then(responses.created)
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
    .then(responses.ok)
    .catch(responses.error)
    .then((response) => callback(null, response))
}

module.exports.get = (event, context, callback) => {
  return passport.checkAuth(event.headers.Authorization)
    .then(() => {
      return UserModel.getById(event.pathParameters.id)
    })
    .then(dtoUser.makeDto)
    .then(responses.ok)
    .catch(responses.error)
    .then((response) => callback(null, response))
}

module.exports.update = (event, context, callback) => {
  return Promise.all([
    passport.checkAuth(event.headers.Authorization),
    helper.validate(event.body)
  ])
    .then(([decoded, data]) => {
      if (decoded.user._id !== event.pathParameters.id) {
        throw Error('User has no permission')
      }
      return UserModel.getById(event.pathParameters.id)
    })
    .then((user) => {
      const data = JSON.parse(event.body)
      return UserModel.update(user._id, data)
    })
    .then(dtoUser.makeDto)
    .then(responses.ok)
    .catch(responses.error)
    .then((response) => callback(null, response))
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
      if (!decoded || !decoded.user ||
        !decoded.user._id.equals(event.pathParameters.id)) {
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
    .then(responses.deleted)
    .catch(responses.error)
    .then((response) => callback(null, response))
}
