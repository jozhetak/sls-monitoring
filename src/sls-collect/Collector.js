const AWS = require('aws-sdk')
const Promise = require('bluebird')
const FunctionModel = require('../shared/model/function')
const InvocationModel = require('../shared/model/invocation')

module.exports = class Collector {
  constructor (accountId) {
    this.accountId = accountId
  }

  save (functions) {
    AWS.config.update({
      accessKeyId: process.env.ACCESS_KEY_ID,
      secretAccessKey: process.SECRET_ACCESS_KEY
    })

    const that = this

    return Promise.each(functions, func => {
      return that._updateFunction(func)
        .then((result) => {
          return that._updateInvocations(result.functionInstance,
            result.invocations)
        })
    })
  }

  _updateInvocations (funcInstance, invocations) {
    //var invocations = funcInstance.invocations;

    return Promise.each(invocations, invocation => {
      return InvocationModel
        .getById(invocation.id)
        .then(invocationDao => {
          if (!invocationDao) {
            invocation.functionId = funcInstance.id
            invocation.accountId = funcInstance.accountId
            const invocationInstance = new InvocationModel(invocation)
            return invocationInstance.save()
          }
        })
    })
  };

  _updateFunction (func) {
    const that = this

    return FunctionModel
      .getOne('arn = :arn', {':arn': func.FunctionArn})
      .then(funcDao => {
        if (funcDao) {
          funcDao.name = func.FunctionName
          funcDao.codeSize = func.CodeSize
          funcDao.timeout = func.Timeout
          funcDao.memSize = func.MemorySize
        } else {
          funcDao = {
            accountId: that.accountId,
            name: func.FunctionName,
            arn: func.FunctionArn,
            codeSize: func.CodeSize,
            timeout: func.Timeout,
            memSize: func.MemorySize
          }
        }
        const funcInstance = new FunctionModel(funcDao)
        return funcInstance.save()

      })
      .then(funcInstance => {
        return {
          functionInstance: funcInstance,
          invocations: func.invocations
        }
      })
  }
}