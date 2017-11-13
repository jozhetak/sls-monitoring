'use strict';

const _ = require('lodash');
const jwt = require('jsonwebtoken');


// Returns a boolean whether or not a user is allowed to call a particular method
// A user with scopes: ['pangolins'] can
// call 'arn:aws:execute-api:ap-southeast-1::random-api-id/dev/GET/pangolins'
const authorizeUser = (userScopes, methodArn) => {
  const hasValidScope = _.some(userScopes, scope => _.endsWith(methodArn, scope));
  return hasValidScope;
};

/**
 * Authorizer functions are executed before your actual functions.
 * @method authorize
 * @param {String} event.authorizationToken - JWT
 * @throws Returns 401 if the token is invalid or has expired.
 * @throws Returns 403 if the token does not have sufficient permissions.
 */
module.exports.handler = (event, context, callback) => {
  console.log('event', event)
  const token = event.authorizationToken || event.headers.Authorization;

  try {
    // Verify JWT
    const decoded = jwt.verify(token, 'JWT_SECRET');
    const user = decoded.user;

    // Checks if the user's scopes allow her to call the current function
    const isAllowed = true// authorizeUser(user.scopes, event.methodArn);

    const effect = isAllowed ? 'Allow' : 'Deny';
    const userId = user._id;
    const authorizerContext = { user: JSON.stringify(user) };
    // Return an IAM policy document for the current endpoint
    const policyDocument = buildIAMPolicy(userId, effect, event.methodArn, authorizerContext);
    console.log('Authorize DONE', policyDocument)
    callback(null, policyDocument);
  } catch (e) {
    callback('Unauthorized'); // Return a 401 Unauthorized response
  }
};



/**
 * Returns an IAM policy document for a given user and resource.
 *
 * @method buildIAMPolicy
 * @param {String} userId - user id
 * @param {String} effect  - Allow / Deny
 * @param {String} resource - resource ARN
 * @param {String} context - response context // must be a string
 * @returns {Object} policyDocument
 */
const buildIAMPolicy = (userId, effect, resource, context) => {
  const policy = {
    principalId: userId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: resource,
        },
      ],
    },
    context,
  };

  console.log('policy', policy)

  return policy;
};
