'use strict';
const AccountModel = require('../../shared/model/user');
const uuid = require('uuid');
const _ = require('lodash');

module.exports.create = (event, context, callback) => {
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);
  const params = {
      _id: uuid.v1(),
      name: data.name,
      key: data.key,
      secret: data.secret,
      region: data.region,
      createdAt: timestamp,
      updatedAt: timestamp
  };
  const account = new AccountModel(params)
  return account.save()
    .then((account) => {
      const response = {
        statusCode: 200,
        body: JSON.stringify(accout)
      };
      callback(null, response);
    })
    .catch((e) => {
        callback(null, {
          statusCode: error.statusCode || 501,
          headers: { 'Content-Type': 'text/plain' },
          body: 'Couldn\'t create accout.',
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
  const user = JSON.parse(event.requestContext.authorizer.user);
  const data = JSON.parse(event.body);

  if (user._id !== event.pathParameters.id){
    return callback(null, {
      statusCode: 403,
      body: JSON.stringify({
        message: 'Cannot edit other user',
        user: user,
        input: event
      })
    });
  }

  return UserModel.update(user._id, data).then((user) => {
    const response = {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Go Serverless v1.0! Your function executed successfully!',
        user: user,
        input: event
      }),
    };

    callback(null, response);
  }).catch((e) => {
    const response = {
      statusCode: 500,
      body: JSON.stringify({
        message: e.message,
        params: data,
        input: event
      }),
    };

    callback(null, response);
  })

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
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