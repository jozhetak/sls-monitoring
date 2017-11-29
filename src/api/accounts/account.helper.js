const joi = require('joi')
const errors = require('../../shared/helper/errors')

const schema = joi.object().keys({
  _id: joi.string().guid(),
  name: joi.string().required(),
  key: joi.string().required().min(16).max(128),
  secret: joi.string(),
  region: joi.string(),
  createdAt: joi.date().forbidden(),
  updatedAt: joi.date().forbidden(),
  // isActive: joi.boolean().truthy(),
  _user: joi.string().guid()
})

module.exports.validate = (user) => {
  return joi.validate(user, schema)
    .catch(err => {
      throw errors.invalidJoi(err)
    })
}

module.exports.validateInvite = (data) => {
  const inviteScema = joi.object().keys({
    _user: joi.string().guid(),
    _users: joi.array().items(joi.string().guid())
  })
  return joi.validate(data, inviteScema)
    .catch(err => {
      throw errors.invalidJoi(err)
    })
}

module.exports.validateAccountUserUpdate = (data) => {
  const schema = joi.object().keys({
    isAdmin: joi.boolean()
  })
  return joi.validate(data, schema)
    .catch(err => {
      throw errors.invalidJoi(err)
    })
}
