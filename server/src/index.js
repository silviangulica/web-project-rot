const http = require("http");
const usersController = require("./controllers/UserController");

const router = usersController;

const server = http.createServer((req, res) => {
  router.handle(req, res);
});

server.listen(3000, () => {
  console.log("Serverul a pornit la portul 3000");
});
