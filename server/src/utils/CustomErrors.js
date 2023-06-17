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

class EmailDuplicateError extends Error {
  constructor(message) {
    super(message);
    this.name = "EmailDuplicateError";
  }
}

class InvalidTokenError extends Error {
  constructor(message) {
    super(message);
    this.name = "InvalidTokenError";
  }
}

class UsernameDuplicateError extends Error {
  constructor(message) {
    super(message);
    this.name = "UsernameDuplicateError";
  }
}

module.exports = {
  UserNotFoundError,
  InvalidCredentialsError,
  InvalidTokenError,
  PasswordTooShortError,
  EmailDuplicateError,
  UsernameDuplicateError,
};
