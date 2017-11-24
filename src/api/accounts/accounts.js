'use strict'
const AccountModel = require('../../shared/model/account')
const UserModel = require('../../shared/model/user')
const UserAccountModel = require('../../shared/model/userAccount')
const uuid = require('uuid')
const passport = require('./../passport/passport')
const helper = require('./account.helper')
const errors = require('../../shared/helper/errors')
const responses = require('../../shared/helper/responses')
const dtoAccount = require('../../shared/account.dto')
const dtoUser = require('../../shared/user.dto')

module.exports.create = (event, context, callback) => {
  console.log('event: ', event)
  return Promise.all([
    passport.checkAuth(event.headers.Authorization),
    helper.validate(event.body)
  ])
    .then(([decoded, data]) => {
      const user = decoded.user
      const timestamp = new Date().getTime()
      const params = {
        _id: uuid.v1(),
        name: data.name,
        key: data.key,
        secret: data.secret,
        region: data.region,
        createdAt: timestamp,
        updatedAt: timestamp,
        isActive: true,
        _user: user._id // createdBy
      }
      const account = new AccountModel(params)
      const accountUser = new UserAccountModel({
        _user: user._id,
        _account: params._id,
        isAdmin: true
      })
      return Promise.all([
        account.save(),
        accountUser.save()
      ])
    })
    .then(result => result[0])
    .then(dtoAccount.public)
    .then(responses.created)
    .catch(responses.error)
    .then(response => callback(null, response))
}

module.exports.list = (event, context, callback) => {
  return passport.checkAuth(event.headers.Authorization)
    .then((decoded) => {
      console.log('user:', decoded.user)
      return UserAccountModel.getAll({
        // IndexName: 'UserAccounts',
        KeyConditionExpression: '#user = :user',
        ExpressionAttributeNames: {
          '#user': '_user'
        },
        ExpressionAttributeValues: {
          ':user': decoded.user._id
        }
        // ProjectionExpression: "_account"
      })
    })
    .then((accounts) => {
      console.log('accounts', accounts)
      const accountsList = []
      accounts.forEach((account) => {
        accountsList.push(account._account)
      })
      return AccountModel.getAllScan({
        KeyConditions: {
          _id: {
            'ComparisonOperator': 'IN',
            'AttributeValueList': accountsList
          }
        }
      })
    })
    .then((accounts) => accounts.map(dtoAccount.public))
    .then(responses.created)
    .catch(responses.error)
    .then(response => callback(null, response))
}

module.exports.get = (event, context, callback) => {
  return passport.checkAuth(event.headers.Authorization)
    .then((decoded) => {
      return AccountModel.getById(event.pathParameters.id)
        .then((account) => {
          if (account._user !== decoded.user._id) {
            throw Error('User has no permission')
          }
          return account
        })
        .catch((err) => {
          throw err
        })
    })
    .then(dtoAccount.public)
    .then(responses.created)
    .catch(responses.error)
    .then(response => callback(null, response))
}

module.exports.update = (event, context, callback) => {
  console.log('event: ', event)
  return Promise.all([
    passport.checkAuth(event.headers.Authorization),
    helper.validate(event.body)
  ])
    .then(([decoded, data]) => {
      console.log(data)
      return AccountModel.getById(event.pathParameters.id)
        .then((account) => {
          if (account._user !== decoded.user._id) {
            throw Error('User has no permission')
          }
          return account
        })
        .catch((err) => {
          throw err
        })
    })
    .then((account) => {
      const data = JSON.parse(event.body)
      return AccountModel.update(account._id, data)
    })
    .then(dtoAccount.public)
    .then(responses.created)
    .catch(responses.error)
    .then(response => callback(null, response))
}

module.exports.delete = (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Go Serverless v1.0! Your function executed successfully!',
      input: event
    })
  }

  callback(null, response)

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
}

module.exports.inviteUsers = (event, context, callback) => {
  return passport.checkAuth(event.headers.Authorization)
    .then((decoded) => {
      return AccountModel.getById(event.pathParameters.id)
        .then((account) => {
          if (account._user !== decoded.user._id) {
            throw Error('User has no permission')
          }
          return account
        })
        .catch((err) => {
          throw err
        })
    })
    .then(() => helper.validateInvite(JSON.parse(event.body)))
    .then((data) => {
      const accountUser = new UserAccountModel({
        _user: data._user,
        _account: event.pathParameters.id,
        isAdmin: false
      })
      return accountUser.save()
    })
    //.then(dtoAccount.public)
    .then(responses.ok)
    .catch(responses.error)
    .then(response => callback(null, response))
}
"8c787aa0-d134-11e7-9f33-85ef5353e0b2"
module.exports.getAccountUsers = (event, context, callback) => {
  return passport.checkAuth(event.headers.Authorization)
    .then((decoded) => {
      console.log('user:', decoded.user)
      return UserAccountModel.getAll({
        IndexName: 'AccountUsers',
        KeyConditionExpression: '#account = :account',
        ExpressionAttributeNames: {
          '#account': '_account'
        },
        ExpressionAttributeValues: {
          ':account': event.pathParameters.id
        }
      })
    })
    .then((users) => {
      console.log('users', users)
      const usersList = []
      users.forEach((user) => {
        usersList.push(user._user)
      })
      return UserModel.getAllScan({
        KeyConditions: {
          _id: {
            'ComparisonOperator': 'IN',
            'AttributeValueList': usersList
          }
        }
      })
    })
    .then((users) => users.map(dtoUser.public))
    .then(responses.ok)
    .catch(responses.error)
    .then(response => callback(null, response))
}

module.exports.updateAccountUser = (event, context, callback) => {
  const response = {
    statusCode: 501,
    body: JSON.stringify({
      message: 'NOT_IMPLEMENTED',
      input: event
    })
  }

  callback(null, response)

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
}

module.exports.deleteAccountUser = (event, context, callback) => {
  const response = {
    statusCode: 501,
    body: JSON.stringify({
      message: 'NOT_IMPLEMENTED',
      input: event
    })
  }

  callback(null, response)

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
}
