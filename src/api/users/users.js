'use strict';
const UserModel = require('../../shared/model/user');
const uuid = require('uuid');
const _ = require('lodash');

module.exports.create = (event, context, callback) => {
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);
  const params = {
      _id: uuid.v1(),
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      createdAt: timestamp,
      updatedAt: timestamp
  };
  const user = new UserModel(params)
  return user.save()
    .then((user) => {
      const response = {
        statusCode: 200,
        body: JSON.stringify(user)
      };
      callback(null, response);
    })
    .catch((e) => {
        callback(null, {
          statusCode: error.statusCode || 501,
          headers: { 'Content-Type': 'text/plain' },
          body: 'Couldn\'t create user.',
        });
      });
}

module.exports.list = (event, context, callback) => {
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

module.exports.get = (event, context, callback) => {
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

module.exports.update = (event, context, callback) => {
  return passport.checkAuth(event.headers.Authorization)
    .then((user) => {
      if (user._id !== event.pathParameters.id){
        throw Error('User has no permission')
      }
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
      return UserModel.update(account._id, data)
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