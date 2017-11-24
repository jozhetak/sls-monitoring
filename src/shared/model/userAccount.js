/**
 * Created by Mac on 10/28/17.
 */

const Model = require('./model')

module.exports = class UserAccounts extends Model {
  constructor (opts) {
    super(opts)
  }

  static get TABLE () {
    return process.env.USER_ACCOUNTS_TABLE
  }
}
