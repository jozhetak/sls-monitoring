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

const test = {
  "resource": "/users/{id}",
    "path": "/users/000",
    "httpMethod": "PUT",
    "headers": {
    "Accept": "*/*",
      "Accept-Encoding": "gzip, deflate, br",
      "Accept-Language": "en-US,en;q=0.9",
      "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6ImY4NjNkMTQwLWM1NTYtMTFlNy1hYjYxLWYzZDc3YTI0ZDU4ZSJ9LCJpYXQiOjE1MTAyMzYzMzQsImV4cCI6MTU0MTc3MjMzNH0.NBkz_DFsyRh_S6iu5B3HPn2IOToVY0YinW6YNQos8vw",
      "cache-control": "no-cache",
      "CloudFront-Forwarded-Proto": "https",
      "CloudFront-Is-Desktop-Viewer": "true",
      "CloudFront-Is-Mobile-Viewer": "false",
      "CloudFront-Is-SmartTV-Viewer": "false",
      "CloudFront-Is-Tablet-Viewer": "false",
      "CloudFront-Viewer-Country": "UA",
      "content-type": "application/json",
      "Host": "bpg7b229qc.execute-api.eu-central-1.amazonaws.com",
      "origin": "chrome-extension://fhbjgbiflinjbdggehcddcbncdddomop",
      "postman-token": "546abef7-210a-2efe-fa41-4da1b8830b2e",
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.89 Safari/537.36",
      "Via": "2.0 a71f83d1ba0346520093d0d32e0ea7dc.cloudfront.net (CloudFront)",
      "X-Amz-Cf-Id": "795PvJjxOUBtFEC4d5SyOs18svCkChuITcwqMUUbZCG0jY404wmhKw==",
      "X-Amzn-Trace-Id": "Root=1-5a0460cb-1cd1a2ed127213952a8f7969",
      "X-Forwarded-For": "185.46.223.241, 54.239.171.19",
      "X-Forwarded-Port": "443",
      "X-Forwarded-Proto": "https"
  },
  "queryStringParameters": null,
    "pathParameters": {
    "id": "000"
  },
  "stageVariables": null,
    "requestContext": {
    "path": "/dev/users/000",
      "accountId": "353837645447",
      "resourceId": "uljytt",
      "stage": "dev",
      "authorizer": {
      "principalId": "f863d140-c556-11e7-ab61-f3d77a24d58e",
        "user": "{\"_id\":\"f863d140-c556-11e7-ab61-f3d77a24d58e\"}"
    },
    "requestId": "1f21e125-c557-11e7-96b3-253a98f56064",
      "identity": {
      "cognitoIdentityPoolId": null,
        "accountId": null,
        "cognitoIdentityId": null,
        "caller": null,
        "apiKey": "",
        "sourceIp": "185.46.223.241",
        "accessKey": null,
        "cognitoAuthenticationType": null,
        "cognitoAuthenticationProvider": null,
        "userArn": null,
        "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.89 Safari/537.36",
        "user": null
    },
    "resourcePath": "/users/{id}",
      "httpMethod": "PUT",
      "apiId": "bpg7b229qc"
  },
  "body": "{}",
    "isBase64Encoded": false
}

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