const mqtt    = require('mqtt');
const winston = require('winston');
const config  = require('config.json')('./src/config.json');


function MqttTest() {
  winston.info('Starting mqtt listener service');
  return new Promise((fullfil) => {
    const client = mqtt.connect('mqtt://localhost');
    client.on('connect', () => {
      client.subscribe(config.topic.pub);
      winston.info(`MQTT listener listening on ${config.topic.pub}`);
    });

    client.on('message', () => {
      winston.info('Mqtt listener received published audio path');
      fullfil();
    });
  });
}

module.exports = MqttTest;
