'use strict'

const joi = require('joi')
const errors = require('../../shared/helper/errors')
const regex = require('../../shared/regex')

const passwordSchema = joi.string().min(8).regex(regex.password)

const createSchema = joi.object().keys({
  firstName: joi.string().trim().regex(regex.firstName).min(2).max(32).required(),
  lastName: joi.string().trim().regex(regex.lastName).min(2).max(32).required(),
  email: joi.string().trim().regex(regex.email).required(),
  password: passwordSchema.required()
})

const updateSchema = joi.object().keys({
  firstName: joi.string().trim().regex(regex.firstName).min(2).max(32).required(),
  lastName: joi.string().trim().regex(regex.lastName).min(2).max(32).required(),
  email: joi.string().trim().regex(regex.email).required()
})

const updatePasswordSchema = joi.object().keys({
  oldPassword: passwordSchema.required(),
  newPassword: passwordSchema.required()
})

module.exports.validateCreate = (user) => {
  return joi.validate(user, createSchema, {abortEarly: false, allowUnknown: false})
    .catch(err => {
      throw errors.invalidJoi(err)
    })
}

module.exports.validateUpdate = (user) => {
  return joi.validate(user, updateSchema, {abortEarly: false, allowUnknown: false})
    .catch(err => {
      throw errors.invalidJoi(err)
    })
}

module.exports.validateUpdatePassword = (data) => {
  return joi.validate(data, updatePasswordSchema, {abortEarly: false, allowUnknown: false})
    .catch(err => {
      throw errors.invalidJoi(err)
    })
}

module.exports.validateResetPassword = (password) => {
  return joi.validate(password, passwordSchema)
    .catch(err => {
      throw errors.invalidJoi(err)
    })
}

module.exports.timestamp = () => {
  return Date.now()
}
