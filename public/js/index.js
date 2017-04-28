var socket = io();

var addChatMessage = function (from, createdAt, text) {
  var formattedTime = moment(createdAt).format('MMM Do YYYY h:mm:ss a');
  var userType = (from === 'Admin') ? 'admin' : 'user';
  var messages = $("#messages");
  var li = $('<li/>').addClass(userType);
  var messageHeader = $('<div class="message-header"/>').text(formattedTime);
  var messageBody = $('<div/>').addClass('message-body').append(
    $('<span/>').addClass('user-name').text(from + ': '),
    text
  );

  li.append(messageHeader, messageBody);
  messages.append(li);
  messages.scrollTop(messages[0].scrollHeight);
  $('#message').focus();
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
  var text = '<a href="' + message.url + '" target="_blank">My current location</a>';
  addChatMessage(message.from, message.createdAt, text);
});

$("#message-form").on('submit', function (e) {
  e.preventDefault();

  var messageTextBox = $('#message');

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
