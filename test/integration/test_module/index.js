const fse      = require('fs-extra');
const mqttTest = require(`${__dirname}/mqtt_tests`);
const consts   = require(`${__dirname}/../../../src/support/constants`);

function startTest() {
  return new Promise((resolve, reject) => {
    mqttTest.publishTest();
    setTimeout(() => {
      mqttTest.isFileExist(`${consts.audioPath}7a242f54a198e42e02076173fc1d2e57.mp3`).then(() => {
        cleanTest().then(() => {
          resolve();
        }, (error) => {
          reject(error);
        });
      }, (error) => {
        reject(error);
      });
    }, 1000 * 5);
  });
}

function cleanTest() {
  return new Promise((resolve, reject) => {
    fse.remove(consts.audioPath, (error) => {
      if (error) reject(error);
      else (resolve());
    });
  });
}

module.exports = {
  startTest
};
