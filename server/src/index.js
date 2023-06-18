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
