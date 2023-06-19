const router = require("../routers/router");
const userService = require("../services/UserService");
const authService = require("../services/AuthService");
const { handleErrors } = require("../utils/RequestUtils");

router.add("get", "/users", async (req, res) => {
  try {
    console.log("BAD");
    authService.verifyAuthorization(req, res, "admin");
    const users = await userService.getUsers();
    res.end(JSON.stringify(users));
  } catch (err) {
    handleErrors(err, res);
  }
});

router.add("get", "/user");

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

// module.exports = router;
