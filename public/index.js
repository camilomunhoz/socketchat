$(document).ready(() => {
  let socket = io("http://localhost:3000");
  let username = "";
  $("input[name=username]").focus();

  function isEmpty(val) {
    if (val.length && val != "" && !/^\s+$/.test(val)) {
      return false;
    } else {
      return true;
    }
  }

  // "LOGIN"
  function flip() {
    if (!isEmpty($("input[name=username]").val())) {
      $("#chat").toggleClass("is-flipped");
      username = $("input[name=username]").val().trim();
      for (msg of previousMessages) renderMessage(msg);
      $("input[name=message]").focus();
    } else {
      $("input[name=username]").focus();
    }
  }
  $("#front button").on("click", flip);
  $("input[name=username]").on("keydown", (e) => {
    if (e.key === "Enter") flip();
  });

  // RENDER MESSAGES
  function renderMessage(msg) {
    $("#messages").append(
      `<div class='message'><span>${
        msg.author == username
          ? "<strong class='you'>Você:</strong>"
          : "<strong>" + msg.author + ":</strong>"
      } ${msg.message}</span><em>${msg.timestamp}</em></div>`
    );
  }
  let previousMessages = [];
  socket.on("previousMessages", (msgs) => {
    previousMessages = msgs; // Will render on "login"
  });
  socket.on("receivedMessage", (msg) => {
    renderMessage(msg);
  });

  // SEND MESSAGE
  function sendMessage() {
    let message = $("input[name=message]").val();
    let timestamp = new Date();

    if (!isEmpty(username) && !isEmpty($("input[name=message]").val())) {
      $("input[name=message]").val("").focus();
      let messageObject = {
        author: username,
        message: message,
        timestamp:
          timestamp.getHours() +
          ":" +
          (timestamp.getMinutes() < 10
            ? "0" + String(timestamp.getMinutes())
            : timestamp.getMinutes()),
      };
      renderMessage(messageObject);
      socket.emit("sendMessage", messageObject);
    }
  }

  $("#back button").on("click", sendMessage);
  $("input[name=message]").on("keydown", (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  });
});
