const fs = require('fs');
const mqtt = require('mqtt');
const config = require('config.json')('./config.json');
const Processor = require('./module/audio-processor.js');
const client = mqtt.connect('mqtt://localhost');

client.on('connect', () => {
  client.subscribe(config.channel.sub);
  try {
    fs.lstatSync(config.audio.path);
  } catch (e) {
    fs.mkdirSync(config.audio.path);
  }
});

client.on('message', (topic, message) => {
  new Processor(message.toString(), config.audio.path)
  .then((path) => {
    client.publish(config.channel.pub, path);
  }, (error) => {
    throw error;
  });
});
