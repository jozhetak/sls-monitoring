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
            body {
                width: 800px;
                height: 362px;
                margin: 0;
                background-color: #ffffff;
                color: #373a36;
                position: relative;
                z-index: 1;
                -webkit-text-size-adjust: 100%;
                font-variant-ligatures: none;
                -webkit-font-variant-ligatures: none;
                text-rendering: optimizeLegibility;
                -moz-osx-font-smoothing: grayscale;
                font-smoothing: antialiased;
                -webkit-font-smoothing: antialiased;
                text-shadow: rgba(0, 0, 0, 0.01) 0 0 1px;
            }
  
            p {
                margin: 0;
            }
  
            .header {
                height: 94px;
                display: flex;
                justify-content: center;
                align-items: center;
                border-bottom: 1px solid rgba(197, 197, 197, 0.5);
            }
  
            .header p {
                font-family: "Raleway", sans-serif;
                font-size: 24px;
            }
  
            .main {
                font-family: "OpenSans", sans-serif;
                font-size: 16px;
                line-height: 1.5;
                height: 214px;
                padding-left: 40px;
                padding-top: 30px;
                box-sizing: border-box;
                border-bottom: 1px solid rgba(197, 197, 197, 0.5);
            }
  
            .main p+p {
                margin-top: 25px;
            }
    
            .bold {
                font-weight: bold;
            }
    
            .button-wrapper {
                margin-top: 20px;
            }
    
            .button {
                width: 240px;
                height: 40px;
                background-color: #00b2a9;
                display: flex;
                text-transform: uppercase;
                justify-content: center;
                align-items: center;
                text-decoration: none;
                color: #ffffff;
                font-size: 14px;
                font-weight: bold;
                font-family: "Raleway", sans-serif;
                position: relative;
            }
    
            .button::after {
                left: 10px;
                bottom: 3px;
                border-radius: 50%;
                box-shadow: -8px 0 20px 5px rgba(71, 71, 71, 0.4);
                content: "";
                display: block;
                position: absolute;
                z-index: -1;
                height: 10px;
                width: 210px;
            }
    
            footer {
                height: 54px;
                display: flex;
                justify-content: center;
                align-items: center;
            }
    
            .copyright {
                font-size: 13.2px;
                font-family: "OpenSans", sans-serif;
                color: #aaaaaa;
            }
        </style>
    </head>
    <body>
        <header class="header">
            <p>
              <span class="bold">SLS</span> Monitoring</p>
        </header>
        <div class="main">
            <p>You’re only one step from being able to log on SLS Montitoring.</p>
            <p class="bold">Click on the button below to confirm your account</p>
            <div class="button-wrapper">
                <a class="button" href="${process.env.API_URL}/users/${user._id}/verification/${user.verificationToken}">confirm your account</a>
            </div>
        </div>
        <footer>
            <div class="copyright">© TechMagic 2016 - 2018</div>
        </footer>
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
              body {
                  width: 800px;
                  height: 456px;
                  margin: 0;
                  background-color: #ffffff;
                  color: #373a36;
                  position: relative;
                  z-index: 1;
      
                  -webkit-text-size-adjust: 100%;
                  font-variant-ligatures: none;
                  -webkit-font-variant-ligatures: none;
                  text-rendering: optimizeLegibility;
                  -moz-osx-font-smoothing: grayscale;
                  font-smoothing: antialiased;
                  -webkit-font-smoothing: antialiased;
                  text-shadow: rgba(0, 0, 0, 0.01) 0 0 1px;
              }
      
              p {
                  margin: 0;
              }

              .header {
                  height: 94px;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  border-bottom: 1px solid rgba(197, 197, 197, 0.5);
              }
      
              .header p {
                  font-family: "Raleway", sans-serif;
                  font-size: 24px;
              }
      
              .main {
                  font-family: "OpenSans", sans-serif;
                  font-size: 16px;
                  line-height: 1.5;
                  width: 100%;
                  height: 308px;
                  padding-left: 40px;
                  padding-top: 35px;
                  box-sizing: border-box;
                  border-bottom: 1px solid rgba(197, 197, 197, 0.5);
                  padding-right: 150px;
              }
      
              .main p+p {
                  margin-top: 25px;
              }
      
              .bold {
                  font-weight: bold;
              }
      
              .small-text {
                  font-size: 14px;
              }
      
              .button-wrapper {
                  margin-top: 20px;
                  margin-bottom: 26px;
              }
      
              .button {
                  width: 240px;
                  height: 40px;
                  background-color: #00b2a9;
                  display: flex;
                  text-transform: uppercase;
                  justify-content: center;
                  align-items: center;
                  text-decoration: none;
                  color: #ffffff;
                  font-size: 14px;
                  font-weight: bold;
                  font-family: "Raleway", sans-serif;
                  position: relative;
              }
      
              .button::after {
                  left: 10px;
                  bottom: 3px;
                  border-radius: 50%;
                  box-shadow: -8px 0 20px 5px rgba(71, 71, 71, 0.4);
                  content: "";
                  display: block;
                  position: absolute;
                  z-index: -1;
                  height: 10px;
                  width: 210px;
              }
      
              footer {
                  height: 54px;
                  display: flex;
                  justify-content: center;
                  align-items: center;
              }
      
              .copyright {
                  font-size: 13.2px;
                  font-family: "OpenSans", sans-serif;
                  color: #aaaaaa;
              }
          </style>
      </head>
      <body>
          <header class="header">
              <p>
                  <span class="bold">SLS</span> Monitoring</p>
          </header>
          <div class="main">
              <p>We recevied a request to reset your password for your SLS account. We are here to help you! </p>
              <p class="bold">Click on the button below to set a new password</p>
              <div class="button-wrapper">
                  <a class="button" href="${process.env.WEB_URL}/users/${user._id}/resetPassword/${user.resetPasswordToken}">set a new password</a>
              </div>
              <p class="small-text">If you didn’t mean to reset your password, than you can ignore this email, your password will not be changed.</p>
          </div>
          <footer>
              <div class="copyright">© TechMagic 2016 - 2018</div>
          </footer>
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
