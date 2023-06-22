const Quiz = require("../models/Quiz");
const Question = require("../models/Question");
const userService = require("./UserService");
const { QuizDoesNotExistError } = require("../utils/CustomErrors");
const { verifyAnswersForQuestion } = require("./QuestionService");

const generateRandomQuiz = async (id) => {
  let questions = await Question.aggregate([{ $sample: { size: 26 } }]);
  let quizToBeAdded = new Quiz({ questions });
  await quizToBeAdded.save();
  // quizToBeAdded = await quizToBeAdded.populate("questions");
  await userService.addQuizToUserQuizArray(quizToBeAdded, id);

  //return getQuizWithAnswers(quizToBeAdded, questions);
  return quizToBeAdded;
};

function getQuizWithAnswers(quiz) {
  let questions = quiz.questions;
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
  let removedQuiz = await Quiz.findByIdAndDelete(quizId);
  if (removedQuiz === null)
    throw new QuizDoesNotExistError(`Quiz with id ${quizId} does not exist`);
  await userService.removeUserQuiz(quizId, userId);
};

const getQuizById = async (quizId) => {
  let foundQuiz = await Quiz.findById(quizId);
  if (foundQuiz === null)
    throw new QuizDoesNotExistError(`Quiz with id ${quizId} does not exist`);
  return foundQuiz;
};

const startQuizForUser = async (userId, quizId) => {
  await getQuizById(quizId);
  return await userService.updateStartTimeForUserQuiz(
    quizId,
    userId,
    Date.now()
  );
};

const endQuizForUser = async (userId, quizId) => {
  await getQuizById(quizId);
  await userService.updateEndTimeForUserQuiz(quizId, userId, Date.now());
};

const verifyAnswers = async (userId, quizId, questionId, answers) => {
  let quiz = await getQuizById(quizId);
  quiz = await quiz.populate("questions");
  let correct = await verifyAnswersForQuestion(questionId, answers);
  return correct;
};

const checkIfQuizIsFinished = async (userId, quizId) => {
  let time = await userService.getQuizTime(userId, quizId);
  let now = Date.now();
  console.log((now - time) / (1000 * 60));
  if ((now - time) / (1000 * 60) > 1) console.log("GATA");
  else console.log("NU GATA");
};

module.exports = {
  generateRandomQuiz,
  removeQuiz,
  getQuizById,
  getQuizWithAnswers,
  startQuizForUser,
  endQuizForUser,
  verifyAnswers,
  checkIfQuizIsFinished,
};
