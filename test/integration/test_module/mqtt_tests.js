const fs      = require('fs');
const mqtt    = require('mqtt');
const winston = require('winston');
const consts  = require(`${__dirname}/../../../src/support/constants`);


const client = mqtt.connect(consts.mqttHost);

const mqttConfig = { qos: 1 };

function publishTest() {
  const topic   = consts.speakTopic.replace('#', 'test');
  const message = 'This is test audio';
  winston.info(`Publishing message to topic ${topic}`);
  client.publish(topic, formatMqttMessage(message), mqttConfig);
}

function isFileExist(path) {
  return new Promise((resolve, reject) => {
    fs.lstat(path, (error) => {
      if (error) reject(error);
      else resolve();
    });
  });
}

function formatMqttMessage(msg) {
  const jsonMessage = {
    message: msg
  };
  return JSON.stringify(jsonMessage);
}

module.exports = {
  publishTest,
  isFileExist
};
