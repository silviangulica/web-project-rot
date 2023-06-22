const mongoose = require("mongoose");

const LawLessonSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    require: true,
  }
});

module.exports = mongoose.model("law_lessons", LawLessonSchema)