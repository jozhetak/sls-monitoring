'use strict';

const AWS = require('aws-sdk');
const uuid = require('uuid');
const Promise = require('bluebird');
const _ = require('lodash')

const FunctionModel = require('./../model/function')
const InvocationModel = require('./../model/invocation')

const LOG_STREAM_LIMIT = 50

AWS.config.setPromisesDependency(require('bluebird'));

module.exports.hello = (event, context) => {

    // console.log('{ "errorMessage": "same errror" }')

    AWS.config.update({accessKeyId: 'AKIAI5HP2HRG4CQINOMA', secretAccessKey: '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'});

    const lambda = new AWS.Lambda();
    return lambda.listFunctions({}).promise()
        .then((data) => {
            return saveOrUpdateFunctions('123', data.Functions);
        })
        .then(() => {
            context.succeed();
        })
        .catch((err) => {
            console.log(err);
            context.done();
       });
};

const saveOrUpdateFunctions = (accountId, functions) => {
    return Promise.each(functions, func => {

        return FunctionModel
            .getOne('arn = :arn', {':arn': func.FunctionArn})
            .then(funcDao => {
                if(funcDao) {
                    funcDao.name = func.FunctionName;
                    funcDao.codeSize = func.CodeSize;
                    funcDao.timeout = func.Timeout;
                    funcDao.memSize = func.MemorySize;
                } else {
                    funcDao = {
                        accountId: accountId,
                        name: func.FunctionName,
                        arn: func.FunctionArn,
                        codeSize: func.CodeSize,
                        timeout: func.Timeout,
                        memSize: func.MemorySize
                    }
                }
                const funcInstance = new FunctionModel(funcDao)
                return funcInstance.save()
            })
            .then((funcInstance) => {
                // update invocations
                console.log('funcInstance', funcInstance);
                return updateInvocations(accountId, funcInstance);
            })
    });
};

const updateInvocations = (accountId, funcInstance) => {
    const cloudwatchlogs = new AWS.CloudWatchLogs();

    const logGroupName = '/aws/lambda/' + funcInstance.name;

    var params = {
        logGroupName: logGroupName, /* required */
        descending: true,
        limit: LOG_STREAM_LIMIT,
        orderBy: 'LastEventTime'
    };

    return cloudwatchlogs.describeLogStreams(params)
        .promise()
        .then((data) => {
            const streamNames = [];
             data.logStreams.forEach((logStream) => {
                 streamNames.push(logStream.logStreamName)
             })

            var params = {
                logGroupName: logGroupName, /* required */
                startTime: new Date().getTime() - 15*60*1000,
                endTime: new Date().getTime(),
                //filterPattern: 'STRING_VALUE',
                interleaved: false,
                logStreamNames: streamNames,
                //nextToken: 'STRING_VALUE',
                //startTime: 0
            };
            return cloudwatchlogs.filterLogEvents(params).promise()
            //context.succeed();
        })
        .then((data) => {
            var invocations = convertEventsToInvocations(data.events, accountId, funcInstance)

            return Promise.each(invocations, invocation => {
                return InvocationModel
                    .getById(invocation.id)
                    .then(invocationDao => {
                        if(!invocationDao) {
                            const invocationInstance = new InvocationModel(invocation)
                            return invocationInstance.save()        
                        }
                    });
            })
        })
        .catch((err) => {
            console.log('EEE', err);
        })
};

const convertEventsToInvocations = (events, accountId, funcInstance) => {
    const START_REQUEST_PATTERN = /(START RequestId:\s)(.*)(\s+Version:.*)/;
    const END_REQUEST_PATTERN = /(END RequestId:\s)(.*)/;
    const REPORT_PATTERN = /(REPORT RequestId:\s)(.*)(\s+Duration:.*)/;
    const DURATION_PATTERN = /(.*Duration:\s)(.*)(\s+ms\s+Billed Duration:.*)/;
    const BILLED_DURATION_PATTERN = /(.*Billed Duration:\s)(.*)(\s+ms\s+Memory\s+Size:.*)/;
    const MEMORY_SIZE_PATTERN = /(.*Memory\s+Size:\s)(.*)(\s+MB.*Max\s+Memory\s+Used:.*)/;
    const MAX_MEMORY_USED_PATTERN = /(.*Max\s+Memory\s+Used:\s)(.*)(\s+MB*)/;
    const ERROR_PATTERN = /(\{.*"errorMessage":)(.*)(\})/;
    const CRASH_PATTERN = /(RequestId:\s)(.*)(\s+Process exited before completing request)/;

    const invocations = [];
    let currentInvocation = {};
    events.forEach((event) => {

        if(START_REQUEST_PATTERN.test(event.message)) {
            try {
                const requestId = event.message.match(START_REQUEST_PATTERN)[2];
                currentInvocation  = {
                    logStreamName: event.logStreamName,
                    id: requestId,
                    accountId: accountId,
                    functionId: funcInstance.id,
                    logs: [
                        {
                            eventId: event.eventId,
                            timestamp: event.timestamp,
                            ingestionTime: event.ingestionTime,
                            message: event.message
                        }
                    ]
                }
            } catch(err) {
                console.log('error parsing log event, START REQUEST PATTERN: ', err, event.message);
            }
        }
        else if(CRASH_PATTERN.test(event.message)) {
            const requestId = event.message.match(CRASH_PATTERN)[2];

            var match = _.find(invocations, function(invocation) { return invocation.id === requestId })
            if (match) {
                match.error = true;
                match.errorType = 'crash';
                match.logs.push(event)
            }
        }
        else if(ERROR_PATTERN.test(event.message)) {
            currentInvocation.error = true;
            currentInvocation.errorType = 'error';
            if(currentInvocation.logs) {
                currentInvocation.logs.push(event);
            }
        }
        else if (REPORT_PATTERN.test(event.message)) {
            try {
                const req = event.message.match(REPORT_PATTERN)[2];
                currentInvocation.duration = event.message.match(DURATION_PATTERN)[2];
                currentInvocation.billedDuration = event.message.match(BILLED_DURATION_PATTERN)[2];
                currentInvocation.memory = event.message.match(MEMORY_SIZE_PATTERN)[2];
                currentInvocation.memoryUsed = event.message.match(MAX_MEMORY_USED_PATTERN)[2];

                if(currentInvocation.logs) {
                    currentInvocation.logs.push(event);
                }

                invocations.push(currentInvocation);
                currentInvocation = {};
            } catch(err) {
                console.log('error parsing log event, REPORT PATTERN: ', err, event.message);
            }

        }
        else {
            if(currentInvocation.logs) {
                currentInvocation.logs.push(event);
            }
        }
    })

    return invocations;
}
