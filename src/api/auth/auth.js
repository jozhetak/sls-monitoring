'use strict'

const UserModel = require('../../shared/model/user')
const jwt = require('jsonwebtoken')
const passport = require('../passport/passport')
const dynamodb = require('../../shared/helper/dynamodb')
const helper = require('./auth.helper')

module.exports.signIn = (event, content, callback) => {
  helper.validate(JSON.parse(event.body))
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
        throw Error('User Not Found')
      }
    })
    .then((user) => {
      user.accessToken = jwt.sign({
        user: {
          _id: user._id
        }
      }, 'JWT_SECRET', {expiresIn: 3600 * 24 * 365})
      const response = {
        statusCode: 200,
        body: JSON.stringify(user)
      }
      callback(null, response)
    })
    .catch((e) => {
      console.log('error', e)
      callback(null, {
        statusCode: e.statusCode || 501,
        headers: {'Content-Type': 'text/plain'},
        body: e.message
      })
    })
}
