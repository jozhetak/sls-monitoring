'use strict';

const UserModel = require('./../../model/user');
const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const jwt = require('jsonwebtoken');

module.exports.signIn = (event, content, callback) => {
  const data = JSON.parse(event.body);
  const query = {
    TableName: UserModel.TABLE, // process.env.FUNCTIONS_TABLE,
    IndexName: 'EmailPasswordIndex',
    KeyConditionExpression: "#email = :emailValue and #password = :passwordValue",
    ExpressionAttributeNames: {
      '#email' : 'email',
      '#password' : 'password'
    },
    ExpressionAttributeValues: {
      ":emailValue": data.email,
      ":passwordValue": data.password
    },
    ScanIndexForward: false
  };

  return dynamoDb.query(query).promise()
    .then((data) => {
      if (data.Count > 0) {
        return data.Items[0];
      } else {
        throw Error('User Not Found')
      }
    })
    .then((user) => {
      const token = jwt.sign({
        user: {
          _id: user._id
        }
      }, 'JWT_SECRET', { expiresIn: 3600*24*365 });
      user.accessToken = token
      const response = {
        statusCode: 200,
        body: JSON.stringify(user)
      };
      callback(null, response);
    })
    .catch((e) => {
      console.log('error', e)
      callback(null, {
        statusCode: e.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: e.message
      });
    })
}