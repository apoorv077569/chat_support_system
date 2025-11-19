const socket = io("https://chat-support-system.onrender.com");

// Read template values
const ticket_id = document.body.dataset.ticketId;
const user_id = document.body.dataset.userId;
const token = localStorage.getItem("token");

const messagesDiv = document.getElementById("messages");
const inputBox = document.getElementById("message_input");
const sendBtn = document.getElementById("send_btn");

// ----------------------------
// LOAD EXISTING MESSAGES (GET)
// ----------------------------
async function loadMessages() {
  try {
    const res = await fetch(`/api/messages/${ticket_id}`, {
      headers: { Authorization: "Bearer " + token },
    });
    const data = await res.json();

    if (!data.messages) return;

    data.messages.forEach((msg) => {
      addMessage(msg.sender_id, msg.message);
    });
  } catch (err) {
    console.error("Error loading messages:", err);
  }
}

// ----------------------------
// ADD MESSAGE TO UI
// ----------------------------
function addMessage(sender, message) {
  sender = String(sender);
  const currentUser = String(user_id);

  const div = document.createElement("div");
  div.classList.add("msg");

  if(sender === currentUser){
    div.classList.add("me");
    div.textContent = message;
  }else{
    div.classList.add("other");
    div.textContent = message;
  }

  messagesDiv.appendChild(div);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// ----------------------------
// SEND MESSAGE (STORE IN DB + SOCKET)
// ----------------------------
async function sendMessage() {
  const message = inputBox.value.trim();
  if (!message) return;

  // 1️⃣ Send to backend DB
  const res = await fetch("/api/messages/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({
      ticket_id,
      message,
    }),
  });

  const data = await res.json();

  if (!data.message) {
    console.error("DB Save Error:", data);
    return;
  }

  // 2️⃣ Emit via socket for real-time display
  socket.emit("send_message", {
    ticket_id,
    sender_id: user_id,
    message,
  });

  // 3️⃣ Add message instantly to UI
  addMessage(user_id, message);

  inputBox.value = "";
}

// send button
sendBtn.addEventListener("click", sendMessage);

// Enter key support
inputBox.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    sendMessage();
  }
});

// ----------------------------
// RECEIVE MESSAGE SOCKET
// ----------------------------
socket.on("receive_message", (data) => {
  if (data.ticket_id != ticket_id) return;
  if (data.sender_id == user_id) return; // avoid duplicate

  addMessage(data.sender_id, data.message);
});

// Join room
socket.emit("join_ticket", { ticket_id });

// Leave room
window.addEventListener("beforeunload", () => {
  socket.emit("leave_ticket", { ticket_id });
});

// Load old messages on page open
loadMessages();
