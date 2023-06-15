const userService = require("./UserService");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const saltRounds = 10;
const secretKey = process.env.JWT_SECRET_KEY;

const register = async (username, email, password) => {
  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const user = await userService.createUser(username, email, hashedPassword);
  return user;
};

const login = async (username, password) => {
  const user = await userService.findUserByUsername(username);

  if (!user) {
    throw new Error(`User ${username} was not found`);
  }

  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    throw new Error(`Password is not correct!`);
  }

  const token = jwt.sign({ id: user.id }, secretKey, { expiresIn: "24h" });
  return { user, token };
};
module.exports = {
  register,
  login,
};
