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

class UsernameDuplicateError extends Error {
  constructor(message) {
    super(message);
    this.name = "UsernameDuplicateError";
  }
}

class TokenInvalidError extends Error {
  constructor(message) {
    super(message);
    this.name = "TokenInvalidError";
  }
}

class UserHasNoPermissionError extends Error {
  constructor(message) {
    super(message);
    this.name = "UserHasNoPermissionError";
  }
}

class QuizDoesNotExistError extends Error {
  constructor(message) {
    super(message);
    this.name = "QuizDoesNotExistError";
  }
}

class InvalidCodeError extends Error {
  constructor(message) {
    super(message);
    this.name = "InvalidCodeError";
  }
}

module.exports = {
  UserNotFoundError,
  InvalidCredentialsError,
  PasswordTooShortError,
  EmailDuplicateError,
  UsernameDuplicateError,
  TokenInvalidError,
  UserHasNoPermissionError,
  QuizDoesNotExistError,
  InvalidCodeError,
};
