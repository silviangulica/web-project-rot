const router = require("../routers/router");

const {
  generateRandomQuiz,
  removeQuiz,
  getQuizById,
  getQuizWithSingleListAnswers,
} = require("../services/QuizService");
const { verifyAuthorization } = require("../services/AuthService");
const { handleErrors } = require("../utils/RequestUtils");
const { getUserQuiz } = require("../services/UserService");

// Generates a random quiz and adds it to the user's quizzes array as well
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

// Deletes a quiz and also removes it from the user's quizzes array
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

// Returns the quiz either with all answers in one array or with answers in separate arrays( correctQ, wrongQ)
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
