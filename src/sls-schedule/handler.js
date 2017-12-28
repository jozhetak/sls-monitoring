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
      ':isActive': 1
    }
  }).then((accounts) => {
    const promises = []
    accounts.Items.forEach((account) => {
      account = JSON.stringify(account)
      promises.push(sns.publish({
        Message: account,
        TargetArn: process.env.SLS_RUN_ARN
      }).promise())
    })
    return Promise.all(promises)
  }).then(() => {
    context.succeed()
  }).catch(err => {
    context.fail(err)
  })
}
