var socket = io();

socket.on('connect', function () {
  console.log('Connected to server.');
});

socket.on('disconnect', function () {
  console.log('Disconnected from server.');
});

socket.on('newMessage', function (message) {
  $("#chatWindow")
    .append("<div class='user'><span class='name'>" + message.from + "</span> at " + new Date(message.createdAt) + "</div>")
    .append("<div class='message'>" + message.text + "</div>");

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
