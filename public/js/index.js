var socket = io();

socket.on('connect', function () {
  console.log('Connected to server.');
});

socket.on('disconnect', function () {
  console.log('Disconnected from server.');
});

socket.on('newMessage', function (message) {
  var wrapperClassName = (message.from === 'Admin') ? 'admin' : 'user'

  $("#chatWindow")
    .append(
      $('<div />').addClass(wrapperClassName + ' messages').append(
        $('<div />', {'class': 'header'}).append(
          $('<span />', {'class': 'name'}).append(message.from),
          ' at ' + new Date(message.createdAt)
        ),
        $('<div />', {'class': 'body'}).append(message.text)
      )
    );
    
  $("#chatWindow").scrollTop($("#chatWindow")[0].scrollHeight);
});

function sendMessage (message) {
  var from = $("#from").val();
  var text = $("#text").val();

  if (from && text) {
    socket.emit('createMessage', {
      from: from,
      text: text
    });

    $("#text").val("");
  }
};
