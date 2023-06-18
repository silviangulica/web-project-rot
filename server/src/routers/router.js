class Router {
  constructor() {
    this.routes = [];
  }

  add(method, pathPattern, handler) {
    this.routes.push({
      method,
      pathPattern,
      handler
    });
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

    for (const route of this.routes) {
      if (route.method.toLowerCase() === method) {
        const match = path.match(route.pathPattern);
        if (match) {
          const params = match.slice(1);
          req.params = params;
          res.setHeader("Access-Control-Allow-Origin", "http://localhost:5500");
          res.setHeader("Access-Control-Allow-Credentials", "true");
          route.handler(req, res);
          return;
        }
      }
    }

    res.statusCode = 404;
    res.end("Not Found");
  }
}

const router = new Router();

module.exports = router;
