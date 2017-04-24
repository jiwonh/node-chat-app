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
