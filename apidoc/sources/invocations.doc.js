
/**
 * @api {get} /accounts/:accountId/functions/:functionId/invocations Get invocations list
 * @apiName GetInvocations
 * @apiVersion 1.0.0
 * @apiDescription Get function invocations list
 * @apiGroup Invocation
 * @apiHeader {String} Authorization Users access token.
 * @apiHeaderExample {json} Header Example:
 {
   "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6Ijg2Y2NmYTAwLWQzYWUtMTFlNy04ZGM1LTFmNzVkNGE3MWY2NyJ9LCJpYXQiOjE1MTE4MTMzNzMsImV4cCI6MTU0MzM0OTM3M30.ScQ8baHireB2heW8ngoXIdWo9qbZkm-ddEP5mTAzLHc"
 }
 * @apiParam {String} accountId Account unique GUID.
 * @apiParamExample {json} Request Params Example:
 *     {
 *       "accountId": "4beaa4e0-e663-11e7-a4b1-53f92960e92c",
 *     }
 * @apiParam {String} functionId Function unique GUID.
 * @apiParamExample {json} Request Params Example:
 *     {
 *       "functionId": "5beaa4e0-e663-11e7-a4b1-53f92960e92c"
 *     }
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
    "Items": [
        {
            "timeout": 227,
            "_account": "9a152540-f6b5-11e7-a0b7-9733f07a1164",
            "codeSize": 392090258,
            "_id": "509d9f4c-a3bc-4eb7-8326-807aa01e81dc",
            "memSize": 2112,
            "arn": "arn:aws:lambda:eu-west-2:145654316758:function:program protocol",
            "name": "program protocol"
        },
        {
            "timeout": 121,
            "_account": "9a152540-f6b5-11e7-a0b7-9733f07a1164",
            "codeSize": 64109636,
            "_id": "f58134fa-da82-4bd8-9061-80ffad703761",
            "memSize": 704,
            "arn": "arn:aws:lambda:us-east-1:294129584939:function:input bus",
            "name": "input bus"
        }
    ],
    "Count": 2,
    "ScannedCount": 2
}
 */

/**
 * @api {get}  /accounts/:accountId/functions/:functionId/invocations/:id Get one invocation
 * @apiName GetInvocation
 * @apiVersion 1.0.0
 * @apiDescription Get one function invocation.
 * @apiGroup Invocation
 * @apiHeaderExample {json} Header Example:
 {
   "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6Ijg2Y2NmYTAwLWQzYWUtMTFlNy04ZGM1LTFmNzVkNGE3MWY2NyJ9LCJpYXQiOjE1MTE4MTMzNzMsImV4cCI6MTU0MzM0OTM3M30.ScQ8baHireB2heW8ngoXIdWo9qbZkm-ddEP5mTAzLHc"
 }
 * @apiParam {String} accountId Account unique GUID.
 * @apiParamExample {json} Request Params Example:
 *     {
 *       "accountId": "4beaa4e0-e663-11e7-a4b1-53f92960e92c",
 *     }
 * @apiParam {String} functionId Function unique GUID.
 * @apiParamExample {json} Request Params Example:
 *     {
 *       "functionId": "5beaa4e0-e663-11e7-a4b1-53f92960e92c"
 *     }
 * @apiParam {String} id Invocation unique GUID.
 * @apiParamExample {json} Request Params Example:
 *     {
 *       "id": "6beaa4e0-e663-11e7-a4b1-53f92960e92c"
 *     }
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 Ok
 {
     "timeout": 227,
     "_id": "509d9f4c-a3bc-4eb7-8326-807aa01e81dc",
     "_account": "9a152540-f6b5-11e7-a0b7-9733f07a1164",
     "codeSize": 392090258,
     "memSize": 2112,
     "name": "program protocol",
     "arn": "arn:aws:lambda:eu-west-2:145654316758:function:program protocol"
 }
 */
