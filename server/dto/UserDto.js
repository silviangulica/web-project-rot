class UserDto {
  constructor(user) {
    this.id = user._id;
    this.username = user.username;
    this.email = user.email;
    this.profilePicture = user.profilePicture;
    this.quizzesPassed = user.quizzesPassed;
    this.correctAnswers = user.correctAnswers;
    this.wrongAnswers = user.wrongAnswers;
    this.totalScore = user.totalScore;
    this.quizList = user.quizList;
  }
}

function userToUserDtoMapper(user) {
  return new UserDto(user);
}
module.exports = {
  userToUserDtoMapper,
};
