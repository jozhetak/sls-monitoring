const joi = require('joi')
const errors = require('../../shared/helper/errors')

const schema = joi.object().keys({
  email: joi.string().email().required(),
  password: joi.string().required()
})

module.exports.validate = (user) => {
  return joi.validate(user, schema)
    .catch(err => {
      throw errors.invalidJoi(err)
    })
}
