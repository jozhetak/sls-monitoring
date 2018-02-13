// -----------------------------------------------------------------
//                    GET Account
// -----------------------------------------------------------------
/**
 * @api {get} /accounts/:id Get account
 * @apiName GetAccount
 * @apiVersion 1.0.0
 * @apiDescription Get account information by id
 * @apiGroup Account
 * @apiHeader {String} Authorization Users access token.
 * @apiHeaderExample {json} Header Example:
 {
   "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6Ijg2Y2NmYTAwLWQzYWUtMTFlNy04ZGM1LTFmNzVkNGE3MWY2NyJ9LCJpYXQiOjE1MTE4MTMzNzMsImV4cCI6MTU0MzM0OTM3M30.ScQ8baHireB2heW8ngoXIdWo9qbZkm-ddEP5mTAzLHc"
 }
 * @apiParam {Number} id Account unique GUID.
 * @apiParamExample {json} Request Params Example:
 *     {
 *       "id": "6beaa4e0-e663-11e7-a4b1-53f92960e92c"
 *     }
 * @apiUse AccountResponseParams
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 {
    "_id": "6beaa4e0-e663-11e7-a4b1-53f92960e92c",
    "name": "Techmagic",
    "key": "qwe1qwe1qwe1qwe1qwe1qwe1",
    "secret": "rty1",
    "region": "eu-central-1",
    "createdAt": 1513870034477,
    "updatedAt": 1513870034477,
    "isActive": 1,
    "_user": "86ccfa00-d3ae-11e7-8dc5-1f75d4a71f67"
}
 * @apiUse Unauthorized
 * @apiUse Forbidden
 * @apiUse NotFound
 */

// -----------------------------------------------------------------
//                    GET ALL Accounts
// -----------------------------------------------------------------
/**
 * @api {get} /accounts Get accounts
 * @apiName GetAccounts
 * @apiVersion 1.0.0
 * @apiDescription Get information about all active accounts.
 * @apiGroup Account
 * @apiHeader {String} Authorization Users access token.
 * @apiHeaderExample {json} Header Example:
 {
   "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6Ijg2Y2NmYTAwLWQzYWUtMTFlNy04ZGM1LTFmNzVkNGE3MWY2NyJ9LCJpYXQiOjE1MTE4MTMzNzMsImV4cCI6MTU0MzM0OTM3M30.ScQ8baHireB2heW8ngoXIdWo9qbZkm-ddEP5mTAzLHc"
 }
 * @apiSuccess (Response fields) {Account[]} accounts Array of accounts.
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 [
 {
     "_id": "6beaa4e0-e663-11e7-a4b1-53f92960e92c",
     "name": "Techmagic",
     "key": "qwe1qwe1qwe1qwe1qwe1qwe1",
     "secret": "rty1",
     "region": "eu-central-1",
     "createdAt": 1513870034477,
     "updatedAt": 1513870034477,
     "_user": "86ccfa00-d3ae-11e7-8dc5-1f75d4a71f67"
 }
 ]
 * @apiUse Unauthorized
 * @apiUse Forbidden
 */

// -----------------------------------------------------------------
//                    CREATE ACCOUNT
// -----------------------------------------------------------------
/**
 * @api {post} /accounts/ Create account
 * @apiName CreateAccount
 * @apiVersion 1.0.0
 * @apiDescription Create account
 * @apiGroup Account
 * @apiHeader {String} Authorization Users access token.
 * @apiHeaderExample {json} Header Example:
 {
   "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6Ijg2Y2NmYTAwLWQzYWUtMTFlNy04ZGM1LTFmNzVkNGE3MWY2NyJ9LCJpYXQiOjE1MTE4MTMzNzMsImV4cCI6MTU0MzM0OTM3M30.ScQ8baHireB2heW8ngoXIdWo9qbZkm-ddEP5mTAzLHc"
 }
 * @apiParam  {String} name Account name.
 * @apiParam  {String} key AWS Access Key.
 * @apiParam  {String} secret AWS Secret for access key.
 * @apiParam  {String} region AWS region.
 * @apiParamExample {json} Request Body Example:
 {
   "name": "Techmagic",
   "key": "qwe1qwe1qwe1qwe1qwe1qwe1",
   "secret": "rty1",
   "region": "eu-central-1"
 }
 * @apiUse AccountResponseParams
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 201 Created
 {
     "_id": "1d72b840-e710-11e7-b0cc-77a5cace9bc4",
     "name": "Techmagic",
     "key": "qwe1qwe1qwe1qwe1qwe1qwe1",
     "secret": "rty1",
     "region": "eu-central-1",
     "createdAt": 1513944205764,
     "updatedAt": 1513944205764,
     "isActive": 1,
     "_user": "86ccfa00-d3ae-11e7-8dc5-1f75d4a71f67"
 }
 * @apiUse Unauthorized
 * @apiUse Forbidden
 * @apiUse AccountNotFound
 */

// -----------------------------------------------------------------
//                    UPDATE ACCOUNT
// -----------------------------------------------------------------
/**
 * @api {put} /accounts/:id Update account
 * @apiName UpdateAccount
 * @apiVersion 1.0.0
 * @apiDescription Update account
 * @apiGroup Account
 * @apiHeader {String} Authorization Users access token.
 * @apiHeaderExample {json} Header Example:
 {
   "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6Ijg2Y2NmYTAwLWQzYWUtMTFlNy04ZGM1LTFmNzVkNGE3MWY2NyJ9LCJpYXQiOjE1MTE4MTMzNzMsImV4cCI6MTU0MzM0OTM3M30.ScQ8baHireB2heW8ngoXIdWo9qbZkm-ddEP5mTAzLHc"
 }
 * @apiParam {Number} id Account unique GUID.
 * @apiParamExample {json} Request Params Example:
 *     {
 *       "id": "6beaa4e0-e663-11e7-a4b1-53f92960e92c"
 *     }
 * @apiParam  {String} name Account name.
 * @apiParam  {String} key AWS Access Key.
 * @apiParam  {String} secret AWS Secret for access key.
 * @apiParam  {String} region AWS region.
 * @apiParamExample {json} Request Body Example:
 {
   "name": "Techmagic",
   "key": "qwe1qwe1qwe1qwe1qwe1qwe1",
   "secret": "rty1",
   "region": "eu-central-1"
 }
 * @apiUse AccountResponseParams
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 {
     "_id": "1d72b840-e710-11e7-b0cc-77a5cace9bc4",
     "name": "Techmagic",
     "key": "qwe1qwe1qwe1qwe1qwe1qwe1",
     "secret": "rty1",
     "region": "eu-central-1",
     "createdAt": 1513944205764,
     "updatedAt": 1513944205764,
     "isActive": 1,
     "_user": "86ccfa00-d3ae-11e7-8dc5-1f75d4a71f67"
 }
 * @apiUse Unauthorized
 * @apiUse Forbidden
 * @apiUse AccountNotFound
 */

// -----------------------------------------------------------------
//                    INVITE USERS INTO ACCOUNT
// -----------------------------------------------------------------
/**
 * @api {post} /accounts/:id/users Invite users
 * @apiName InviteUsers
 * @apiVersion 1.0.0
 * @apiDescription Invite users into account
 * @apiGroup Account
 * @apiHeader {String} Authorization Users access token.
 * @apiHeaderExample {json} Header Example:
 {
   "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6Ijg2Y2NmYTAwLWQzYWUtMTFlNy04ZGM1LTFmNzVkNGE3MWY2NyJ9LCJpYXQiOjE1MTE4MTMzNzMsImV4cCI6MTU0MzM0OTM3M30.ScQ8baHireB2heW8ngoXIdWo9qbZkm-ddEP5mTAzLHc"
 }
 * @apiParam {Number} id Account unique GUID.
   * @apiParamExample {json} Request Params Example:
   *     {
   *       "id": "6beaa4e0-e663-11e7-a4b1-53f92960e92c"
   *     }
 * @apiParam  {String} _users Array of users id.
 * @apiParamExample {json} Request Body Example:
{
"_users": ["86ccfa00-d3ae-11e7-8dc5-1f75d4a71f67"]
}
 // * @apiUse AccountResponseParams
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 [
 {
     "_user": "86ccfa00-d3ae-11e7-8dc5-1f75d4a71f67",
     "_account": "6beaa4e0-e663-11e7-a4b1-53f92960e92c",
     "isAdmin": false,
     "_id": "ba5316f0-e710-11e7-9657-c149dea0905e"
 }
 ]
 * @apiUse Unauthorized
 * @apiUse Forbidden
 * @apiUse AccountNotFound
 */
// -----------------------------------------------------------------
//                    INVITE USER INTO ACCOUNT BY EMAIL
// -----------------------------------------------------------------
/**
 * @api {post} /accounts/:id/user Invite users
 * @apiName InviteUsers
 * @apiVersion 1.0.0
 * @apiDescription Invite users into account
 * @apiGroup Account
 * @apiHeader {String} Authorization Users access token.
 * @apiHeaderExample {json} Header Example:
 {
   "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6Ijg2Y2NmYTAwLWQzYWUtMTFlNy04ZGM1LTFmNzVkNGE3MWY2NyJ9LCJpYXQiOjE1MTE4MTMzNzMsImV4cCI6MTU0MzM0OTM3M30.ScQ8baHireB2heW8ngoXIdWo9qbZkm-ddEP5mTAzLHc"
 }
 * @apiParam {Number} id Account unique GUID.
 * @apiParamExample {json} Request Params Example:
 *     {
   *       "id": "6beaa4e0-e663-11e7-a4b1-53f92960e92c"
   *     }
 * @apiParam  {String} email user email.
 * @apiParamExample {json} Request Body Example:
 {
  "email": "dmytro.kucheryavenko@techmagic.co",
 }
 // * @apiUse AccountResponseParams
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 {
    "_account": "42a3fb70-10b8-11e8-9f6b-679b5b428256",
    "_user": "58c541f0-10ce-11e8-a161-edf22960cb51",
    "firstName": "DmytroK",
    "lastName": "Kucheryavenko",
    "email": "dmytro.kucheryavenko+6@techmagic.co",
    "isAdmin": false
  }
 * @apiUse Unauthorized
 * @apiUse Forbidden
 * @apiUse AccountNotFound
 */

// -----------------------------------------------------------------
//                    GET ACCOUNT USERS
// -----------------------------------------------------------------
/**
 * @api {get} /accounts/:id/users Get account users
 * @apiName GetAccountUsers
 * @apiVersion 1.0.0
 * @apiDescription Get users of account
 * @apiGroup Account
 * @apiHeader {String} Authorization Users access token.
 * @apiHeaderExample {json} Header Example:
 {
   "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6Ijg2Y2NmYTAwLWQzYWUtMTFlNy04ZGM1LTFmNzVkNGE3MWY2NyJ9LCJpYXQiOjE1MTE4MTMzNzMsImV4cCI6MTU0MzM0OTM3M30.ScQ8baHireB2heW8ngoXIdWo9qbZkm-ddEP5mTAzLHc"
 }
 * @apiParam {Number} id Account unique GUID.
 * @apiParamExample {json} Request Params Example:
 *     {
 *       "id": "6beaa4e0-e663-11e7-a4b1-53f92960e92c"
 *     }
 // * @apiUse AccountResponseParams
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 [
 {
     "_user": {
         "firstName": "Taras",
         "lastName": "Buchko",
         "createdAt": 1512991422,
         "password": "70ccd9007338d6d81dd3b6271621b9cf9a97ea00",
         "verificationToken": "61d763885d3f54a41061f54992f80040",
         "verificationTokenExpires": 1612991422,
         "_id": "86ccfa00-d3ae-11e7-8dc5-1f75d4a71f68",
         "isActive": 1,
         "email": "adminl@techmagic.co",
         "updatedAt": 1512991422
     },
     "isAdmin": false,
     "_id": "82e45390-e685-11e7-9adb-8b6d5ba9a9e6",
     "_account": "6beaa4e0-e663-11e7-a4b1-53f92960e92c"
 }
 ]
 * @apiUse Unauthorized
 * @apiUse Forbidden
 * @apiUse AccountNotFound
 */

// -----------------------------------------------------------------
//                    UPDATE ACCOUNT USERS
// -----------------------------------------------------------------
/**
 * @api {put} /accounts/:accountId/users/:id Update account users
 * @apiName UpdateAccountUsers
 * @apiVersion 1.0.0
 * @apiDescription Update user of account
 * @apiGroup Account
 * @apiHeader {String} Authorization Users access token.
 * @apiHeaderExample {json} Header Example:
 {
   "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6Ijg2Y2NmYTAwLWQzYWUtMTFlNy04ZGM1LTFmNzVkNGE3MWY2NyJ9LCJpYXQiOjE1MTE4MTMzNzMsImV4cCI6MTU0MzM0OTM3M30.ScQ8baHireB2heW8ngoXIdWo9qbZkm-ddEP5mTAzLHc"
 }
 * @apiParam {Number} accountId Account unique GUID.
 * @apiParam {Number} id Users unique GUID.
 * @apiParamExample {json} Request Params Example:
 *     {
 *       "accountId": "6beaa4e0-e663-11e7-a4b1-53f92960e92c"
 *       "id": "86ccfa00-d3ae-11e7-8dc5-1f75d4a71f67"
 *     }
 * @apiParamExample {json} Request Body Example:
 {
   "isAdmin": true
 }
 // * @apiUse AccountResponseParams
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 {
     "_user": "86ccfa00-d3ae-11e7-8dc5-1f75d4a71f67",
     "_account": "6beaa4e0-e663-11e7-a4b1-53f92960e92c",
     "isAdmin": true,
     "_id": "dacf4510-e70c-11e7-8dd7-5fac8fcb80fe"
 }
 * @apiUse Unauthorized
 * @apiUse Forbidden
 * @apiUse AccountNotFound
 */

// -----------------------------------------------------------------
//                    DELETE ACCOUNT USERS
// -----------------------------------------------------------------
/**
 * @api {delete} /accounts/:accountId/users/:id Delete account users
 * @apiName DeleteAccountUsers
 * @apiVersion 1.0.0
 * @apiDescription Delete user of account
 * @apiGroup Account
 * @apiHeader {String} Authorization Users access token.
 * @apiHeaderExample {json} Header Example:
 {
   "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6Ijg2Y2NmYTAwLWQzYWUtMTFlNy04ZGM1LTFmNzVkNGE3MWY2NyJ9LCJpYXQiOjE1MTE4MTMzNzMsImV4cCI6MTU0MzM0OTM3M30.ScQ8baHireB2heW8ngoXIdWo9qbZkm-ddEP5mTAzLHc"
 }
 * @apiParam {Number} accountId Account unique GUID.
 * @apiParam {Number} id Users unique GUID.
 * @apiParamExample {json} Request Params Example:
 *     {
 *       "accountId": "6beaa4e0-e663-11e7-a4b1-53f92960e92c"
 *       "id": "86ccfa00-d3ae-11e7-8dc5-1f75d4a71f67"
 *     }
 // * @apiUse AccountResponseParams
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 {
     "Attributes": {
         "_user": "86ccfa00-d3ae-11e7-8dc5-1f75d4a71f67",
         "isAdmin": true,
         "_id": "dacf4510-e70c-11e7-8dd7-5fac8fcb80fe",
         "_account": "6beaa4e0-e663-11e7-a4b1-53f92960e92c"
     }
 }
 * @apiUse Unauthorized
 * @apiUse Forbidden
 * @apiUse AccountNotFound
 */
// -----------------------------------------------------------------
//                    DELETE ACCOUNT
// -----------------------------------------------------------------
/**
 * @api {delete} /accounts/:id Delete account
 * @apiName DeleteAccount
 * @apiVersion 1.0.0
 * @apiDescription Delete account
 * @apiGroup Account
 * @apiHeader {String} Authorization Users access token.
 * @apiHeaderExample {json} Header Example:
 {
   "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6Ijg2Y2NmYTAwLWQzYWUtMTFlNy04ZGM1LTFmNzVkNGE3MWY2NyJ9LCJpYXQiOjE1MTE4MTMzNzMsImV4cCI6MTU0MzM0OTM3M30.ScQ8baHireB2heW8ngoXIdWo9qbZkm-ddEP5mTAzLHc"
 }
 * @apiParam {Number} id Account unique GUID.
 * @apiParamExample {json} Request Params Example:
 *     {
 *       "id": "6beaa4e0-e663-11e7-a4b1-53f92960e92c"
 *     }
 * @apiParam  {String} name Account name.
 * @apiParam  {String} key AWS Access Key.
 * @apiParam  {String} secret AWS Secret for access key.
 * @apiParam  {String} region AWS region.
 * @apiParamExample {json} Request Body Example:
 {
   "name": "Techmagic",
   "key": "qwe1qwe1qwe1qwe1qwe1qwe1",
   "secret": "rty1",
   "region": "eu-central-1"
 }
 * @apiUse AccountResponseParams
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 {
     "_id": "1d72b840-e710-11e7-b0cc-77a5cace9bc4",
     "name": "Techmagic",
     "key": "qwe1qwe1qwe1qwe1qwe1qwe1",
     "secret": "rty1",
     "region": "eu-central-1",
     "createdAt": 1513944205764,
     "updatedAt": 1513944205764,
     "isActive": 1,
     "_user": "86ccfa00-d3ae-11e7-8dc5-1f75d4a71f67"
 }
 * @apiUse Unauthorized
 * @apiUse Forbidden
 * @apiUse AccountNotFound
 */
// -----------------------------------------------------------------
//                    DEFINES
// -----------------------------------------------------------------
/**
 * @apiDefine Unauthorized
 * @apiError Unauthorized The <code>Authorization</code> filed of the User was not found in header, or token was invalid.
 * @apiErrorExample {String} Unauthorized:
 HTTP/1.1 401 Not Authenticated
 UNAUTHORIZED
 */

/**
 * @apiDefine AccountNotFound
 * @apiError AccountNotFound The <code>id</code> of the Account was not found.
 * @apiErrorExample {String} AccountNotFound:
 HTTP/1.1 404 Not Found
 NOT_FOUND
 */

/**
 * @apiDefine Forbidden
 * @apiError Forbidden User is authorized, but <code>not permitted</code> to perform the requested operation
 * @apiErrorExample {String} Forbidden:
 HTTP/1.1 403 Forbidden
 FORBIDDEN
 */

/**
 * @apiDefine BadRequest
 * @apiError BadRequest The request parameters is <code>invalid</code>.
 *@apiErrorExample {String} BadRequest:
 HTTP/1.1 400  Bad Request
 */

/**
 * @apiDefine Gone
 * @apiError Gone Requested resource is no longer available and will not be available again
 * @apiErrorExample {String} Gone:
 HTTP/1.1 410 Gone
 Gone
 */

/**
 * @apiDefine Conflict
 * @apiError Conflict The request could not be completed due to a conflict with the current state of the resource
 * @apiErrorExample {String} Conflict:
 HTTP/1.1 409 Conflict
 Conflict
 */

/**
 * @apiDefine AccountResponseParams
 * @apiSuccess (Response fields) {String} _id Unique account identificator across all program. Default uuid v1 value.
 * @apiSuccess (Response fields) {String} name Account name.
 * @apiSuccess (Response fields) {String} key AWS Access Key.
 * @apiSuccess (Response fields) {String} secret AWS Secret for access key.
 * @apiSuccess (Response fields) {String} region AWS region.
 * @apiSuccess (Response fields) {String} _user Account creator.
 * @apiSuccess (Response fields) {Timestamp} createdAt The number of seconds between a users creation and the Unix Epoch.
 * @apiSuccess (Response fields) {Timestamp} updatedAt The number of seconds between a users deletion and the Unix Epoch.
 */
