
/**
 * @api {post} /accounts/:id/functions Populate functions & invocations
 * @apiName Populate
 * @apiVersion 1.0.0
 * @apiDescription Populate test data in database.
 * @apiGroup Populate
 * @apiParam {Number} id Account unique GUID.
 * @apiParamExample {json} Request Params Example:
 *     {
 *       "id": "6beaa4e0-e663-11e7-a4b1-53f92960e92c"
 *     }
 * @apiParam  {Number} daysInPast The difference between current date and minimum possible date for test data generation. If no specified, the default value is 1 day
 * @apiParam  {Number} errorsCoefficient The coefficient of errors for invocations from 0 to 1. 0.5 means that approximately every second invocation will fail. If no specified, the default value is 0.5
 * @apiParam  {String} invocationsMin The minimum possible value of  function invocations. If no specified, the default value is 5
 * @apiParam  {String} invocationsMax The maximum possible value of  function invocations. If no specified, the default value is 10
 * @apiParam  {String} functionsCount The count of functions to populate. If no specified, the default value is 1
 * @apiBodyExample {String} Request Body Example
   {
    "daysInPast": 31,
    "errorsCoefficient": 0.8,
    "invocationsMin":1,
    "invocationsMax":15,
    "functionsCount":25
  }
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 201 Created
*/

/**
 * @api {delete} /accounts/:id/functions Clean up functions and invocations
 * @apiName CleanUp
 * @apiVersion 1.0.0
 * @apiDescription Cleanup data in database.
 * @apiGroup Populate
 * @apiParam {Number} id Account unique GUID.
 * @apiParamExample {json} Request Params Example:
 *     {
 *       "id": "6beaa4e0-e663-11e7-a4b1-53f92960e92c"
 *     }
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 Ok
 [
    {
        "UnprocessedItems": {}
    },
    {
        "UnprocessedItems": {}
    }
]
 */
