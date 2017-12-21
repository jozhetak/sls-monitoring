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
