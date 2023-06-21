const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'gulica.sv@gmail.com',
    pass: 'SilvianCelMaiFain2023'
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