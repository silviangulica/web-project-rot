const { userToUserDtoMapper } = require("../dto/UserDto");
const User = require("../models/User");
const authService = require("./AuthService");
const {
  UsernameDuplicateError,
  EmailDuplicateError,
} = require("../utils/CustomErrors");

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

const getUserQuiz = async (quizId, userId) => {
  // let us = await User.find({ _id: userId }, { quizList: 1, _id: 0 });
  // console.log(us);

  let userQuizArray = await User.find(
    { _id: userId, "quizList.quiz": quizId },
    { quizList: 1, _id: 0, startTime: 1, endTime: 1, score: 1 }
  );

  return userQuizArray.at(0).quizList.find((q) => q.quiz.equals(quizId));
};

const removeUserQuiz = async (quizId, userId) => {
  await User.updateOne(
    { _id: userId },
    { $pull: { quizList: { quiz: quizId } } }
  );
};

const addQuizToUserQuizArray = async (quizz, userId) => {
  await User.findByIdAndUpdate(userId, {
    $push: {
      quizList: {
        quiz: quizz._id,
        score: quizz.score,
        startTime: quizz.startTime,
        endTime: quizz.endTime,
      },
    },
  });
};

const updateStartTimeForUserQuiz = async (quizId, userId, startTime) => {
  await User.updateOne(
    { _id: userId, "quizList.quiz": quizId },
    { $set: { "quizList.$.startTime": startTime } }
  );
  return startTime;
};

const updateEndTimeForUserQuiz = async (quizId, userId, endTime) => {
  await User.updateOne(
    { _id: userId, "quizList.quiz": quizId },
    { $set: { "quizList.$.endTime": endTime } }
  );
};

const updateScoreForUserQuiz = async (quizId, userId, score) => {
  await User.updateOne(
    { _id: userId, "quizList.quiz": quizId },
    { $set: { "quizList.$.score": score } }
  );
};
const increaseTotalScore = async (userId, scoreToAdd) => {
  const user = await User.findById(userId);
  let newScore = user.totalScore + scoreToAdd;

  if (newScore < 0) {
    newScore = 0;
  }
  await User.updateOne({ _id: userId }, { totalScore: newScore });
};
const increaseScoreForUserQuiz = async (quizId, userId, score) => {
  await User.updateOne(
    { _id: userId, "quizList.quiz": quizId },
    { $inc: { "quizList.$.score": score } }
  );
};

const increaseCorrectAnswerStats = async (userId, quizId) => {
  await User.updateOne({ _id: userId }, { $inc: { correctAnswers: 1 } });
  await increaseTotalScore(userId, 1);
  await increaseScoreForUserQuiz(quizId, userId, 1);
};

const increaseWrongAnswerStats = async (userId) => {
  await User.updateOne({ _id: userId }, { $inc: { wrongAnswers: 1 } });
  await increaseTotalScore(userId, -1);
};
const increasePassedQuizStats = async (userId, quizId) => {
  let currentScore = (await getUserQuiz(quizId, userId)).score;
  if (currentScore >= 22) {
    await User.updateOne({ _id: userId }, { $inc: { quizzesPassed: 1 } });
    await increaseTotalScore(userId, 30);
  }
};
const getQuizTime = async (userId, quizId) => {
  let document = await User.findOne(
    { _id: userId, "quizList.quiz": quizId },
    { "quizList.$": 1, _id: 0 }
  );
  return document.quizList[0].startTime;
};

const startQuizForUser = async (userId, quizId) => {
  await updateScoreForUserQuiz(quizId, userId, 0);
  return await updateStartTimeForUserQuiz(quizId, userId, Date.now());
};

const endQuizForUser = async (userId, quizId) => {
  await updateEndTimeForUserQuiz(quizId, userId, Date.now());
  await increasePassedQuizStats(userId, quizId);
};

const checkIfQuizIsFinished = async (userId, quizId, res) => {
  let time = await getQuizTime(userId, quizId);
  let now = Date.now();
  console.log((now - time) / (1000 * 60));
  if ((now - time) / (1000 * 60) > 30) res.finished = true;
};

const updateUser = async (id, modifications) => {
  let user = await User.findById(id);
  if (modifications.username) {
    checkIfUserExists = await findUserByUsername(modifications.username);
    if (checkIfUserExists) {
      throw new UsernameDuplicateError(
        `Username ${modifications.username} already exists`
      );
    }
    user.username = modifications.username;
  }
  if (modifications.email) {
    checkIfEmailExists = await findByEmail(modifications.email);
    if (checkIfEmailExists) {
      throw new EmailDuplicateError(`Email ${modifications.email} already exists`);
    }
    user.email = modifications.email;
  }
  if (modifications.password) {
    user.password = authService.getHashedPassword(modifications.password);
  }
  if (modifications.picture) {
    user.profilePicture = modifications.picture;
  }
  await user.save();
  return await findUserById(id);
}

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
  addQuizToUserQuizArray,
  updateStartTimeForUserQuiz,
  updateEndTimeForUserQuiz,
  updateScoreForUserQuiz,
  increaseWrongAnswerStats,
  increaseCorrectAnswerStats,
  getQuizTime,
  startQuizForUser,
  endQuizForUser,
  checkIfQuizIsFinished,
  increasePassedQuizStats,
  updateUser
};
