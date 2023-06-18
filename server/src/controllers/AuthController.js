const router = require("../routers/router");
const {
  UserNotFoundError,
  InvalidCredentialsError,
  UsernameDuplicateError,
  EmailDuplicateError,
  PasswordTooShortError,
  TokenInvalidError,
} = require("../utils/CustomErrors");
const { getRequestBody } = require("../utils/RequestUtils");
const { userToUserDtoMapper } = require("../dto/UserDto");
const authService = require("../services/AuthService");
const User = require("../models/User");
const Question = require("../models/Question");
const QuizSchema = require("../models/Quiz");
router.add("post", "/register", async (req, res) => {
  try {
    let body = await getRequestBody(req);
    const { username, email, password } = JSON.parse(body);
    const user = await authService.register(username, email, password);
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(userToUserDtoMapper(user)));
  } catch (err) {
    console.log(err);
    res.statusCode = 400;
    if (err instanceof UsernameDuplicateError) {
      res.end(
        JSON.stringify({ code: "username_duplicate", message: err.message })
      );
    } else if (err instanceof EmailDuplicateError) {
      res.end(
        JSON.stringify({ code: "email_duplicate", message: err.message })
      );
    } else if (err instanceof PasswordTooShortError) {
      res.end(
        JSON.stringify({ code: "password_too_short", message: err.message })
      );
    } else {
      res.end(JSON.stringify({ message: err.message }));
    }
  }
});

router.add("post", "/login", async (req, res) => {
  try {
    let body = await getRequestBody(req);
    const { email, password } = JSON.parse(body);
    const { user, token } = await authService.login(email, password);
    res.setHeader("Content-Type", "application/json");
    res.setHeader(
      "Set-Cookie",
      `token=${token};Path:/; Expires=${new Date(
        Date.now() + 1000 * 60 * 60 * 24
      ).toUTCString()}; HttpOnly;`
    );
    res.end(JSON.stringify({ user: userToUserDtoMapper(user) }));
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      res.statusCode = 401;
    } else if (err instanceof UserNotFoundError) {
      res.statusCode = 404;
    } else {
      res.statusCode = 400;
    }
    res.end(JSON.stringify({ message: err.message }));
  }
});
router.add("post", "/logout", (req, res) => {
  res.setHeader(
    "Set-Cookie",
    `token=;Path=/; Expires=${new Date(0).toUTCString()};`
  );
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({ message: "Logged out" }));
});

router.add("get", "/verifyToken", async (req, res) => {
  try {
    let token = authService.verifyToken(
      authService.checkThatTokenIsPresent(req)
    );
    res.setHeader(
      "Set-Cookie",
      `token=${token};Path:/; Expires=${new Date(
        Date.now() + 1000 * 60 * 60 * 24
      ).toUTCString()}; HttpOnly;`
    );
    res.end(JSON.stringify({ message: "Token is valid" }));
  } catch (err) {
    res.statusCode = 401;
    res.end(JSON.stringify({ message: err.message }));
  }
});
