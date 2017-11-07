/**
 * Created by Mac on 10/28/17.
 */
const uuid = require('uuid');
const AWS = require('aws-sdk');
const Promise = require('bluebird');
const _ = require('lodash');
const model = require('./model');

//const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports = class Invocation extends Model {
    constructor(opts) {
        super(opts);
        // this.data = opts || {};
    }

    static get TABLE () {
        return process.env.INVOCATIONS_TABLE;
    }

    // save() {
    //     const params = {
    //         TableName: process.env.INVOCATIONS_TABLE,
    //         Item: this.data
    //     };
    //
    //     return dynamoDb.put(params).promise()
    //         .then(() => {
    //             return this.data;
    //         });
    // }
    //
    // static getById(id) {
    //     var params = {
    //         TableName : process.env.INVOCATIONS_TABLE,
    //         Key: {
    //             id: id
    //         }
    //     };
    //
    //     var documentClient = new AWS.DynamoDB.DocumentClient();
    //
    //     return documentClient.get(params)
    //         .promise()
    //         .then((data) => {
    //             return data.Item;
    //         })
    // }
}
