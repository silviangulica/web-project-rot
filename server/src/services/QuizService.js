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

function getQuizWithSingleListAnswers(quiz) {
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

// Mixes the answers order for a question
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
  foundQuiz = await foundQuiz.populate("questions");
  return foundQuiz;
};

module.exports = {
  generateRandomQuiz,
  removeQuiz,
  getQuizById,
  getQuizWithSingleListAnswers,
};
