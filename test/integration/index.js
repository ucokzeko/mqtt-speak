const fse     = require('fs-extra');
const winston = require('winston');
const spawn   = require('child_process').spawn;
const consts  = require(`${__dirname}/../../src/support/constants`);

launchService('Host', spawn('node', ['--use_strict', `${__dirname}/host.js`]))
.then(() => {
  const serviceName = 'MQTT Speak';
  let command       = spawn('npm', ['start']);

  if (process.env.INTEGRATION_TESTING) {
    command = spawn('journalctl', ['-fu', 'mqtt-speak']);
  }

  launchService(serviceName, command).then(() => {
    launchService('Integration Tests', spawn('./node_modules/.bin/mocha', ['--use_strict', `${__dirname}/test_module/`]))
    .then(() => {
      finishTest();
    });
  });
});

function launchService(serviceName, command) {
  let resolveTimer = null;

  return new Promise((resolve) => {
    winston.info(`Launching ${serviceName} service...`);
    const service = command;

    service.stdout.on('data', (data) => {
      winston.info(`${serviceName} log: ${data}`);
      clearTimeout(resolveTimer);
      resolveTimer = setTimeout(() => {
        resolve();
      }, 1000 * 3);
    });

    service.stderr.on('data', (data) => {
      winston.info(`${serviceName} log: ${data}`);
    });

    service.on('close', (code) => {
      winston.info(`${serviceName} exited with code ${code}`);
    });
  });
}

function finishTest() {
  winston.info('Test succeed. Start cleaning...');
  fse.remove(consts.audioPath, (error) => {
    if (error) throw error;
    else process.exit();
  });
}
