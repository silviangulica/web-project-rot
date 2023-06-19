const { userToUserDtoMapper } = require("../../dto/UserDto");
const User = require("../models/User");

const createUser = async (username, email, password) => {
  const user = new User({
    username,
    email,
    password,
  });

  await user.save();

  return user;
};

const getUsers = async () => {
  const users = await User.find({}, { password: 0 });
  return users;
};

const findUserById = async (idToSearch) => {
  const user = await User.findById(idToSearch);
  return userToUserDtoMapper(user);
};

const findUserByUsername = async (usernameToSearch) => {
  const user = await User.findOne({ username: usernameToSearch });
  return user;
};

const findByEmail = async (emailToSearch) => {
  const user = await User.findOne({ email: emailToSearch });
  return user;
};

const getTop10UsersByScore = async () => {
  const users = await User.find({}, { username: 1, totalScore: 1, _id: 0 })
    .sort({ totalScore: -1 })
    .limit(10);

  return users;
};

const getTop10UsersByQuizzes = async () => {
  const users = await User.find({}, { username: 1, quizzesPassed: 1, _id: 0 })
    .sort({ quizzesPassed: -1 })
    .limit(10);

  return users;
};

const getTop10UsersByCorrectAnswers = async () => {
  const users = await User.find({}, { username: 1, correctAnswers: 1, _id: 0 })
    .sort({ correctAnswers: -1 })
    .limit(10);
  return users;
};

const getUserQuiz = async (quizToGet, userId) => {
  // let us = await User.find({ _id: userId }, { quizList: 1, _id: 0 });
  // console.log(us);

  let userQuizArray = await User.find(
    { _id: userId, "quizList.quiz": quizToGet._id },
    { quizList: 1, _id: 0 }
  );

  return userQuizArray.at(0).quizList.find((q) => q.quiz.equals(quizToGet._id));

  // //THIS IS TO FREAKING UPDATE THE SCORE SMH
  // us = await User.updateOne(
  //   { _id: userId, "quizList.quiz": "64909b8c1b01e9d0c9600d0d" },
  //   { $set: { "quizList.$.score": 6 } }
  // );

  // THIS IS FOR DELETING
  // us = await User.updateOne(
  //   { _id: userId },
  //   {
  //     $pull: {
  //       "quizzList.quiz": "64909b8c1b01e9d0c9600d0d",
  //     },
  //   }
  // );
};

const removeUserQuiz = async (quizId, userId) => {
  await User.updateOne(
    { _id: userId },
    { $pull: { quizList: { quiz: quizId } } }
  );
};

const updateUserQuiz = async (quizId, userId) => {
  await User.findByIdAndUpdate(userId, {
    $push: { quizList: { quiz: quizId, score: 0 } },
  });
};
module.exports = {
  createUser,
  getUsers,
  findUserByUsername,
  findByEmail,
  getTop10UsersByScore,
  getTop10UsersByQuizzes,
  getTop10UsersByCorrectAnswers,
  findUserById,
  getUserQuiz,
  removeUserQuiz,
  updateUserQuiz,
};
