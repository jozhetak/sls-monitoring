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
  Promise.all([
    passport.checkAuth(event.headers.Authorization).then(decoded => UserModel.isActiveOrThrow(decoded)),
    helper.validate(event.body)
  ])
    .then(([userId, data]) => {
      const timestamp = Date.now()
      const params = {
        _id: uuid.v1(),
        name: data.name,
        key: data.key,
        secret: data.secret,
        region: data.region,
        createdAt: timestamp,
        updatedAt: timestamp,
        isActive: 1,
        _user: userId // createdBy
      }
      const account = new AccountModel(params)
      const accountUser = new UserAccountModel({
        _user: userId,
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
  return passport
    .checkAuth(event.headers.Authorization)
    .then(decoded => UserModel.isActiveOrThrow(decoded))
    .then(id => UserAccountModel.getAccountsByUser(id))
    .then(accounts => {
      if (!accounts) throw errors.notFound()
      return accounts.map(account => {
        return { _id: account._account }
      })
    })
    .then(keysList => AccountModel.getByKeys({Keys: keysList}))
    .then((accounts) => accounts.map(dtoAccount.public))
    .then(responses.ok)
    .catch(responses.error)
    .then(response => callback(null, response))
}

module.exports.get = (event, context, callback) => {
  return Promise.all([
    passport.checkAuth(event.headers.Authorization).then(decoded => UserModel.isActiveOrThrow(decoded)),
    AccountModel.getActiveByIdrOrThrow(event.pathParameters.id),
    UserAccountModel.getUsersByAccount(event.pathParameters.id)]
  )
    .then(([id, account, accountUsers]) => {
      let accountUsersIds = accountUsers.map(user => user._user)
      if (!account) throw errors.notFound()
      if (!accountUsersIds.includes(id)) {
        throw errors.forbidden()
      }
      return account
    })
    .then(dtoAccount.public)
    .then(responses.ok)
    .catch(responses.error)
    .then(response => callback(null, response))
}

module.exports.update = (event, context, callback) => {
  return Promise.all([
    passport.checkAuth(event.headers.Authorization).then(decoded => UserModel.isActiveOrThrow(decoded)),
    AccountModel.getActiveByIdrOrThrow(event.pathParameters.id),
    helper.validate(event.body),
    UserAccountModel.getUsersByAccount(event.pathParameters.id)
  ])
    .then(([id, account, body, accountUsers]) => {
      let accountUsersIds = accountUsers.map(user => user._user)
      if (!(accountUsersIds.includes(id) && accountUsers.find(user => user._user === id).isAdmin)) {
        throw errors.forbidden()
      }

      return AccountModel.update(account._id, body)
    })
    .then(dtoAccount.public)
    .then(responses.created)
    .catch(responses.error)
    .then(response => callback(null, response))
}

module.exports.delete = (event, context, callback) => {
  return Promise.all([
    passport.checkAuth(event.headers.Authorization).then(decoded => UserModel.isActiveOrThrow(decoded)),
    AccountModel.getActiveByIdrOrThrow(event.pathParameters.id),
    UserAccountModel.getUsersByAccount(event.pathParameters.id)]
  )
    .then(([id, account, accountUsers]) => {
      if (!accountUsers) throw errors.notFound()
      let accountUsersIds = accountUsers.map(user => user._user)
      if (!(accountUsersIds.includes(id) && accountUsers.find(user => user._user === id).isAdmin)) {
        throw errors.forbidden()
      }

      return AccountModel.remove(account._id)
    })
    .then(responses.ok)
    .catch(responses.error)
    .then(response => callback(null, response))
}

module.exports.inviteUsers = (event, context, callback) => {
  return Promise.all([
    passport.checkAuth(event.headers.Authorization).then(decoded => UserModel.isActiveOrThrow(decoded)),
    AccountModel.getActiveByIdrOrThrow(event.pathParameters.id),
    helper.validateInvite(event.body),
    UserAccountModel.getUsersByAccount(event.pathParameters.id)
  ])
    .then(([id, account, body, accountUsers]) => {
      let users = []
      let accountUsersIds = accountUsers.map(user => user._user)
      if (!(accountUsersIds.includes(id) && accountUsers.find(user => user._user === id).isAdmin)) {
        throw errors.forbidden()
      }

      if (body._users) {
        users = body._users
      }
      if (body._user) {
        users.push(body._user)
      }
      users = users.filter(user => !accountUsersIds.includes(user))
      return Promise.all(users.map(user => UserModel.getById(user)))
    })
    .then(users => {
      let dbPromises = []
      users.forEach((user) => {
        let accountUser = new UserAccountModel({
          _user: user._id,
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
  return Promise.all([
    passport.checkAuth(event.headers.Authorization).then(decoded => UserModel.isActiveOrThrow(decoded)),
    UserAccountModel.getUsersByAccount(event.pathParameters.id)
  ])
    .then(([id, accountUsers]) => {
      if (!accountUsers || accountUsers.length === 0) throw errors.notFound()
      let accountUsersIds = accountUsers.map(user => user._user)
      if (!accountUsersIds.includes(id)) {
        throw errors.forbidden()
      }
      const usersList = []
      accountUsers.forEach((user) => {
        usersList.push({
          _id: user._user
        })
      })
      return UserModel.getUsersOfAccount({
        _account: event.pathParameters.id,
        Keys: usersList
      })
    })
    .then((users) => users.map(user => {
      user._user = dtoUser.public(user._user)
      return user
    }))
    .then(responses.ok)
    .catch(responses.error)
    .then(response => callback(null, response))
}

module.exports.updateAccountUser = (event, context, callback) => {
  return Promise.all([
    passport.checkAuth(event.headers.Authorization).then(decoded => UserModel.isActiveOrThrow(decoded)),
    UserAccountModel.getUsersByAccount(event.pathParameters.id)
  ])
    .then(([id, accountUsers]) => {
      let accountUsersIds = accountUsers.map(user => user._user)
      if (!(accountUsersIds.includes(id) && accountUsers.find(user => user._user === id).isAdmin)) {
        throw errors.forbidden()
      }
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
  const userId = event.pathParameters.userId
  const accountId = event.pathParameters.id
  const token = event.headers.Authorization

  return Promise.all([
    passport.checkAuth(token).then(decoded => UserModel.isActiveOrThrow(decoded)),
    AccountModel.getActiveByIdrOrThrow(accountId),
    UserAccountModel.getUsersByAccount(accountId)]
  )
    .then(([id, account, accountUsers]) => {
      let accountUsersIds = accountUsers.map(user => user._user)
      if (userId === id && accountUsers.filter(user => user._user !== id && user.isAdmin).length === 0) {
        throw errors.forbidden()
      }
      if (!(accountUsersIds.includes(id) && accountUsers.find(user => user._user === id).isAdmin)) {
        throw errors.forbidden()
      }

      return UserAccountModel.delete({
        Key: {
          _user: userId,
          _account: accountId
        }
      })
    })
    .then(responses.ok)
    .catch(responses.error)
    .then(response => callback(null, response))
}
