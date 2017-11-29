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
        isActive: 1,
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
        accountsList.push({_id: account._account})
      })
      return AccountModel.getByKeys({
        Keys: accountsList
      })
    })
    .then((accounts) => accounts.map(dtoAccount.public))
    .then(responses.ok)
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
  console.log('event: ', event)
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
    .then((account) => {
      return AccountModel.update(account._id, {
        isActive: 0
      })
    })
    .then(responses.deleted)
    .catch(responses.error)
    .then(response => callback(null, response))
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
      let users = []
      const dbPromises = []
      if (data._users) {
        users = data._users
      }
      if (data._user) {
        users.push(data._user)
      }
      // TODO: check response for _user + _users with the same user ID
      users.forEach((user) => {
        let accountUser = new UserAccountModel({
          _user: user,
          _account: event.pathParameters.id,
          isAdmin: false
        })
        dbPromises.push(accountUser.save())
      })
      return Promise.all(dbPromises)
    })
    .then(responses.ok)
    .catch(responses.error)
    .then(response => callback(null, response))
}

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
      const usersList = []
      users.forEach((user) => {
        usersList.push({
          _id: user._user
        })
      })
      console.log('users', usersList)
      return UserModel.getUsersOfAccount({
        _account: event.pathParameters.id,
        Keys: usersList
      })
    })
    //.then((users) => users.map(dtoUser.makeDto))
    .then(responses.ok)
    .catch(responses.error)
    .then(response => callback(null, response))
}

// TODO: check user permission
module.exports.updateAccountUser = (event, context, callback) => {
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
    .then(() => helper.validateAccountUserUpdate(JSON.parse(event.body)))
    .then((data) => {
      let accountUser = new UserAccountModel({
        _user: event.pathParameters.userId,
        _account: event.pathParameters.id,
        isAdmin: data.isAdmin
      })
      return accountUser.save()
    })
    .then(responses.ok)
    .catch(responses.error)
    .then(response => callback(null, response))
}

module.exports.deleteAccountUser = (event, context, callback) => {
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
    .then((data) => {
      return UserAccountModel.delete({
        Key: {
          _user: event.pathParameters.userId,
          _account: event.pathParameters.id
        }
      })
    })
    .then(responses.ok)
    .catch(responses.error)
    .then(response => callback(null, response))
}
