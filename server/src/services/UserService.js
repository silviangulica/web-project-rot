import { User } from "../models/User";

const createUser = async (username, email, password) => {
  const user = new User({
    username,
    email,
    password,
  });

  await user.save();

  return user;
};

module.exports = {
  createUser,
};
