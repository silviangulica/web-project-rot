const mongoose = require("mongoose");

const LessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    require: true,
  },
  image_url: {
    type: String,
    require: true,
  }, 
  id: {
    type: Number,
    require: true,
  }
});

module.exports = mongoose.model("lessons", LessonSchema)