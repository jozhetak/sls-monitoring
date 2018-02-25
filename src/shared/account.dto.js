module.exports.public = (account, isAdmin) => {
  return {
    _id: account._id ? account._id : null,
    name: account.name ? account.name : null,
    key: account.key ? account.key : null,
    secret: account.secret ? account.secret : null,
    region: account.region ? account.region : null,
    createdAt: account.createdAt ? account.createdAt : null,
    updatedAt: account.updatedAt ? account.updatedAt : null,
    isActive: account.isActive ? account.isActive : undefined,
    isAdmin: isAdmin,
    _user: account._user ? account._user : null
  }
}
