'use strict'

global.Promise = require('bluebird')

const InvocationModel = require('../../shared/model/invocation')
const AccountModel = require('../../shared/model/account')
const UserModel = require('../../shared/model/user')
const UserAccountModel = require('../../shared/model/userAccount')
const FunctionModel = require('../../shared/model/function')
const errors = require('../../shared/helper/errors')
const passport = require('./../passport/passport')
const responses = require('../../shared/helper/responses')

module.exports.list = (event, context, callback) => {
  const query = event.queryStringParameters
  const token = event.headers.Authorization
  const accountId = event.pathParameters.id
  const functionId = event.pathParameters.functionId
  const limit = query && query.limit ? query.limit : 50
  const startTime = query && query.startTime
    ? parseInt(query.startTime)
    : (new Date()).getTime() - 24 * 60 * 60 * 1000
  const promises = [
    passport.checkAuth(token)
      .then(decoded => UserModel.isActiveOrThrow(decoded)),
    AccountModel.getActiveByIdrOrThrow(accountId),
    UserAccountModel.getUsersByAccount(accountId),
    FunctionModel.getById(functionId)
  ]
  if (query && query.key) {
    promises.push(InvocationModel.getById(query.key))
  }

  return Promise.all(promises)
    .then(([id, account, accountUsers, func, lastReturnedInvocation]) => {
      const exclusiveStartKey = lastReturnedInvocation ? {
        _function: lastReturnedInvocation._function,
        _id: lastReturnedInvocation._id,
        startTime: lastReturnedInvocation.startTime
      } : undefined
      let accountUsersIds = accountUsers.map(user => user._user)
      if (!(accountUsersIds.includes(id))) {
        throw errors.forbidden()
      }
      if (func._account !== accountId) {
        throw errors.forbidden()
      }

      return InvocationModel.getAll({
        IndexName: 'FunctionIdIndex',
        KeyConditionExpression: '#function = :function AND #startTime >= :startTime',
        ExpressionAttributeNames: {
          '#function': '_function',
          '#startTime': 'startTime'
        },
        ExpressionAttributeValues: {
          ':function': functionId,
          ':startTime': startTime
        },
        ExclusiveStartKey: exclusiveStartKey,
        Limit: limit,
        ScanIndexForward: false
      })
    })
    .then(responses.ok)
    .catch(responses.error)
    .then(response => callback(null, response))
}

module.exports.listOfAccount = (event, context, callback) => {
  const query = event.queryStringParameters
  const token = event.headers.Authorization
  const accountId = event.pathParameters.id
  const limit = query && query.limit ? query.limit : 50
  const startTime = query && query.startTime
    ? parseInt(query.startTime)
    : (new Date()).getTime() - 24 * 60 * 60 * 1000

  const promises = [
    passport.checkAuth(token)
      .then(decoded => UserModel.isActiveOrThrow(decoded)),
    AccountModel.getActiveByIdrOrThrow(accountId),
    UserAccountModel.getUsersByAccount(accountId)
  ]
  if (query && query.key) {
    promises.push(InvocationModel.getById(query.key))
  }
  return Promise.all(promises)
    .spread((id, account, accountUsers, lastReturnedInvocation) => {
      const exclusiveStartKey = lastReturnedInvocation ? {
        _account: lastReturnedInvocation._account,
        _id: lastReturnedInvocation._id,
        startTime: lastReturnedInvocation.startTime
      } : undefined

      let accountUsersIds = accountUsers.map(user => user._user)
      if (!(accountUsersIds.includes(id))) {
        throw errors.forbidden()
      }

      return InvocationModel.getAll({
        IndexName: 'AccountIdTime',
        KeyConditionExpression: '#account = :account AND #startTime >= :startTime',
        ExpressionAttributeNames: {
          '#account': '_account',
          '#startTime': 'startTime'
        },
        ExpressionAttributeValues: {
          ':account': accountId,
          ':startTime': startTime
        },
        ExclusiveStartKey: exclusiveStartKey,
        Limit: limit,
        ScanIndexForward: false
      })
    })
    .then(data => {
      const arrayOfPromises = data.Items.map(invocation => {
        return FunctionModel.getById(invocation._function)
          .then(functionObj => {
            invocation.functionName = functionObj.name
          })
      })
      return Promise.all(arrayOfPromises)
        .then(() => responses.ok(data))
    })
    .catch(responses.error)
    .then(response => callback(null, response))
}

module.exports.get = (event, context, callback) => {
  const token = event.headers.Authorization
  const accountId = event.pathParameters.id
  const functionId = event.pathParameters.functionId
  const invocationId = event.pathParameters.invocationId

  return Promise.all([
      passport.checkAuth(token)
        .then(decoded => UserModel.isActiveOrThrow(decoded)),
      AccountModel.getActiveByIdrOrThrow(accountId),
      UserAccountModel.getUsersByAccount(accountId),
      FunctionModel.getById(functionId)
    ]
  )
    .then(([id, account, accountUsers, func]) => {
      let accountUsersIds = accountUsers.map(user => user._user)
      if (!(accountUsersIds.includes(id))) {
        throw errors.forbidden()
      }
      if (func._account !== accountId) throw errors.forbidden()
      return InvocationModel.getById(invocationId)
    })
    .then(invocation => {
      if (invocation._function !== functionId) {
        throw errors.forbidden()
      }
      return invocation
    })
    .then(responses.ok)
    .catch(responses.error)
    .then(response => callback(null, response))
}
// TODO: support endTime
module.exports.chartFunctionInvocations = (event, context, callback) => {
  const query = event.queryStringParameters
  const token = event.headers.Authorization
  const accountId = event.pathParameters.id
  const functionId = event.pathParameters.functionId
  const startTime = query && query.startTime
    ? Number(query.startTime)
    : (new Date()).getTime() - 30 * 24 * 60 * 60 * 1000
  return Promise.all(
    [
      passport.checkAuth(token)
        .then(decoded => UserModel.isActiveOrThrow(decoded)),
      AccountModel.getActiveByIdrOrThrow(accountId),
      UserAccountModel.getUsersByAccount(accountId),
      FunctionModel.getById(functionId)
    ]
  )
    .then(([id, account, accountUsers, func]) => {
      let accountUsersIds = accountUsers.map(user => user._user)
      if (!(accountUsersIds.includes(id))) {
        throw errors.forbidden()
      }
      if (func._account !== accountId) {
        throw errors.forbidden()
      }

      return InvocationModel.getAll({
        IndexName: 'FunctionIdIndex',
        KeyConditionExpression: '#function = :function AND #startTime >= :startTime',
        FilterExpression: '',
        ExpressionAttributeNames: {
          '#function': '_function',
          '#startTime': 'startTime'
        },
        ExpressionAttributeValues: {
          ':function': functionId,
          ':startTime': startTime
        },
        ScanIndexForward: false
      })
    })
    .then((result) => {
      const byday = {}
      const data = result.Items
      data.forEach((value) => {
        let d = new Date(value['startTime'])
        d = Math.floor(d.getTime() / (1000 * 60 * 60 * 24))
        byday[d] = byday[d] || []
        byday[d].push(value)
      })
      return (Object.keys(byday)).map((value) => {
        return {
          title: (new Date(value * 1000 * 60 * 60 * 24)).toDateString(),
          val: (byday[value]).length
        }
      })
    })
    .then(responses.ok)
    .catch(responses.error)
    .then(response => callback(null, response))
}

module.exports.chartFunctionErrors = (event, context, callback) => {
  const query = event.queryStringParameters
  const token = event.headers.Authorization
  const accountId = event.pathParameters.id
  const functionId = event.pathParameters.functionId
  const startTime = query && query.startTime
    ? Number(query.startTime)
    : (new Date()).getTime() - 30 * 24 * 60 * 60 * 1000
  return Promise.all(
    [
      passport.checkAuth(token)
        .then(decoded => UserModel.isActiveOrThrow(decoded)),
      AccountModel.getActiveByIdrOrThrow(accountId),
      UserAccountModel.getUsersByAccount(accountId),
      FunctionModel.getById(functionId)
    ]
  )
    .then(([id, account, accountUsers, func]) => {
      let accountUsersIds = accountUsers.map(user => user._user)
      if (!(accountUsersIds.includes(id))) {
        throw errors.forbidden()
      }
      if (func._account !== accountId) {
        throw errors.forbidden()
      }

      return InvocationModel.getAll({
        IndexName: 'FunctionIdIndex',
        KeyConditionExpression: '#function = :function AND #startTime >= :startTime',
        FilterExpression: '',
        ExpressionAttributeNames: {
          '#function': '_function',
          '#startTime': 'startTime'
        },
        ExpressionAttributeValues: {
          ':function': functionId,
          ':startTime': startTime
        },
        ScanIndexForward: false
      })
    })
    .then((result) => {
      const byday = {}
      const data = result.Items
      data.forEach((value) => {
        let d = new Date(value['startTime'])
        d = Math.floor(d.getTime() / (1000 * 60 * 60 * 24))
        byday[d] = byday[d] || 0
        if (value['error']) {
          byday[d]++
        }
      })
      return (Object.keys(byday)).map((value) => {
        return {
          title: (new Date(value * 1000 * 60 * 60 * 24)).toDateString(),
          val: byday[value]
        }
      })
    })
    .then(responses.ok)
    .catch(responses.error)
    .then(response => callback(null, response))
}
// TODO: support endTime

module.exports.chartFunctionDuration = (event, context, callback) => {
  const query = event.queryStringParameters
  const token = event.headers.Authorization
  const accountId = event.pathParameters.id
  const functionId = event.pathParameters.functionId
  const startTime = query && query.startTime
    ? Number(query.startTime)
    : (new Date()).getTime() - 30 * 24 * 60 * 60 * 1000
  return Promise.all(
    [
      passport.checkAuth(token)
        .then(decoded => UserModel.isActiveOrThrow(decoded)),
      AccountModel.getActiveByIdrOrThrow(accountId),
      UserAccountModel.getUsersByAccount(accountId),
      FunctionModel.getById(functionId)
    ]
  )
    .then(([id, account, accountUsers, func]) => {
      let accountUsersIds = accountUsers.map(user => user._user)
      if (!(accountUsersIds.includes(id))) {
        throw errors.forbidden()
      }
      if (func._account !== accountId) {
        throw errors.forbidden()
      }

      return InvocationModel.getAll({
        IndexName: 'FunctionIdIndex',
        KeyConditionExpression: '#function = :function AND #startTime >= :startTime',
        FilterExpression: '',
        ExpressionAttributeNames: {
          '#function': '_function',
          '#startTime': 'startTime'
        },
        ExpressionAttributeValues: {
          ':function': functionId,
          ':startTime': startTime
        },
        ScanIndexForward: false
      })
    })
    .then((result) => {
      const byday = {}
      const data = result.Items
      data.forEach((value) => {
        let d = new Date(value['startTime'])
        d = Math.floor(d.getTime() / (1000 * 60 * 60 * 24))
        if (!byday[d]) {
          byday[d] = {
            totalDuration: Number(value.duration),
            invocationsCount: 1
          }
        } else {
          byday[d].totalDuration += Number(value.duration)
          byday[d].invocationsCount++
        }
      })
      return (Object.keys(byday)).map((value) => {
        return {
          title: (new Date(value * 1000 * 60 * 60 * 24)).toDateString(),
          val: Math.round(byday[value].totalDuration /
            byday[value].invocationsCount * 100) / 100
        }
      })
    })
    .then(responses.ok)
    .catch(responses.error)
    .then(response => callback(null, response))
}

module.exports.chartAccountInvocations = (event, context, callback) => {
  const query = event.queryStringParameters
  const token = event.headers.Authorization
  const accountId = event.pathParameters.id
  const startTime = query && query.startTime
    ? Number(query.startTime)
    : (new Date()).getTime() - 30 * 24 * 60 * 60 * 1000
  return Promise.all([
    passport.checkAuth(token)
      .then(decoded => UserModel.isActiveOrThrow(decoded)),
    AccountModel.getActiveByIdrOrThrow(accountId),
    UserAccountModel.getUsersByAccount(accountId)
  ])
    .then(([id, account, accountUsers]) => {
      let accountUsersIds = accountUsers.map(user => user._user)
      if (!(accountUsersIds.includes(id))) {
        throw errors.forbidden()
      }

      return InvocationModel.getAll({
        IndexName: 'AccountIdTime',
        KeyConditionExpression: '#account = :account AND #startTime >= :startTime',
        FilterExpression: '',
        ExpressionAttributeNames: {
          '#account': '_account',
          '#startTime': 'startTime'
        },
        ExpressionAttributeValues: {
          ':account': accountId,
          ':startTime': startTime
        },
        ScanIndexForward: false
      })
    })
    .then((result) => {
      const byday = {}
      const data = result.Items
      data.forEach((value) => {
        let d = new Date(value['startTime'])
        d = Math.floor(d.getTime() / (1000 * 60 * 60 * 24))
        byday[d] = byday[d] || []
        byday[d].push(value)
      })
      return (Object.keys(byday)).map((value) => {
        return {
          title: (new Date(value * 1000 * 60 * 60 * 24)).toDateString(),
          val: (byday[value]).length
        }
      })
    })
    .then(responses.ok)
    .catch(responses.error)
    .then(response => callback(null, response))
}

module.exports.chartAccountErrors = (event, context, callback) => {
  const query = event.queryStringParameters
  const token = event.headers.Authorization
  const accountId = event.pathParameters.id
  const startTime = query && query.startTime
    ? Number(query.startTime)
    : (new Date()).getTime() - 30 * 24 * 60 * 60 * 1000
  return Promise.all([
    passport.checkAuth(token)
      .then(decoded => UserModel.isActiveOrThrow(decoded)),
    AccountModel.getActiveByIdrOrThrow(accountId),
    UserAccountModel.getUsersByAccount(accountId)
  ])
    .then(([id, account, accountUsers]) => {
      let accountUsersIds = accountUsers.map(user => user._user)
      if (!(accountUsersIds.includes(id))) {
        throw errors.forbidden()
      }

      return InvocationModel.getAll({
        IndexName: 'AccountIdTime',
        KeyConditionExpression: '#account = :account AND #startTime >= :startTime',
        FilterExpression: '',
        ExpressionAttributeNames: {
          '#account': '_account',
          '#startTime': 'startTime'
        },
        ExpressionAttributeValues: {
          ':account': accountId,
          ':startTime': startTime
        },
        ScanIndexForward: false
      })
    })
    .then((result) => {
      const byday = {}
      const data = result.Items
      data.forEach((value) => {
        let d = new Date(value['startTime'])
        d = Math.floor(d.getTime() / (1000 * 60 * 60 * 24))
        byday[d] = byday[d] || 0
        if (value['error']) {
          byday[d]++
        }
      })
      return (Object.keys(byday)).map((value) => {
        return {
          title: (new Date(value * 1000 * 60 * 60 * 24)).toDateString(),
          val: byday[value]
        }
      })
    })
    .then(responses.ok)
    .catch(responses.error)
    .then(response => callback(null, response))
}

module.exports.chartAccountDuration = (event, context, callback) => {
  const query = event.queryStringParameters
  const token = event.headers.Authorization
  const accountId = event.pathParameters.id
  const startTime = query && query.startTime
    ? Number(query.startTime)
    : (new Date()).getTime() - 30 * 24 * 60 * 60 * 1000
  return Promise.all([
    passport.checkAuth(token)
      .then(decoded => UserModel.isActiveOrThrow(decoded)),
    AccountModel.getActiveByIdrOrThrow(accountId),
    UserAccountModel.getUsersByAccount(accountId)
  ])
    .then(([id, account, accountUsers]) => {
      let accountUsersIds = accountUsers.map(user => user._user)
      if (!(accountUsersIds.includes(id))) {
        throw errors.forbidden()
      }

      return InvocationModel.getAll({
        IndexName: 'AccountIdTime',
        KeyConditionExpression: '#account = :account AND #startTime >= :startTime',
        FilterExpression: '',
        ExpressionAttributeNames: {
          '#account': '_account',
          '#startTime': 'startTime'
        },
        ExpressionAttributeValues: {
          ':account': accountId,
          ':startTime': startTime
        },
        ScanIndexForward: false
      })
    })
    .then((result) => {
      const byday = {}
      const data = result.Items
      data.forEach((value) => {
        let d = new Date(value['startTime'])
        d = Math.floor(d.getTime() / (1000 * 60 * 60 * 24))
        if (!byday[d]) {
          byday[d] = {
            totalDuration: Number(value.duration),
            invocationsCount: 1
          }
        } else {
          byday[d].totalDuration += Number(value.duration)
          byday[d].invocationsCount++
        }
      })
      return (Object.keys(byday)).map((value) => {
        return {
          title: (new Date(value * 1000 * 60 * 60 * 24)).toDateString(),
          val: Math.round(byday[value].totalDuration /
            byday[value].invocationsCount * 100) / 100
        }
      })
    })
    .then(responses.ok)
    .catch(responses.error)
    .then(response => callback(null, response))
}
// eventsArray = [ {id: 1, date: 1387271989749 }, {id:2, date: 1387271989760} ];
// byday={};
// byweek={};
// bymonth={};

// function groupweek(value, index, array)
// {
//   d = new Date(value['date']);
//   d = Math.floor(d.getTime()/(1000*60*60*24*7));
//   byweek[d]=byweek[d]||[];
//   byweek[d].push(value);
// }
// function groupmonth(value, index, array)
// {
//   d = new Date(value['date']);
//   d = (d.getFullYear()-1970)*12 + d.getMonth();
//   bymonth[d]=bymonth[d]||[];
//   bymonth[d].push(value);
// }
// eventsArray.map(groupday);
// eventsArray.map(groupweek);
// eventsArray.map(groupmonth);
