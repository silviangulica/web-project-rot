const userService = require("./UserService");
const {
  UserNotFoundError,
  InvalidCredentialsError,
  PasswordTooShortError,
  UsernameDuplicateError,
  EmailDuplicateError,
  UserHasNoPermissionError,
  TokenInvalidError,
} = require("../utils/CustomErrors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const saltRounds = 10;
const secretKey = process.env.JWT_SECRET_KEY;

const register = async (username, email, password) => {
  if (password.length < 6) {
    throw new PasswordTooShortError("Password must be at least 6 characters");
  }
  checkIfUserExists = await userService.findUserByUsername(username);
  if (checkIfUserExists) {
    throw new UsernameDuplicateError(`Username ${username} already exists`);
  }

  checkIfEmailExists = await userService.findByEmail(email);
  if (checkIfEmailExists) {
    throw new EmailDuplicateError(`Email ${email} already exists`);
  }

  const hashedPassword = await getHashedPassword(password);
  const user = await userService.createUser(username, email, hashedPassword);
  return user;
};

/* If user credentials are valid, create the token and return it with the user
 */
const login = async (email, password) => {
  const user = await userService.findByEmail(email);

  if (!user) {
    throw new UserNotFoundError(`User email ${email} was not found`);
  }

  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    throw new InvalidCredentialsError(`Password is not correct!`);
  }

  const token = jwt.sign({ id: user.id, role: user.role }, secretKey, {
    expiresIn: "12h",
  });
  return { user, token };
};

/* Verify if the token is valid and if the user has the required role and
  refreshes the token if it is about to expire ( 30 minutes left)
  * If the token is valid, return the user id
 */
const verifyAuthorization = (req, res, requiredRole) => {
  let token = checkThatTokenIsPresent(req);
  const decoded = jwt.verify(token, secretKey);
  verifyRole(decoded.role, requiredRole);

  if (decoded.exp - Date.now() / 1000 < 60 * 30) {
    const newToken = jwt.sign(
      { id: decoded.id, role: decoded.role },
      secretKey,
      {
        expiresIn: "12h",
      }
    );
    res.setHeader(
      "Set-Cookie",
      `token=${newToken};Path:/; Expires=${new Date(
        Date.now() + 1000 * 60 * 60 * 24
      ).toUTCString()}; HttpOnly;`
    );
  }

  return decoded.id;
};

const checkThatTokenIsPresent = (req) => {
  let token = req.headers.cookie;
  if (token === undefined) {
    throw new TokenInvalidError("Token is not present");
  }
  token = token.substring("token=".length);
  return token;
};

const verifyRole = (role, requiredRole) => {
  if (role === "admin" || role === requiredRole) {
    return;
  }
  throw new UserHasNoPermissionError("User has no permission");
};

const getHashedPassword = async (password) => {
  return await bcrypt.hash(password, saltRounds);
};

module.exports = {
  register,
  login,
  checkThatTokenIsPresent,
  verifyAuthorization,
  getHashedPassword,
};
