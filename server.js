const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const formatMessage = require("./utils/messages");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//static modules
app.use(express.static(path.join(__dirname, "public")));

const botName = "ChatMeBot";

// Run when client connects
io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    io.emit("roomInfo", { username, room });
  });

  // Welcome message
  socket.emit("message", formatMessage(botName, "Welcome to LetsChat!"));

  // Broadcast when a user connects
  socket.broadcast.emit(
    "message",
    formatMessage(botName, "A user has joined the chat")
  );

  // Runs when client disconnects
  socket.on("disconnect", () => {
    io.emit("message", formatMessage(botName, "A user has left the chat"));
  });

  // Listen for chatMessage
  socket.on("chatMessage", (msg) => {
    // Send the message to frontend
    io.emit("message", formatMessage("User", msg));
  });
});

const PORT = 3000 || process.env.PORT;

const startServer = () => {
  server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}... `);
  });
};

startServer();
