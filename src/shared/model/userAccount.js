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

  static getAccountsByUser (id) {
    return this.getAll({
      TableName: UserAccounts.TABLE,
      KeyConditionExpression: '#user = :user',
      ExpressionAttributeNames: {
        '#user': '_user'
      },
      ExpressionAttributeValues: {
        ':user': id
      }
      // ProjectionExpression: "_account"
    }).then(data => data.Items)
  }

  static getUsersByAccount (id) {
    return this.getAll({
      IndexName: 'AccountUsers',
      KeyConditionExpression: '#account = :account',
      ExpressionAttributeNames: {
        '#account': '_account'
      },
      ExpressionAttributeValues: {
        ':account': id
      }
    }).then(data => data.Items)
  }
}
