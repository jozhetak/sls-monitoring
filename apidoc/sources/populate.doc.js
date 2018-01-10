
/**
 * @api {post} accounts/:id/functions?days=:days&errors=:errors&invocations_min=:invocations_min&invocations_max=:invocations_max&functions_count=:functions_count Populate functions & invocations
 * @apiName Populate
 * @apiVersion 1.0.0
 * @apiDescription Populate test data in database.
 * @apiGroup Populate
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
 * @apiParam  {Number} days The difference between current date and minimum possible date for test data generation. If no specified, the default value is 365 days
 * @apiParam  {Number} errors The coefficient of errors for invocations from 0 to 1. 0.5 means that approximately every second invocation will fail. If no specified, the default value is 0.5
 * @apiParam  {String} invocations_min The minimum possible value of  function invocations. If no specified, the default value is 5
 * @apiParam  {String} invocations_max The maximum possible value of  function invocations. If no specified, the default value is 10
 * @apiParam  {String} functions_count The count of functions to populate.
 * @apiParamExample {String} Request Query Example
 {
    days=31&errors=0.6&invocations_min=1&invocations_max=5&functions_count=2
 }
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 201 Created
*/

/**
 * @api {delete} accounts/:id/functions Clean up functions and invocations
 * @apiName CleanUp
 * @apiVersion 1.0.0
 * @apiDescription Cleanup data in database.
 * @apiGroup Populate
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
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 Ok
 {
 [
    {
        "UnprocessedItems": {}
    },
    {
        "UnprocessedItems": {}
    }
]
 }
 */
