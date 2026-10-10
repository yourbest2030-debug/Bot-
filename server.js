const http = require('http');
const PORT = process.env.PORT || 3000;

const html = '<!DOCTYPE html>' +
'<html lang="en">' +
'<head>' +
'<meta charset="UTF-8">' +
'<meta name="viewport" content="width=device-width, initial-scale=1.0">' +
'<title>Physiotherapy Clinic</title>' +
'<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">' +
'<style>' +
':root { --primary: #b8737f; --primary-dark: #9c5a66; --primary-light: #f5e6e8; --bg-soft: #fdf8f9; --text-dark: #4a3035; --text-light: #ffffff; --accent: #d4a5a5; }' +
'body { background: linear-gradient(135deg, #fdf8f9 0%, #f5e6e8 100%); font-family: "Inter", sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }' +
'.chat-container { width: 100%; max-width: 420px; height: 92vh; max-height: 750px; background: #ffffff; border-radius: 24px; box-shadow: 0 20px 60px rgba(184, 115, 127, 0.15); display: flex; flex-direction: column; overflow: hidden; border: 1px solid rgba(184, 115, 127, 0.1); }' +
'.chat-header { background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%); color: var(--text-light); padding: 24px 20px; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 4px 12px rgba(156, 90, 102, 0.2); }' +
'.header-content { display: flex; align-items: center; gap: 12px; }' +
'.logo-icon { width: 36px; height: 36px; background: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px; }' +
'.header-text h1 { font-family: "Playfair Display", serif; font-size: 18px; font-weight: 600; margin: 0; letter-spacing: 0.5px; }' +
'.header-text p { font-size: 11px; opacity: 0.9; margin: 2px 0 0 0; font-weight: 300; }' +
'.close-btn { cursor: pointer; font-size: 24px; opacity: 0.8; transition: opacity 0.2s; }' +
'.close-btn:hover { opacity: 1; }' +
'.chat-messages { flex: 1; padding: 24px 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 16px; background: var(--bg-soft); }' +
'.message { max-width: 82%; padding: 14px 18px; font-size: 14px; line-height: 1.6; border-radius: 20px; font-weight: 400; }' +
'.bot-msg { background: #ffffff; color: var(--text-dark); align-self: flex-start; border-bottom-left-radius: 6px; box-shadow: 0 2px 8px rgba(184, 115, 127, 0.08); border: 1px solid rgba(184, 115, 127, 0.1); }' +
'.user-msg { background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%); color: var(--text-light); align-self: flex-end; border-bottom-right-radius: 6px; box-shadow: 0 2px 8px rgba(156, 90, 102, 0.2); }' +
'.quick-replies { display: flex; flex-wrap: wrap; gap: 10px; padding: 16px 20px; background: var(--bg-soft); border-top: 1px solid rgba(184, 115, 127, 0.1); }' +
'.quick-btn { background: #ffffff; border: 1.5px solid var(--primary); color: var(--primary); padding: 10px 18px; border-radius: 24px; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.25s ease; font-family: "Inter", sans-serif; }' +
'.quick-btn:hover { background: var(--primary); color: white; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(184, 115, 127, 0.25); }' +
'.schedule-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin: 10px 0; width: 100%; }' +
'.schedule-day { background: #ffffff; border: 2px solid var(--primary); border-radius: 12px; padding: 12px 8px; text-align: center; cursor: pointer; transition: all 0.25s ease; font-weight: 600; color: var(--primary-dark); font-size: 12px; }' +
'.schedule-day:hover { background: var(--primary); color: white; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(184, 115, 127, 0.3); }' +
'.schedule-day.selected { background: var(--primary); color: white; border-color: var(--primary-dark); }' +
'.schedule-day.disabled { opacity: 0.3; cursor: not-allowed; background: #f0f0f0; border-color: #ccc; }' +
'.schedule-day .day-name { font-size: 11px; margin-bottom: 4px; opacity: 0.9; }' +
'.schedule-day .day-date { font-size: 16px; font-weight: 700; }' +
'.time-slots { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; margin-top: 10px; width: 100%; }' +
'.time-slot { background: #ffffff; border: 1.5px solid var(--primary); border-radius: 20px; padding: 10px; text-align: center; cursor: pointer; transition: all 0.25s ease; font-size: 13px; font-weight: 500; color: var(--primary-dark); }' +
'.time-slot:hover { background: var(--primary); color: white; transform: scale(1.05); }' +
'.time-slot.selected { background: var(--primary); color: white; }' +
'.chat-input { display: flex; padding: 16px 20px; background: #ffffff; border-top: 1px solid rgba(184, 115, 127, 0.1); gap: 12px; align-items: center; }' +
'.chat-input input { flex: 1; padding: 14px 18px; background: var(--bg-soft); border: 1.5px solid rgba(184, 115, 127, 0.2); border-radius: 28px; color: var(--text-dark); font-size: 14px; outline: none; font-family: "Inter", sans-serif; transition: border-color 0.2s; }' +
'.chat-input input:focus { border-color: var(--primary); }' +
'.chat-input input::placeholder { color: #b8a0a5; }' +
'.chat-input button { background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%); border: none; color: white; padding: 14px 22px; border-radius: 28px; font-weight: 600; cursor: pointer; font-family: "Inter", sans-serif; font-size: 14px; transition: all 0.25s ease; box-shadow: 0 4px 12px rgba(156, 90, 102, 0.2); }' +
'.chat-input button:hover { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(156, 90, 102, 0.3); }' +
'</style>' +
'</head>' +
'<body>' +
'<div class="chat-container">' +
'<div class="chat-header"><div class="header-content"><div class="logo-icon">🛡️</div><div class="header-text"><h1>Physiotherapy Clinic</h1><p>Professional Care & Rehabilitation</p></div></div><span class="close-btn">&times;</span></div>' +
'<div class="chat-messages" id="chatMessages"></div>' +
'<div class="quick-replies" id="quickReplies"></div>' +
'<div class="chat-input"><input type="text" id="userInput" placeholder="Type your message..." onkeypress="handleEnter(event)"><button onclick="sendMessage()">Send</button></div>' +
'</div>' +
'<script>' +
'var chatMessages = document.getElementById("chatMessages");' +
'var userInput = document.getElementById("userInput");' +
'var quickRepliesContainer = document.getElementById("quickReplies");' +
'var currentContext = null;' +
'var selectedDate = null;' +
'function generateScheduleDays() { var days = []; var dayNames = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]; var fullDayNames = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]; for (var i = 0; i < 7; i++) { var date = new Date(); date.setDate(date.getDate() + i); days.push({ date: date, dayName: dayNames[date.getDay()], fullDayName: fullDayNames[date.getDay()], dayNum: date.getDate(), month: date.toLocaleDateString("en-US", { month: "short" }), isWeekend: date.getDay() === 0 || date.getDay() === 6 }); } return days; }' +
'var timeSlots = ["9:00 AM","10:00 AM","11:00 AM","2:00 PM","3:00 PM","4:00 PM","5:00 PM"];' +
'function showVisualSchedule() { var days = generateScheduleDays(); var scheduleHTML = "<div style=\'background:white;padding:15px;border-radius:16px;margin:10px 0;\'>"; scheduleHTML += "<div style=\'font-weight:600;color:#9c5a66;margin-bottom:12px;text-align:center;\'>📅 Select Your Preferred Day</div>"; scheduleHTML += "<div class=\'schedule-grid\'>"; for (var i = 0; i < days.length; i++) { var day = days[i]; var isDisabled = day.isWeekend; scheduleHTML += "<div class=\'schedule-day " + (isDisabled ? "disabled" : "") + "\' onclick=\'" + (isDisabled ? "" : "selectDay(" + i + ")") + "\' id=\'day-" + i + "\'><div class=\'day-name\'>" + day.dayName + "</div><div class=\'day-date\'>" + day.dayNum + " " + day.month + "</div></div>"; } scheduleHTML += "</div><div id=\'timeSlotsContainer\' style=\'display:none;\'>"; scheduleHTML += "<div style=\'font-weight:600;color:#9c5a66;margin:12px 0 8px 0;text-align:center;\'> Select Time</div><div class=\'time-slots\'>"; for (var j = 0; j < timeSlots.length; j++) { scheduleHTML += "<div class=\'time-slot\' onclick=\'selectTime(\"" + timeSlots[j] + "\")\' id=\'time-" + j + "\'>" + timeSlots[j] + "</div>"; } scheduleHTML += "</div></div></div>"; addMessage(scheduleHTML, "bot"); }' +
'function selectDay(dayIndex) { var days = generateScheduleDays(); selectedDate = days[dayIndex]; var els = document.querySelectorAll(".schedule-day"); for (var i = 0; i < els.length; i++) { els[i].classList.remove("selected"); if (i === dayIndex) els[i].classList.add("selected"); } document.getElementById("timeSlotsContainer").style.display = "block"; setTimeout(function() { document.getElementById("timeSlotsContainer").scrollIntoView({ behavior: "smooth", block: "center" }); }, 100); }' +
'function selectTime(time) { if (!selectedDate) return; var dateTimeString = selectedDate.fullDayName + ", " + selectedDate.dayNum + " " + selectedDate.month + " at " + time; addMessage(dateTimeString, "user"); setTimeout(function() { var reply = "Perfect! I\'ve noted your appointment request for " + dateTimeString + ". Our care coordinator will contact you within 24 hours to confirm. Is there anything else I can help you with?"; addMessage(reply, "bot"); showQuickReplies(["Clinic Hours","Location","No, thanks"]); currentContext = null; }, 600); }' +
'var responses = { greeting: "Welcome to our Physiotherapy Clinic. How can I support your health and recovery journey today?", book: "I\'d be happy to help you book a consultation. Please select your preferred day and time from the schedule below:", pain: "I understand you\'re experiencing discomfort. Could you tell me more about your symptoms?", hours: "Our clinic hours are Monday to Friday, 8 AM to 6 PM, and Saturday 9 AM to 1 PM. Would you like to schedule a visit?", location: "We\'re located at 123 Medical Center Drive, Suite 100. Would you like directions or to book an appointment?", default: "I\'m here to help. You can ask about booking, our services, clinic hours, or tell me about your symptoms." };' +
'function initChat() { addMessage(responses.greeting, "bot"); showQuickReplies(["Book Consultation","Our Services","Clinic Hours"]); }' +
'function addMessage(text, sender) { var msgDiv = document.createElement("div"); msgDiv.classList.add("message", sender === "bot" ? "bot-msg" : "user-msg"); msgDiv.innerHTML = text; chatMessages.appendChild(msgDiv); chatMessages.scrollTop = chatMessages.scrollHeight; }' +
'function showQuickReplies(options) { quickRepliesContainer.innerHTML = ""; for (var i = 0; i < options.length; i++) { (function(option) { var btn = document.createElement("button"); btn.classList.add("quick-btn"); btn.innerText = option; btn.onclick = function() { handleQuickReply(option); }; quickRepliesContainer.appendChild(btn); })(options[i]); } }' +
'function handleQuickReply(text) { addMessage(text, "user"); quickRepliesContainer.innerHTML = ""; processInput(text.toLowerCase()); }' +
'function sendMessage() { var text = userInput.value.trim(); if (!text) return; addMessage(text, "user"); userInput.value = ""; processInput(text.toLowerCase()); }' +
'function handleEnter(event) { if (event.key === "Enter") sendMessage(); }' +
'function processInput(input) { setTimeout(function() { var reply = responses.default; var nextReplies = []; var text = input.toLowerCase().trim(); if (["hi","hello","hey","salam","greetings","good morning","good afternoon"].some(function(w) { return text.includes(w); })) { reply = "Hello! Welcome to our Physiotherapy Clinic. How can I support your recovery today?"; nextReplies = ["Book Consultation","Our Services","Clinic Hours"]; currentContext = null; } else if (["thanks","thank you","bye","goodbye","no thanks"].some(function(w) { return text.includes(w); })) { reply = "You\'re very welcome! Wishing you health, wellness, and have a good day! 🌸"; nextReplies = []; currentContext = null; } else if (currentContext === "booking_time") { var timeWords = ["am","pm","morning","afternoon","evening","monday","tuesday","wednesday","thursday","friday","saturday","sunday","tomorrow","today","next week","weekend"]; var isTime = timeWords.some(function(w) { return text.includes(w); }) || /\\d{1,2}/.test(text); if (isTime) { reply = "Wonderful! I\'ve noted your preference for " + input + ". Our care coordinator will contact you shortly to confirm your appointment. Is there anything else I can help with?"; nextReplies = ["Clinic Hours","Location","No, thanks"]; currentContext = null; } else { reply = "Please use the visual schedule above to select your preferred day and time."; nextReplies = []; } } else if (currentContext === "symptoms") { var symptomWords = ["pain","discomfort","weakness","pressure","stiffness","injury","sprain","strain"]; var isSymptom = symptomWords.some(function(w) { return text.includes(w); }); if (isSymptom) { reply = "Thank you for sharing. Our physiotherapists are highly experienced in treating these concerns. Would you like to book a comprehensive assessment?"; nextReplies = ["Book Consultation","Learn More"]; currentContext = "booking_time"; } else { reply = "Could you describe your symptoms? For example, pain, stiffness, or a specific injury?"; nextReplies = ["Pain","Stiffness","Injury"]; } } else if (["book","appointment","schedule","consultation","session","reserve","visit"].some(function(w) { return text.includes(w); })) { reply = responses.book; nextReplies = []; currentContext = "booking_time"; showVisualSchedule(); return; } else if (["hurt","pain","ache","sore","symptoms","discomfort","problem","issue"].some(function(w) { return text.includes(w); })) { reply = responses.pain; nextReplies = ["Back Pain","Knee Pain","Neck Pain","Shoulder Pain"]; currentContext = "symptoms"; } else if (["hour","open","close","time","schedule","when"].some(function(w) { return text.includes(w); })) { reply = responses.hours; nextReplies = ["Book Consultation","Location"]; currentContext = null; } else if (["location","address","where","map","find you","clinic","directions"].some(function(w) { return text.includes(w); })) { reply = responses.location; nextReplies = ["Book Consultation","Hours"]; currentContext = null; } else if (["service","treatment","offer","provide","what do you do"].some(function(w) { return text.includes(w); })) { reply = "We specialize in musculoskeletal and pelvic floor rehabilitation, including manual therapy, personalized exercise programs, and post-operative recovery. What would you like to know more about?"; nextReplies = ["Assessment","Treatment","Book Consultation"]; currentContext = null; } else if (["female","women","pregnancy","postpartum","maternal","pelvic"].some(function(w) { return text.includes(w); })) { reply = "We specialize in women\'s health and pelvic floor physiotherapy, including pregnancy and postpartum recovery. Would you like to book a consultation?"; nextReplies = ["Book Consultation","Learn More"]; currentContext = "booking_time"; } else if (["male","men","prostate","sports"].some(function(w) { return text.includes(w); })) { reply = "We also provide specialized pelvic floor therapy for men, as well as sports injury rehabilitation. Would you like to learn more?"; nextReplies = ["Book Consultation","Learn More"]; currentContext = "booking_time"; } else if (["back","knee","neck","shoulder","leg","arm","hip","ankle","wrist"].some(function(w) { return text.includes(w); })) { reply = "I\'m sorry to hear your " + input + " is bothering you. Our physiotherapists can definitely help with that. Would you like to book an assessment?"; nextReplies = ["Book Consultation","Tell me more"]; currentContext = "booking_time"; } addMessage(reply, "bot"); if (nextReplies.length > 0) showQuickReplies(nextReplies); }, 600); }' +
'initChat();' +
'</script>' +
'</body>' +
'</html>';

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
