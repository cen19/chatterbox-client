var app = {};


app.init = function() {
  
};

$(document).ready(function() {
  app.send = function(obj) { 
    $.ajax({
      type: 'POST',
      url: 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages',
      data: JSON.stringify(obj),
      contentType: 'application/json',
      success: null,
    });
  };

  app.fetch = function () { 
    $.ajax({
      type: 'GET',
      url: undefined
      
    });
  };

  app.clearMessages = function() {
    $('#chats').empty();
  };


  app.renderMessage = function(obj) {
    console.log(obj);
    var username = obj.username;
    var roomname = obj.roomname;
    var text = obj.text;
    // $something = $(something)
    // $('#chats').prepend(`<span>${obj.text}</span>`);
    // app.send($(`<span>${obj.text}</span>`).appendTo('#chats'));
    // $('#chats').prepend(`<span>${obj.text}</span>`);
    $('#chats').append('<p>text</p>');
  };

  app.renderRoom = function() {
    
  }; 



  app.renderMessage(message);
});

