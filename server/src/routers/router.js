const url = require("url");

class Router {
  constructor() {
    this.routes = {};
  }

  add(method, path, handler) {
    if (!this.routes[method]) {
      this.routes[method] = {};
    }
    //extract the named parameters from path stuff like ?id=1
    const paramNames = [];

    this.routes[method][path] = handler;
  }

  handle(req, res) {
    const method = req.method.toLowerCase();
    const parsedPath = url.parse(req.url, true);
    const path = parsedPath.pathname;
    req.params = parsedPath.query;

    if (method === "options") {
      res.statusCode = 204;
      res.end();
      return;
    }

    const handler = this.routes[method][path];
    if (handler) {
      handler(req, res);
    } else {
      res.statusCode = 404;
      res.end("Not Found");
    }
  }
}

const router = new Router();

module.exports = router;
