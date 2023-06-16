class UserNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "UserNotFoundError";
  }
}

class InvalidCredentialsError extends Error {
  constructor(message) {
    super(message);
    this.name = "InvalidCredentialsError";
  }
}

class PasswordTooShortError extends Error {
  constructor(message) {
    super(message);
    this.name = "PasswordTooShortError";
  }
}

class InvalidTokenError extends Error {
  constructor(message) {
    super(message);
    this.name = "InvalidTokenError";
  }
}

module.exports = {
  UserNotFoundError,
  InvalidCredentialsError,
  InvalidTokenError,
  PasswordTooShortError,
};
