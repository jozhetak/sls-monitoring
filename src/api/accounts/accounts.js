'use strict';
const AccountModel = require('../../shared/model/account');
const uuid = require('uuid');
const _ = require('lodash');
const passport = require('./../passport/passport')
const waterfall = require('async/waterfall')

module.exports.create = (event, context, callback) => {
  return passport.checkAuth(event.headers.Authorization)
    .then((user) => {
      const timestamp = new Date().getTime();
      const data = JSON.parse(event.body);
      const params = {
        _id: uuid.v1(),
        name: data.name,
        key: data.key,
        secret: data.secret,
        region: data.region,
        createdAt: timestamp,
        updatedAt: timestamp,
        _users:[user._id]
      };
      const account = new AccountModel(params)
      return account.save()
    })
    .then((result) => {
      return {
        statusCode: 201,
        error: null,
        result: result
      }
    })
    .catch((err) => {
      return {
        statusCode: 500,
        error: err.message,
        result: null
      }
    })
    .finally((object) => {
      const response = {
        statusCode: object.statusCode,
        body: JSON.stringify({
          error: object.error,
          result: object.result
        }),
      };
      callback(null, response);
    })
}

module.exports.list = (event, context, callback) => {
  return passport.checkAuth(event.headers.Authorization)
    .then((user) => {
      return AccountModel.getAll()
    })
    .then((result) => {
      return {
        statusCode: 200,
        error: null,
        result: result
      }
    })
    .catch((err) => {
      return {
        statusCode: 500,
        error: err.message,
        result: null
      }
    })
    .finally((object) => {
      const response = {
        statusCode: object.statusCode,
        body: JSON.stringify({
          error: object.error,
          result: object.result
        }),
      };
      callback(null, response);
    })
};

module.exports.get = (event, context, callback) => {
  return passport.checkAuth(event.headers.Authorization)
    .then((user) => {
      return AccountModel.getById(event.pathParameters.id)
        .then((account) => {
          if (_.indexOf(account._users, user._id) === -1) {
            throw Error('User has no permission')
          }
          return account
        })
        .catch((err) => {
          throw err
        })
    })
    .then((result) => {
      return {
        statusCode: 200,
        error: null,
        result: result
      }
    })
    .catch((err) => {
      return {
        statusCode: 500,
        error: err.message,
        result: null
      }
    })
    .finally((object) => {
      const response = {
        statusCode: object.statusCode,
        body: JSON.stringify({
          error: object.error,
          result: object.result
        }),
      };
      callback(null, response);
    })
};

module.exports.update = (event, context, callback) => {
  return passport.checkAuth(event.headers.Authorization)
    .then((user) => {
      return AccountModel.getById(event.pathParameters.id)
        .then((account) => {
          if (_.indexOf(account._users, user._id) === -1) {
            throw Error('User has no permission')
          }
          return account
        })
        .catch((err) => {
          throw err
        })
    })
    .then((account) => {
      const data = JSON.parse(event.body);
      return AccountModel.update(account._id, data)
    })
    .then((result) => {
      return {
        statusCode: 200,
        error: null,
        result: result
      }
    })
    .catch((err) => {
      return {
        statusCode: 500,
        error: err.message,
        result: null
      }
    })
    .finally((object) => {
      const response = {
        statusCode: object.statusCode,
        body: JSON.stringify({
          error: object.error,
          result: object.result
        }),
      };
      callback(null, response);
    })
};


module.exports.delete = (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Go Serverless v1.0! Your function executed successfully!',
      input: event,
    }),
  };

  callback(null, response);

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};