const http = require('http');
const PORT = process.env.PORT || 3000;

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Physiotherapy Assistant</title>
<style>
  :root {
    --primary: #9c4256; /* Elegant Maroon */
    --primary-light: #fdf2f4; /* Soft Pink Background */
    --text-dark: #333333;
    --text-light: #ffffff;
  }
  body {
    background-color: #f4f4f9;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    margin: 0;
  }
  .chat-container {
    width: 100%;
    max-width: 400px;
    height: 90vh;
    max-height: 700px;
    background: #fff;
    border-radius: 20px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .chat-header {
    background: var(--primary);
    color: var(--text-light);
    padding: 20px;
    font-size: 20px;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .chat-messages {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 15px;
    background: var(--primary-light);
  }
  .message {
    max-width: 80%;
    padding: 12px 16px;
    font-size: 15px;
    line-height: 1.5;
    border-radius: 18px;
  }
  .bot-msg {
    background: #ffffff;
    color: var(--text-dark);
    align-self: flex-start;
    border-bottom-left-radius: 4px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.05);
  }
  .user-msg {
    background: var(--primary);
    color: var(--text-light);
    align-self: flex-end;
    border-bottom-right-radius: 4px;
  }
  .quick-replies {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    padding: 0 20px 10px 20px;
    background: var(--primary-light);
  }
  .quick-btn {
    background: #ffffff;
    border: 1px solid var(--primary);
    color: var(--primary);
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s;
  }
  .quick-btn:hover {
    background: var(--primary);
    color: white;
  }
  .chat-input {
    display: flex;
    padding: 15px;
    background: #fff;
    border-top: 1px solid #eee;
    gap: 10px;
  }
  .chat-input input {
    flex: 1;
    padding: 12px 15px;
    background: #f8f9fa;
    border: 1px solid #e0e0e0;
    border-radius: 25px;
    color: var(--text-dark);
    font-size: 15px;
    outline: none;
  }
  .chat-input button {
    background: var(--primary);
    border: none;
    color: white;
    padding: 0 20px;
    border-radius: 25px;
    font-weight: 600;
    cursor: pointer;
  }
</style>
</head>
<body>
<div class="chat-container">
  <div class="chat-header">
    <span>🛡️ Physiotherapy</span>
    <span style="cursor:pointer; font-size:24px;">&times;</span>
  </div>
  <div class="chat-messages" id="chatMessages"></div>
  <div class="quick-replies" id="quickReplies"></div>
  <div class="chat-input">
    <input type="text" id="userInput" placeholder="Type a message..." onkeypress="handleEnter(event)">
    <button onclick="sendMessage()">Send</button>
  </div>
</div>
<script>
const chatMessages = document.getElementById('chatMessages');
const userInput = document.getElementById('userInput');
const quickRepliesContainer = document.getElementById('quickReplies');
const responses = {
  greeting: "Hello! Welcome to our Physiotherapy clinic. How can I help you today?",
  book: "I can help you book an assessment. What day and time works best for you?",
  pain: "I'm sorry to hear you're in pain. Could you tell me where it hurts?",
  back: "Lower back pain is very common. We can definitely help with that. Would you like to book a session?",
  knee: "Knee issues can be tricky. We'll do a full mobility assessment. Shall we book you in?",
  hours: "We are open Monday to Friday, 8 AM to 6 PM.",
  location: "We are located at 123 Medical Center Drive, Suite 100.",
  default: "I didn't quite catch that. Could you please rephrase, or choose an option below?"
};
function initChat() {
  addMessage(responses.greeting, 'bot');
  showQuickReplies(['Book Session', 'My Back Hurts', 'Opening Hours']);
}
function addMessage(text, sender) {
  const msgDiv = document.createElement('div');
  msgDiv.classList.add('message', sender === 'bot' ? 'bot-msg' : 'user-msg');
  msgDiv.innerText = text;
  chatMessages.appendChild(msgDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}
function showQuickReplies(options) {
  quickRepliesContainer.innerHTML = '';
  options.forEach(option => {
    const btn = document.createElement('button');
    btn.classList.add('quick-btn');
    btn.innerText = option;
    btn.onclick = () => handleQuickReply(option);
    quickRepliesContainer.appendChild(btn);
  });
}
function handleQuickReply(text) {
  addMessage(text, 'user');
  quickRepliesContainer.innerHTML = '';
  processInput(text.toLowerCase());
}
function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;
  addMessage(text, 'user');
  userInput.value = '';
  processInput(text.toLowerCase());
}
function handleEnter(event) {
  if (event.key === 'Enter') sendMessage();
}
function processInput(input) {
  setTimeout(() => {
    let reply = responses.default;
    let nextReplies = [];
    if (input.includes('book') || input.includes('appointment')) {
      reply = responses.book;
      nextReplies = ['Tomorrow', 'Next Week'];
    } else if (input.includes('hurt') || input.includes('pain')) {
      reply = responses.pain;
      nextReplies = ['Back', 'Knee', 'Neck'];
    } else if (input.includes('back')) {
      reply = responses.back;
      nextReplies = ['Book Session', 'Tell me more'];
    } else if (input.includes('knee')) {
      reply = responses.knee;
      nextReplies = ['Book Session'];
    } else if (input.includes('hour') || input.includes('open')) {
      reply = responses.hours;
      nextReplies = ['Book Session', 'Location'];
    } else if (input.includes('hi') || input.includes('hello')) {
      reply = "Hi there! How can I assist you with your recovery today?";
      nextReplies = ['Book Session', 'Opening Hours'];
    }
    addMessage(reply, 'bot');
    if (nextReplies.length > 0) showQuickReplies(nextReplies);
  }, 800);
}
initChat();
</script>
</body>
</html>`;

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(html);
});

server.listen(PORT, () => {
  console.log(`Server is live on port ${PORT}`);
});
