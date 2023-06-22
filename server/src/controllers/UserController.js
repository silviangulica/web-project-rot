const router = require("../routers/router");
const userService = require("../services/UserService");
const authService = require("../services/AuthService");
const quizService = require("../services/QuizService");
const { handleErrors, getRequestBody } = require("../utils/RequestUtils");

router.add("get", "/users", async (req, res) => {
  try {
    let result;
    authService.verifyAuthorization(req, res, "admin");
    if (req.params.id) {
      result = await userService.findUserById(req.params.id);
    } else {
      result = await userService.getUsers();
    }
    console.log(result);
    res.end(JSON.stringify(result));
  } catch (err) {
    handleErrors(err, res);
  }
});

router.add("get", "/users/me", async (req, res) => {
  try {
    let id = authService.verifyAuthorization(req, res, "user");
    let user = await userService.findUserById(id);
    res.end(JSON.stringify(user));
  } catch (err) {
    handleErrors(err, res);
  }
});

router.add("get", "/users/top-points", async (req, res) => {
  try {
    authService.verifyAuthorization(req, res, "user");
    const users = await userService.getTop10UsersByScore();
    res.end(JSON.stringify(users));
  } catch (err) {
    handleErrors(err, res);
  }
});

router.add("get", "/users/top-quizzes", async (req, res) => {
  try {
    authService.verifyAuthorization(req, res, "user");
    const users = await userService.getTop10UsersByQuizzes();
    res.end(JSON.stringify(users));
  } catch (err) {
    handleErrors(err, res);
  }
});

router.add("get", "/users/top-answers", async (req, res) => {
  try {
    authService.verifyAuthorization(req, res, "user");
    const users = await userService.getTop10UsersByCorrectAnswers();
    res.end(JSON.stringify(users));
  } catch (err) {
    handleErrors(err, res);
  }
});

router.add("patch", "/users/quizzes", async (req, res) => {
  try {
    let id = authService.verifyAuthorization(req, res, "user");
    let quizId = req.params.quizId;
    let body = JSON.parse(await getRequestBody(req));
    let time;
    if (body.action === "start") {
      time = await userService.startQuizForUser(id, quizId);
    } else if (body.action === "end") {
      time = await userService.endQuizForUser(id, quizId);
    }
    res.end(JSON.stringify({ message: time }));
  } catch (err) {
    handleErrors(err, res);
  }
});

router.add("patch", "/users/quizzes/questions", async (req, res) => {
  try {
    let id = authService.verifyAuthorization(req, res, "user");
    let quizId = req.params.quizId;
    await userService.checkIfQuizIsFinished(id, quizId, res);

    let questionId = req.params.questionId;
    let answers = JSON.parse(await getRequestBody(req));
    let correct = await quizService.verifyAnswers(
      id,
      quizId,
      questionId,
      answers
    );
    if (correct == true) {
      await userService.increaseCorrectAnswerStats(id, quizId);
    } else {
      await userService.increaseWrongAnswerStats(id, quizId);
    }
    res.end(JSON.stringify({ correct }));
  } catch (err) {
    console.log(err);
    handleErrors(err, res);
  }
});
