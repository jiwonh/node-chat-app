class Users {
  constructor () {
    this.users = [];
  }

  addUser (id, name, room) {
    var user = {id, name, room};
    this.users.push(user);

    return user;
  }

  removeUser (id) {
    var user = this.getUser(id);

    if (user) {
        this.users = this.users.filter((user) => user.id !== id);
    }

    return user;
  }

  getUser (id) {
    return this.users.find((user) => user.id === id);
  }

  getUserList (room) {
    var users = this.users.filter((user) => user.room === room);
    var namesArray = users.map((user) => user.name);

    return namesArray;
  }

  getRoomList () {
    var roomsArray = this.users.map((user) => user.room);
    var uniqueRooms = roomsArray.filter((room, index, self) => {
      return self.indexOf(room) === index;
    });

    return uniqueRooms;
  }

  isUserNameTaken (name, room) {
    var user = this.users.find((user) => user.name.toLowerCase() === name.toLocaleLowerCase() && user.room === room);

    if (user) {
      return true;
    }
    return false;
  }
}

module.exports = {Users};
