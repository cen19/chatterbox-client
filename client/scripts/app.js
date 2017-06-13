var app = {
  //TODO: The current 'handleUsernameClick' function just toggles the class 'friend'
  //to all messages sent by the user

  // set the server url for easier future reference
  server: 'http://parse.CAMPUS.hackreactor.com/chatterbox/classes/messages',
  // set default username
  username: 'anon',
  // set default room
  roomname: 'lobby', // default room name
  lastMessageId: 0, // have a default last message id so that they are sorted properly
  friends: {}, // storage as object for friends
  messages: [], // storage as array for messages

  init: function() {
    // get the username
    app.username = window.location.search.substr(10); // check  this out, might be because of the url?

    // Cache jQuery selectors?
      // setting jQuery properties for app equal to the id/class lookup?
    app.$message = $('#message');
    app.$chats = $('#chats');
    app.$roomSelect = $('#roomSelect');
    app.$send = $('#send');

    // adding listeners
      // jQuery.on is a listener
    app.$chats.on('click', '.username', app.handleUsernameClick); // cached version points to the (#chats) class in the DOM and attaches the listener
    app.$send.on('change', app.handleSubmit);
    app.$roomSelect.on('change', app.handleRoomChange);


    // fetching previous messages
    app.startSpinner(); // starts the image gif to show that the messages are loading
    app.fetch(false);

    // poll for new messages
    setInterval(function() {
      app.fetch(true);
    }, 3000); // does the action every 3 seconds
  }, // end of init function

  send: function(message) {
    app.startSpinner();

    // POST to server
    $.ajax({
      url: app.server,
      type: 'POST',
      data: message,
      success: function(data) {
        // clear messages input on success of server response
        app.$message.val('');

        // trigger a fetch to update the messages, pass true to animate 
        app.fetch();
      },
      error: function(error) {
        console.error('chatterbox: failed to send message', error);
      }
    });
  },

  fetch: function(animate) {
    $.ajax({
      url: app.server,
      type: 'GET',
      data: {
        order: '-createdAt'
      },
      contentType: 'application/json',
      success: function(data) {
        // if there is no data, just return out of it
        if (!data.results || !data.results.length) {
          return;
        }

        // store messages for caching later
        app.messages = data.results;

        // getting the last message
        var mostRecentMessage = data.results[data.results.length - 1];

        // only bother updating the dom if we have a new message
        if (mostRecentMessage.objectId !== app.lastMessageId) {
          // update the UI with new fetched rooms
          app.renderRoomList(data.results);

          app.renderMessages(data.results, animate);

          // store the ID of the most recent message
          app.lastMessageId = mostRecentMessage.objectId;
        }
      },
      error: function(error) {
        console.error('chatterbox: failed to fetch messages', error);
      }
    });
  },

  clearMessages: function() {
    app.$chats.html('');
  },

  renderMessage: function(messages, animate) {
    // clear existing messages
    app.clearMessages();
    app.stopSpinner();
    if (Array.isArray(messages)) {
      messages.filter(function(message) {
        return message.roomname === app.roomname || app.roomname === 'lobby' && !message.roomname;
      }).forEach(app.renderMessage);
    }

    // make it scroll to the top
    if (animate) {
      $('body').animate({scrollTop: '0px'}, 'fast');
    }
  },

  renderRoomList: function(messages) {
    app.$roomSelect.html('<option value="__newroom">New Room...</option>');

    if (messages) {
      var rooms = {};
      messages.forEach(function(message) {
        var roomname = message.roomname;
        if (roomname && !rooms[roomname]) {
          // add the room to the select menu
          app.renderRoomList(roomname);

          // store that we've added this room
          room[roomname] = true;
        }
      });
    }

    // select the menu option
    app.$roomSelect.val(app.roomname);
  },

  renderRoom: function(roomname) {
    // prevent XSS by escaping with DOM methods
    var $option = $('<option/>').val(roomname).text(roomname);

    // add to select
    app.$roomSelect.append($option);
  },

  renderMessage: function(message) {
    if (!message.roomname) {
      message.roomname = 'lobby';
    }

    // create a div to hold the chats
    var $chat = $('<div class="chat"/>');

    // add in the message data using dom methods to avoid XSS
    // store the username in the leemnt's data attribute
    var $username = $('<span class="username"/>');
    $username.text(message.username + ': ').attr('data-roomname', message.roomname).attr('data-username', message.username).appendTo($chat);
  
    // add the friend class
    if (app.friends[message.username] === true) {
      $username.addClass('friend');
    }

    var $message = $('<br><span/>');
    $message.text(message.text).appendTo($chat);

    // add the message to the UI
    app.$chats.append($chat);

  },

  handleUsernameClick: function(event) {
    // get the username from data attr
    var username = $(event.target).data('username');

    if (username !== undefined) {
      // toggle friend
      app.friends[username] = !app.friends[username];

      // escape the username it case it contains a quote
      var selector = '[data-username="' + username.replace(/"/g, '\\\"') + '"]';
      // add friend's css class to  all of tha tuser's messages
      var $usernames = $(selector).toggleClass('friend');
    }
  },

  handleRoomChange: function(event) {
    var selectIndex = app.$roomSelect.prop('selectedIndex');
    // new room is always the first option
    if (selectIndex === 0) {
      var roomname = prompt('enter room name');
      if (roomname) {
        // set as the current room
        app.roomname = roomname;

        // add room to the menu
        app.renderRoom(roomname);

        // select the menu option
        app.$roomSelect.val(roomname);
      }
    } else {
      app.startSpinner();
      // store as undefined for empty names
      app.roomname = app.$roomSelect.val();
    }
    // rerender messages
    app.renderMessages(app.messages);
  },

  handleSubmit: function (event) {
    var message = {
      username: app.username,
      text: app.$message.val(),
      roomname: app.roomname || 'lobby'
    };

    app.send(message);

    // stop the form from submitting
    event.preventDefault();
  },

  startSpinner: function() {
    $('.spinner img').show();
    $('form input[type=submit]').attr('disabled', 'true');
  },

  stopSpinner: function() {
    $('spinner img').fadeOut('fast');
    $('form input[type=submit]').attr('disabled', null);
    
  }

};

