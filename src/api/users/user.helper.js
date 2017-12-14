const joi = require('joi')
const errors = require('../../shared/helper/errors')

const passwordSchema = joi.string().min(8).regex(/.*/)

const schema = joi.object().keys({
  _id: joi.string().guid(),
  firstName: joi.string(),
  lastName: joi.string(),
  email: joi.string().email(),
  password: passwordSchema.forbidden(),
  createdAt: joi.date().forbidden(),
  updatedAt: joi.date().forbidden()
})

module.exports.validate = (user) => {
  return joi.validate(user, schema)
    .catch(err => {
      throw errors.invalidJoi(err)
    })
}

const createSchema = joi.object().keys({
  _id: joi.string().guid().forbidden(),
  firstName: joi.string(),
  lastName: joi.string(),
  email: joi.string().email(),
  password: passwordSchema,
  createdAt: joi.date().forbidden(),
  updatedAt: joi.date().forbidden()
})

module.exports.validateCreate = (user) => {
  return joi.validate(user, createSchema)
    .catch(err => {
      throw errors.invalidJoi(err)
    })
}


module.exports.validatePassword = (password) => {
  return joi.validate(password, passwordSchema)
    .catch(err => {
      throw errors.invalidJoi(err)
    })
}

module.exports.timestamp = () => {
  return Date.now()
}
