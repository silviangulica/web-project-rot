const querystring = require("querystring");
const errors = require("./CustomErrors");
function getRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      resolve(body);
    });

    req.on("error", (err) => {
      reject(err);
    });
  });
}

function handleErrors(err, res) {
  code = undefined;
  if (
    err instanceof errors.TokenInvalidError ||
    err instanceof errors.InvalidCredentialsError
  )
    res.statusCode = 401;
  else if (err instanceof errors.UserHasNoPermissionError) res.statusCode = 403;
  else if (
    err instanceof errors.UserNotFoundError ||
    err instanceof errors.QuizDoesNotExistError
  )
    res.statusCode = 404;
  else {
    res.statusCode = 400;
    if (err instanceof errors.UsernameDuplicateError)
      code = "username_duplicate";
    else if (err instanceof errors.EmailDuplicateError)
      code = "email_duplicate";
    else if (err instanceof errors.PasswordTooShortError) {
      code = "password_too_short";
    }
  }
  let response = { message: err.message };
  if (code) response.code = code;
  res.end(JSON.stringify(response));
}
module.exports = {
  getRequestBody,
  handleErrors,
};
