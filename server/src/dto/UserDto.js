class UserDto {
  constructor(user) {
    this.id = user.id;
    this.username = user.username;
    this.email = user.email;
  }
}

function userToUserDtoMapper(user) {
  return new UserDto(user);
}
module.exports = {
  userToUserDtoMapper,
};
