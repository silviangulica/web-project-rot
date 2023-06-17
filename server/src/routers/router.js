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
      res.setHeader("Access-Control-Allow-Origin", "http://localhost:5500");
      res.setHeader("Access-Control-Allow-Methods", "*");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type");
      res.setHeader("Access-Control-Allow-Credentials", "true");
      res.statusCode = 204;
      res.end();
      return;
    }

    const handler = this.routes[method][path];
    if (handler) {
      res.setHeader("Access-Control-Allow-Origin", "http://localhost:5500");
      res.setHeader("Access-Control-Allow-Credentials", "true");
      handler(req, res);
    } else {
      res.statusCode = 404;
      res.end("Not Found");
    }
  }
}

const router = new Router();

module.exports = router;
