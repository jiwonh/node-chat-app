const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const port = process.env.PORT || 3000;
const {generateMessage} = require('./utils/message');

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

require('./config/express')(app);
require('./config/routes')(app);

io.on('connection', (socket) => {
  console.log('New user is connected.');

  socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app.'));

  socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined.'));

  socket.on('createMessage', (message, callback) => {
    console.log('createMessage:', message);

    io.emit('newMessage', generateMessage(message.from, message.text));
    // socket.broadcast.emit('newMessage', generateMessage(message.from, message.text));

    callback({
      success: true
    });
  });

  socket.on('disconnect', () => {
    console.log('User was disconnected');
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
