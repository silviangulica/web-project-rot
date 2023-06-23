const router = require("../routers/router");

const {
  generateRandomQuiz,
  removeQuiz,
  getQuizById,
  getQuizWithSingleListAnswers,
  startQuizForUser,
  verifyAnswers,
  checkIfQuizIsFinished,
} = require("../services/QuizService");
const { getRequestBody } = require("../utils/RequestUtils");
const { verifyAuthorization } = require("../services/AuthService");
const { handleErrors } = require("../utils/RequestUtils");
const {
  getUserQuiz,
  increaseCorrectAnswerStats,
  increaseWrongAnswerStats,
} = require("../services/UserService");

router.add("post", "/quizzes", async (req, res) => {
  try {
    let id = verifyAuthorization(req, res, "user");
    let quiz = await generateRandomQuiz(id);
    quiz = await getUserQuiz(quiz._id, id);
    res.end(JSON.stringify(quiz));
  } catch (err) {
    console.log(err);
    handleErrors(err, res);
  }
});

router.add("delete", "/quizzes", async (req, res) => {
  try {
    let quizId = req.params.quizId;
    let id = verifyAuthorization(req, res, "user");
    await removeQuiz(id, quizId);
    res.end(JSON.stringify({ message: "Quiz removed successfully" }));
  } catch (err) {
    console.log(err);
    handleErrors(err, res);
  }
});

router.add("get", "/quizzes", async (req, res) => {
  try {
    let quizId = req.params.quizId;
    let answersFormat = req.params.answersFormat;
    console.log(answersFormat);
    await verifyAuthorization(req, res, "user");
    let quiz = await getQuizById(quizId);
    if (answersFormat === "singleList")
      quiz = getQuizWithSingleListAnswers(quiz);
    res.end(JSON.stringify(quiz));
  } catch (err) {
    console.log(err);
    handleErrors(err, res);
  }
});
