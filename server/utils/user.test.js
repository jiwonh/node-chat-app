const expect = require('expect');
const {Users} = require('./users');

describe('Users', () => {
  var users;

  beforeEach(() => {
    users = new Users();
    users.users = [{
      id: '1',
      name: 'John',
      room: 'Node Course'
    }, {
      id: '2',
      name: 'Mike',
      room: 'Angular Course'
    }, {
      id: '3',
      name: 'Jane',
      room: 'Node Course'
    }];
  });

  it('should create a new user', () => {
    var user = {
      id: '123',
      name: 'Jiwon',
      room: 'Node Study Room'
    };

    var users = new Users();
    var resultUser = users.addUser(user.id, user.name, user.room);

    expect(users.users).toEqual([user]);
  });

  it('should return names for node course', () => {
    var userList = users.getUserList('Node Course');

    expect(userList).toEqual(['John', 'Jane']);
  });

  it('should return names for angular course', () => {
    var userList = users.getUserList('Angular Course');

    expect(userList).toEqual(['Mike']);
  });

  it('should find user', () => {
    var userId = '2';
    var user = users.getUser(userId);

    expect(user.id).toEqual(userId);
  });

  it('should not find user', () => {
    var userId = '99';
    var user = users.getUser(userId);

    expect(user).toNotExist();
  });

  it('should remove user', () => {
    var userId = '2';
    var removedUser = users.removeUser(userId);

    expect(removedUser.id).toBe(userId);
    expect(users.users.length).toBe(2);
  });

  it('should not remove user', () => {
    var removedUser = users.removeUser('99');

    expect(removedUser).toNotExist();
    expect(users.users.length).toBe(3);
  });

  it('should return true if name already taken in room', () => {
    var result = users.isUserNameTaken('Jane', 'Node Course');

    expect(result).toBe(true);
  });

  it('should return false if name not taken in room', () => {
    var result = users.isUserNameTaken('New User', 'Node Course');

    expect(result).toBe(false);
  });

  it('should return false if name already taken but not same room', () => {
    var result = users.isUserNameTaken('Jane', 'New Room');
    
    expect(result).toBe(false);
  });

  it('should return unique rooms', () => {
    var uniqueRooms = users.getRoomList();

    expect(uniqueRooms.length).toBe(2);
  });
});
