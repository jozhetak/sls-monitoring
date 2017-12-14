'use strict'
const HttpStatus = require('./HttpStatus')

module.exports.ok = (body) => {
  return buildResponse(HttpStatus.OK, body)
}

module.exports.created = (body) => {
  return buildResponse(HttpStatus.CREATED, body)
}
module.exports.empty = (body) => {
  return buildResponse(HttpStatus.NO_CONTENT, body)
}

module.exports.redirect = (url) => {
  return buildResponse(HttpStatus.MOVED_TEMPORARILY, null, {'Location': `${process.env.WEB_URL}/${url}`})
}

module.exports.error = (error) => {
  return buildResponse(error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR, error.message)
}

function buildResponse (statusCode, body, headers) {
  return {
    statusCode: statusCode,
    headers: headers || {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify(body)
  }
}
