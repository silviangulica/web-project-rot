const router = require("../routers/router");
const userService = require("../services/UserService");
const authService = require("../services/AuthService");
const questionService = require("../services/QuestionService");
const { handleErrors, getRequestBody } = require("../utils/RequestUtils");

// Get all users (needs admin role) or a specific user by id
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

// Validates the user JWT and returns the user data
router.add("get", "/users/me", async (req, res) => {
  try {
    let id = authService.verifyAuthorization(req, res, "user");
    let user = await userService.findUserById(id);
    res.end(JSON.stringify(user));
  } catch (err) {
    handleErrors(err, res);
  }
});

// Returns the top 10 users by their score
router.add("get", "/users/top-points", async (req, res) => {
  try {
    authService.verifyAuthorization(req, res, "user");
    const users = await userService.getTop10UsersByScore();
    res.end(JSON.stringify(users));
  } catch (err) {
    handleErrors(err, res);
  }
});

// Returns the top 10 users by the number of quizzes they have passed
router.add("get", "/users/top-quizzes", async (req, res) => {
  try {
    authService.verifyAuthorization(req, res, "user");
    const users = await userService.getTop10UsersByQuizzes();
    res.end(JSON.stringify(users));
  } catch (err) {
    handleErrors(err, res);
  }
});

// Returns the top 10 users by the number of correct answers they have given
router.add("get", "/users/top-answers", async (req, res) => {
  try {
    authService.verifyAuthorization(req, res, "user");
    const users = await userService.getTop10UsersByCorrectAnswers();
    res.end(JSON.stringify(users));
  } catch (err) {
    handleErrors(err, res);
  }
});

// Depending on the body.action value, it either starts or ends a quiz for the user ( sets the endTime + startTime and updates the passed count if it was passed) and returns the time.
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

// Verifies the question answer and UPDATES the user's score and correctAnswers/wrongAnswers count
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

// Endpoint to get all the 3 top 10 users in one request, as a rss feed
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

// Used to update an user's data
router.add("put", "/users", async (req, res) => {
  try {
    let id = authService.verifyAuthorization(req, res, "user");
    let body = JSON.parse(await getRequestBody(req));
    let user = await userService.updateUser(id, body.userObj);
    console.log(body);
    console.log(user);
    res.end(JSON.stringify({ msg: "User updated successfully" }));
  } catch (err) {
    handleErrors(err, res);
  }
});
