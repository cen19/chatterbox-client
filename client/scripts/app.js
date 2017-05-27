var app = {};
app.server = 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages';


app.init = function() {
  
};

var message = {
  username: 'Mel Brooks',
  text: 'It\'s good to be the king',
  roomname: 'lobby'
};


$(document).ready(function() {
  app.send = function(obj) { 
    $.ajax({
      type: 'POST',
      url: app.server,
      data: JSON.stringify(obj),
      contentType: 'application/json',
      success: null,
    });
  };

  app.fetch = function () { 
    $.ajax({
      type: 'GET',
      url: app.server
      
    });
  };

  app.clearMessages = function() {        
    $('#chats').empty();
  };

  app.renderMessage = function(obj) {
    
    var $text = $(`<p class ='chat'>${obj.text}</p>`);
    var $username = $(`<p class="username">${obj.username}</p>`);
    var $chatSpan = $username + $text;
    // $chat.attr(text and username ).addClass('chat')
    console.log($username[0]);
    $('#chats').append($username);
  };

  app.renderRoom = function(roomName) {
    console.log($('#roomSelect'));
    $('#roomSelect').append('<p>roomName</p>');
  }; 
  
  
  app.handleUsernameClick = function() { 
    console.log('hello')
    $(document).on('click', '.username', function() {
      $(this).css({'font-weight': 800});
      
    });
    //$('#main').attr()

  };
  
  app.handleSubmit = function() { 
    
  };
  

  app.renderMessage(message);
});




