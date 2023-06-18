const mongoose = require("mongoose");

const UserQuizSchema = new mongoose.Schema({
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quiz",
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
});

module.exports = UserQuizSchema;
