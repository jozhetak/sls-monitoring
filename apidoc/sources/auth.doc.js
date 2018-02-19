/**
* @api {post} /signIn Sign in into the system
* @apiName Signin
* @apiVersion 1.0.0
* @apiDescription Get authorization token to perform requests.
* @apiGroup Authorization
* @apiParam {String} email Email of user.
* @apiParam {String} password Password of user.
* @apiParamExample {json} Request Params Example:
  *     {
*       "email": "igor.genal@techmagic.co"
*       "password": "Password4"
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
  "updatedAt": 1513905678,
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6ImZhYzQ2MDAwLWUxMDEtMTFlNy04OGM3LTk3MzQyZjRiNmFkNyJ9LCJpYXQiOjE1MTMyODA2NjYsImV4cCI6MTU0NDgxNjY2Nn0.pyczLauspgXM5HbCF5IdPfx7ZU1bvsOFoyxc2JHmGs8"
}
* @apiUse NotFound
* @apiUse BadRequest
 */

/**
 * @apiDefine NotFound
 * @apiError UserNotFound The <code>id</code> of the User was not found.
 * @apiErrorExample {String} UserNotFound:
 HTTP/1.1 404 Not Found
 NOT_FOUND
 */

/**
 * @apiDefine BadRequest
 * @apiError BadRequest The request parameters is <code>invalid</code>.
 *@apiErrorExample {String} BadRequest:
 HTTP/1.1 400  Bad Request
 */
