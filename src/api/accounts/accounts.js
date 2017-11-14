'use strict';
const AccountModel = require('../../shared/model/account');
const uuid = require('uuid');
const _ = require('lodash');
const passport = require('./../passport/passport')
const waterfall = require('async/waterfall')

module.exports.create = (event, context, callback) => {
  waterfall([
    (cb) => passport.handler(event, context, cb),
    (policyDocument, cb) => {
      cb(null, JSON.parse(policyDocument.context.user))
    },
    (user, cb) => {
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
        .then((account) => {
          cb(null, account);
        })
        .catch((e) => {
          cb(e)
        })
    }
  ], (err, result) => {
    const response = {
      statusCode: 200,
      body: JSON.stringify({
        event: event,
        error: err,
        result: result
      }),
    };
    callback(null, response);
  })
}

module.exports.list = (event, context, callback) => {
  waterfall([
    (cb) => passport.handler(event, context, cb),
    (policyDocument, cb) => {
      cb(null, JSON.parse(policyDocument.context.user))
    },
    (user, cb) => {
      return AccountModel.getAll(

      )
        .then((account) => {
          if (_.indexOf(account._users, user._id) === -1) {
            cb('User has no permission')
          }
          console.log(_.indexOf(account._users, user._id))
          cb(null, account);
        })
        .catch((e) => {
          cb(e)
        })
    }
  ], (err, result) => {
    const response = {
      statusCode: 200,
      body: JSON.stringify({
        event: event,
        error: err,
        result: result
      }),
    };
    callback(null, response);
  })
};

module.exports.get = (event, context, callback) => {
    waterfall([
      (cb) => passport.handler(event, context, cb),
      (policyDocument, cb) => {
        cb(null, JSON.parse(policyDocument.context.user))
      },
      (user, cb) => {
        AccountModel.getById(event.pathParameters.id)
          .then((account) => {
            if (_.indexOf(account._users, user._id) === -1) {
              cb('User has no permission')
            }
            cb(null, account)
          })
          .catch((e) => {
            cb(e)
          })
      }
    ], (err, result) => {
      const response = {
        statusCode: 200,
        body: JSON.stringify({
          error: err,
          result: result
        }),
      };
      callback(null, response);
    })




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