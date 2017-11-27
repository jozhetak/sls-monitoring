const AWS = require('aws-sdk')
const ses = new AWS.SES({region: 'eu-west-1'})

module.exports = (opts) => {
  const params = {
    Destination: {
      ToAddresses: [
        opts.email
      ]
    },
    Message: {
      Body: {
        Text: {
          Data: opts.body
        }
      },
      Subject: {
        Data: opts.subject
      }
    },
    Source: 'genal.igor@gmail.com',
  }
  return ses.sendEmail(params).promise()
}
