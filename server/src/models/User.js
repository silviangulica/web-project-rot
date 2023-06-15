const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  // Todo: Got to add score information, can be done by either embedding or referencing (we'll see which one is better for our use case)
});

module.exports = mongoose.model("User", UserSchema);
