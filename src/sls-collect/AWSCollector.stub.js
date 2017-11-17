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
                        Functions: testData.functions
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
                        logStreams: testData.logStreams
                    })
                }
            }
        }

        filterLogEvents() {
            return {
                promise() {
                    return Promise.resolve({
                        events: testData.events
                    })
                }
            }
        }
    };

    return AWSStub;

}