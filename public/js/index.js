function existRoomSelectionChange () {
  var selectedOptionValue = $('#existRoom').find(':selected').text();

  if (selectedOptionValue) {
    $('#room').prop('disabled', true);
  } else {
    $('#room').prop('disabled', false);
  }
};

function joinFormSubmit () {
  var selectedOptionValue = $('#existRoom').find(':selected').text();

  if (!selectedOptionValue) {
    $('#existRoom').prop('disabled', true);
  }
};

$('#existRoom').on('change', existRoomSelectionChange);
$(window).on('load', existRoomSelectionChange);
$('form[name="joinForm"]').submit(joinFormSubmit);
