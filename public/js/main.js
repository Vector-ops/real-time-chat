const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");

// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

console.log({ username, room });

const socket = io();
//Join chat room
socket.emit("joinRoom", { username, room });

// Set room name and users
socket.on("roomInfo", ({ username, room }) => {
  setRoomInfo({ username, room });
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
  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;

  // Clear input
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

// Output message to DOM
const outputMessage = (message) => {
  console.log(message);
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `
  <p class="meta">${message.username} <span>${message.time}</span></p>
  <p class="text">${message.text}</p>`;
  document.querySelector(".chat-messages").appendChild(div);
};

const setRoomInfo = ({ username, room }) => {
  const roomName = document.getElementById("room-name");
  const Users = document.getElementById("users");
  const user = document.createElement("li");
  user.innerText = username;
  roomName.innerText = room;
  Users.appendChild(user);
};
