const joi = require('joi')
const errors = require('../../shared/helper/errors')

const schema = joi.object().keys({
  _id: joi.string().guid(),
  firstName: joi.string(),
  lastName: joi.string(),
  email: joi.string().email(),
  password: joi.string().forbidden(),
  createdAt: joi.date().forbidden(),
  updatedAt: joi.date().forbidden()
  // isActive: joi.boolean().truthy()
})

module.exports.validate = (user) => {
  return joi.validate(user, schema)
    .catch(err => {
      throw errors.invalidJoi(err)
    })
}

const createSchema = joi.object().keys({
  _id: joi.string().guid(),
  firstName: joi.string(),
  lastName: joi.string(),
  email: joi.string().email(),
  password: joi.string(),
  createdAt: joi.date().forbidden(),
  updatedAt: joi.date().forbidden()
})

module.exports.validateCreate = (user) => {
  return joi.validate(user, createSchema)
    .catch(err => {
      throw errors.invalidJoi(err)
    })
}
