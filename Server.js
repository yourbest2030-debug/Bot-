const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('Bot'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Bot', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🤘 Riff is live on port ${PORT}`);
});
