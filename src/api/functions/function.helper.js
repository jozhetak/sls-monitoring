'use strict'

const joi = require('joi')
const errors = require('../../shared/helper/errors')

const createPopulationSchema = joi.object().keys({
  daysInPast: joi.number().integer().min(1).max(31).default(1),
  errorsCoefficient: joi.number().min(0).max(1).default(0.5),
  functionsCount: joi.number().integer().min(1).max(50).default(1),
  invocationsMin: joi.number().integer().min(0).max(99).default(5),
  invocationsMax: joi.number().integer().min(0).max(100).default(10)
})

module.exports.validateCreatePopulation = (data) => {
  return joi.validate(data, createPopulationSchema, {abortEarly: false, allowUnknown: false})
    .catch(err => {
      throw errors.invalidJoi(err)
    })
}
