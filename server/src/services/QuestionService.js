const Question = require("../models/Question");

const getQuestionById = async (questionId) => {
  return await Question.findById(questionId);
};

const verifyAnswersForQuestion = async (questionId, answers) => {
  let question = await getQuestionById(questionId);
  let correctAnswers = question.correctQ;
  let correct = true;
  answers.forEach((answer) => {
    if (!correctAnswers.includes(answer)) {
      correct = false;
    }
  });
  return correct;
};

module.exports = {
  getQuestionById,
  verifyAnswersForQuestion,
};
