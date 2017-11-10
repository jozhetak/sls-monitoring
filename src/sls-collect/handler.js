'use strict';

const AWSCollector = require('./AWSCollector');

module.exports.run = (event, context) => {

    const collector = new AWSCollector('12345', {
        accessKeyId: 'AKIAI6XEDKZIA7BDZ6XQ',
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
