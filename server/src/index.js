require("dotenv").config({ path: "./process.env" });
const loginController = require("./controllers/LoginController");
const userController = require("./controllers/UserController");
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
    console.log("Connect failure!!!");
  }
}

connect();

// -- Server
const server = http.createServer((req, res) => {
  router.handle(req, res);
});

server.listen(8081);
