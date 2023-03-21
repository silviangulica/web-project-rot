const path = require("path");
const { readFile } = require("./fileIO");

function route(url, callback) {
  let filePath = url;

  // Default routing
  if (url === "/") {
    filePath = "../UI/index.html";
  }

  // For css/html
  if (filePath != "../UI/index.html") filePath = "../UI" + filePath;

  const extname = String(path.extname(filePath)).toLowerCase();
  let contentType = "text/html";

  if (extname === ".css") {
    contentType = "text/css";
  } else if (extname === ".js") {
    contentType = "text/javascript";
  } else if (extname === "") {
    filePath = filePath + ".html"; // <- if no extension and no default routing, then add .html and load the file
  }

  readFile(filePath, (err, content) => {
    if (err) {
      callback(err);
    } else {
      callback(null, contentType, content);
    }
  });
}

module.exports = { route };
