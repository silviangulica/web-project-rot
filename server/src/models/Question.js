const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  image_url: {
    type: String,
    required: false,
  },
  incorrectQ: [String],
  correctQ: [String],
});

module.exports = mongoose.model("Question", QuestionSchema);
