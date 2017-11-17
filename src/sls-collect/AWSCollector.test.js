'use strict';

const _ = require('lodash');
const expect = require('chai').expect;
const sinon = require('sinon');
const Promise = require('bluebird');
const proxyquire =  require('proxyquire').noCallThru();
const stub  = require('./AWSCollector.stub.js');
const stubData  = require('./AWSCollector.stub.json');

const PositiveCase1 = stubData.PositiveCase1;

const AWSStub = stub.AWSSDK({
    functions: PositiveCase1.ListLambda.Functions,
    logStreams: PositiveCase1.describeLogStreams.logStreams,
    events: PositiveCase1.filterLogEvents.events});

const AWSCollector = proxyquire('./AWSCollector', { 'aws-sdk': AWSStub });

describe('--- AWSCollector ---', () => {

    describe('Collect', () => {
        let sandbox;
        let collectorSaveStub;

        beforeEach(() => {
            sandbox = sinon.sandbox.create();

        });

        afterEach(() => {
            sandbox.restore();
        });


        describe('Positive test cases', () => {
            it('Should be able to collect correct data', () => {
                const collector = new AWSCollector('12345', {});
                // collectorSaveStub = sandbox.stub(collector, 'save');
                // collectorSaveStub.returns(Promise.resolve());

                return collector
                    .collect()
                    .then((functions) => {

                        console.log('AAAAA', functions);

                    })
            })
        });
    });
});