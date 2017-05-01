var socket = io();
var params = $.deparam(window.location.search);

var scrollToBottom = function () {
  // Selectors
  var messages = $('#messages');
  var newMessage = messages.children('li:last-child');
  // Heights
  var scrollTop = messages.prop('scrollTop');
  var clientHeight = messages.prop('clientHeight');
  var scrollHeight = messages.prop('scrollHeight');
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();

  // avoid to scroll to bottom when user reading old messages.
  if (scrollTop + clientHeight + newMessageHeight + lastMessageHeight >= scrollHeight) {
    messages.scrollTop(scrollHeight);
  }
};

var addChatMessage = function (from, createdAt, html) {
  var messages = $("#messages");
  var formattedTime = moment(createdAt).format('h:mm:ss a');
  var template = $('#message-template').html();
  var html = Mustache.render(template, {
    isAdmin: from === 'Admin',
    from: from,
    createdAt: formattedTime,
    text: html
  });

  messages.append(html);
  scrollToBottom();
  $('#text-box').focus();
};

socket.on('connect', function () {
  socket.emit('join', params, function (err, users) {
    if (err) {
      alert(err);
      window.location.href = '/';
    } else {
      console.log('No error');
    }
  });
});

socket.on('disconnect', function () {
  console.log('Disconnected from server.');
});

socket.on('updateUserList', function (users) {
  var ol = $('<ol />');

  users.forEach(function (user) {
    ol.append($('<li />').text(user));
  });

  $('#users').html(ol);
});

socket.on('newMessage', function (message) {
  addChatMessage(message.from, message.createdAt, message.text);
});

socket.on('newLocationMessage', function (message) {
  var text = $('<a target="_blank" />').attr('href', message.url).text('My current Location');
  addChatMessage(message.from, message.createdAt, text.prop('outerHTML'));
});

$("#message-form").on('submit', function (e) {
  e.preventDefault();

  var messageTextBox = $('#text-box');

  socket.emit('createMessage', {
    text: messageTextBox.val()
  }, function (res) {
    messageTextBox.val('');
  });

});

var locationButton = $('#send-location');

locationButton.on('click', function () {
  if (!navigator.geolocation) {
    return alert('Your browser not supported geo location service.');
  }

  locationButton.attr('disabled', 'disabled').text('Sending location...');

  navigator.geolocation.getCurrentPosition(function (position) {
    locationButton.removeAttr('disabled').text('Send Location');
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, function (err) {
    locationButton.removeAttr('disabled').text('Send Location');
    alert('Unable to fetch location.');
  });
});
