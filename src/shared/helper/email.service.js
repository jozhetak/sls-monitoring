const AWS = require('aws-sdk')
const ses = new AWS.SES({region: process.env.SES_REGION})

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

// TODO: remove "localhost" and project url
module.exports.sendVerificationEmail = (user) => {
  const options = {
    recipient: user.email,
    subject: 'Verification email',
    body: `Hello ${user.firstName + ' ' + user.lastName}! Please open the <a href="http://localhost:3000/users/${user._id}/verification/${user.verificationToken}">link</a> to verify your account `
  }
  return _sendEmail(options)
}

module.exports.sendResetPasswordEmail = (user) => {
  console.log(user)
  const options = {
    recipient: user.email,
    subject: 'Reset password email',
    body: `Hello ${user.firstName + ' ' + user.lastName}! Please open the <a href="${process.env.WEB_URL}/users/${user._id}/resetPassword/${user.resetPasswordToken}">link</a> to reset your password`
  }
  return _sendEmail(options)
}
