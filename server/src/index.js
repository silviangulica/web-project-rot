require("dotenv").config();
const loginController = require("./controllers/AuthController");
const userController = require("./controllers/UserController");
const lessonController = require("./controllers/LessonController");
let router = require("./routers/router");

const mongoose = require("mongoose");
const http = require("http");

// Connect to database
const uri = process.env.MONGO_URI;

async function connect() {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connect successfully!!!");
  } catch (error) {
    console.log(error);
    console.log("Connect failure!!!");
  }
}

connect();

// -- Mail settings
const mailOptions = {
  from: 'gulica.sv@gmail.com',
  to: 'mamaischimadalina@gmail.com',
  subject: 'Sending Email using Node.js',
  text: 'That was easy!'
};

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp-relay.sendinblue.com',
  port: 587,
  secure: false,
  auth: {
    user: 'gulica.sv@gmail.com',
    pass: '1TDkrgJVcHQPS34I'
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

sendMail(mailOptions);



// -- Server
const server = http.createServer((req, res) => {
  const allowedOrigins = [
    "http://localhost:5500",
    "http://127.0.0.1:5500",
  ];
  
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  router.handle(req, res);
});

server.listen(8081);
