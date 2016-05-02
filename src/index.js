const fs = require('fs');
const mqtt = require('mqtt');
const config = require('config.json')(`${__dirname}/config.json`);
const Processor = require('./module/audio-processor.js');
const client = mqtt.connect('mqtt://localhost');
const winston = require('winston');

winston.info(`Audio path: ${config.audio.path}`);
winston.info(`Subscribed topic: ${config.topic.sub}`);
winston.info(`Published topic: ${config.topic.pub}`);

client.on('connect', () => {
  client.subscribe(config.topic.sub);
  try {
    fs.lstatSync(config.audio.path);
  } catch (e) {
    fs.mkdirSync(config.audio.path);
  }
});

client.on('message', (topic, message) => {
  winston.info(`Message received: ${message.toString()}`);
  new Processor(message.toString(), config.audio.path)
  .then((path) => {
    client.publish(config.topic.pub, path);
    winston.info(`Audio path published with data: ${path}`);
  }, (error) => {
    winston.error(error);
  });
});
