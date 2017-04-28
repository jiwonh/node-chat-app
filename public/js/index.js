var socket = io();

socket.on('connect', function () {
  console.log('Connected to server.');
});

socket.on('disconnect', function () {
  console.log('Disconnected from server.');
});

socket.on('newMessage', function (message) {
  var userType = (message.from === 'Admin') ? 'admin' : 'user'
  var messages = $("#messages");
  var li = $('<li/>').addClass(userType);
  var messageHeader = $('<div class="message-header"/>').text(new Date(message.createdAt));
  var messageBody = $('<div/>').addClass('message-body').append(
    $('<span/>').addClass('user-name').text(message.from + ': '),
    message.text
  );
  li.append(messageBody);
  messages.append(li);
  messages.scrollTop(messages[0].scrollHeight);
});

socket.on('newLocationMessage', function (message) {
  var li = $('<li/>');
  var a = $('<a target="_blank">My current location</a>');

  a.attr('href', message.url);
  li.append('<span class="user-name">' + message.from + '</span>: ');
  li.append(a);
  $("#messages").append(li);
});

$("#message-form").on('submit', function (e) {
  e.preventDefault();

  var messageTextBox = $('#message');

  if (messageTextBox.val()) {
    socket.emit('createMessage', {
      from: 'User',
      text: messageTextBox.val()
    }, function (res) {
      console.log(res);
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
    locationButton.removeAttr('disabled');
    alert('Unable to fetch location.').text('Send Location');
  });
});
