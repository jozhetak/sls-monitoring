'use strict';
const AWS = require('aws-sdk');
const Promise = require('bluebird');
const Collector = require('./Collector');
const _ = require('lodash');

const LOG_STREAM_LIMIT = 50;
const LOG_EVENT_TIMEOUT = 15 * 60 * 1000;

AWS.config.setPromisesDependency(Promise);

module.exports = class AWSCollector extends Collector {
    constructor(accountId, opts) {
        super(accountId);
        this.accessKeyId = opts.accessKeyId;
        this.secretAccessKey = opts.secretAccessKey;
    }

    collectAndSave() {
        return collect()
            .then((functions) => {
                return that.save(functions)
            })
    }

    collect() {
        AWS.config.update({
            accessKeyId: this.accessKeyId,
            secretAccessKey: this.secretAccessKey
        });

        const that = this;

        // collect code
        const lambda = new AWS.Lambda();
        return lambda.listFunctions({}).promise()
            .then((data) => {

                console.log('data', data);
                return Promise.map(data.Functions, func => {
                    return that._getInvocations(func)
                        .then((invocations) => {
                            func.invocations = invocations;
                            return func;
                        })
                });
            })
            // .then((functions) => {
            //     console.log('functions', functions);
            //     return that.save(functions)
            // })
    }

    _getInvocations(func) {
        const cloudwatchlogs = new AWS.CloudWatchLogs();
        const logGroupName = '/aws/lambda/' + func.FunctionName;

        const params = {
            logGroupName: logGroupName,
            descending: true,
            limit: LOG_STREAM_LIMIT,
            orderBy: 'LastEventTime'
        };

        const that = this;

        return cloudwatchlogs.describeLogStreams(params)
            .promise()
            .then((data) => {
                const streamNames = [];
                data.logStreams.forEach((logStream) => {
                    streamNames.push(logStream.logStreamName)
                });

                if(streamNames.length === 0) {
                    return
                }

                var params = {
                    logGroupName: logGroupName,
                    startTime: new Date().getTime() - LOG_EVENT_TIMEOUT,
                    endTime: new Date().getTime(),
                    interleaved: false,
                    logStreamNames: streamNames
                };
                return cloudwatchlogs.filterLogEvents(params).promise()
            })
            .then((data) => {
                if(!data) {
                    return [];
                }

                var invocations = that._convertEventsToInvocations(data.events)
                return invocations;
            })
    }

    _convertEventsToInvocations(events) {
        const START_REQUEST_PATTERN = /(START RequestId:\s)(.*)(\s+Version:.*)/;
        const END_REQUEST_PATTERN = /(END RequestId:\s)(.*)/;
        const REPORT_PATTERN = /(REPORT RequestId:\s)(.*)(\s+Duration:.*)/;
        const DURATION_PATTERN = /(.*Duration:\s)(.*)(\s+ms\s+Billed Duration:.*)/;
        const BILLED_DURATION_PATTERN = /(.*Billed Duration:\s)(.*)(\s+ms\s+Memory\s+Size:.*)/;
        const MEMORY_SIZE_PATTERN = /(.*Memory\s+Size:\s)(.*)(\s+MB.*Max\s+Memory\s+Used:.*)/;
        const MAX_MEMORY_USED_PATTERN = /(.*Max\s+Memory\s+Used:\s)(.*)(\s+MB*)/;
        const ERROR_PATTERN = /(\{.*"errorMessage":)(.*)(\})/;
        const CONFIG_ERROR_PATTERN_1 = /(.*at\s)(.*)(\/var\/task\/*)/;
        const CONFIG_ERROR_PATTERN_2 = /^module initialization error/i;
        const CONFIG_ERROR_PATTERN_3 = /^Unhandled rejection/i;

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
                        //accountId: accountId,
                        //functionId: funcInstance.id,
                        logs: [event]
                    }
                } catch(err) {
                    console.log('error parsing log event, START REQUEST PATTERN: ', err, event.message);
                }
            }
            else if(CRASH_PATTERN.test(event.message)) {
                const requestId = event.message.match(CRASH_PATTERN)[2];

                var match = _.find(invocations, function(invocation) { return invocation.id === requestId })
                if (match) {
                    match.error = 1;
                    match.errorType = 'crash';
                    match.logs.push(event)
                }
            }
            else if(ERROR_PATTERN.test(event.message)) {
                currentInvocation.error = 1;
                currentInvocation.errorType = 'error';
                if(currentInvocation.logs) {
                    currentInvocation.logs.push(event);
                }
            }
            else if(CONFIG_ERROR_PATTERN_1.test(event.message) ||
                    CONFIG_ERROR_PATTERN_2.test(event.message) ||
                    CONFIG_ERROR_PATTERN_3.test(event.message)) {
                currentInvocation.error = 1 ;
                currentInvocation.errorType = 'config';
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
                    throw err;
                }

            }
            else {
                if(currentInvocation.logs) {
                    currentInvocation.logs.push(event);
                }
            }
        });

        return invocations;
    };
};