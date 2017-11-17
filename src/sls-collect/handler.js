'use strict';

const AWSCollector = require('./AWSCollector');

module.exports.run = (event, context) => {

    const message = event.Records[0].Sns.Message;
    console.log('From SNS:', message);

    const collector = new AWSCollector('12345', {
        accessKeyId: '',
        secretAccessKey: ''
    });

    return collector
        .collectAndSave()
        .then(() => {
            context.succeed()
        })
        .catch(err => {
            context.fail(err);
        });

};
