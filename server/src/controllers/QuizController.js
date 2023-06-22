const router = require("../routers/router");

const {
  generateRandomQuiz,
  removeQuiz,
  getQuizById,
  getQuizWithAnswers,
  startQuizForUser,
  verifyAnswers,
} = require("../services/QuizService");
const { getRequestBody } = require("../utils/RequestUtils");
const { verifyAuthorization } = require("../services/AuthService");
const { handleErrors } = require("../utils/RequestUtils");
const {
  getUserQuiz,
  increaseCorrectAnswerStats,
  increaseWrongAnswerStats,
} = require("../services/UserService");

router.add("post", "/quiz/create", async (req, res) => {
  try {
    let id = verifyAuthorization(req, res, "user");
    let quiz = await generateRandomQuiz(id);
    quiz = await getUserQuiz(quiz._id, id);
    res.end(JSON.stringify(quiz));
  } catch (err) {
    handleErrors(err, res);
  }
});

router.add("delete", "/quiz", async (req, res) => {
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

router.add("get", "/quiz", async (req, res) => {
  try {
    let quizId = req.params.quizId;
    let id = verifyAuthorization(req, res, "user");
    let quiz = await getQuizById(quizId);
    await quiz.populate("questions");
    res.end(JSON.stringify(getQuizWithAnswers(quiz)));
  } catch (err) {
    console.log(err);
  }
});

router.add("post", "/quiz/start", async (req, res) => {
  try {
    let id = verifyAuthorization(req, res, "user");
    let quizId = req.params.quizId;
    let startTime = await startQuizForUser(id, quizId);
    res.end(JSON.stringify({ message: startTime }));
  } catch (err) {
    handleErrors(err, res);
  }
});

router.add("post", "/quiz/answer", async (req, res) => {
  try {
    let id = verifyAuthorization(req, res, "user");
    let quizId = req.params.quizId;
    let questionId = req.params.questionId;
    let answers = JSON.parse(await getRequestBody(req));
    let correct = await verifyAnswers(id, quizId, questionId, answers);
    if (correct == true) {
      await increaseCorrectAnswerStats(id);
    } else {
      await increaseWrongAnswerStats(id);
    }
    res.end(JSON.stringify({ correct }));
  } catch (err) {
    console.log(err);
    handleErrors(err, res);
  }
});
