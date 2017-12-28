'use strict'
const FunctionModel = require('../../shared/model/function')
const InvocationModel = require('../../shared/model/function')
const _ = require('lodash')
const passport = require('./../passport/passport')
const responses = require('../../shared/helper/responses')
const faker = require('faker')

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
      let eventCounter = faker.random.number({min: 33769902588851484788521757190824674485845186067860094976, max: 53769902588851484788521757190824674485845186067860094976})
      let promises = []
      for (let func of value) {
        let invocationsCount = faker.random.number({min: invocationsMin, max: invocationsMax})
        for (let i = 0; i < invocationsCount; i++) {
          let duration = faker.random.number({min: 0, max: func.timeout * 1000})
          let invocation = {
            '_account': func._account,
            '_function': func._id,
            '_id': faker.random.uuid(),
            'accountId': func.accountId,
            'billedDuration': Math.round(duration / 100) * 100,
            'duration': duration,
            'functionId': func._id,
            'logs': [
              {
                'eventId': eventCounter,
                'ingestionTime': 1514294804409,
                'logStreamName': '2017/12/26/[$LATEST]bb229c89263b4b9e8f4b7875db4ebb70',
                'message': 'START RequestId: 6a869218-ea40-11e7-8417-bbb6fde68b2a Version: $LATEST\n',
                'timestamp': 1514294804421
              },
              {
                'eventId': eventCounter += faker.random.number({min: 1, max: 1000}).toString(),
                'ingestionTime': 1514294804477,
                'logStreamName': '2017/12/26/[$LATEST]bb229c89263b4b9e8f4b7875db4ebb70',
                'message': 'END RequestId: 6a869218-ea40-11e7-8417-bbb6fde68b2a\n',
                'timestamp': 1514294804489
              },
              {
                'eventId': eventCounter += faker.random.number({min: 1, max: 1000}).toString(),
                'ingestionTime': 1514294804477,
                'logStreamName': '2017/12/26/[$LATEST]bb229c89263b4b9e8f4b7875db4ebb70',
                'message': 'REPORT RequestId: 6a869218-ea40-11e7-8417-bbb6fde68b2a\tDuration: 65.21 ms\tBilled Duration: 100 ms \tMemory Size: 1024 MB\tMax Memory Used: 98 MB\t\n',
                'timestamp': 1514294804489
              }
            ],
            'logStreamName': '2017/12/26/[$LATEST]bb229c89263b4b9e8f4b7875db4ebb70',
            'memory': func.memSize,
            'memoryUsed': faker.random.number({min: 10, max: func.memSize})

          }
          let invocationModel = new InvocationModel(invocation)
          promises.push(invocationModel.save())
        }
      }
      return Promise.all(promises)
    })
    .then(value => {
      console.log(value)
      return value
    })
    .then(responses.ok)
    .catch(responses.error)
    .then(response => callback(null, response))
}
