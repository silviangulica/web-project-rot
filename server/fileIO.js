const fs = require('fs');

function readFile(filePath, callback) {
  fs.readFile(filePath, (err, content) => {
    if (err) {
      callback({ code: 404, message: 'File not found' });
    } else {
      callback(null, content);
    }
  });
}

module.exports = { readFile };
