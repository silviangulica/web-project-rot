const mongoose = require("mongoose");

const RecoveryCode = new mongoose.Schema({
  code: {
    type: String,
    required: true,
  },
  expirationTime: {
    type: Number,
    required: true,
  }
});

module.exports = RecoveryCode;