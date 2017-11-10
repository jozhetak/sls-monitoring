'use strict';

const Promise = require('bluebird');
const AWS = require('aws-sdk');

//const sharp = require ('sharp');
AWS.config.setPromisesDependency(require('bluebird'));

module.exports.run = (event, context) => {
    console.log("Access Key:", AWS.config.credentials.accessKeyId, process.env.accessKeyId)

    AWS.config.update({accessKeyId: 'AKIAIO43W2FP3V74OLXQ', secretAccessKey: '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'});
    console.log("Access Key 2:", AWS.config.credentials.accessKeyId)

    const cred = new AWS.Credentials();

    AWS.config.credentials = cred;
    console.log("Access Key 3:", AWS.config.credentials.accessKeyId)
    context.succeed();

};