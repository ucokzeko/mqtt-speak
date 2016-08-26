const mqtt    = require('mqtt');
const mkdirp  = require('mkdirp');
const winston = require('winston');

const consts       = require('./support/constants');
const TTSProcessor = require('./module/tts-processor.js');

const client = mqtt.connect(consts.mqttHost);

const express = require('express');
const app = express();
const path = require('path');

app.set('port', consts.port);

winston.info(`Audio path:       ${consts.audioPath}`);
winston.info(`Subscribed topic: ${consts.speakTopic}`);
winston.info(`Published topic:  ${consts.playTopic}`);

client.on('connect', () => {
  winston.info('Connected to MQTT Broker. Awaiting messages.');
  client.subscribe(consts.speakTopic);

  mkdirp(consts.audioPath, (err) => {
    if (err) {
      winston.error(err);
    }
  });
  app.use('/audio', express.static(consts.audioPath));

  const server = app.listen(app.get('port'), () => {
    const port = server.address().port;
    winston.info(`Listening on port: '${port}`);
  });
});

client.on('message', (topic, rawMessage) => {
  const message = rawMessage.toString();
  try {
    const toSpeak = JSON.parse(message).message;
    winston.info(`Message received: '${message}'`);

    new TTSProcessor(toSpeak, consts.audioPath)
    .then((path) => {
      client.publish(consts.playTopic, path);
      winston.info(`Audio path published with data: ${path}`);
    }, (error) => {
      winston.error(error);
    });
  } catch (e) {
    winston.error(`Message failed. Probably invalid JSON. ${e}`);
  }
});

// Makes a url to a given served file path
function buildDownloadUrl(downloadPath) {
  const url = uri({
    protocol: 'http',
    hostname: `${consts.hostname}:${consts.port}`,
    path:     downloadPath
  });
  return url.toString();
}
