const mongoose = require("mongoose");

const UserQuizSchema = new mongoose.Schema({
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quiz",
    required: true,
  },
  score: {
    type: Number,
    required: true,
    default: 0,
  },

  startTime: {
    type: Date,
  },
  endTime: {
    type: Date,
  },
});

module.exports = UserQuizSchema;
