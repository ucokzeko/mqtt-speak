const express = require('express');
const winston = require('winston');

const app  = express();
const port = 3001;

app.post('/tts', (req, res) => {
  const result = {
    relative_url: 'test.mp3'
  };
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(result));
});
app.use(express.static(`${__dirname}/audio`));

app.listen(port);

winston.info(`Host is listening on port: ${port}`);
