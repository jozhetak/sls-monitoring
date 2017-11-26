'use strict'

const AWS = require('aws-sdk')
const Promise = require('bluebird')
const AccountModel = require('./../shared/model/account')

AWS.config.setPromisesDependency(Promise)

module.exports.run = (event, context) => {
  console.log(process.env.SLS_RUN_ARN)
  // read data from accounts
  const sns = new AWS.SNS()

  return AccountModel.getAllScan({
    FilterExpression: 'isActive = :isActive',
    ExpressionAttributeValues: {
      ':isActive': true
    }
  })
    .then((accounts) => {
      return Promise.map(accounts, account => {
        account = JSON.stringify(account)
        console.log(account)
        return sns.publish({
          Message: account,
          TargetArn: process.env.SLS_RUN_ARN
        }).promise()
      }).then(() => {
        context.succeed()
      }).catch(err => {
        context.fail(err)
      })
    })
}
