module.exports.makeDto = (user) => {
  return {
    _id: user._id ? user._id : null,
    firstName: user.firstName ? user.firstName : null,
    lastName: user.lastName ? user.lastName : null,
    email: user.email ? user.email : null,
    createdAt: user.createdAt ? user.createdAt : null,
    updatedAt: user.updatedAt ? user.updatedAt : null
  }
}
