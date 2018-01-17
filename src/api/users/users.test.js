/* eslint-disable no-undef */
'use strict'

const sinon = require('sinon')
const chai = require('chai')
const users = require('./users')

const UserModel = require('../../shared/model/user')
const emailService = require('../../shared/helper/email.service')

chai.should()
describe('users', () => {
  describe('create', () => {
    describe('should create user without errors', () => {
      let sandbox
      before((done) => {
        sandbox = sinon.sandbox.create()
        sandbox.stub(UserModel.prototype, 'save').resolves({
          _id: 1,
          email: 'test@test.test',
          firstName: 'jon',
          lastName: 'doe'
        })
        sandbox.stub(emailService, 'sendVerificationEmail').resolves(true)
        sandbox.stub(UserModel, 'getByEmail').resolves(false)
        done()
      })
      after(() => {
        sandbox.restore()
      })
      it('should create user', (done) => {
        users.create({
          body: JSON.stringify({
            firstName: 'jon',
            lastName: 'doe',
            email: 'test@test.com',
            password: '12345678'
          })
        }, null, (err, response) => {
          console.log(response)
          response.statusCode.should.be.equal(201)
          done()
        })
      })
    })
  })

  describe('resetPassword', () => {
    describe('should reset password', () => {
      let sandbox
      after(() => {
        sandbox.restore()
      })
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
    })
  })
})
