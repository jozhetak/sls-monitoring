'use strict'

const sinon = require('sinon')
const proxyquire = require('proxyquire').noCallThru()
const stub = require('./AWSCollector.stub.js')
const stubData = require('./AWSCollector.stub.json')
const chai = require('chai')
const _ = require('lodash')

let AWSStub = {}

chai.should()

describe('--- AWSCollector ---', () => {

  describe('Collect', () => {
    let sandbox
    let collectorSaveStub

    beforeEach(() => {
      sandbox = sinon.sandbox.create()
    })

    afterEach(() => {
      AWSStub = {}
      sandbox.restore()
    })

    it('Should be able to collect correct data', () => {
      const Case1 = stubData.Case1

      AWSStub = stub.AWSSDK({
        ListLambda: Case1.ListLambda,
        describeLogStreams: Case1.describeLogStreams,
        filterLogEvents: Case1.filterLogEvents
      })

      const AWSCollector = proxyquire('./AWSCollector', {'aws-sdk': AWSStub})

      const collector = new AWSCollector('12345', {})

      return collector
        .collect()
        .then((functions) => {
          functions.should.be.instanceof(Array).and.have.lengthOf(2)

          const noLogStreamLambda = _.find(functions,
            f => f.FunctionName === 'Lambda2-no-log-streams')
          noLogStreamLambda.invocations.should.be.instanceof(Array)
            .and
            .have
            .lengthOf(0)

          const lambda = _.find(functions, f => f.FunctionName === 'Lambda1')
          lambda.invocations.should.be.instanceof(Array).and.have.lengthOf(2)
          lambda.CodeSize.should.equal(2000)
          lambda.Timeout.should.equal(120)
          lambda.MemorySize.should.equal(512)
          lambda.Runtime.should.equal('nodejs')

          const invocation1 = lambda.invocations[0]
          const invocation2 = lambda.invocations[1]

          invocation1.should.not.have.property('error')
          invocation1.should.not.have.property('errorType')
          invocation1.logs.should.be.instanceof(Array).and.have.lengthOf(3)
          invocation1.duration.should.equal(207.39)
          invocation1.billedDuration.should.equal(300)
          invocation1.memory.should.equal(1024)
          invocation1.memoryUsed.should.equal(38)

          invocation2.should.not.have.property('error')
          invocation2.should.not.have.property('errorType')
          invocation2.logs.should.be.instanceof(Array).and.have.lengthOf(4)
          invocation2.duration.should.equal(204.49)
          invocation2.billedDuration.should.equal(230)
          invocation2.memory.should.equal(512)
          invocation2.memoryUsed.should.equal(0)
        })
    })

    it('Should correctly collect errors from logs', () => {
      const Case2 = stubData.Case2

      AWSStub = stub.AWSSDK({
        ListLambda: Case2.ListLambda,
        describeLogStreams: Case2.describeLogStreams,
        filterLogEvents: Case2.filterLogEvents
      })

      const AWSCollector = proxyquire('./AWSCollector', {'aws-sdk': AWSStub})

      const collector = new AWSCollector('12345', {})

      return collector
        .collect()
        .then((functions) => {
          functions.should.be.instanceof(Array).and.have.lengthOf(2)

          const lambda1 = _.find(functions,
            f => f.FunctionName === 'Lambda1-errors')
          lambda1.invocations.should.be.instanceof(Array).and.have.lengthOf(3)

          let invocation = lambda1.invocations[0]
          invocation.should.have.property('error')
          invocation.should.have.property('errorType')
          invocation.errorType.should.equal('config')
          invocation.logs.should.be.instanceof(Array).and.have.lengthOf(4)
          invocation.duration.should.equal(120.39)
          invocation.billedDuration.should.equal(150)
          invocation.memory.should.equal(1024)
          invocation.memoryUsed.should.equal(38)

          invocation = lambda1.invocations[1]
          invocation.should.have.property('error')
          invocation.should.have.property('errorType')
          invocation.errorType.should.equal('config')
          invocation.logs.should.be.instanceof(Array).and.have.lengthOf(4)

          invocation = lambda1.invocations[2]
          invocation.should.have.property('error')
          invocation.should.have.property('errorType')
          invocation.errorType.should.equal('config')
          invocation.logs.should.be.instanceof(Array).and.have.lengthOf(4)

          const lambda2 = _.find(functions,
            f => f.FunctionName === 'Lambda2-errors')
          lambda2.invocations.should.be.instanceof(Array).and.have.lengthOf(3)

          invocation = lambda2.invocations[0]
          invocation.should.have.property('error')
          invocation.should.have.property('errorType')
          invocation.errorType.should.equal('config')
          invocation.logs.should.be.instanceof(Array).and.have.lengthOf(4)
          invocation.duration.should.equal(100)
          invocation.billedDuration.should.equal(200)
          invocation.memory.should.equal(1024)
          invocation.memoryUsed.should.equal(38)

          invocation = lambda2.invocations[1]
          invocation.should.have.property('error')
          invocation.should.have.property('errorType')
          invocation.errorType.should.equal('crash')
          invocation.logs.should.be.instanceof(Array).and.have.lengthOf(4)

          invocation = lambda2.invocations[2]
          invocation.should.have.property('error')
          invocation.should.have.property('errorType')
          invocation.errorType.should.equal('error')
          invocation.logs.should.be.instanceof(Array).and.have.lengthOf(4)
        })
    })
  })
})