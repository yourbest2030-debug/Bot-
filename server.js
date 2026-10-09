const http = require('http');
const PORT = process.env.PORT || 3000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Physiotherapy Clinic - AI Assistant</title>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
<style>
  :root {
    --primary: #b8737f; --primary-dark: #9c5a66; --primary-light: #f5e6e8; --bg-soft: #fdf8f9; --text-dark: #4a3035; --text-light: #ffffff;
  }
  body { background: linear-gradient(135deg, #fdf8f9 0%, #f5e6e8 100%); font-family: 'Inter', sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
  .chat-container { width: 100%; max-width: 420px; height: 92vh; max-height: 750px; background: #ffffff; border-radius: 24px; box-shadow: 0 20px 60px rgba(184, 115, 127, 0.15); display: flex; flex-direction: column; overflow: hidden; border: 1px solid rgba(184, 115, 127, 0.1); }
  .chat-header { background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%); color: var(--text-light); padding: 20px; display: flex; align-items: center; justify-content: space-between; }
  .header-content { display: flex; align-items: center; gap: 12px; }
  .header-text h1 { font-family: 'Playfair Display', serif; font-size: 18px; margin: 0; }
  .header-text p { font-size: 11px; opacity: 0.9; margin: 2px 0 0 0; }
  .voice-indicator { font-size: 12px; background: rgba(255,255,255,0.2); padding: 4px 10px; border-radius: 12px; display: none; }
  .voice-indicator.active { display: block; animation: pulse 1.5s infinite; }
  @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }
  .chat-messages { flex: 1; padding: 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 16px; background: var(--bg-soft); }
  .message { max-width: 82%; padding: 14px 18px; font-size: 14px; line-height: 1.6; border-radius: 20px; }
  .bot-msg { background: #ffffff; color: var(--text-dark); align-self: flex-start; border-bottom-left-radius: 6px; box-shadow: 0 2px 8px rgba(184, 115, 127, 0.08); border: 1px solid rgba(184, 115, 127, 0.1); }
  .user-msg { background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%); color: var(--text-light); align-self: flex-end; border-bottom-right-radius: 6px; }
  .chat-input { display: flex; padding: 16px; background: #ffffff; border-top: 1px solid rgba(184, 115, 127, 0.1); gap: 10px; align-items: center; }
  .chat-input input { flex: 1; padding: 14px 18px; background: var(--bg-soft); border: 1.5px solid rgba(184, 115, 127, 0.2); border-radius: 28px; color: var(--text-dark); font-size: 14px; outline: none; font-family: 'Inter', sans-serif; }
  .icon-btn { background: none; border: none; cursor: pointer; padding: 10px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: background 0.2s; }
  .icon-btn:hover { background: var(--primary-light); }
  .icon-btn svg { width: 24px; height: 24px; fill: var(--primary); }
  .icon-btn.listening { background: var(--primary); }
  .icon-btn.listening svg { fill: white; animation: pulse 1s infinite; }
  .send-btn { background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%); border: none; color: white; padding: 12px 20px; border-radius: 28px; font-weight: 600; cursor: pointer; font-family: 'Inter', sans-serif; }
</style>
</head>
<body>
<div class="chat-container">
  <div class="chat-header">
    <div class="header-content">
      <div class="header-text"><h1>Physiotherapy Clinic</h1><p>AI-Powered Care Assistant</p></div>
    </div>
    <div class="voice-indicator" id="voiceIndicator">Listening...</div>
  </div>
  <div class="chat-messages" id="chatMessages"></div>
  <div class="chat-input">
    <button class="icon-btn" id="micBtn" title="Speak"><svg viewBox="0 0 24 24"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/></svg></button>
    <input type="text" id="userInput" placeholder="Type or speak your message..." onkeypress="handleEnter(event)">
    <button class="send-btn" onclick="sendMessage()">Send</button>
  </div>
</div>
<script>
const chatMessages = document.getElementById('chatMessages'); const userInput = document.getElementById('userInput'); const micBtn = document.getElementById('micBtn'); const voiceIndicator = document.getElementById('voiceIndicator');
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition; let recognition = null; let isListening = false;
if (SpeechRecognition) { recognition = new SpeechRecognition(); recognition.continuous = false; recognition.interimResults = false; recognition.lang = 'en-US'; recognition.onstart = () => { isListening = true; micBtn.classList.add('listening'); voiceIndicator.classList.add('active'); }; recognition.onend = () => { isListening = false; micBtn.classList.remove('listening'); voiceIndicator.classList.remove('active'); }; recognition.onresult = (event) => { userInput.value = event.results[0][0].transcript; sendMessage(); }; } else { micBtn.style.display = 'none'; }
micBtn.addEventListener('click', () => { if (!recognition) return; if (isListening) recognition.stop(); else recognition.start(); });
function speakText(text) { if ('speechSynthesis' in window) { window.speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(text); u.rate = 1; u.pitch = 1; u.volume = 1; window.speechSynthesis.speak(u); } }
function addMessage(text, sender) { const d = document.createElement('div'); d.classList.add('message', sender === 'bot' ? 'bot-msg' : 'user-msg'); d.innerText = text; chatMessages.appendChild(d); chatMessages.scrollTop = chatMessages.scrollHeight; }
function sendMessage() { const text = userInput.value.trim(); if (!text) return; addMessage(text, 'user'); userInput.value = ''; const t = document.createElement('div'); t.classList.add('message', 'bot-msg'); t.innerText = '...'; t.id = 'typingIndicator'; chatMessages.appendChild(t); chatMessages.scrollTop = chatMessages.scrollHeight;
  fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: text }) })
  .then(res => res.json()).then(data => { document.getElementById('typingIndicator').remove(); addMessage(data.reply || "Error connecting.", 'bot'); speakText(data.reply || "Error connecting."); })
  .catch(err => { document.getElementById('typingIndicator').remove(); addMessage("Connection error.", 'bot'); });
}
function handleEnter(event) { if (event.key === 'Enter') sendMessage(); }
addMessage("Hello! Welcome to our Physiotherapy Clinic. How can I support your health journey today?", 'bot');
</script>
</body>
</html>`;

const SYSTEM_PROMPT = "You are a professional, empathetic AI assistant for a Physiotherapy Clinic. You help patients book appointments, answer questions about clinic hours (Mon-Fri 8AM-6PM, Sat 9AM-1PM), location (123 Medical Center Dr), and provide general, safe information about physiotherapy. Do not give specific medical diagnoses. Keep responses concise (under 3 sentences).";

const server = http.createServer(async (req, res) => {
  if (req.method === 'GET' && req.url === '/') { 
    res.writeHead(200, { 'Content-Type': 'text/html' }); 
    res.end(html); 
    return; 
  }
  
  if (req.method === 'POST' && req.url === '/api/chat') {
    let body = ''; 
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', async () => {
      try {
        const { message } = JSON.parse(body);
        let aiReply = "I'm having a little trouble thinking right now. Could you please rephrase that?";
        
        if (GEMINI_API_KEY) {
          // Updated to use the correct model endpoint
          const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
          
          const response = await fetch(url, {
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              contents: [{ parts: [{ text: `${SYSTEM_PROMPT}\n\nUser: ${message}` }] }] 
            })
          });
          
          const data = await response.json();

          if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0]) {
            aiReply = data.candidates[0].content.parts[0].text;
          } else {
            console.error("GEMINI API ERROR RESPONSE:", JSON.stringify(data));
          }
        } else {
          aiReply = "Please add your GEMINI_API_KEY in Railway Variables!";
        }
        
        res.writeHead(200, { 'Content-Type': 'application/json' }); 
        res.end(JSON.stringify({ reply: aiReply }));
      } catch (error) { 
        console.error("Server Error:", error); 
        res.writeHead(500, { 'Content-Type': 'application/json' }); 
        res.end(JSON.stringify({ reply: "Internal server error." })); 
      }
    }); 
    return;
  }
  
  res.writeHead(404); 
  res.end();
});

server.listen(PORT, () => { 
  console.log(`AI Physio Bot is live on port ${PORT}`); 
});
