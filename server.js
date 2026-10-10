const http = require('http');
const PORT = process.env.PORT || 3000;

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Physiotherapy Clinic</title>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
<style>
  :root {
    --primary: #b8737f;
    --primary-dark: #9c5a66;
    --primary-light: #f5e6e8;
    --bg-soft: #fdf8f9;
    --text-dark: #4a3035;
    --text-light: #ffffff;
  }
  body {
    background: linear-gradient(135deg, #fdf8f9 0%, #f5e6e8 100%);
    font-family: 'Inter', sans-serif;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    margin: 0;
  }
  .chat-container {
    width: 100%;
    max-width: 420px;
    height: 92vh;
    max-height: 750px;
    background: #ffffff;
    border-radius: 24px;
    box-shadow: 0 20px 60px rgba(184, 115, 127, 0.15);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border: 1px solid rgba(184, 115, 127, 0.1);
  }
  .chat-header {
    background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
    color: var(--text-light);
    padding: 24px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .header-content { display: flex; align-items: center; gap: 12px; }
  .logo-icon { width: 36px; height: 36px; background: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px; }
  .header-text h1 { font-family: 'Playfair Display', serif; font-size: 18px; font-weight: 600; margin: 0; }
  .header-text p { font-size: 11px; opacity: 0.9; margin: 2px 0 0 0; font-weight: 300; }
  .close-btn { cursor: pointer; font-size: 24px; opacity: 0.8; }
  
  .chat-messages { flex: 1; padding: 24px 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 16px; background: var(--bg-soft); }
  .message { max-width: 82%; padding: 14px 18px; font-size: 14px; line-height: 1.6; border-radius: 20px; font-weight: 400; }
  .bot-msg { background: #ffffff; color: var(--text-dark); align-self: flex-start; border-bottom-left-radius: 6px; box-shadow: 0 2px 8px rgba(184, 115, 127, 0.08); border: 1px solid rgba(184, 115, 127, 0.1); }
  .user-msg { background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%); color: var(--text-light); align-self: flex-end; border-bottom-right-radius: 6px; }
  
  .quick-replies { display: flex; flex-wrap: wrap; gap: 10px; padding: 16px 20px; background: var(--bg-soft); border-top: 1px solid rgba(184, 115, 127, 0.1); }
  .quick-btn { background: #ffffff; border: 1.5px solid var(--primary); color: var(--primary); padding: 10px 18px; border-radius: 24px; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.25s ease; font-family: 'Inter', sans-serif; }
  .quick-btn:hover { background: var(--primary); color: white; transform: translateY(-1px); }
  
  .schedule-container { background: white; padding: 15px; border-radius: 16px; margin: 10px 0; width: 100%; box-sizing: border-box; }
  .schedule-title { font-weight: 600; color: var(--primary-dark); margin-bottom: 12px; text-align: center; font-size: 14px; }
  .schedule-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
  .schedule-day { background: #ffffff; border: 2px solid var(--primary); border-radius: 12px; padding: 10px 5px; text-align: center; cursor: pointer; transition: all 0.2s; color: var(--primary-dark); }
  .schedule-day:hover { background: var(--primary); color: white; }
  .schedule-day.selected { background: var(--primary); color: white; }
  .schedule-day.disabled { opacity: 0.3; cursor: not-allowed; background: #f0f0f0; border-color: #ccc; color: #999; }
  .day-name { font-size: 11px; margin-bottom: 4px; }
  .day-date { font-size: 14px; font-weight: 700; }

  .time-slots { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; margin-top: 12px; }
  .time-slot { background: #ffffff; border: 1.5px solid var(--primary); border-radius: 20px; padding: 10px; text-align: center; cursor: pointer; font-size: 13px; color: var(--primary-dark); font-weight: 500; }
  .time-slot:hover { background: var(--primary); color: white; }

  .chat-input { display: flex; padding: 16px 20px; background: #ffffff; border-top: 1px solid rgba(184, 115, 127, 0.1); gap: 12px; align-items: center; }
  .chat-input input { flex: 1; padding: 14px 18px; background: var(--bg-soft); border: 1.5px solid rgba(184, 115, 127, 0.2); border-radius: 28px; color: var(--text-dark); font-size: 14px; outline: none; }
  .chat-input button { background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%); border: none; color: white; padding: 14px 22px; border-radius: 28px; font-weight: 600; cursor: pointer; }
</style>
</head>
<body>
<div class="chat-container">
  <div class="chat-header">
    <div class="header-content">
      <div class="logo-icon">️</div>
      <div class="header-text">
        <h1>Physiotherapy Clinic</h1>
        <p>Professional Care & Rehabilitation</p>
      </div>
    </div>
    <span class="close-btn">&times;</span>
  </div>
  <div class="chat-messages" id="chatMessages"></div>
  <div class="quick-replies" id="quickReplies"></div>
  <div class="chat-input">
    <input type="text" id="userInput" placeholder="Type your message..." onkeypress="handleEnter(event)">
    <button onclick="sendMessage()">Send</button>
  </div>
</div>

<script>
const chatMessages = document.getElementById('chatMessages');
const userInput = document.getElementById('userInput');
const quickRepliesContainer = document.getElementById('quickReplies');
let currentContext = null;
let selectedDate = null;

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const fullDayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const timeSlots = ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'];

function generateDays() {
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    days.push({
      dayName: dayNames[d.getDay()],
      fullDayName: fullDayNames[d.getDay()],
      dayNum: d.getDate(),
      month: d.toLocaleDateString('en-US', { month: 'short' }),
      isWeekend: d.getDay() === 0 || d.getDay() === 6
    });
  }
  return days;
}

function showSchedule() {
  const container = document.createElement('div');
  container.className = 'schedule-container';
  
  const title = document.createElement('div');
  title.className = 'schedule-title';
  title.innerText = '📅 Select Your Preferred Day';
  container.appendChild(title);

  const grid = document.createElement('div');
  grid.className = 'schedule-grid';

  const days = generateDays();
  days.forEach((day, index) => {
    const btn = document.createElement('div');
    btn.className = 'schedule-day' + (day.isWeekend ? ' disabled' : '');
    btn.innerHTML = '<div class="day-name">' + day.dayName + '</div><div class="day-date">' + day.dayNum + ' ' + day.month + '</div>';
    if (!day.isWeekend) {
      btn.onclick = () => selectDay(index, days, grid, container);
    }
    grid.appendChild(btn);
  });
  container.appendChild(grid);
  
  const timeContainer = document.createElement('div');
  timeContainer.id = 'timeSlotsArea';
  timeContainer.style.display = 'none';
  container.appendChild(timeContainer);

  addMessageElement(container);
}

function selectDay(index, days, grid, mainContainer) {
  selectedDate = days[index];
  const buttons = grid.children;
  for (let i = 0; i < buttons.length; i++) buttons[i].classList.remove('selected');
  buttons[index].classList.add('selected');

  const timeArea = document.getElementById('timeSlotsArea');
  timeArea.style.display = 'block';
  timeArea.innerHTML = '';
  
  const timeTitle = document.createElement('div');
  timeTitle.className = 'schedule-title';
  timeTitle.innerText = '🕐 Select Time';
  timeTitle.style.marginTop = '10px';
  timeArea.appendChild(timeTitle);

  const timeGrid = document.createElement('div');
  timeGrid.className = 'time-slots';
  
  timeSlots.forEach(time => {
    const tBtn = document.createElement('div');
    tBtn.className = 'time-slot';
    tBtn.innerText = time;
    tBtn.onclick = () => selectTime(time);
    timeGrid.appendChild(tBtn);
  });
  timeArea.appendChild(timeGrid);
}

function selectTime(time) {
  if (!selectedDate) return;
  const finalString = selectedDate.fullDayName + ', ' + selectedDate.dayNum + ' ' + selectedDate.month + ' at ' + time;
  addMessage(finalString, 'user');
  setTimeout(() => {
    addMessage("Perfect! I've noted your request for " + finalString + ". Our coordinator will contact you within 24 hours to confirm. Anything else?", 'bot');
    showQuickReplies(['Clinic Hours', 'Location', 'No, thanks']);
    currentContext = null;
  }, 600);
}

function addMessageElement(element) {
  const msgDiv = document.createElement('div');
  msgDiv.classList.add('message', 'bot-msg');
  msgDiv.style.maxWidth = '100%';
  msgDiv.appendChild(element);
  chatMessages.appendChild(msgDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
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
  options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'quick-btn';
    btn.innerText = opt;
    btn.onclick = () => {
      addMessage(opt, 'user');
      quickRepliesContainer.innerHTML = '';
      processInput(opt.toLowerCase());
    };
    quickRepliesContainer.appendChild(btn);
  });
}

function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;
  addMessage(text, 'user');
  userInput.value = '';
  processInput(text.toLowerCase());
}

function handleEnter(e) { if (e.key === 'Enter') sendMessage(); }

function processInput(input) {
  setTimeout(() => {
    let reply = "I'm here to help. You can ask about booking, services, or hours.";
    let nextReplies = [];
    const text = input.toLowerCase().trim();

    if (['hi', 'hello', 'hey', 'salam'].some(w => text.includes(w))) {
      reply = "Hello! Welcome to our Physiotherapy Clinic. How can I help you today?";
      nextReplies = ['Book Consultation', 'Our Services', 'Clinic Hours'];
      currentContext = null;
    } 
    else if (['thanks', 'thank you', 'bye', 'goodbye'].some(w => text.includes(w))) {
      reply = "You're very welcome! Wishing you health and a good day! 🌸";
      nextReplies = [];
      currentContext = null;
    }
    else if (currentContext === 'booking_time') {
      reply = "Please use the visual schedule above to select your day and time.";
      nextReplies = [];
    }
    else if (['book', 'appointment', 'schedule', 'visit'].some(w => text.includes(w))) {
      reply = "I'd be happy to help you book. Please select a day and time below:";
      currentContext = 'booking_time';
      showSchedule();
      return; 
    } 
    else if (['hour', 'open', 'close', 'time'].some(w => text.includes(w))) {
      reply = "We are open Mon-Fri 8AM-6PM, and Sat 9AM-1PM. Would you like to book?";
      nextReplies = ['Book Consultation', 'Location'];
    } 
    else if (['location', 'address', 'where'].some(w => text.includes(w))) {
      reply = "We are at 123 Medical Center Drive, Suite 100. Would you like to book?";
      nextReplies = ['Book Consultation', 'Hours'];
    }
    else if (['service', 'treatment', 'offer'].some(w => text.includes(w))) {
      reply = "We specialize in musculoskeletal and pelvic floor rehab, manual therapy, and exercise programs. What would you like to know?";
      nextReplies = ['Book Consultation', 'Hours'];
    }
    else if (['pain', 'hurt', 'ache', 'sore'].some(w => text.includes(w))) {
      reply = "I'm sorry to hear that. Could you tell me which part of your body hurts?";
      nextReplies = ['Back', 'Knee', 'Neck', 'Shoulder'];
      currentContext = 'symptoms';
    }
    else if (['back', 'knee', 'neck', 'shoulder'].some(w => text.includes(w))) {
      reply = "Our therapists can definitely help with " + input + ". Would you like to book an assessment?";
      nextReplies = ['Book Consultation', 'No, thanks'];
      currentContext = 'booking_time';
    }

    addMessage(reply, 'bot');
    if (nextReplies.length > 0) showQuickReplies(nextReplies);
  }, 500);
}

// Start the chat
addMessage("Welcome to our Physiotherapy Clinic. How can I support your health journey today?", 'bot');
showQuickReplies(['Book Consultation', 'Our Services', 'Clinic Hours']);
</script>
</body>
</html>`;

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);
    return;
  }
  res.writeHead(404);
  res.end();
});

server.listen(PORT, () => {
  console.log('Server is live on port ' + PORT);
});
