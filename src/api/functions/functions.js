'use strict'
const AccountModel = require('../../shared/model/account')
const UserModel = require('../../shared/model/user')
const UserAccountModel = require('../../shared/model/userAccount')
const passport = require('./../passport/passport')
const errors = require('../../shared/helper/errors')
const FunctionModel = require('../../shared/model/function')
const InvocationModel = require('../../shared/model/invocation')
const _ = require('lodash')
const responses = require('../../shared/helper/responses')
const faker = require('faker')
const BigInteger = require('big-integer')

module.exports.list = (event, context, callback) => {
  const token = event.headers.Authorization
  const accountId = event.pathParameters.id

  return Promise.all([
    passport.checkAuth(token).then(decoded => UserModel.isActiveOrThrow(decoded)),
    AccountModel.getActiveByIdrOrThrow(accountId),
    UserAccountModel.getUsersByAccount(accountId)]
  )
    .then(([id, account, accountUsers]) => {
      let accountUsersIds = accountUsers.map(user => user._user)
      if (!(accountUsersIds.includes(id))) {
        throw errors.forbidden()
      }

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
  const token = event.headers.Authorization
  const accountId = event.pathParameters.id
  const functionId = event.pathParameters.functionId

  return Promise.all([
    passport.checkAuth(token).then(decoded => UserModel.isActiveOrThrow(decoded)),
    AccountModel.getActiveByIdrOrThrow(accountId),
    UserAccountModel.getUsersByAccount(accountId)]
  )
    .then(([id, account, accountUsers]) => {
      let accountUsersIds = accountUsers.map(user => user._user)
      if (!(accountUsersIds.includes(id))) {
        throw errors.forbidden()
      }
      return FunctionModel.getById(functionId)
    })
    .then(func => {
      if (func._account !== accountId) throw errors.forbidden()
      return func
    })
    .then(responses.ok)
    .catch(responses.error)
    .then(response => callback(null, response))
}

module.exports.populate = (event, context, callback) => {
  let functionsCount = event.queryStringParameters.functions_count ? event.queryStringParameters.functions_count : 5
  let invocationsMin = event.queryStringParameters.invocations_min ? event.queryStringParameters.invocations_min : 5
  let invocationsMax = event.queryStringParameters.invocations_max ? event.queryStringParameters.invocations_max : 10
  let daysInThePast = event.queryStringParameters.days ? event.queryStringParameters.days : 365
  let errorsCoef = event.queryStringParameters.errors ? event.queryStringParameters.errors : 0.5
  const accountId = event.pathParameters.id
  const max = new Date()
  const min = new Date()
  min.setDate(max.getDate() - daysInThePast)

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

      let functions = []
      for (let i = 0; i < functionsCount; i++) {
        let func = {}
        let name = faker.hacker.verb() + ' ' + faker.hacker.noun()
        func._id = faker.random.uuid()
        func._account = accountId
        func.arn = `arn:aws:lambda:${faker.helpers.randomize(regions)}:${faker.random.number({min: 100000000000, max: 999999999999})}:function:${name}`
        func.codeSize = faker.random.number(({min: 100, max: 999999999}))
        func.memSize = Math.round(faker.random.number(({min: 128, max: 3008})) / 64) * 64
        func.name = name
        func.timeout = faker.random.number({min: 0, max: 300})
        let funcModel = new FunctionModel(func)
        functions.push(funcModel.data)
      }
      return functions
    })
    .then(functions => {
      let eventCounter = new BigInteger('33773592922032033623252972461104249685054501853208182784').plus(faker.random.number({min: 1000, max: 5000}))
      let invocations = []
      for (let func of functions) {
        let invocationsCount = faker.random.number({min: Math.min(invocationsMin, invocationsMax), max: Math.max(invocationsMax, invocationsMin)})
        let errorsCount = Math.round(errorsCoef * invocationsCount)
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
            'billedDuration': billedDuration,
            'duration': duration,
            'startTime': randomDateMillis,
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
          if (errorsCount > 0) {
            invocation.error = 1
            invocation.errorType = faker.helpers.randomize([
              'crash',
              'error',
              'config'
            ])

            if (invocation.errorType === 'error') {
              invocation.logs.splice(2, 0, {
                'eventId': (eventCounter = eventCounter.plus(faker.random.number({min: 1, max: 1000}))).toString(),
                'ingestionTime': randomDateMillis += faker.random.number({min: 0, max: duration / 3}),
                'logStreamName': invocation.logStreamName,
                'message': '{"errorMessage":\t "some error"\t}',
                'timestamp': randomDateMillis += faker.random.number({min: 0, max: duration / 3})
              })
            }
            if (invocation.errorType === 'crash') {
              invocation.logs.splice(2, 0, {
                'eventId': (eventCounter = eventCounter.plus(faker.random.number({min: 1, max: 1000}))).toString(),
                'ingestionTime': randomDateMillis += faker.random.number({min: 0, max: duration / 3}),
                'logStreamName': invocation.logStreamName,
                'message': `RequestId: ${_id} Process exited before completing request`,
                'timestamp': randomDateMillis += faker.random.number({min: 0, max: duration / 3})
              })
            }
            if (invocation.errorType === 'config') {
              invocation.logs.splice(2, 0, {
                'eventId': (eventCounter = eventCounter.plus(faker.random.number({min: 1, max: 1000}))).toString(),
                'ingestionTime': randomDateMillis += faker.random.number({min: 0, max: duration / 3}),
                'logStreamName': invocation.logStreamName,
                'message': `${new Date(randomDateMillis).toISOString()} ${_id} Error: [object Object]\tat module.exports.run (/var/task/src/test-error/handler.js:8:11)`,
                'timestamp': randomDateMillis += faker.random.number({min: 0, max: duration / 3})
              })
            }

            errorsCount--
          }
          let invocationModel = new InvocationModel(invocation)
          invocations.push(invocationModel.data)
        }
      }
      return {
        functions: functions,
        invocations: invocations
      }
    })
    .then(({functions, invocations}) => {
      return Promise.all([FunctionModel.batchWrite(functions), InvocationModel.batchWrite(invocations)])
    })
    .then(responses.created)
    .catch(responses.error)
    .then(response => callback(null, response))
}

module.exports.clear = (event, context, callback) => {
  return Promise.all([InvocationModel.getAllScan({})
    .then(({Items}) => {
      if (Items && Items.length > 0) { return InvocationModel.bulkDelete({Keys: Items.map((item) => { return {_id: item._id} })}) }
      return []
    }), FunctionModel.getAllScan({})
    .then(({Items}) => {
      if (Items && Items.length > 0) { return FunctionModel.bulkDelete({Keys: Items.map((item) => { return {_id: item._id} })}) }
      return []
    })
  ])
    .then(responses.ok)
    .catch(responses.error)
    .then(response => callback(null, response))
}
