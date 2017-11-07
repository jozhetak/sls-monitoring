'use strict';

const Promise = require('bluebird');

module.exports.hello = (event, context, callback) => {
  //throw new Error('some error');
  console.log('test callback error');
  callback('sb error');

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};
