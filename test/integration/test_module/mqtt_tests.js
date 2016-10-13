const fs      = require('fs');
const mqtt    = require('mqtt');
const rewire  = require('rewire');
const assert  = require('assert');
const winston = require('winston');
const path    = require('path');

const consts = require('../../../src/support/constants');

const prefixTone = path.join(__dirname, '../../..', '/src/support/audio/notify.mp3');
const client = mqtt.connect(consts.mqttHost);
const mqttConfig = { qos: 1 };

describe('MQTT', () => {
  const topic     = consts.speakTopic.replace('#', 'test');
  const processor = rewire('../../../src/module/tts-processor.js');

  describe('MQTT#publish message', () => {
    let prefixHash;
    before(() => processor.__get__('getMD5File')(prefixTone).then((hash) => {
      prefixHash = hash.read();
    }));

    it('should not throw error when message contains only alphabetic characters', (done) => {
      const message  = 'This is a test audio';
      const filename = processor.__get__('getMD5String')(message);

      winston.info(`Publishing message to topic ${topic}`);
      client.publish(topic, formatMqttMessage(message), mqttConfig);

      setTimeout(() => {
        assert.doesNotThrow(() => {
          fileExists(`${consts.audioPath}${filename}.mp3`);
          fileExists(`${consts.audioPath}${prefixHash}${filename}.mp3`);
        }, (error) =>
          error
        );
        done();
      }, 1000 * 3);
    }).timeout(5000);

    it('should not throw error when sending repeated message', (done) => {
      const message  = 'This is a test audio';
      const filename = processor.__get__('getMD5String')(message);

      winston.info(`Publishing message to topic ${topic}`);
      client.publish(topic, formatMqttMessage(message), mqttConfig);

      setTimeout(() => {
        assert.doesNotThrow(() => {
          fileExists(`${consts.audioPath}${filename}.mp3`);
          fileExists(`${consts.audioPath}${prefixHash}${filename}.mp3`);
        }, (error) =>
          error
        );
        done();
      }, 1000 * 3);
    }).timeout(5000);
  });
});

function fileExists(filePath) {
  const stats = fs.lstatSync(filePath);
  return stats.isFile();
}

function formatMqttMessage(msg) {
  const jsonMessage = {
    message: msg
  };
  return JSON.stringify(jsonMessage);
}
