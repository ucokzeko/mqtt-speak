const express = require('express');

const app = express();
app.post('/tts', (req, res) => {
  const result = {
    relative_url: 'test.mp3'
  };
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(result));
});
app.use(express.static(`${__dirname}/audio`));

app.listen(3001);
