const userService = require("./UserService");
const {
  UserNotFoundError,
  InvalidCredentialsError,
  PasswordTooShortError,
  UsernameDuplicateError,
  EmailDuplicateError,
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

  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const user = await userService.createUser(username, email, hashedPassword);
  return user;
};

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

const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, secretKey);

    if (decoded.exp < Date.now() / 1000) {
      console.log("Token expired");
      throw new TokenInvalidError("Token expired");
    }

    if (decoded.exp - Date.now() / 1000 < 60 * 30) {
      const newToken = jwt.sign(
        { id: decoded.id, role: decoded.role },
        secretKey,
        {
          expiresIn: "12h",
        }
      );
      return newToken;
    }
    return token;
  } catch (err) {
    console.log(err);
    throw new TokenInvalidError("Token invalid");
  }
};

const checkThatTokenIsPresent = (req) => {
  let token = req.headers.cookie;
  if (token === undefined) {
    throw new TokenInvalidError("Token is not present");
  }
  token = token.substring("token=".length);
  return token;
};
const verifyIfRequestCameFromUser = (req, userId) => {
  let token = checkThatTokenIsPresent(req);
  token = jwt.verify(token, secretKey);
  if (token.id !== userId) {
    throw new TokenInvalidError("Request came from another user");
  }
};
module.exports = {
  register,
  login,
  verifyToken,
  checkThatTokenIsPresent,
  verifyIfRequestCameFromUser,
};
