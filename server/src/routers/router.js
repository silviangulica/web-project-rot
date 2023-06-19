class Router {
  constructor() {
    this.routes = [];
  }

  add(method, pathPattern, handler) {
    this.routes.push({
      method,
      pathPattern,
      handler,
    });
    this.routes.sort((a, b) => b.pathPattern.length - a.pathPattern.length);
  }

  handle(req, res) {
    const method = req.method.toLowerCase();
    const path = req.url;

    if (method === "options") {
      res.statusCode = 204;
      res.end();
      return;
    }
    for (const route of this.routes) {
      if (route.method.toLowerCase() === method) {
        const match = path.match(route.pathPattern);
        if (match) console.log(match);
        if (match) {
          console.log(match);
          const params = match.slice(1);

          req.params = params;
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
