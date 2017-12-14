'use strict'
// -----------------------------------------------------------------
//                    GET USER
// -----------------------------------------------------------------
/**
 * @api {get} /users/:id Get user
 * @apiName GetUser
 * @apiVersion 1.0.0
 * @apiDescription Get user information by id
 * @apiGroup User
 * @apiHeader {String} Authorization Users access token.
 * @apiHeaderExample {json} Header Example:
      {
        "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6Ijg2Y2NmYTAwLWQzYWUtMTFlNy04ZGM1LTFmNzVkNGE3MWY2NyJ9LCJpYXQiOjE1MTE4MTMzNzMsImV4cCI6MTU0MzM0OTM3M30.ScQ8baHireB2heW8ngoXIdWo9qbZkm-ddEP5mTAzLHc"
      }
 * @apiParam {Number} id Users unique GUID.
 * @apiParamExample {json} Request Params Example:
 *     {
 *       "id": "86ccfa00-d3ae-11e7-8dc5-1f75d4a71f67"
 *     }
 * @apiUse UserResponseParams
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 {
     "_id": "86ccfa00-d3ae-11e7-8dc5-1f75d4a71f67",
     "firstName": "Ihor",
     "lastName": "Fito",
     "email": "igor.genal@techmagic.co",
     "createdAt": 1512991422,
     "updatedAt": 1513905678
 }
 * @apiUse Unauthorized
 * @apiUse Forbidden
 * @apiUse NotFound
 */
// -----------------------------------------------------------------
//                    GET ALL USERS
// -----------------------------------------------------------------

/**
 * @api {get} /users/ Get all users
 * @apiName GetUsers
 * @apiVersion 1.0.0
 * @apiDescription Get information about all active users. Has default pagination, so you will receive just few first users.
 * @apiGroup User
 * @apiHeader {String} Authorization Users access token.
 * @apiHeaderExample {json} Header Example:
 {
   "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6Ijg2Y2NmYTAwLWQzYWUtMTFlNy04ZGM1LTFmNzVkNGE3MWY2NyJ9LCJpYXQiOjE1MTE4MTMzNzMsImV4cCI6MTU0MzM0OTM3M30.ScQ8baHireB2heW8ngoXIdWo9qbZkm-ddEP5mTAzLHc"
 }
 * @apiSuccess (Response fields) {User[]} users Array of users.
 * @apiSuccess (Response fields) {String} lastEvaluatedKey _id of the last received user. If this value isn't null, it's imply that we haven't receive all users.
 * @apiSuccessExample {json} Success Response:
 * HTTP/1.1 200 OK
 {
     "users": [
         {
             "_id": "01572140-de65-11e7-9073-b1b39b2b0abf",
             "firstName": "Ihor",
             "lastName": "Fito",
             "email": "igor.genal@techmagic.co",
             "createdAt": 1512991105364,
             "updatedAt": 1512991105364
         },
         {
             "_id": "be5145f0-de65-11e7-aa0a-334b240eef1b",
             "firstName": "Ihor",
             "lastName": "Fito",
             "email": "igor.genal@techmagic.co",
             "createdAt": 1512991422,
             "updatedAt": 1512991422
         },
         {
             "_id": "86ccfa00-d3ae-11e7-8dc5-1f75d4a71f67",
             "firstName": "Ihor",
             "lastName": "Fito",
             "email": "igor.genal@techmagic.co",
             "createdAt": 1511871670718,
             "updatedAt": 1511871670718
         }
     ],
     "lastEvaluatedKey": null
 }
 * @apiUse Unauthorized
 * @apiUse Forbidden
 */
// -----------------------------------------------------------------
//                    CREATE USER
// -----------------------------------------------------------------

/**
 * @api {post} /users/ Create user
 * @apiName CreateUser
 * @apiVersion 1.0.0
 * @apiDescription Create user
 * @apiGroup User
 * @apiParam {String} email Email of user, where verification email will be send.
 * @apiParam {String} password Password of user, will be hashed on the backend and should be never returned in responses.
 * @apiParam {String} firstName FirstName of user.
 * @apiParam {String} lastName Lastname of user.
 * @apiParamExample {json} Request Body Example:
 {
   "email": "igor.genal@techmagic.co",
   "password": "Password4",
   "firstName": "Ihor",
   "lastName": "Fito"
 }
 * @apiUse UserResponseParams
 * @apiSuccessExample {json} Success Response:
 * HTTP/1.1 201 Created
 {
     "_id": "8ea9bb30-de69-11e7-b0e7-3b963549d5aa",
     "firstName": "Ihor",
     "lastName": "Fito",
     "email": "igor.genal@techmagic.co",
     "createdAt": 1512993060451,
     "updatedAt": 1512993060451
 }
 * @apiUse BadRequest
 */
// -----------------------------------------------------------------
//                    DELETE USER
// -----------------------------------------------------------------

/**
 * @api {delete} /users/:id Delete user
 * @apiName DeleteUser
 * @apiVersion 1.0.0
 * @apiDescription Makes user inactive, so it disappears from all responses and stats.
 * @apiGroup User
 * @apiHeader {String} Authorization Users access token.
 * @apiHeaderExample {json} Header Example:
 {
   "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6Ijg2Y2NmYTAwLWQzYWUtMTFlNy04ZGM1LTFmNzVkNGE3MWY2NyJ9LCJpYXQiOjE1MTE4MTMzNzMsImV4cCI6MTU0MzM0OTM3M30.ScQ8baHireB2heW8ngoXIdWo9qbZkm-ddEP5mTAzLHc"
 }
 * @apiParam {Number} id Users unique GUID.
 * @apiParamExample {json} Request Params Example:
 *     {
 *       "id": "86ccfa00-d3ae-11e7-8dc5-1f75d4a71f67"
 *     }
 * @apiUse UserResponseParams
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 {
     "_id": "86ccfa00-d3ae-11e7-8dc5-1f75d4a71f67",
     "firstName": "Ihor",
     "lastName": "Fito",
     "email": "igor.genal@techmagic.co",
     "createdAt": 1512991706,
     "updatedAt": 1512994728
 }
 * @apiUse Unauthorized
 * @apiUse Forbidden
 */
// -----------------------------------------------------------------
//                    UPDATE USER
// -----------------------------------------------------------------

/**
 * @api {put} /users/:id Update user
 * @apiName UpdateUser
 * @apiVersion 1.0.0
 * @apiDescription Update user fields.
 * @apiGroup User
 * @apiHeader {String} Authorization Users access token.
 * @apiHeaderExample {json} Header Example:
 {
   "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6Ijg2Y2NmYTAwLWQzYWUtMTFlNy04ZGM1LTFmNzVkNGE3MWY2NyJ9LCJpYXQiOjE1MTE4MTMzNzMsImV4cCI6MTU0MzM0OTM3M30.ScQ8baHireB2heW8ngoXIdWo9qbZkm-ddEP5mTAzLHc"
 }
 * @apiParam {Number} id Users unique GUID.
 * @apiParamExample {json} Request Params Example:
 *     {
 *       "id": "86ccfa00-d3ae-11e7-8dc5-1f75d4a71f67"
 *     }
 * @apiParamExample {json} Request Body Example:
 {
     "firstName": "Igor",
     "lastName": "Genal",
     "email": "igor.genal@techmagic.co"
 }
 * @apiUse UserResponseParams
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 {
     "_id": "86ccfa00-d3ae-11e7-8dc5-1f75d4a71f67",
     "firstName": "Igor",
     "lastName": "Genal",
     "email": "igor.genal@techmagic.co",
     "createdAt": 1512991422,
     "updatedAt": 1513012053
 }
 * @apiUse Unauthorized
 * @apiUse Forbidden
 * @apiUse BadRequest
 */
// -----------------------------------------------------------------
//                    CHANGE USER PASSWORD
// -----------------------------------------------------------------

/**
 * @api {put} /users/:id/password Change user password
 * @apiName ChangePassword
 * @apiVersion 1.0.0
 * @apiDescription Update user password.
 * @apiGroup User
 * @apiHeader {String} Authorization Users access token.
 * @apiHeaderExample {json} Header Example:
 {
   "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6Ijg2Y2NmYTAwLWQzYWUtMTFlNy04ZGM1LTFmNzVkNGE3MWY2NyJ9LCJpYXQiOjE1MTE4MTMzNzMsImV4cCI6MTU0MzM0OTM3M30.ScQ8baHireB2heW8ngoXIdWo9qbZkm-ddEP5mTAzLHc"
 }
 * @apiParam {Number} id Users unique GUID.
 * @apiParam {String} password New password of user.
 * @apiParamExample {json} Request Params Example:
 *     {
 *       "id": "86ccfa00-d3ae-11e7-8dc5-1f75d4a71f67"
 *     }
 * @apiParamExample {json} Request Body Example:
 *     {
 *       "password": "HelloTrainingCenter"
 *     }
 * @apiUse UserResponseParams
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 {
     "_id": "86ccfa00-d3ae-11e7-8dc5-1f75d4a71f67",
     "firstName": "Ihor",
     "lastName": "Fito",
     "email": "igor.genal@techmagic.co",
     "createdAt": 1512991422,
     "updatedAt": 1513004802
 }
 * @apiUse Unauthorized
 * @apiUse Forbidden
 * @apiUse BadRequest
 */
// -----------------------------------------------------------------
//                    VERIFY USER
// -----------------------------------------------------------------

/**
 * @api {get} /users/:id/verification/:token Verify user
 * @apiName VerifyUser
 * @apiVersion 1.0.0
 * @apiDescription Makes user active.
 * @apiGroup User
 * @apiParam {Number} id Users unique GUID.
 * @apiParam {String} token Randomly generated 32 length hex sequence
 * @apiParamExample {json} Request Params Example:
 *     {
 *       "id": "86ccfa00-d3ae-11e7-8dc5-1f75d4a71f67",
 *       "token": "f6d34fd632467e8fc85612012b73faad"
 *     }
 * @apiUse UserResponseParams
 * @apiSuccessExample {String} Success-Response:
 * HTTP/1.1 200 OK
 * This api call should redirect on some page (start or auth) at frontend.
 * @apiUse BadRequest
 * @apiUse Gone
 */
// -----------------------------------------------------------------
//                    SEND VERIFICATION EMAIL
// -----------------------------------------------------------------

/**
 * @api {post} /users/:id/email/verification Send verification email
 * @apiName VerificationEmail
 * @apiVersion 1.0.0
 * @apiDescription Send verification email.
 * @apiGroup User
 * @apiParam {Number} id Users unique GUID.
 * @apiParamExample {json} Request Params Example:
 *     {
 *       "id": "86ccfa00-d3ae-11e7-8dc5-1f75d4a71f67"
 *     }
 * @apiSuccessExample {String} Success-Response:
 * HTTP/1.1 204 No Content
 * @apiUse Conflict
 */
// -----------------------------------------------------------------
//                    SEND RESET PASSWORD EMAIL
// -----------------------------------------------------------------

/**
 * @api {post} /users/email/password Send reset password email
 * @apiName ResetPasswordEmail
 * @apiVersion 1.0.0
 * @apiDescription Send reset password email.
 * @apiGroup User
 * @apiParam {String} email Email of user.
 * @apiParamExample {json} Request Body Example:
 {
   "email": "igor.genal@techmagic.co"
 }
 * @apiSuccessExample {String} Success-Response:
 * HTTP/1.1 204 No Content
 * @apiUse Forbidden
 * @apiUse NotFound
 */
// -----------------------------------------------------------------
//                    RESET USER PASSWORD
// -----------------------------------------------------------------

/**
 * @api {post} /users/:id/resetPassword/:token Reset password
 * @apiName ResetPassword
 * @apiVersion 1.0.0
 * @apiDescription Reset user password
 * @apiGroup User
 * @apiParam {Number} id Users unique GUID.
 * @apiParam {String} token Randomly generated 32 length hex sequence
 * @apiParam {String} password New password of user.
 * @apiParamExample {json} Request Params Example:
 *     {
 *       "id": "86ccfa00-d3ae-11e7-8dc5-1f75d4a71f67",
 *       "token": "f6d34fd632467e8fc85612012b73faad"
 *     }
 *@apiParamExample {json} Request Body Example:
 {
    "password": "HelloGuys"
 }
 * @apiUse UserResponseParams
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 {
     "_id": "86ccfa00-d3ae-11e7-8dc5-1f75d4a71f67",
     "firstName": "Ihor",
     "lastName": "Fito",
     "email": "igor.genal@techmagic.co",
     "createdAt": 1512991422,
     "updatedAt": 1513004802
 }
 * @apiUse BadRequest
 * @apiUse Gone
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
 * @apiDefine NotFound
 * @apiError UserNotFound The <code>id</code> of the User was not found.
 * @apiErrorExample {String} UserNotFound:
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
 * @apiDefine UserResponseParams
 * @apiSuccess (Response fields) {String} _id Unique user identificator across all program. Default uuid v1 value.
 * @apiSuccess (Response fields) {String} firstName Firstname of the User.
 * @apiSuccess (Response fields) {String} lastName Lastname of the User.
 * @apiSuccess (Response fields) {String} email Email of the User.
 * @apiSuccess (Response fields) {Timestamp} createdAt The number of seconds between a users creation and the Unix Epoch.
 * @apiSuccess (Response fields) {Timestamp} updatedAt The number of seconds between a users deletion and the Unix Epoch.
 */
