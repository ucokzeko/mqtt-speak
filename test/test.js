const mqtt     = require('mqtt');
const winston  = require('winston');
const spawn    = require('child_process').spawn;
const client   = mqtt.connect('mqtt://localhost');
const config   = require('config.json')('./src/config.json');
const MqttTest = require(`${__dirname}/test-module/mqtt-test.js`);
const FileTest = require(`${__dirname}/test-module/audio-file-test.js`);

const mqttConfig = { qos: 1 };
var readyToClose = false;

new MqttTest()
.then(() => {
  finishTest();
});
launchService()
.then(() => {
  publishToPlayer();
});

function launchService() {
  return new Promise((fullfil) => {
    winston.info('Launching speak service...');
    const service = spawn('npm', ['start']);

    service.stdout.on('data', (data) => {
      winston.info(`MQTT-Speak log: ${data}`);
      if (data.indexOf(config.topic.sub) > -1) {
        fullfil();
      }
      if (data.indexOf('published with') > -1) {
        new FileTest(data.toString())
        .then(() => {
          finishTest();
        }, (error) => {
          throw error;
        });
      }
    });

    service.stderr.on('data', (data) => {
      winston.info(`MQTT-Speak log: ${data}`);
    });

    service.on('close', (code) => {
      winston.info(`MQTT-Speak exited with code ${code}`);
    });
  });
}

function publishToPlayer() {
  const topic   = config.topic.sub.replace('#', 'test');
  const message = 'This is test audio';
  winston.info(`Publishing message to topic ${topic}`);
  client.publish(topic, message, mqttConfig);
  setTimeout(() => {
    winston.error(new Error('Test failed (Waiting timeout)'));
    process.exit();
  }, 10000);
}

function finishTest() {
  if (readyToClose) {
    winston.info('Test succeeded');
    process.exit();
  } else {
    readyToClose = true;
  }
}
