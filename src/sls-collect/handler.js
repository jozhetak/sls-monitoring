'use strict'

const AWSCollector = require('./AWSCollector')

module.exports.run = (event, context, cb) => {
  return new Promise((resolve, reject) => {
    resolve(module.exports.getParamsFromEvent(event))
  })
    .then((eventParams) => {
      return new AWSCollector(eventParams._account, {
        accessKeyId: eventParams.key,
        secretAccessKey: eventParams.secret
      })
    })
    .then((collector) => collector.collectAndSave())
    .then(() => {
      context.succeed('Done')
      if (cb) cb()
    })
    .catch(err => {
      context.fail(err.message)
      if (cb) cb(err)
    })
}

module.exports.getParamsFromEvent = (event, cb) => {
  try {
    const message = JSON.parse(event.Records[0].Sns.Message)
    console.log('From SNS:', message)
    const _account = message._id
    const key = message.key
    const secret = message.secret
    const region = message.region
    if (cb) cb()
    return {
      _account: _account,
      key: key,
      secret: secret,
      region: region
    }
  } catch (err) {
    if (cb) cb(err)
    throw Error('Wrong Event Params')
  }
}
