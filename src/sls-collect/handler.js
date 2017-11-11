'use strict';

const AWSCollector = require('./AWSCollector');

module.exports.run = (event, context) => {

    var message = event.Records[0].Sns.Message;
    console.log('From SNS:', message);

    const collector = new AWSCollector('12345', {
        accessKeyId: 'AKIAJFWWM4LHJ73A2YUQ',
        secretAccessKey: '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'
    });

    return collector
        .collect()
        .then(() => {
            context.succeed()
        })
        .catch(err => {
            context.fail(err);
        });

};
