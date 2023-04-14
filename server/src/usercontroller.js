const Router = require("./router");

const router = new Router();

router.add("get", "/users", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({ message: "Lista utilizatorilor" })); // serializare la JSON
});

module.exports = router;
