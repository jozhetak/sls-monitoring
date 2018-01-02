'use strict'

const sinon = require('sinon')
const chai = require('chai')
const users = require('./users')
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
})
