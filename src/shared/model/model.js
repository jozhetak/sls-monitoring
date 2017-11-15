/**
 * Created by Mac on 10/28/17.
 */
const uuid = require('uuid');
const AWS = require('aws-sdk');
const Promise = require('bluebird');
const _ = require('lodash');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports = class Model {
  // const schema = {
  //   _id: 'S',
  //   firstName: 'S',
  //   lastName: 'S'
  // }

  static getUpdateCondition(params) {
    const timestamp = new Date().getTime();
    let UpdateExpression = 'SET ';
    const ExpressionAttributeValues = {
      ':updatedAt' : timestamp
    }
    _.forOwn(params, (value, key) => {
      UpdateExpression += key + ' = ' + ':' + key + ', ';
      ExpressionAttributeValues[':' + key] = value
    })
    UpdateExpression += 'updatedAt = :updatedAt';
    return {
      ExpressionAttributeValues: ExpressionAttributeValues,
      UpdateExpression: UpdateExpression
    }
  }

    constructor(opts) {
        this.data = opts || {};

        if(!opts.id) {
            this.data.id = uuid.v1();
        }
    }

    static get TABLE () {
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
            TableName : this.TABLE,
            Key: {
                _id: id
            }
        };

        var documentClient = new AWS.DynamoDB.DocumentClient();

        return documentClient.get(params)
            .promise()
            .then((data) => {
                return data.Item;
            })
    }

    static getAll(keyConditionExpression, expressionAttributeValues) {
      const query = {
        TableName: this.TABLE, // process.env.FUNCTIONS_TABLE,
        KeyConditionExpression: keyConditionExpression,
        ExpressionAttributeValues: expressionAttributeValues
      };

      return dynamoDb.query(query).promise()
        .then((data) => {
          return data.Items;
        })
    }

    static getOne(keyConditionExpression, expressionAttributeValues) {
        const query = {
            TableName: this.TABLE, // process.env.FUNCTIONS_TABLE,
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

    static update(id, data) {
      const {ExpressionAttributeValues, UpdateExpression} = this.getUpdateCondition(data)
      const params = {
        TableName: this.TABLE,
        Key: {
          _id: id,
        },
        ExpressionAttributeValues: ExpressionAttributeValues,
        UpdateExpression: UpdateExpression
      };
      return dynamoDb.update(params).promise()
        .then((data) => {
          if (data) {
            return data;
          }
          return null;
        })
    }
}
