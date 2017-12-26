'use strict'

const AWSCollector = require('./AWSCollector')

module.exports.run = (event, context) => {
  const message = JSON.parse(event.Records[0].Sns.Message)
  console.log('From SNS:', message)
  const _account = message._id
  const key = message.key
  const secret = message.secret
  const region = message.region
  const collector = new AWSCollector(_account, {
    accessKeyId: key,
    secretAccessKey: secret
  })
  return collector
    .collectAndSave()
    .then(() => {
      context.succeed()
    })
    .catch(err => {
      context.fail(err)
    })

}
