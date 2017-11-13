'use strict';

const AWSCollector = require('./AWSCollector');

module.exports.run = (event, context) => {

    const ßmessage = event.Records[0].Sns.Message;
    console.log('From SNS:', message);

    const collector = new AWSCollector('12345', {
        accessKeyId: '',
        secretAccessKey: '/3VEXhCmkknuGi3Kqc4vx5oJq2d9'
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
