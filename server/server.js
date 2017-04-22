const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

require('./config/express')(app);
require('./config/routes')(app);

io.on('connection', (socket) => {
  console.log('New user is connected.');

  socket.emit('newMessage', {
    from: 'Admin',
    text: 'Welcome to the chat app.',
    createdAt: new Date().getTime()
  });

  socket.broadcast.emit('newMessage', {
    from: 'Admin',
    text: 'New user joined.',
    createdAt: new Date().getTime()
  });

  socket.on('disconnect', () => {
    console.log('User was disconnected');
  });

  socket.on('createMessage', (message) => {
    console.log('createMessage:', message);

    io.emit('newMessage', {
      from: message.from,
      text: message.text,
      createdAt: new Date().getTime()
    });

    // socket.broadcast.emit('newMessage', {
    //   from: message.from,
    //   text: message.text,
    //   createdAt: new Date().getTime()
    // });
  });

});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
