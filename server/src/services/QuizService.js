const Quiz = require("../models/Quiz");
const Question = require("../models/Question");

const generateRandomQuiz = async () => {
  let questions = await Question.aggregate([{ $sample: { size: 26 } }]);
  let quizToBeAdded = new Quiz({ questions });
  await quizToBeAdded.save();
  quizToBeAdded = await quizToBeAdded.populate("questions");

  return getQuizWithAnswers(quizToBeAdded, questions);
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
module.exports = {
  generateRandomQuiz,
};
