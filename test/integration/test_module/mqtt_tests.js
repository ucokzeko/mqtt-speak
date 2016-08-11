const fs      = require('fs');
const mqtt    = require('mqtt');
const rewire  = require('rewire');
const assert  = require('assert');
const winston = require('winston');
const consts  = require(`${__dirname}/../../../src/support/constants`);

const client = mqtt.connect(consts.mqttHost);

const mqttConfig = { qos: 1 };

describe('MQTT', () => {
  let message     = 'This is test audio';
  const topic     = consts.speakTopic.replace('#', 'test');
  const processor = rewire(`${__dirname}/../../../src/module/tts-processor.js`);

  describe('MQTT#publish message', () => {
    it('should not throw error when message contains only alphabetic characters', (done) => {
      winston.info(`Publishing message to topic ${topic}`);
      client.publish(topic, formatMqttMessage(message), mqttConfig);
      const filename = processor.__get__('getMD5String')(message);

      assert.doesNotThrow(() => {
        isFileCreated(`${consts.audioPath}${filename}.mp3`);
      }, (error) =>
        error
      );
      done();
    });

    it('should not throw error when message contains combination alphabetic and numeric characters', (done) => {
      message = 'Test 123';
      winston.info(`Publishing message to topic ${topic}`);
      client.publish(topic, formatMqttMessage(message), mqttConfig);
      const filename = processor.__get__('getMD5String')(message);

      assert.doesNotThrow(() => {
        isFileCreated(`${consts.audioPath}${filename}.mp3`);
      }, (error) =>
        error
      );
      done();
    });

    it('should not throw error when sending repeated message', (done) => {
      winston.info(`Publishing message to topic ${topic}`);
      client.publish(topic, formatMqttMessage(message), mqttConfig);
      const filename = processor.__get__('getMD5String')(message);

      assert.doesNotThrow(() => {
        isFileCreated(`${consts.audioPath}${filename}.mp3`);
      }, (error) =>
        error
      );
      done();
    });
  });
});

function isFileCreated(path) {
  const stats = fs.lstatSync(path);
  return stats.isFile();
}

function formatMqttMessage(msg) {
  const jsonMessage = {
    message: msg
  };
  return JSON.stringify(jsonMessage);
}
