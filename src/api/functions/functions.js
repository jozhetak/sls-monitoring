'use strict'
const FunctionModel = require('../../shared/model/function')
const InvocationModel = require('../../shared/model/function')
const _ = require('lodash')
const passport = require('./../passport/passport')
const responses = require('../../shared/helper/responses')
const faker = require('faker')
const BigInteger = require('big-integer')

module.exports.list = (event, context, callback) => {
  return passport.checkAuth(event.headers.Authorization)
    .then((user) => {
      return FunctionModel.getAll({
        IndexName: 'AccountIdIndex',
        KeyConditionExpression: '#account = :account',
        ExpressionAttributeNames: {
          '#account': '_account'
        },
        ExpressionAttributeValues: {
          ':account': event.pathParameters.id
        }
      })
    })
    // .then((accounts) => accounts.map(dtoAccount.public))
    .then(responses.ok)
    .catch(responses.error)
    .then(response => callback(null, response))
}

module.exports.get = (event, context, callback) => {
  return passport.checkAuth(event.headers.Authorization)
    .then((user) => {
      return FunctionModel.getById(event.pathParameters.functionId)
    })
    .then(responses.ok)
    .catch(responses.error)
    .then(response => callback(null, response))
}

module.exports.populate = (event, context, callback) => {
  let functionsCount = event.queryStringParameters ? event.queryStringParameters.functions_count : 5
  let invocationsMin = event.queryStringParameters ? event.queryStringParameters.invocations_min : 5
  let invocationsMax = event.queryStringParameters ? event.queryStringParameters.invocations_max : 10
  let daysInThePast = event.queryStringParameters ? event.queryStringParameters.days : 365
  const max = new Date()
  const min = new Date()
  min.setFullYear(max.getFullYear() - 1)
  console.log(functionsCount)
  console.log(invocationsMin)
  console.log(invocationsMax)
  Promise.resolve()
    .then(() => {
      const regions = [
        'us-east-2',
        'us-east-1',
        'us-west-1',
        'us-west-2',
        'ap-south-1',
        'ap-northeast-2',
        'ap-southeast-1',
        'ap-southeast-2',
        'ap-northeast-1',
        'ca-central-1',
        'cn-north-1',
        'eu-central-1',
        'eu-west-1',
        'eu-west-2',
        'eu-west-3',
        'sa-east-1' ]

      let promises = []
      for (let i = 0; i < functionsCount; i++) {
        let func = {}
        let accountId = faker.random.uuid()
        let name = faker.hacker.verb()
        func._id = faker.random.uuid()
        func._account = accountId
        func.accountId = accountId
        func.arn = `arn:aws:lambda:${faker.helpers.randomize(regions)}:${faker.random.number({min: 100000000000, max: 999999999999})}:function:${name}`
        func.codeSize = faker.random.number(({min: 100, max: 999999999}))
        func.memSize = Math.round(faker.random.number(({min: 128, max: 3008})) / 64) * 64
        func.name = name
        func.timeout = faker.random.number({min: 0, max: 300})
        let funcModel = new FunctionModel(func)
        promises.push(funcModel.save())
      }
      return Promise.all(promises)
    })
    .then(value => {
      let eventCounter = new BigInteger('33773592922032033623252972461104249685054501853208182784').plus(faker.random.number({min: 1000, max: 5000}))
      let promises = []
      for (let func of value) {
        let invocationsCount = faker.random.number({min: invocationsMin, max: invocationsMax})
        for (let i = 0; i < invocationsCount; i++) {
          let duration = faker.finance.amount(0, func.timeout * 100)
          let randomDate = faker.date.between(min, max)
          let randomDateMillis = randomDate.getTime()
          let _id = faker.random.uuid()
          let logStreamName = `${randomDate.getFullYear()}/${randomDate.getMonth() + 1}/${randomDate.getDate()}[$LATEST]${faker.random.uuid()}`
          let billedDuration = Math.round(duration / 100) * 100
          let memoryUsed = faker.random.number({min: 10, max: func.memSize})
          let invocation = {
            '_account': func._account,
            '_function': func._id,
            '_id': _id,
            'accountId': func.accountId,
            'billedDuration': billedDuration,
            'duration': duration,
            'functionId': func._id,
            'logs': [
              {
                'eventId': (eventCounter = eventCounter.plus(faker.random.number({min: 1, max: 1000}))).toString(),
                'ingestionTime': randomDateMillis,
                'logStreamName': logStreamName,
                'message': `START RequestId: ${_id}  Version: $LATEST\n`,
                'timestamp': randomDateMillis - faker.random.number({min: 5, max: 15})
              },
              {
                'eventId': (eventCounter = eventCounter.plus(faker.random.number({min: 1, max: 1000}))).toString(),
                'ingestionTime': randomDateMillis += faker.random.number({min: 0, max: duration / 3}),
                'logStreamName': logStreamName,
                'message': `END RequestId: ${_id}\n`,
                'timestamp': randomDateMillis += faker.random.number({min: 0, max: duration / 3})
              },
              {
                'eventId': (eventCounter = eventCounter.plus(faker.random.number({min: 1, max: 1000}))).toString(),
                'ingestionTime': randomDateMillis += faker.random.number({min: 0, max: duration / 3}),
                'logStreamName': logStreamName,
                'message': `REPORT RequestId: ${_id}\tDuration: ${duration} ms\tBilled Duration: ${billedDuration} ms \tMemory Size: ${func.memSize} MB\tMax Memory Used: ${memoryUsed} MB\t\n`,
                'timestamp': randomDateMillis += faker.random.number({min: 0, max: duration / 3})
              }
            ],
            'logStreamName': logStreamName,
            'memory': func.memSize,
            'memoryUsed': memoryUsed

          }
          let invocationModel = new InvocationModel(invocation)
          promises.push(invocationModel.save())
        }
      }
      return Promise.all(promises)
    })
    .then(value => {
 //     console.log(value)
      return undefined
    })
    .then(responses.ok)
    .catch(responses.error)
    .then(response => callback(null, response))
}

module.exports.clear = (event, context, callback) => {
  InvocationModel.getAllScan({})
    .then(({Items}) => {
      console.log(Items)
      return Promise.all(Items.map(item => InvocationModel.delete({Key: item._id})))
    })
    .then(responses.ok)
    .catch(responses.error)
    .then(response => callback(null, response))
}
