'use strict'
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
  const body = JSON.parse(event.body)
  const now = helper.timestamp()

  helper.validateCreate(body)
    .then(data => {
      const params = {
        _id: uuid.v1(),
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: passport.encryptPassword(data.password),
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

  passport.checkAuth(token)
    .then((decoded) => UserModel.isActiveOrThrow(decoded))
    .then(() => {
      let LastEvaluatedKey = null
      if (query && Object.prototype.hasOwnProperty.call(query, 'LastEvaluatedKey')) {
        LastEvaluatedKey = {
          _id: query.LastEvaluatedKey,
          isActive: 1
        }
      }
      return UserModel.getAllScan({
        IndexName: 'isActive',
        Limit: 2,
        ExclusiveStartKey: LastEvaluatedKey
      })
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
  const body = JSON.parse(event.body)

  Promise.all([
    passport.checkSelf(token, id),
    helper.validate(body)
  ])
    .then(([decoded]) => UserModel.isActiveOrThrow(decoded))
    .then(() => UserModel.update(id, body))
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
  const body = JSON.parse(event.body)

  passport.checkSelf(token, id)
    .then((decoded) => UserModel.isActiveOrThrow(decoded))
    .then(() => helper.validatePassword(body.password))
    .then((password) => {
      return UserModel.update(id, {
        password: passport.encryptPassword(password)
      })
    })
    .then(dtoUser.public)
    .then(responses.ok)
    .catch(responses.error)
    .then((response) => callback(null, response))
}

module.exports.resetPassword = (event, context, callback) => {
  const {id, token} = event.pathParameters
  const body = JSON.parse(event.body)

  Promise.all([
    helper.validatePassword(body.password),
    UserModel.getActiveByIdrOrThrow(id)
  ])
    .then(([user, password]) => {
      if (user.resetPasswordTokenExpires < helper.timestamp()) throw errors.expired()
      if (user.resetPasswordToken === token) {
        return UserModel.update(user._id, {
          password: passport.encryptPassword(password),
          resetPassword: null,
          resetPasswordTokenExpires: null
        })
      }
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
    .then(() => responses.redirect('test'))
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
  const body = JSON.parse(event.body)

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
