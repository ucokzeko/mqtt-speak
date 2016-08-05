const mkdirp       = require('mkdirp');
const mqtt         = require('mqtt');
const winston      = require('winston');
const TTSProcessor = require('./module/tts-processor.js');
const consts       = require(`${__dirname}/support/constants`);

const config    = require('config.json')(`${__dirname}/config.json`);
const client    = mqtt.connect('mqtt://localhost');

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
