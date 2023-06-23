require("dotenv").config();
const loginController = require("./controllers/AuthController");
const userController = require("./controllers/UserController");
const lessonController = require("./controllers/LessonController");
const supportController = require("./controllers/SupportController");
const quizController = require("./controllers/QuizController");
const uploadController = require("./controllers/UploaderController");
const recoveryController = require("./controllers/RecoveryController");
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
    console.log(
      "[" + "\x1b[32m" + "Info" + "\x1b[0m" + "]: Connected to database!"
    );
  } catch (error) {
    console.log(error);
    console.log(
      "[" +
        "\x1b[31m" +
        "Error" +
        "\x1b[0m" +
        "]: Could not connect to database!"
    );
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
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:5500");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE,PATCH");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  router.handle(req, res);
});

server.listen(8081);
