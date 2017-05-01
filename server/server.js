const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const port = process.env.PORT || 3000;
const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');

var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

require('./config/express')(app);
require('./config/routes')(app, users);

io.on('connection', (socket) => {

  socket.on('join', (params, callback) => {
    params.room = params.room.toLowerCase();

    if (!isRealString(params.name) || !isRealString(params.room)) {
      return callback('Display name and room name is required.');
    } else if (users.isUserNameTaken(params.name, params.room)) {
      return callback('Display name already taken.');
    }

    console.log(`${params.name} has joined to ${params.room}.`);

    // join to socket
    socket.join(params.room);

    users.removeUser(socket.id);

    // add user to users
    users.addUser(socket.id, params.name, params.room);

    io.to(params.room).emit('updateUserList', users.getUserList(params.room));

    // send welcom message to only new user
    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app.'));

    // broadcast to other users
    socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} joined.`));

    callback();
  });

  socket.on('createMessage', (message, callback) => {
    var user = users.getUser(socket.id);

    if (user && isRealString(message.text)) {
      io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
    }

    callback();
  });

  socket.on('createLocationMessage', (coords) => {
    var user = users.getUser(socket.id);

    if (user) {
      io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
    }
  });

  socket.on('disconnect', () => {
    var user = users.removeUser(socket.id);

    if (user) {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));

      console.log(`${user.name} has left from ${user.room}.`);
    }
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port} `);
});
