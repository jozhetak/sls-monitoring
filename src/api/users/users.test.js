'use strict'

const sinon = require('sinon')
const chai = require('chai')
const users = require('./users')

const UserModel = require('../../shared/model/user')
// const helper = require('./user.helper')
// const uuid = require('uuid')
// const passport = require('../passport/passport')
// const errors = require('../../shared/helper/errors')
// const dtoUser = require('../../shared/user.dto')
// const responses = require('../../shared/helper/responses')
// const emailService = require('../../shared/helper/email.service')
// const hour = 360000

chai.should()
describe('users', () => {
  describe('create', () => {
    let sandbox
    beforeEach(() => {
      sandbox = sinon.sandbox.create()
    })

    afterEach(() => {
      sandbox.restore()
    })
    it('should create user', (done) => {
      done()
    })
  })

  describe('resetPassword', () => {
    let sandbox
    afterEach(() => {
      sandbox.restore()
    })
    describe('should reset password', () => {
      before((done) => {
        sandbox = sinon.createSandbox()
        sandbox.stub(UserModel, 'getActiveByIdrOrThrow').withArgs(1).resolves({
          _id: 1,
          resetPasswordTokenExpires: Date.now() + 3600,
          resetPasswordToken: 'token'
        })
        sandbox.stub(UserModel, 'update').resolves({
          _id: 1
        })
        done()
      })
      it('check calls', (done) => {
        users.resetPassword({
          pathParameters: {
            id: 1,
            token: 'token'
          },
          body: JSON.stringify({
            password: '12345678'
          })
        }, null, (err, response) => {
          response.statusCode.should.be.equal(200)
          done()
        })
      })

      // done()
    })
  })
})
