/**
 * Created by Mac on 10/28/17.
 */
const uuid = require('uuid');
const AWS = require('aws-sdk');
const Promise = require('bluebird');
const _ = require('lodash');

//const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports = class Function extends Model {
    constructor(opts) {
        super(opts);
    }

    static get TABLE () {
        return process.env.FUNCTIONS_TABLE;
    }

    // save() {
    //     const params = {
    //         TableName: process.env.FUNCTIONS_TABLE,
    //         Item: this.data
    //     };
    //
    //     return dynamoDb.put(params).promise()
    //         .then(() => {
    //             return this.data;
    //         });
    // }
    //
    // static getOne(keyConditionExpression, expressionAttributeValues) {
    //     const query = {
    //         TableName:  process.env.FUNCTIONS_TABLE,
    //         IndexName: 'FunctionArnIndex',
    //         KeyConditionExpression: keyConditionExpression,
    //         ExpressionAttributeValues: expressionAttributeValues
    //     };
    //
    //     return dynamoDb.query(query).promise()
    //         .then((data) => {
    //             if (data.Count > 0) {
    //                 return data.Items[0];
    //             }
    //
    //             return null;
    //         })
    // }
}
