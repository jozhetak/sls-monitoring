/* eslint-disable keyword-spacing */
'use strict'
const UserModel = require('../../shared/model/user')
const helper = require('./user.helper')
const uuid = require('uuid')
const passport = require('../passport/passport')
const errors = require('../../shared/helper/errors')
const dtoUser = require('../../shared/user.dto')
const responses = require('../../shared/helper/responses')
const emailService = require('../../shared/helper/email.service')
const hour = 3600000
module.exports.create = (event, context, callback) => {
  helper.validateCreate(JSON.parse(event.body))
    .then(data => {
      const now = Date.now()
      const params = {
        _id: uuid.v1(),
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: passport.encryptPassword(data.password),
        createdAt: now,
        updatedAt: now,
        isActive: false,
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
  return passport.checkAuth(event.headers.Authorization)
    .then(decoded => {
      if (!decoded || !decoded.user) {
        throw errors.forbidden()
      }
      return UserModel.getAllScan({
        FilterExpression: '#isActive = :isActive',
        ExpressionAttributeNames: {
          '#isActive': 'isActive'
        },
        ExpressionAttributeValues: {
          ':isActive': true
        }
      })
    })
    .then(users => users.map(dtoUser.makeDto))
    .then(responses.ok)
    .catch(responses.error)
    .then((response) => callback(null, response))
}

module.exports.get = (event, context, callback) => {
  return passport.checkAuth(event.headers.Authorization)
    .then(() => UserModel.getById(event.pathParameters.id))
    .then(dtoUser.public)
    .then(responses.ok)
    .catch(responses.error)
    .then((response) => callback(null, response))
}

module.exports.update = (event, context, callback) => {
  return Promise.all([
    passport.checkAuth(event.headers.Authorization),
    helper.validate(event.body)
  ])
    .then(([decoded]) => {
      if (decoded.user._id !== event.pathParameters.id) {
        throw errors.forbidden()
      }
      return UserModel.getById(event.pathParameters.id)
    })
    .then((user) => UserModel.update(user._id, JSON.parse(event.body)))
    .then(dtoUser.makeDto)
    .then(responses.ok)
    .catch(responses.error)
    .then((response) => callback(null, response))
}

module.exports.delete = (event, context, callback) => {
  return passport.checkAuth(event.headers.Authorization)
    .then(decoded => {
      if(!decoded.user._id === event.pathParameters.id)) {
        throw errors.forbidden()
      }
      return UserModel.getById(event.pathParameters.id)
    })
    .then((user) => UserModel.update(user._id, {isActive: false}))
    .then(dtoUser.public)
    .then(responses.deleted)
    .catch(responses.error)
    .then((response) => callback(null, response))
}

module.exports.changePassword = (event, context, callback) => {
  const id = event.pathParameters.id

  return passport.checkAuth(event.headers.Authorization)
    .then((decoded) => {
      if (decoded.user._id !== id) {
        throw errors.forbidden()
      }
      return UserModel.update(id, {
        password: passport.encryptPassword(JSON.parse(event.body).password)
      })
    })
    .then(dtoUser.public)
    .then(responses.ok)
    .catch(responses.error)
    .then((response) => callback(null, response))
}

module.exports.resetPassword = (event, context, callback) => {
  const {id, token} = event.pathParameters

  const password = JSON.parse(event.body).password
  UserModel.getById(id)
    .then(user => {
      if (!user) throw errors.notFound()
      if(user.passwordTokenExpires < Date.now()) throw errors.expired()
      if (user.resetPasswordToken === token) {
        return UserModel.update(user._id, {
          password: passport.encryptPassword(password),
          resetPassword: null,
          passwordTokenExpires: null
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
      if(user.verificationTokenExpires < Date.now()) throw errors.expired()
      if (user.verificationToken === token) {
        return UserModel.update(user._id, {isActive: true, verificationToken: null, verificationTokenExpires: null})
      }
    })
     .then(() => responses.redirect('test'))
     .catch(responses.error)
     .then((response) => callback(null, response))
}

module.exports.sendVerificationEmail = (event, contex, callback) => {
  UserModel.getById(event.pathParameters.id)
    .then(user => {
      if(!user) throw errors.notFound()
      return UserModel.update(user._id, {verificationToken: passport.generateToken(),
        verificationTokenExpires: Date.now() + hour * 2
      })
    })
    .then(emailService.sendVerificationEmail)
    .then(responses.ok)
    .catch(responses.error)
    .then((response) => callback(null, response))
}

module.exports.sendResetPasswordEmail = (event, contex, callback) => {
  UserModel.getByEmail(JSON.parse(event.body).email)
    .then(user => {
      if(!user) throw errors.notFound()
      UserModel.update(user._id, {resetPasswordToken: passport.generateToken(), passwordTokenExpires: Date.now() + hour})
    })
    .then(emailService.sendResetPasswordEmail)
    .then(responses.ok)
    .catch(responses.error)
    .then((response) => callback(null, response))
}
