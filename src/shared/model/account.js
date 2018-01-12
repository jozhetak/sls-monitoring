/**
 * Created by Mac on 10/28/17.
 */

const Model = require('./model')
const errors = require('../helper/errors')

module.exports = class Account extends Model {
  constructor (opts) {
    super(opts)
  }

  static get TABLE () {
    return process.env.ACCOUNTS_TABLE
  }

  static getActiveByIdrOrThrow (id) {
    return this.getById(id)
      .then(account => {
        if (!account) {
          throw errors.notFound()
        }
        if (!account.hasOwnProperty('isActive')) throw errors.notFound()
        return account
      })
  }

  static isActiveOrThrow (accounts) {
    return this.getById(accounts._id)
      .then(user => {
        if (!user) {
          throw errors.notFound()
        }
        if (!user.hasOwnProperty('isActive')) throw errors.forbidden()
        return user._id
      })
  }
}
