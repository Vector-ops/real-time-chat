const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");

// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();
//Join chat room
socket.emit("joinRoom", { username, room });

// Get room name and users
socket.on("roomUsers", ({ room, users }) => {
  setRoomInfo(room);
  updateUsers(users);
});

// Message from server
socket.on("message", (message) => {
  outputMessage(message);
});

// Message submit
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const msg = e.target.elements.msg.value;

  // Emit message to server
  socket.emit("chatMessage", msg);

  // Clear input
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Output message to DOM
const outputMessage = (message) => {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `
  <p class="meta">${message.username} <span>${message.time}</span></p>
  <p class="text">${message.text}</p>`;
  document.querySelector(".chat-messages").appendChild(div);
};

// Add room name
const setRoomInfo = (room) => {
  const roomName = document.getElementById("room-name");
  roomName.innerText = room;
};

// Update user list
const updateUsers = (users) => {
  const userList = document.getElementById("users");
  userList.innerHTML = "";
  users.forEach((user) => {
    const li = document.createElement("li");
    li.innerText = user.username;
    userList.appendChild(li);
  });
};
