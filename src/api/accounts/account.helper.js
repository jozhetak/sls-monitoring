const joi = require('joi')
const errors = require('../../shared/helper/errors')
const regex = require('../../shared/regex')

const schema = joi.object().keys({
  _id: joi.string().guid(),
  name: joi.string().required(),
  key: joi.string().required().min(16).max(128),
  secret: joi.string(),
  region: joi.string(),
  createdAt: joi.date().forbidden(),
  updatedAt: joi.date().forbidden(),
  // isActive: joi.boolean().truthy(),
  _user: joi.string().guid().forbidden()
})

const inviteSchema = joi.object().keys({
  _user: joi.string().guid(),
  _users: joi.array().items(joi.string().guid())
})

const inviteByEmailSchema = joi.object().keys({
  email: joi.string().trim().regex(regex.email).required()
})

const userUpdateSchema = joi.object().keys({
  isAdmin: joi.boolean()
})

module.exports.validate = (user) => {
  return joi.validate(user, schema, {abortEarly: false, allowUnknown: false})
    .catch(err => {
      throw errors.invalidJoi(err)
    })
}

module.exports.validateInvite = (data) => {
  return joi.validate(data, inviteSchema,
    {abortEarly: false, allowUnknown: false})
    .catch(err => {
      throw errors.invalidJoi(err)
    })
}

module.exports.validateInviteByEmail = (data) => {
  return joi.validate(data, inviteByEmailSchema,
    {abortEarly: false, allowUnknown: false})
    .catch(err => {
      throw errors.invalidJoi(err)
    })
}

module.exports.validateAccountUserUpdate = (data) => {
  return joi.validate(data, userUpdateSchema,
    {abortEarly: false, allowUnknown: false})
    .catch(err => {
      throw errors.invalidJoi(err)
    })
}
