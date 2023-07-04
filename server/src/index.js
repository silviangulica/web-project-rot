//require("dotenv").config();
let router = require("./routers/router");
const loginController = require("./controllers/AuthController");
const userController = require("./controllers/UserController");
const lessonController = require("./controllers/LessonController");
const supportController = require("./controllers/SupportController");
const quizController = require("./controllers/QuizController");
const uploadController = require("./controllers/UploaderController");
const recoveryController = require("./controllers/RecoveryController");
const mongoose = require("mongoose");
const http = require("http");
const port = process.env.PORT || 8081;
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
(async () => {
  await connect();
})();

router.add("get", "/favicon.ico", async (req, res) => {
  res.statusCode = 204;
  res.end();
});

// -- Server
const server = http.createServer((req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader(
    "Access-Control-Allow-Origin",
    "http://www.romaniantraffictutor.tech"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE,PATCH");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  router.handle(req, res);
});

server.listen(port, () => {
  console.log(
    "[" +
      "\x1b[32m" +
      "Info" +
      "\x1b[0m" +
      "]: Server listening on port " +
      port
  );
});
