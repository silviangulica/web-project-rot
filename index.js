
const http = require('http');
const fs = require('fs');

const server = http.createServer(function(req, res) {
  if (req.method === 'GET' && req.url === '/') {
    res.setHeader('Content-Type', 'text/html');
    fs.readFile('index.html', function(err, data) {
      if (err) {
        res.statusCode = 500;
        res.end('Error reading index.html');
      } else {
        res.statusCode = 200;
        res.end(data);
      }
    });
  } else {
    res.statusCode = 404;
    res.end('Not found');
  }
});

// Listen on port 3000
server.listen(3000);