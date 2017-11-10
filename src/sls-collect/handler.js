'use strict';

const AWSCollector = require('./AWSCollector');

module.exports.run = (event, context) => {

    const collector = new AWSCollector('12345', {
        accessKeyId: 'AKIAIGGFXPP7OWBKKPNA',
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
