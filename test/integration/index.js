const winston  = require('winston');
const spawn    = require('child_process').spawn;
const tests    = require(`${__dirname}/test_module/index`);

launchHost().then(() => {
  launchMqttSpeak().then(() => {
    winston.info('Starting tests');
    tests.startTest().then(() => {
      finishTest();
    }, (error) => {
      winston.error(error);
    });
  });
});

function launchMqttSpeak() {
  return new Promise((resolve) => {
    const service = (() => {
      if (process.env.INTEGRATION_TESTING) {
        winston.info('Connecting to service journal...');
        return spawn('journalctl', ['-fu', 'mqtt-speak']);
      } else {
        winston.info('Launching mqtt speak service...');
        return spawn('npm', ['start']);
      }
    })();

    service.stdout.on('data', (data) => {
      winston.info(`MQTT-Speak log: ${data}`);
      if (data.indexOf('Connected to MQTT Broker') > -1) {
        resolve();
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

function launchHost() {
  return new Promise((resolve) => {
    winston.info('Launching host service...');
    const service = spawn('node', ['--use_strict', `${__dirname}/host.js`]);

    service.stdout.on('data', (data) => {
      winston.info(`Host log: ${data}`);
    });

    service.stderr.on('data', (data) => {
      winston.info(`Host log: ${data}`);
    });

    service.on('close', (code) => {
      winston.info(`Host exited with code ${code}`);
    });
    resolve();
  });
}

function finishTest() {
  winston.info('Test succeed');
  process.exit();
}
