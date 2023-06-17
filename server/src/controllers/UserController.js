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
// module.exports = router;
