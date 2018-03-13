'use strict'

global.Promise = require('bluebird')

const UserModel = require('../../shared/model/user')
const helper = require('./user.helper')
const uuid = require('uuid')
const passport = require('../passport/passport')
const errors = require('../../shared/helper/errors')
const dtoUser = require('../../shared/user.dto')
const responses = require('../../shared/helper/responses')
const emailService = require('../../shared/helper/email.service')
const hour = 360000

module.exports.create = (event, context, callback) => {
  let body
  try {
    body = JSON.parse(event.body)
  } catch (err) {
    return callback(null, responses.error(errors.badRequest()))
  }
  const now = helper.timestamp()
  helper.validateCreate(body)
    .then(data => UserModel.getByEmail(data.email))
    .then(duplicate => {
      if (duplicate) throw errors.conflict()
      const params = {
        _id: uuid.v1(),
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        password: passport.encryptPassword(body.password),
        createdAt: now,
        updatedAt: now,
        verificationToken: passport.generateToken(),
        verificationTokenExpires: now + hour * 2
      }
      const user = new UserModel(params)
      return Promise.all([user.save(), emailService.sendVerificationEmail(user.data)])
    })
    .then((res) => dtoUser.public(res[0]))
    .then(responses.created)
    .catch(responses.error)
    .then((response) => callback(null, response))
}

module.exports.list = (event, context, callback) => {
  const token = event.headers.Authorization
  const query = event.queryStringParameters
  const limit = query && query.limit ? query.limit : 50
  const key = query && query.key ? {_id: query.key, isActive: 1} : undefined

  passport.checkAuth(token)
    .then((decoded) => UserModel.isActiveOrThrow(decoded))
    .then(() => {
      let params = {
        IndexName: 'isActive',
        Limit: limit,
        ExclusiveStartKey: key
      }

      return UserModel.getScan(params)
    })
    .then(dtoUser.publicList)
    .then(responses.ok)
    .catch(responses.error)
    .then((response) => callback(null, response))
}

module.exports.get = (event, context, callback) => {
  const id = event.pathParameters.id
  const token = event.headers.Authorization

  passport.checkAuth(token)
    .then((decoded) => UserModel.isActiveOrThrow(decoded))
    .then(() => UserModel.getActiveByIdrOrThrow(id))
    .then(dtoUser.public)
    .then(responses.ok)
    .catch(responses.error)
    .then((response) => callback(null, response))
}

module.exports.update = (event, context, callback) => {
  const id = event.pathParameters.id
  const token = event.headers.Authorization
  let body
  try {
    body = JSON.parse(event.body)
  } catch (err) {
    return callback(null, responses.error(errors.badRequest()))
  }

  Promise.all([
    passport.checkSelf(token, id),
    helper.validateUpdate(body)
  ])
    .then(([decoded]) => UserModel.isActiveOrThrow(decoded))
    .then(() => {
      return UserModel.getByEmail(body.email)
        .then(user => {
          if (!user) {
            return UserModel.update(id, body)
          } else {
            throw errors.forbidden()
          }
        })
    })
    .then(dtoUser.public)
    .then(responses.ok)
    .catch(responses.error)
    .then((response) => callback(null, response))
}

module.exports.delete = (event, context, callback) => {
  const id = event.pathParameters.id
  const token = event.headers.Authorization

  passport.checkSelf(token, id)
    .then((decoded) => UserModel.isActiveOrThrow(decoded))
    .then(() => UserModel.remove(id))
    .then(dtoUser.public)
    .then(responses.ok)
    .catch(responses.error)
    .then((response) => callback(null, response))
}

module.exports.changePassword = (event, context, callback) => {
  const id = event.pathParameters.id
  const token = event.headers.Authorization
  let body
  try {
    body = JSON.parse(event.body)
  } catch (err) {
    return callback(null, responses.error(errors.badRequest()))
  }

  passport.checkSelf(token, id)
    .then(() => helper.validateUpdatePassword(body))
    .then(() => UserModel.getActiveByIdrOrThrow(id))
    .then(user => {
      if (user.password !== passport.encryptPassword(body.oldPassword)) {
        throw errors.forbidden()
      }
      return UserModel.update(id, {
        password: passport.encryptPassword(body.newPassword)
      })
    })
    .then(dtoUser.public)
    .then(responses.ok)
    .catch(responses.error)
    .then((response) => callback(null, response))
}

module.exports.resetPassword = (event, context, callback) => {
  const {id, token} = event.pathParameters
  let body
  try {
    body = JSON.parse(event.body)
  } catch (err) {
    return callback(null, responses.error(errors.badRequest()))
  }

  Promise.all([
    helper.validateResetPassword(body.password),
    UserModel.getActiveByIdrOrThrow(id)
  ])
    .then(([password, user]) => {
      if (user.resetPasswordTokenExpires < helper.timestamp()) throw errors.expired()
      if (!user.resetPasswordToken === token) throw errors.forbidden()

      return UserModel.update(user._id, {
        password: passport.encryptPassword(password),
        resetPassword: null,
        resetPasswordTokenExpires: null
      })
    })
    .then(dtoUser.public)
    .then(responses.ok)
    .catch(responses.error)
    .then((response) => callback(null, response))
}

module.exports.verify = (event, context, callback) => {
  const {id, token} = event.pathParameters

  UserModel.getById(id)
    .then(user => {
      if (!user) throw errors.notFound()
      if (user.isActive) throw errors.conflict()
      if (user.verificationTokenExpires < helper.timestamp()) throw errors.expired()
      if (user.verificationToken !== token) throw errors.badRequest()
      return UserModel.update(user._id, {
        isActive: 1,
        verificationToken: null,
        verificationTokenExpires: null
      })
    })
    .then(() => responses.redirect('login'))
    .catch(responses.error)
    .then((response) => callback(null, response))
}

module.exports.sendVerificationEmail = (event, contex, callback) => {
  const id = event.pathParameters.id

  UserModel.getById(id)
    .then((user) => {
      if (!user) throw errors.notFound()
      if (user.isActive) throw errors.conflict()
      return UserModel.update(id, {
        verificationToken: passport.generateToken(),
        verificationTokenExpires: helper.timestamp() + hour * 2
      })
    })
    .then(emailService.sendVerificationEmail)
    .then(responses.empty)
    .catch(responses.error)
    .then((response) => callback(null, response))
}

module.exports.sendResetPasswordEmail = (event, contex, callback) => {
  let body
  try {
    body = JSON.parse(event.body)
  } catch (err) {
    return callback(null, responses.error(errors.badRequest()))
  }

  UserModel.getByEmail(body.email)
    .then(user => {
      if (!user) throw errors.notFound()
      return UserModel.update(user._id, {
        resetPasswordToken: passport.generateToken(),
        resetPasswordTokenExpires: helper.timestamp() + hour * 2
      })
    })
    .then(emailService.sendResetPasswordEmail)
    .then(responses.empty)
    .catch(responses.error)
    .then((response) => callback(null, response))
}
