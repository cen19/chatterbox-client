var app = {};


app.init = function() {
  
};

var message = {
  username: 'Mel Brooks',
  text: 'It\'s good to be the king',
  roomname: 'lobby'
};


app.send = function() {
  $.ajax({
    type: 'POST',
    url: 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: null,
  });
};

app.fetch = function () { 
  $.ajax({
    type: 'GET',
    url: url,
    
  });
};

app.clearMessages = function() {
  $('#chats').remove();
};

var message = {
  username: 'Mel Brooks',
  text: 'Never underestimate the power of the Schwartz!',
  roomname: 'lobby'
};

app.renderMessage = function() {
  
};

app.renderRoom = function() {
  
};