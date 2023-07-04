const nodemailer = require("nodemailer");
//require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: "smtp-relay.sendinblue.com",
  port: 587,
  auth: {
    user: "webrot7@gmail.com",
    pass: process.env.SENDINBLUE_PASSWORD,
  },
});

const sendMail = (mailObj) => {
  transporter.sendMail(mailObj, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent successfully: " + info.response);
    }
  });
};

module.exports = sendMail;
