'use strict';

module.exports = {
    AWSSDK: AWSSDK
};

function AWSSDK(testData) {
    const AWSStub =  {
        config: {
            update() {
                console.log('AWSStub.config.update MOCK!!!!')
            },
            setPromisesDependency() {}
        }
    };

    AWSStub.Lambda = class {
        listFunctions() {
            return {
                promise() {
                    return Promise.resolve({
                        Functions: testData.ListLambda.Functions
                    })
                }
            }
        }
    };

    AWSStub.CloudWatchLogs = class {
        describeLogStreams() {
            return {
                promise() {
                    return Promise.resolve({
                        logStreams: testData.describeLogStreams.logStreams
                    })
                }
            }
        }

        filterLogEvents(params) {
            return {
                promise() {
                    return Promise.resolve({
                        events: testData.filterLogEvents[params.logGroupName].events
                    })
                }
            }
        }
    };

    return AWSStub;

}