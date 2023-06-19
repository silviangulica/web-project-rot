const Quiz = require("../models/Quiz");
const Question = require("../models/Question");
const User = require("../models/User");
const { default: mongoose } = require("mongoose");
const userService = require("./UserService");
const { QuizDoesNotExistError } = require("../utils/CustomErrors");

const generateRandomQuiz = async (id) => {
  let questions = await Question.aggregate([{ $sample: { size: 26 } }]);
  let quizToBeAdded = new Quiz({ questions });
  await quizToBeAdded.save();
  // quizToBeAdded = await quizToBeAdded.populate("questions");
  await userService.updateUserQuiz(quizToBeAdded._id, id);

  //return getQuizWithAnswers(quizToBeAdded, questions);
  return quizToBeAdded;
};

function getQuizWithAnswers(quiz, questions) {
  questions = questions.map((questionToChange) => {
    return {
      _id: questionToChange._id,
      question: questionToChange.question,
      image_url: questionToChange.image_url
        ? questionToChange.image_url
        : "none",
      answers: getMixedAnswers(questionToChange),
    };
  });
  return { _id: quiz._id, questions: questions };
}
function getMixedAnswers(question) {
  let allAnswers = question.incorrectQ.concat(question.correctQ);
  let mixedAnswers = [];
  while (allAnswers.length > 0) {
    let randomIndex = Math.floor(Math.random() * allAnswers.length);
    mixedAnswers.push(allAnswers[randomIndex]);
    allAnswers.splice(randomIndex, 1);
  }

  return mixedAnswers;
}

const removeQuiz = async (userId, quizId) => {
  if (!verifyIfQuizExists(quizId))
    throw new QuizDoesNotExistError(`Quiz with id ${quizId} does not exist`);
  await Quiz.findByIdAndDelete(quizId);
  await userService.removeUserQuiz(quizId, userId);
};

const verifyIfQuizExists = async (quizId) => {
  let quiz = await Quiz.findById(quizId);
  return quiz ? true : false;
};
module.exports = {
  generateRandomQuiz,
  removeQuiz,
};
