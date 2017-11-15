'use strict';

const AWS = require('aws-sdk');
const Promise = require('bluebird');

AWS.config.setPromisesDependency(Promise);

module.exports.run = (event, context) => {
    // read data from accounts
    var sns = new AWS.SNS();

    const accounts =[];

    // foreach send sns topic
    accounts.push({
        acoountId: '157000000',
        accessKeyId: '',
        secretAccessKey: ''
    });

    // foreach send sns topic
    accounts.push({
        acoountId: '157000001',
        accessKeyId: '',
        secretAccessKey: ''
    });


    return Promise.map(accounts, account => {

        account = JSON.stringify(account);

        console.log(account)
        return sns.publish({
            Message: account,
            TargetArn: process.env.SLS_RUN_ARN
        }).promise()
    }).then(() => {
        context.succeed();

    }).catch(err => {
        context.fail(err)
    });
};
