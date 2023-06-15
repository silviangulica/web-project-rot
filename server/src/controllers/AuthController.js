const router = require("../routers/router");
const { getRequestBody } = require("../utils/RequestUtils");
const { userToUserDtoMapper } = require("../dto/UserDto");
const authService = require("../services/AuthService");
router.add("post", "/register", async (req, res) => {
  try {
    let body = await getRequestBody(req);
    const { username, email, password } = JSON.parse(body);
    const user = await authService.register(username, email, password);
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(userToUserDtoMapper(user)));
  } catch (err) {
    res.statusCode = 400;
    res.end(JSON.stringify({ message: err.message }));
  }
});

router.add("post", "/login", async (req, res) => {
  try {
    let body = await getRequestBody(req);
    const { username, password } = JSON.parse(body);
    const { user, token } = await authService.login(username, password);
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ user: userToUserDtoMapper(user), token }));
  } catch (err) {
    res.statusCode = 401;
    res.end(JSON.stringify({ message: err.message }));
  }
});
