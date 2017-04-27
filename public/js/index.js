var socket = io();

socket.on('connect', function () {
  console.log('Connected to server.');
});

socket.on('disconnect', function () {
  console.log('Disconnected from server.');
});

socket.on('newMessage', function (message) {
  var wrapperClassName = (message.from === 'Admin') ? 'admin' : 'user'
  var chatWindow = $("#chatWindow");

  chatWindow
    .append(
      $('<li />').addClass(wrapperClassName + ' messages').append(
        $('<div />', {'class': 'header'}).append(
          $('<span />', {'class': 'name'}).text(message.from),
          ' at ' + new Date(message.createdAt)
        ),
        $('<div />', {'class': 'body'}).text(message.text)
      )
    );

  chatWindow.scrollTop(chatWindow[0].scrollHeight);
});

socket.on('newLocationMessage', function (message) {
  var li = $('<li />');
  var a = $('<a target="_blank">My current location</a>');

  a.attr('href', message.url);
  li.text(message.from + ': ');
  li.append(a);
  $("#chatWindow").append(li);
});

$("#chatForm").on('submit', function (e) {
  e.preventDefault();

  var from = $("#from").val();
  var text = $("#text").val();

  if (from && text) {
    socket.emit('createMessage', {
      from: from,
      text: text
    }, function (res) {
      $("#text").val("");
      console.log(res);
    });
  }
});

var locationButton = $('#send-location');

locationButton.on('click', function (e) {
  e.preventDefault();

  if (!navigator.geolocation) {
    return alert('Your browser not supported geo location service.');
  }

  var from = $("#from").val();

  navigator.geolocation.getCurrentPosition(function (position) {
    if (from) {
      socket.emit('createLocationMessage', {
        from: from,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
    }
  }, function (err) {
    alert('Unable to fetch location.');
  });
});
