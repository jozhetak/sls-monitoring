'use strict';

const AWS = require('aws-sdk');
const Promise = require('bluebird');

AWS.config.setPromisesDependency(Promise);

module.exports.run = (event, context) => {
    console.log(process.env.SLS_RUN_ARN)
    // read data from accounts
    var sns = new AWS.SNS();

    const accounts =[];

    // foreach send sns topic
    accounts.push({
        acoountId: '157000000',
        accessKeyId: 'AKIAJFWWM4LHJ73A2YUQ',
        secretAccessKey: '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'
    });

    // foreach send sns topic
    accounts.push({
        acoountId: '157000001',
        accessKeyId: 'AKIAJFWWM4LHJ73A2YUQ',
        secretAccessKey: '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'
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
