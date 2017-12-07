/**
 * @apiDefine Create User Validation
 * @apiExample {js} Joi Validation
 * joi.object().keys({
   _id: joi.string().guid(),
  firstName: joi.string(),
  lastName: joi.string(),
  email: joi.string().email(),
  password: joi.string(),
  createdAt: joi.date().forbidden(),
  updatedAt: joi.date().forbidden()
})
 */
/**
 * @apiDefine Create User Validation
 * @apiExample {js} Joi Validation
 * joi.object().keys({
   _id: joi.string().guid(),
  firstName: joi.string(),
  lastName: joi.string(),
  email: joi.string().email(),
  password: joi.string(),
  createdAt: joi.date().forbidden(),
  updatedAt: joi.date().forbidden()
})
 */
/**
 * @apiDefine Edit User Validation
 * @apiExample {js} Joi Validation
 *
 joi.object().keys({
  _id: joi.string().guid(),
  firstName: joi.string(),
  lastName: joi.string(),
  email: joi.string().email(),
  password: joi.string(),
  createdAt: joi.date().forbidden(),
  updatedAt: joi.date().forbidden()
})
 */

/**
 * @api {post} /users Create user
 * @apiName Create User
 * @apiDescription Create company and company admin
 * @apiGroup User
 * @apiUse Create User Validation
 * @apiParamExample {json} Request-Example:
 *  {
 *    "email": "igor.genal@techmagic.co",
 *    "password": "Password4",
 *    "firstName": "Ihor",
 *    "lastName": "Fito"
 *  }

 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 201 Created
 {
     "_id": "a5ef7a40-d5c8-11e7-9162-11abbe0b136d", //It's just for example, you will 100% receive other GUID
     "firstName": "Ihor",
     "lastName": "Fito",
     "email": "igor.genal@techmagic.co",
     "createdAt": 1512044341220,
     "updatedAt": 1512044341220
 }
 * @apiErrorExample {json} Bad Request:
 {
   "code": 400,
   "error": "BAD_REQUEST",
   "message": "\"password\" is required; "
 }
 */

/** ---------------------------------------------------------------------------------------------------------------------------------- **/

/**
 * @api {post} /company/:companyId/user Invite user(s) to company
 * @apiName PostCompanyUsers
 * @apiDescription Invite not admins to the company
 * @apiGroup Company
 * @apiUse validateInviteUsersToCompany
 * @apiParamExample {json} Request-Example:
 [{
    "firstName": "nikita",
    "lastName": "pankiv",
    "email": "nikita@techmagic.co",
    "country": "france",
    "lang": "french",
    "postcode": "12345",
    "extraInformation": [{"title": "Info", description: "something about user"}], // optional
    "isCompanyAdmin": true, // optional
    "password": "********" // only if isCompanyAdmin = true
 }]

 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 [{
    "_id": "592b3eef97c0ba1a8ac5213b",
    "isCompanyAdmin": false,
    "isSysAdmin": false,
    "email": "nikita@techmagic.co"
    "_company": "592b3eef97c0ba1a8ac52qqq"
    "country": "france", // optional
    "lang": "french", // optional
    "postcode": "12345", // optional
    "extraInformation": [{"title": "Info", description: "something about user"}], // optional
    "isCompanyAdmin": true, // optional
 }]
 * @apiErrorExample {json} FORBIDDEN:
 {
   "code": 403,
   "error": "FORBIDDEN",
   "message": "FORBIDDEN"
 }
 */

/** ---------------------------------------------------------------------------------------------------------------------------------- **/

/**
 * @api {get} /company/:companyId Get company info
 * @apiName GetCompany
 * @apiDescription Get company info
 * @apiUse CompanyDatabaseSchema
 * @apiGroup Company
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 {
     "name": "Techmagic"
  }
 * @apiErrorExample {json} FORBIDDEN:
 {
   "code": 403,
   "error": "FORBIDDEN",
   "message": "FORBIDDEN"
 }
 */

/** ---------------------------------------------------------------------------------------------------------------------------------- **/

/**
 * @api {patch} /company/:companyId Edit company details
 * @apiName PatchCompany
 * @apiDescription edit company details
 * @apiGroup Company
 * @apiUse CompanyDatabaseSchema
 * @apiUse EditCompanyValidation
 * @apiParamExample {json} Request-Example:
 *     {
 *       "name": "Techmagic",
 *       "info": "it company"
 *     }

 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 {
   "name": "Techmagic",
   "info": "it company",
   "_id": "592b3b608cd6291923e74ac2"
 }
 * @apiErrorExample {json} FORBIDDEN:
 {
   "code": 403,
   "error": "FORBIDDEN",
   "message": "FORBIDDEN"
 }
 */

// -----------------------------------------------------------------

/**
 * @api {delete} /company/:companyId Delete company
 * @apiName DeleteCompany
 * @apiDescription Delete company
 * @apiGroup Company

 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 {
     "_id": "592b3eef97c0ba1a8ac5213b",
     "name": "techmagic",
     "isActive": false
  }
 * @apiErrorExample {json} FORBIDDEN:
 {
   "code": 403,
   "error": "FORBIDDEN",
   "message": "FORBIDDEN"
 }
 */

/** ---------------------------------------------------------------------------------------------------------------------------------- **/

/**
 * @api {get} /company/ Get all companies
 * @apiName GetCompanies
 * @apiDescription Get all companies if user is sys admin
 * @apiGroup Company
 * @apiUse CompanyDatabaseSchema
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 [{
    "_id": "592b3eef97c0ba1a8ac5213b,
    "name": "Techmagic"
  },
 {
   "_id": "592b3eef97c0ba1a8ac5213v",
   "name": "Google"
 },
 ]
 * @apiErrorExample {json} FORBIDDEN:
 {
   "code": 403,
   "error": "FORBIDDEN",
   "message": "FORBIDDEN"
 }
 */

/** ------------------------------------------------------------------------- **/

/**
 * @api {post} /company/:companyId/invite Send invite email to user(s)
 * @apiName PostCompanyUsersInvite
 * @apiDescription Send invite email to user(s)
 * @apiGroup Company
 * @apiParamExample {json} Request-Example:
 [ "592b3eef97c0ba1a8ac5213b", "592b3eef97c0ba1a8ac5333"]

 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 [{
    "_id": "592b3eef97c0ba1a8ac5213b",
    "isCompanyAdmin": false,
    "isSysAdmin": false,
    "email": "nikita@techmagic.co"
    "_company": "592b3eef97c0ba1a8ac52qqq"
 },
 {
    "_id": "592b3eef97c0ba1a8ac5333",
    "isCompanyAdmin": false,
    "isSysAdmin": false,
    "email": "ivan@techmagic.co"
    "_company": "592b3eef97c0ba1a8ac52qqq"
 }]
 * @apiErrorExample {json} FORBIDDEN:
 {
   "code": 403,
   "error": "FORBIDDEN",
   "message": "FORBIDDEN"
 }
 */

/** ------------------------------------------------------------------------- **/

/**
 * @api {post} /company/:companyId/sendTestEmail Send test email
 * @apiName PostCompanyTestEmail
 * @apiDescription Send test email
 * @apiGroup Company
 * @apiParamExample {json} Request-Example:
 {
  email: "john.doe@awesome.com"
 }

 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 204 OK

 * @apiErrorExample {json} FORBIDDEN:
 {
   "code": 403,
   "error": "FORBIDDEN",
   "message": "FORBIDDEN"
 }
 */
