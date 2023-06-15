const express = require("express");
const mongoose = require("mongoose");
const User = require("./user")

const app = express();

const uri =
  "mongodb+srv://webrootpj:GxzYuigHkkmslB7v@mongo-webproject.gqoqzuw.mongodb.net/test?retryWrites=true&w=majority";

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
app.listen(3000, () => {
  console.log("Server running on port 3000");
});


// new User object