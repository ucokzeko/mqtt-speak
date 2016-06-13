const fs = require('fs');
const mqtt = require('mqtt');
const config = require('config.json')(`${__dirname}/config.json`);
const Processor = require('./module/audio-processor.js');
const client = mqtt.connect('mqtt://localhost');
const winston = require('winston');

const audioPath = process.env.SPEAK_AUDIO_PATH || config.audio.path;

client.on('connect', () => {
  client.subscribe(config.topic.sub);
  winston.info(`Audio path: ${audioPath}`);
  winston.info(`Subscribed topic: ${config.topic.sub}`);
  winston.info(`Published topic: ${config.topic.pub}`);
  try {
    fs.lstatSync(audioPath);
  } catch (e) {
    fs.mkdirSync(audioPath);
  }
});

client.on('message', (topic, message) => {
  winston.info(`Message received: ${message.toString()}`);
  new Processor(message.toString(), audioPath)
  .then((path) => {
    client.publish(config.topic.pub, path);
    winston.info(`Audio path published with data: ${path}`);
  }, (error) => {
    winston.error(error);
  });
});
