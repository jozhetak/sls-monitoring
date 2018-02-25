'use strict'

module.exports.public = (user) => {
  return {
    _id: user._id ? user._id : null,
    firstName: user.firstName ? user.firstName : null,
    lastName: user.lastName ? user.lastName : null,
    email: user.email ? user.email : null,
    createdAt: user.createdAt ? user.createdAt : null,
    updatedAt: user.updatedAt ? user.updatedAt : null
  }
}

module.exports.publicList = (data) => {
  return {
    users: data.Items.sort((a, b) => b.createdAt - a.createdAt).map(this.public),
    lastEvaluatedKey: data.LastEvaluatedKey ? data.LastEvaluatedKey._id : null
  }
}

module.exports.withToken = (user) => {
  let dto = this.public(user)
  dto.accessToken = user.accessToken
  return dto
}

module.exports.invited = (user, accountUser) => {
  return {
    _account: accountUser._account,
    _user: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    isAdmin: accountUser.isAdmin
  }
}

module.exports.accountAssignee = (user) => {
  return {
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    isAdmin: user.isAdmin
  }
}
