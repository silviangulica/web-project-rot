require("dotenv").config({ path: "./process.env" });
const userController = require("./controllers/UserController");
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
  console.log("Un nou response!");
});

server.listen(8081);
