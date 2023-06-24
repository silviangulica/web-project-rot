const router = require("../routers/router");
const userService = require("../services/UserService");
const authService = require("../services/AuthService");
const questionService = require("../services/QuestionService");
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
    let correct = await questionService.verifyAnswersForQuestion(
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

router.add("get", "/users/top-10-rss", async (req, res) => {
  try {
    authService.verifyAuthorization(req, res, "user");
    let feed = await userService.getTop10RssFeed();
    res.setHeader("Content-Type", "application/rss+xml");
    res.end(feed);
  } catch (err) {
    console.log(err);
    handleErrors(err, res);
  }
});

// PUT: /users/updateUser
router.add("put", "/users", async (req, res) => {
  try {
    let id = authService.verifyAuthorization(req, res, "user");
    let body = JSON.parse(await getRequestBody(req));
    let user = await userService.updateUser(id, body.userObj);
    res.end(JSON.stringify( {msg: "User updated successfully"} ));
  } catch (err) {
    handleErrors(err, res);
  }
});
// DELETE: /users?id=...
router.add("delete", "/users", async (req, res) => {
  try {
    let id = authService.verifyAuthorization(req, res, "admin");
    let userId = req.params.id;
    await userService.deleteUser(userId);

    // Show log
    console.log("[\x1b[31mDELETE\x1b[0m]: User deleted with id: " + userId);
    res.end(JSON.stringify({ msg: "User deleted successfully" }));
  } catch (err) {
    handleErrors(err, res);
  }
});


// UPDATE: /users/email?id=...
router.add("put", "/users/email", async (req, res) => {
  try {
    let id = authService.verifyAuthorization(req, res, "admin");
    let { email, userId } = JSON.parse(await getRequestBody(req));
    console.log(email, userId);
    await userService.updateUserEmail(userId, email);
    console.log("[\x1b[32mUPDATE\x1b[0m]: User email updated with id: " + userId);
    res.end(JSON.stringify({ msg: "User email updated successfully" }));
  } catch (err) {
    handleErrors(err, res);
  }
});