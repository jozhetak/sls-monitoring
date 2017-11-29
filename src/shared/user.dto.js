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
    users: data.Items.map(this.public),
    lastEvaluatedKey: data.LastEvaluatedKey ? data.LastEvaluatedKey._id : null
  }
}
