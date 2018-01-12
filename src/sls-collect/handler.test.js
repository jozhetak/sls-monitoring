'use strict'
const sinon = require('sinon')
const chai = require('chai')
const expect = require('chai').expect
chai.should()

const handler = require('./handler')
class MockLambdaContext {
  constructor () {
    this.succeed = sinon.stub()
    this.fail = sinon.stub()
  }
  reset () {
    this.succeed.reset()
    this.fail.reset()
  }
}
describe('sls-collect.handler', () => {
  describe('Run Lambda Func', function () {
    let ctx
    before(function () {
      ctx = new MockLambdaContext()
    })
    describe('When params are wrong', function () {
      before(function () {
        handler.run({someParam: 10}, ctx)
      })
      it('should fail with Wrong Event Params', function () {
        expect(ctx.fail.calledWith('Wrong Event Params')).to.equal(true)
      })
      after(function () {
        ctx.reset()
      })
    })
  })
  describe('getParamsFromEvent', function () {
    describe('When params are wrong', function () {
      it('should fail with Wrong Event Params', function () {
        expect(() => handler.getParamsFromEvent({})).to.throw(Error)
      })
    })
  })
})
