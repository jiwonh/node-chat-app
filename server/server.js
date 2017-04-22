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

  socket.on('disconnect', () => {
    console.log('User was disconnected');
  });

  socket.on('createMessage', (message) => {
    message.createdAt = new Date().getTime();
    console.log('createMessage:', message);
    io.emit('newMessage', message);
  });

});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
