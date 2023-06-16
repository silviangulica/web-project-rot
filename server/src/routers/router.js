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
      res.setHeader("Access-Control-Allow-Origin", "*"); // cand e in productie, trebuie sa fie adresa site-ului in loc de *
      res.setHeader("Access-Control-Allow-Methods", "*");
      res.setHeader("Access-Control-Allow-Headers", "*");
      res.statusCode = 204;
      res.end();
      return;
    }

    const handler = this.routes[method][path];
    if (handler) {
      res.setHeader("Access-Control-Allow-Origin", "*");
      handler(req, res);
    } else {
      res.statusCode = 404;
      res.end("Not Found");
    }
  }
}

const router = new Router();

module.exports = router;
