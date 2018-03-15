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
  const generateHTMLEmail = () => `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>Confirm</title>
        <style>
            @import url("https://fonts.googleapis.com/css?family=Raleway:400,600,800");
        </style>
    </head>
    <body>
        <table border="0" cellpadding="0" cellspacing="0" style="margin:0; padding:0;width: 800px; height: 362px;">
            <tr style="height: 94px; border-bottom: 1px solid rgba(197, 197, 197, 0.5); box-sizing: border-box;">
                <td style="color: #373a36; font-size: 24px; font-family: 'Raleway', sans-serif; line-height: 26px; -webkit-text-size-adjust:none; display: block; margin-top: 30px; text-align: center; border-bottom: 1px solid rgba(197, 197, 197, 0.5); padding-bottom: 38px;">
                    <span style="color: #373a36; font-size: 24px; font-family: 'Raleway', sans-serif; font-weight: bold; line-height: 26px; -webkit-text-size-adjust:none; display: inline;">SLS</span> Monitoring</td>
            </tr>
            <tr style="height: 80px; box-sizing: border-box;color: #373a36; font-size: 16px; font-family: 'OpenSans', sans-serif; line-height: 18px;">
                <td style="height: 24px; margin-top: 30px; width: 600px; margin-left: 40px; display: block;">You’re only one step from being able to log on SLS Montitoring.</td>
            </tr>
            <tr style="height: 44px; box-sizing: border-box;color: #373a36; font-size: 16px; font-family: 'OpenSans', sans-serif; line-height: 18px;">
                <td style="height: 24px; width: 600px; margin-left: 40px; display: block; font-weight: bold;">Click on the button below to confirm your account</td>
            </tr>
            <tr style="height: 90px;">
                <td style="height: 90px; width: 800px; padding-left: 40px; display: block; font-weight: bold;border-bottom: 1px solid rgba(197, 197, 197, 0.5);">
                    <a class="button" href="${process.env.API_URL}/users/${user._id}/verification/${user.verificationToken}" style="color: #ffffff; font-size: 14px; font-family: 'Raleway', sans-serif; line-height: 16px; -webkit-text-size-adjust:none; display: block;width: 240px; height: 40px;background-color: #00b2a9;text-decoration: none; box-sizing:border-box; padding-top: 12px; text-align: center;" target="_blank">CONFIRM YOUR ACCOUNT</a>
                </td>
            </tr>
            <tr>
                <td style="height:54px;font-size: 13.2px; font-family: 'OpenSans', sans-serif; color: #aaaaaa;text-align: center;">© TechMagic 2016 - 2018</td>
            </tr>
        </table>
    </body>
    </html>
  `
  const options = {
    recipient: user.email,
    subject: 'Verification email',
    body: generateHTMLEmail()
  }
  return _sendEmail(options)
}

module.exports.sendResetPasswordEmail = (user) => {
  console.log(user)
  const generateHTMLEmail = () => `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>Confirm</title>
        <style>
            @import url("https://fonts.googleapis.com/css?family=Raleway:400,600,800");
        </style>
    </head>
    <body>
        <table border="0" cellpadding="0" cellspacing="0" style="margin:0; padding:0;width: 800px; height: 362px;">
            <tr style="height: 94px; border-bottom: 1px solid rgba(197, 197, 197, 0.5); box-sizing: border-box;">
                <td style="color: #373a36; font-size: 24px; font-family: 'Raleway', sans-serif; line-height: 26px; -webkit-text-size-adjust:none; display: block; margin-top: 30px; text-align: center; border-bottom: 1px solid rgba(197, 197, 197, 0.5); padding-bottom: 38px;">
                    <span style="color: #373a36; font-size: 24px; font-family: 'Raleway', sans-serif; font-weight: bold; line-height: 26px; -webkit-text-size-adjust:none; display: inline;">SLS</span> Monitoring</td>
            </tr>
            <tr style="height: 95px; box-sizing: border-box;color: #373a36; font-size: 16px; font-family: 'OpenSans', sans-serif; line-height: 18px;">
                <td style="height: 48px; margin-top: 30px; width: 600px; margin-left: 40px; display: block;">We recevied a request to reset your password for your SLS account. We are here to help you!</td>
            </tr>
            <tr style="height: 42px; box-sizing: border-box;color: #373a36; font-size: 16px; font-family: 'OpenSans', sans-serif; line-height: 18px;">
                <td style="height: 24px; width: 600px; margin-left: 40px; display: block; font-weight: bold;">Click on the button below to set a new password</td>
            </tr>
            <tr style="height: 56px;">
                <td style="height: 56px; width: 800px; padding-left: 40px; display: block; font-weight: bold;">
                    <a class="button" href="${process.env.WEB_URL}/users/${user._id}/resetPassword/${user.resetPasswordToken}" style="color: #ffffff; font-size: 14px; font-family: 'Raleway', sans-serif; line-height: 16px; -webkit-text-size-adjust:none; display: block;width: 240px; height: 40px;background-color: #00b2a9;text-decoration: none; box-sizing:border-box; padding-top: 12px; padding-left:40px;" target="_blank">SET A NEW PASSWORD</a>
                </td>
            </tr>
            <tr style="height: 85px; box-sizing: border-box;color: #373a36; font-size: 14px; font-family: 'OpenSans', sans-serif; line-height: 18px;">
                <td style="height: 85px; margin-top: 30px; margin-left: 40px; display: block;border-bottom: 1px solid rgba(197, 197, 197, 0.5);">If you didn’t mean to reset your password, than you can ignore this email, your password will not
                    <br>be changed.</td>
            </tr>
            <tr>
                <td style="height:54px;font-size: 13.2px; font-family: 'OpenSans', sans-serif; color: #aaaaaa;text-align: center;">© TechMagic 2016 - 2018</td>
            </tr>
        </table>
    </body>
    </html>
  `
  const options = {
    recipient: user.email,
    subject: 'Reset password email',
    body: generateHTMLEmail()
  }
  return _sendEmail(options)
}
