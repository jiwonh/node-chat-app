var socket = io();

var addChatMessage = function (from, createdAt, html) {
  var formattedTime = moment(createdAt).format('MMM Do YYYY h:mm:ss a');
  var template = $('#message-template').html();
  var html = Mustache.render(template, {
    from: from,
    createdAt: formattedTime,
    text: html
  });
  var messages = $("#messages");

  messages.append(html);
  messages.scrollTop(messages[0].scrollHeight);
  $('#text-box').focus();
};

socket.on('connect', function () {
  console.log('Connected to server.');
});

socket.on('disconnect', function () {
  console.log('Disconnected from server.');
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

  if (messageTextBox.val()) {
    socket.emit('createMessage', {
      from: 'User',
      text: messageTextBox.val()
    }, function (res) {
      //console.log(res);
      messageTextBox.val('');
    });
  }
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
      from: 'User',
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, function (err) {
    locationButton.removeAttr('disabled').text('Send Location');
    alert('Unable to fetch location.');
  });
});
