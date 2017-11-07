/**
 * Created by Mac on 10/28/17.
 */
const uuid = require('uuid');
const AWS = require('aws-sdk');
const Promise = require('bluebird');
const _ = require('lodash');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports = class Model {
    constructor(opts) {
        this.data = opts || {};

        if(!opts.id) {
            this.data.id = uuid.v1();
        }
    }

    save() {
        const params = {
            TableName: this.constructor.TABLE, //process.env.FUNCTIONS_TABLE,
            Item: this.data
        };

        return dynamoDb.put(params).promise()
            .then(() => {
                return this.data;
            });
    }

    static getById(id) {
        var params = {
            TableName : Model.TABLE,
            Key: {
                id: id
            }
        };

        var documentClient = new AWS.DynamoDB.DocumentClient();

        return documentClient.get(params)
            .promise()
            .then((data) => {
                return data.Item;
            })
    }

    static getOne(keyConditionExpression, expressionAttributeValues) {
        const query = {
            TableName: Model.TABLE, // process.env.FUNCTIONS_TABLE,
            IndexName: 'FunctionArnIndex',
            KeyConditionExpression: keyConditionExpression,
            ExpressionAttributeValues: expressionAttributeValues
        };

        return dynamoDb.query(query).promise()
            .then((data) => {
                if (data.Count > 0) {
                    return data.Items[0];
                }

                return null;
            })
    }
}
