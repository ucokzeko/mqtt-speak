const fs      = require('fs');
const mqtt    = require('mqtt');
const rewire  = require('rewire');
const assert  = require('assert');
const winston = require('winston');

const consts = require('../../../src/support/constants');

const client = mqtt.connect(consts.mqttHost);

const mqttConfig = { qos: 1 };

describe('MQTT', () => {
  const topic     = consts.speakTopic.replace('#', 'test');
  const processor = rewire('../../../src/module/tts-processor.js');

  describe('MQTT#publish message', () => {
    it('should not throw error when message contains only alphabetic characters', (done) => {
      const message  = 'This is test audio';
      const filename = processor.__get__('getMD5String')(message);

      winston.info(`Publishing message to topic ${topic}`);
      client.publish(topic, formatMqttMessage(message), mqttConfig);

      setTimeout(() => {
        assert.doesNotThrow(() => {
          isFileCreated(`${consts.audioPath}${filename}.mp3`);
        }, (error) =>
          error
        );
        done();
      }, 1000 * 1);
    });

    it('should not throw error when message contains combination alphabetic and numeric characters', (done) => {
      const message  = 'Test 123';
      const filename = processor.__get__('getMD5String')(message);

      winston.info(`Publishing message to topic ${topic}`);
      client.publish(topic, formatMqttMessage(message), mqttConfig);

      setTimeout(() => {
        assert.doesNotThrow(() => {
          isFileCreated(`${consts.audioPath}${filename}.mp3`);
        }, (error) =>
          error
        );
        done();
      }, 1000 * 1);
    });

    it('should not throw error when sending repeated message', (done) => {
      const message  = 'Test 123';
      const filename = processor.__get__('getMD5String')(message);

      winston.info(`Publishing message to topic ${topic}`);
      client.publish(topic, formatMqttMessage(message), mqttConfig);

      setTimeout(() => {
        assert.doesNotThrow(() => {
          isFileCreated(`${consts.audioPath}${filename}.mp3`);
        }, (error) =>
          error
        );
        done();
      }, 1000 * 1);
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
