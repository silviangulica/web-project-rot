const router = require("../routers/router");

router.add("post", "/login", (req, res) => {
  res.setHeader("Content-Type", "application/json");

  res.end(JSON.stringify({ message: "Login" })); 
});

module.exports = router;