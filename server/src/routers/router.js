class Router {
  constructor() {
    this.routes = {};
  }

  add(method, path, handler) {
    if (!this.routes[method]) {
      this.routes[method] = {};
    }
    this.routes[method][path] = handler;
  }

  handle(req, res) {
    const method = req.method.toLowerCase();
    const path = req.url;

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
