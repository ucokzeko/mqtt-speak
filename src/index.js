const mqtt    = require('mqtt');
const mkdirp  = require('mkdirp');
const winston = require('winston');

const consts       = require('./support/constants');
const TTSProcessor = require('./module/tts-processor.js');

const client = mqtt.connect(consts.mqttHost);

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
