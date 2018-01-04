'use strict'
const chai = require('chai')
const assert = require('assert')

const Model = require('./model')

chai.should()
describe('model', () => {
  describe('constructor', () => {
    it('should be created object', () => {
      const obj = new Model({
        arg1: 1,
        arg2: 2
      })
      console.log(obj)
      obj.data.arg1.should.be.equal(1)
      obj.data.arg2.should.be.equal(2)
      assert(obj.data._id.should.exist)
    })
  })
})
