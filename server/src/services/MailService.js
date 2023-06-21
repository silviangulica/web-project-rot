const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp-relay.sendinblue.com',
  port: 587,
  auth: {
    user: 'webrot7@gmail.com',
    pass: 'KGShHFWwTfUaMz6N'
  }
});

const sendMail = (mailObj) => {
  transporter.sendMail(mailObj, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent successfully: ' + info.response);
    }
  });
}

module.exports = sendMail;