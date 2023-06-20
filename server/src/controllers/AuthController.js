const router = require("../routers/router");
const { getRequestBody, handleErrors } = require("../utils/RequestUtils");
const authService = require("../services/AuthService");
const User = require("../models/User");
const Question = require("../models/Question");
const QuizSchema = require("../models/Quiz");
const { userToUserDtoMapper } = require("../../dto/UserDto");
router.add("post", "/register", async (req, res) => {
  try {
    let body = await getRequestBody(req);
    const { username, email, password } = JSON.parse(body);
    const user = await authService.register(username, email, password);
    res.end(JSON.stringify(userToUserDtoMapper(user)));
  } catch (err) {
    handleErrors(err, res);
  }
});

router.add("post", "/login", async (req, res) => {
  try {
    let body = await getRequestBody(req);
    const { email, password } = JSON.parse(body);
    const { user, token } = await authService.login(email, password);
    res.setHeader(
      "Set-Cookie",
      `token=${token};Path:/; Expires=${new Date(
        Date.now() + 1000 * 60 * 60 * 24
      ).toUTCString()}; HttpOnly;`
    );
    res.end(JSON.stringify(userToUserDtoMapper(user)));
  } catch (err) {
    handleErrors(err, res);
  }
});
router.add("get", "/logout", (req, res) => {
  res.setHeader(
    "Set-Cookie",
    `token=;Path=/; Expires=${new Date(0).toUTCString()};`
  );
  res.end(JSON.stringify({ message: "Logged out" }));
});

router.add("get", "/verifyToken", async (req, res) => {
  try {
    authService.verifyAuthorization(req, res, "user");
    res.end(JSON.stringify({ message: "Token is valid" }));
  } catch (err) {
    handleErrors(err, res);
  }
});
