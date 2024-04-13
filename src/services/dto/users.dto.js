export default class UsersDTO {
  constructor(user) {
    this.id = user._id;
    this.firstName = user.first_name;
    this.lastName = user.last_name;
    this.age = user.age;
    this.email = user.email;
    this.fullName = `${this.firstName} - ${this.lastName}`;
  }
}
