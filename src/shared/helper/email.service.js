const AWS = require('aws-sdk')
const ses = new AWS.SES({region: 'eu-west-1'})

const _sendEmail = (data) => {
  const params = {
    Destination: {
      ToAddresses: [
        data.recipient
      ]
    },
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: data.body
        }
      },
      Subject: {
        Data: data.subject
      }
    },
    Source: process.env.SOURCE_EMAIL
  }
  return ses.sendEmail(params).promise()
}

module.exports.sendVerificationEmail = (user) => {
  const options = {
    recipient: user.email,
    subject: 'Verification email',
    body: `Hello ${user.firstName + ' ' + user.lastName}! Please open the <a href="http://localhost:3000/users/verify/${user.token}">link</a> to verify your account `
  }
  return _sendEmail(options)
}

module.exports.sendResetPasswordEmail = (user) => {
  const options = {
    recipient: user.email,
    subject: 'Reset password email',
    body: `Hello ${user.firstName + ' ' + user.lastName}! Please open the <a href="http://localhost:3000/users/reset-password/${user.token}">link</a> to reset your password`
  }
  return _sendEmail(options)
}