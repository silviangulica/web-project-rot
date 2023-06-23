const mongoose = require("mongoose");
const UserQuizSchema = require("./UserQuiz");
const RecoveryCode = require("./RecoveryCode");

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
  role: {
    type: String,
    required: true,
    default: "user",
  },
  quizzesPassed: {
    type: Number,
    default: 0,
  },
  correctAnswers: {
    type: Number,
    default: 0,
  },
  wrongAnswers: {
    type: Number,
    default: 0,
  },
  totalScore: {
    type: Number,
    default: 0,
  },
  profilePicture: {
    type: String,
    default:
      "https://th.bing.com/th/id/OIP.ilvIUpk5eCS26XBmYT9lUwHaE9?pid=ImgDet&rs=1",
  },

  quizList: [UserQuizSchema],
  recoveryCode: RecoveryCode,
  needRecovery: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("User", UserSchema);
