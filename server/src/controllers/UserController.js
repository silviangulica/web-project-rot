const router = require("../routers/router");
const userService = require("../services/UserService");

router.add("get", "/users", async (req, res) => {
  try {
    res.setHeader("Content-Type", "application/json");
    const users = await userService.getUsers();
    res.end(JSON.stringify(users));
  } catch (err) {
    res.statusCode = 400;
    res.end(JSON.stringify({ message: err.message }));
  }
});

router.add("get", "/users/top-points", async (req, res) => {
  try {
    res.setHeader("Content-Type", "application/json");
    const users = await userService.getTop10UsersByScore();
    res.end(JSON.stringify(users));
  } catch (err) {
    res.statusCode = 400;
    res.end(JSON.stringify({ message: err.message }));
  }
});

router.add("get", "/users/top-quizzes", async (req, res) => {
  try {
    res.setHeader("Content-Type", "application/json");
    const users = await userService.getTop10UsersByQuizzes();
    res.end(JSON.stringify(users));
  } catch (err) {
    res.statusCode = 400;
    res.end(JSON.stringify({ message: err.message }));
  }
});

router.add("get", "/users/top-answers", async (req, res) => {
  try {
    res.setHeader("Content-Type", "application/json");
    const users = await userService.getTop10UsersByCorrectAnswers();
    res.end(JSON.stringify(users));
  } catch (err) {
    res.statusCode = 400;
    res.end(JSON.stringify({ message: err.message }));
  }
});

// module.exports = router;
