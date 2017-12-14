'use strict'
const HttpStatus = require('./HttpStatus')

class ProjectError extends Error {
  constructor (message) {
    super(message)
    this.message = message
    this.name = 'projectError'
    this.error = message
  }
}

module.exports.serverError = (err) => {
  const error = new ProjectError('SERVER_ERROR')
  if (err) error.message = err
  error.statusCode = HttpStatus.INTERNAL_SERVER_ERROR
  return error
}

module.exports.notFound = (err) => {
  const error = new ProjectError('NOT_FOUND')
  if (err) error.message = err
  error.statusCode = HttpStatus.NOT_FOUND
  return error
}

module.exports.badRequest = (err) => {
  const error = new ProjectError('BAD_REQUEST')
  if (err) error.message = err
  error.statusCode = HttpStatus.BAD_REQUEST
  return error
}

module.exports.forbidden = (err) => {
  const error = new ProjectError('FORBIDDEN')
  if (err) error.message = err
  error.statusCode = HttpStatus.FORBIDDEN
  return error
}

module.exports.unauthorized = (err) => {
  const error = new ProjectError('UNAUTHORIZED')
  if (err) error.message = err
  error.statusCode = HttpStatus.UNAUTHORIZED
  return error
}

module.exports.invalidJoi = (err) => {
  let result = ''
  for (const error of err.details) {
    result += error.message.toString()
  }
  console.log(result)
  return this.badRequest(result)
}

module.exports.expired = (err) => {
  const error = new ProjectError('GONE')
  if (err) error.message = err
  error.statusCode = HttpStatus.GONE
  return error
}
