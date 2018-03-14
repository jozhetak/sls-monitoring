'use strict'

global.Promise = require('bluebird')

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
  const accountIdIsAdminMap = new Map()
  return passport
    .checkAuth(event.headers.Authorization)
    .then(decoded => UserModel.isActiveOrThrow(decoded))
    .then(id => UserAccountModel.getAccountsByUser(id))
    .then(accounts => {
      if (!accounts) throw errors.notFound()
      const keysList = accounts.map(account => {
        accountIdIsAdminMap.set(account._account, account.isAdmin)
        return {_id: account._account}
      })
      if (!accounts.length) {
        return []
      }
      return AccountModel.getByKeys({Keys: keysList})
    })
    .then((accounts) => accounts.filter(account => account.isActive))
    .then((accounts) => accounts.sort((a, b) => b.createdAt - a.createdAt))
    .then((accounts) => {
      return accounts.map(account => {
        return dtoAccount.public(account, accountIdIsAdminMap.get(account._id))
      })
    })
    .then(responses.ok)
    .catch(responses.error)
    .then(response => callback(null, response))
}

module.exports.get = (event, context, callback) => {
  return Promise.all([
    passport.checkAuth(event.headers.Authorization)
      .then(decoded => UserModel.isActiveOrThrow(decoded)),
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
    passport.checkAuth(event.headers.Authorization)
      .then(decoded => UserModel.isActiveOrThrow(decoded)),
    AccountModel.getActiveByIdrOrThrow(event.pathParameters.id),
    helper.validate(event.body),
    UserAccountModel.getUsersByAccount(event.pathParameters.id)
  ])
    .then(([id, account, body, accountUsers]) => {
      let accountUsersIds = accountUsers.map(user => user._user)
      if (!(accountUsersIds.includes(id) &&
          accountUsers.find(user => user._user === id).isAdmin)) {
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
    passport.checkAuth(event.headers.Authorization)
      .then(decoded => UserModel.isActiveOrThrow(decoded)),
    AccountModel.getActiveByIdrOrThrow(event.pathParameters.id),
    UserAccountModel.getUsersByAccount(event.pathParameters.id)]
  )
    .then(([id, account, accountUsers]) => {
      if (!accountUsers) throw errors.notFound()
      let accountUsersIds = accountUsers.map(user => user._user)
      if (!(accountUsersIds.includes(id) &&
          accountUsers.find(user => user._user === id).isAdmin)) {
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
    passport.checkAuth(event.headers.Authorization)
      .then(decoded => UserModel.isActiveOrThrow(decoded)),
    AccountModel.getActiveByIdrOrThrow(event.pathParameters.id),
    helper.validateInvite(event.body),
    UserAccountModel.getUsersByAccount(event.pathParameters.id)
  ])
    .then(([id, account, body, accountUsers]) => {
      let users = []
      let accountUsersIds = accountUsers.map(user => user._user)
      if (!(accountUsersIds.includes(id) &&
          accountUsers.find(user => user._user === id).isAdmin)) {
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

module.exports.inviteUserByEmail = (event, context, callback) => {
  return passport.checkAuth(event.headers.Authorization)
    .then(decoded => {
      return [
        UserModel.isActiveOrThrow(decoded),
        AccountModel.getActiveByIdrOrThrow(event.pathParameters.id),
        UserAccountModel.getUsersByAccount(event.pathParameters.id),
        helper.validateInviteByEmail(JSON.parse(event.body))
          .then(data => UserModel.getByEmail(data.email))
      ]
    })
    .spread((id, account, accountUsers, userToInvite) => {
      if (!userToInvite) {
        throw errors.badRequest()
      }
      const accountUsersIds = accountUsers.map(user => user._user)
      if (!(accountUsersIds.includes(id) &&
          accountUsers.find(user => user._user === id).isAdmin)) {
        throw errors.forbidden()
      }
      if (accountUsersIds.includes(userToInvite._id)) {
        throw errors.forbidden()
      }
      let newAccountUser = new UserAccountModel({
        _user: userToInvite._id,
        _account: event.pathParameters.id,
        isAdmin: false
      })
      return [userToInvite, newAccountUser.save()]
    })
    .spread((userToInvite, newAccountUser) => {
      return dtoUser.invited(userToInvite, newAccountUser)
    })
    .then(responses.ok)
    .catch(responses.error)
    .then(response => callback(null, response))
}

module.exports.getAccountUsers = (event, context, callback) => {
  return Promise.all([
    passport.checkAuth(event.headers.Authorization)
      .then(decoded => UserModel.isActiveOrThrow(decoded)),
    UserAccountModel.getUsersByAccount(event.pathParameters.id)
  ])
    .then(([id, accountUsers]) => {
      if (!accountUsers || accountUsers.length === 0) throw errors.notFound()

      let currentAccountUser
      const usersList = []
      const rolesMap = new Map()

      accountUsers.forEach((user) => {
        const userId = user._user
        usersList.push({
          _id: userId
        })

        rolesMap.set(user._user, user.isAdmin)

        if (userId === id) {
          currentAccountUser = user
        }
      })

      if (!currentAccountUser) {
        throw errors.forbidden()
      }

      return [
        currentAccountUser,
        rolesMap,
        UserModel.getByKeys({
          Keys: usersList
        })]
    })
    .spread((currentAccountUser, rolesMap, users) => {
      const sortedUsers = users.sort((a, b) => b.createdAt - a.createdAt)
      return {
        isAdmin: currentAccountUser.isAdmin,
        users: sortedUsers.map(user => {
          user.isAdmin = rolesMap.get(user._id)
          return dtoUser.accountAssignee(user)
        })
      }
    })
    .then(responses.ok)
    .catch(responses.error)
    .then(response => callback(null, response))
}

module.exports.updateAccountUser = (event, context, callback) => {
  return passport.checkAuth(event.headers.Authorization)
    .then(decoded => {
      // if (decoded.user._id === event.pathParameters.userId) {
      //   throw errors.forbidden()
      // }
      return Promise.all([
        UserModel.isActiveOrThrow(decoded),
        UserAccountModel.getUsersByAccount(event.pathParameters.id)
      ])
    })
    .then(([id, accountUsers]) => {
      let accountUsersIds = accountUsers.map(user => user._user)
      const admins = accountUsers.filter(user => user._user !== id && user.isAdmin).length
      if (!(accountUsersIds.includes(id) && accountUsers.find(user => user._user === id).isAdmin)) {
        throw errors.forbidden()
      }
      if (!JSON.parse(event.body).isAdmin && !admins) {
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
    passport.checkAuth(token)
      .then(decoded => UserModel.isActiveOrThrow(decoded)),
    AccountModel.getActiveByIdrOrThrow(accountId),
    UserAccountModel.getUsersByAccount(accountId)]
  )
    .then(([id, account, accountUsers]) => {
      let accountUsersIds = accountUsers.map(user => user._user)
      if (userId === id && accountUsers.filter(user => user._user !== id && user.isAdmin).length === 0) {
        throw errors.forbidden()
      }
      if (!accountUsersIds.includes(id) && accountUsers.find(user => user._user === id).isAdmin) {
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
