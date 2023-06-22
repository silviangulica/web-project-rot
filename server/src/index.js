require("dotenv").config();
const loginController = require("./controllers/AuthController");
const userController = require("./controllers/UserController");
const lessonController = require("./controllers/LessonController");
const supportController = require("./controllers/SupportController");
const quizController = require("./controllers/QuizController");
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
    console.log("Connected successfully!!!");
  } catch (error) {
    console.log(error);
    console.log("Connect failure!!!");
  }
}

connect();

// -- Mail settings
const mailOptions = {
  from: "webrot7@gmail.com",
  to: "gulica.sv@gmail.com",
  subject: "Sending Email using Node.js",
  text: "That was easy!",
};

// -- Server
const server = http.createServer((req, res) => {
  // pentru allow origin

  let origins = [
    "http://localhost:5500",
    "http://127.0.0.1:5500",
  ];
  let origin = req.headers.origin;
  if (origins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  
  res.setHeader("Content-Type", "application/json");
  //res.setHeader("Access-Control-Allow-Origin", "http://localhost:5500");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  router.handle(req, res);
});

server.listen(8081);
