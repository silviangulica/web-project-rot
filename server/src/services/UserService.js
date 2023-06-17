const User = require("../models/User");

const createUser = async (username, email, password) => {
  const user = new User({
    username,
    email,
    password,
  });

  await user.save();

  return user;
};

const getUsers = async () => {
  const users = await User.find();
  return users;
};

const findUserByUsername = async (usernameToSearch) => {
  const user = await User.findOne({ username: usernameToSearch });
  return user;
};

const findByEmail = async (emailToSearch) => {
  const user = await User.findOne({ email: emailToSearch });
  return user;
};
module.exports = {
  createUser,
  getUsers,
  findUserByUsername,
  findByEmail,
};
