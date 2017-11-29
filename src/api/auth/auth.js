'use strict'

const UserModel = require('../../shared/model/user')
const jwt = require('jsonwebtoken')
const passport = require('../passport/passport')
const dynamodb = require('../../shared/helper/dynamodb')
const helper = require('./auth.helper')
const errors = require('../../shared/helper/errors')
const dtoUser = require('../../shared/user.dto')
const responses = require('../../shared/helper/responses')

module.exports.signIn = (event, content, callback) => {
  const body = JSON.parse(event.body)

  helper.validate(body)
    .then((data) => {
      const query = {
        TableName: UserModel.TABLE, // process.env.FUNCTIONS_TABLE,
        IndexName: 'EmailPasswordIndex',
        KeyConditionExpression: '#email = :emailValue and #password = :passwordValue',
        ExpressionAttributeNames: {
          '#email': 'email',
          '#password': 'password'
        },
        ExpressionAttributeValues: {
          ':emailValue': data.email,
          ':passwordValue': passport.encryptPassword(data.password)
        },
        ScanIndexForward: false
      }

      return dynamodb.query(query).promise()
    })
    .then((data) => {
      if (data.Count > 0) {
        return data.Items[0]
      } else {
        throw errors.notFound()
      }
    })
    .then((user) => {
      user.accessToken = jwt.sign({
        user: {
          _id: user._id
        }
      }, 'JWT_SECRET', {expiresIn: 3600 * 24 * 365})
    })
    .then(dtoUser.public)
    .then(responses.ok)
    .catch(responses.error)
    .then(response => callback(null, response))
}
