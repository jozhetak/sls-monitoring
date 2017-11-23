'use strict'
const HttpStatus = require('./HttpStatus')

module.exports.ok = (body) => {
  return buildResponse(HttpStatus.OK, body)
}

module.exports.created = (body) => {
  return buildResponse(HttpStatus.CREATED, body)
}
module.exports.deleted = (body) => {
  return buildResponse(HttpStatus.NO_CONTENT, body)
}
module.exports.error = (error) => {
  return buildResponse(error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR, error.message)
}

function buildResponse (statusCode, body) {
  return {
    statusCode: statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify(body)
  }
}
