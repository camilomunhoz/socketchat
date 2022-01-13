const express = require("express");
const path = require("path");

const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server); // socket.io

app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "public"));
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

app.use("/", (req, res) => {
  res.render("index.html");
});

let messages = [];

// Opens socket connection
io.on("connection", (socket) => {
  console.log(`Socket conectado: ${socket.id}`);

  // Sends the previous messages
  socket.emit("previousMessages", messages);

  // Receives a new message, store it and broadcast it for everyone
  socket.on("sendMessage", (data) => {
    messages.push(data);
    socket.broadcast.emit("receivedMessage", data);
  });
});

server.listen(3000);
