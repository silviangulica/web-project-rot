const router = require("../routers/router");

const { generateRandomQuiz, removeQuiz } = require("../services/QuizService");
const { getRequestBody } = require("../utils/RequestUtils");
const {
  verifyIfRequestCameFromUser,
  verifyAuthorization,
} = require("../services/AuthService");
const { handleErrors } = require("../utils/RequestUtils");
const { getUserQuiz } = require("../services/UserService");

router.add("post", "/quiz/create", async (req, res) => {
  try {
    let id = req.params.id;
    verifyAuthorization(req, res, "user");
    verifyIfRequestCameFromUser(req, id);
    let quiz = await generateRandomQuiz(id);
    quiz = await getUserQuiz(quiz, id);
    res.end(JSON.stringify(quiz));
  } catch (err) {
    handleErrors(err, res);
  }
});

router.add("delete", "/quiz", async (req, res) => {
  try {
    let userId = req.params.id;
    let quizId = req.params.quizId;
    verifyAuthorization(req, res, "user");
    verifyIfRequestCameFromUser(req, userId);
    await removeQuiz(userId, quizId);
    res.end(JSON.stringify({ message: "Quiz removed successfully" }));
  } catch (err) {
    console.log(err);
    handleErrors(err, res);
  }
});
