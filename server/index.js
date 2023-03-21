const http = require("http");
const path = require("path");
const { route } = require("./routing");
const { readFile } = require("./fileIO");

const server = http.createServer((req, res) => {
  let filePath = req.url;

  route(filePath, (err, contentType, content) => {
    if (err) {
      res.writeHead(err.code);
      res.end(`${err.code} ${err.message}`);
    } else {
      res.writeHead(200, { "Content-Type": contentType });
      res.end(content, "utf-8");
    }
  });
});

const port = 3000;
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
