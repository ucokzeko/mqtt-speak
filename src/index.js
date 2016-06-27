const mkdirp       = require('mkdirp');
const mqtt         = require('mqtt');
const winston      = require('winston');
const TTSProcessor = require('./module/tts-processor.js');

const config    = require('config.json')(`${__dirname}/config.json`);
const client    = mqtt.connect('mqtt://localhost');
const audioPath = process.env.SPEAK_AUDIO_PATH || config.audio.path;

winston.info(`Audio path:       ${audioPath}`);
winston.info(`Subscribed topic: ${config.topic.sub}`);
winston.info(`Published topic:  ${config.topic.pub}`);

client.on('connect', () => {
  winston.info('Connected to MQTT Broker. Awaiting messages.');
  client.subscribe(config.topic.sub);

  mkdirp(audioPath, (err) => {
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

    new TTSProcessor(toSpeak, audioPath)
    .then((path) => {
      client.publish(config.topic.pub, path);
      winston.info(`Audio path published with data: ${path}`);
    }, (error) => {
      winston.error(error);
    });
  } catch (e) {
    winston.error(`Message failed. Probably invalid JSON. ${e}`);
  }
});
