module.exports.ok = (body) => {
  return buildResponse(200, body)
}

module.exports.create = (body) => {
  return buildResponse(201, body)
}
module.exports.delete = (body) => {
  return buildResponse(204, body)
}
module.exports.error = (error) => {
  console.log(error)
  return buildResponse(error.statusCode || 500, error.message)
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
