const fs      = require('fs');
const winston = require('winston');

function AudioFile(log) {
  winston.info('Checking if audio file is created');
  return new Promise((fullfil, reject) => {
    const path = `${log.split(':')[2].trim()}`;
    winston.info(`Audio path: ${path}`);
    try {
      fs.lstatSync(path);
      winston.info('Audio file found');
      cleaning(path)
      .then(() => {
        fullfil();
      }, (error) => {
        reject(error);
      });
    } catch (ex) {
      reject(ex);
    }
  });
}

function cleaning(path) {
  winston.info('Removing audio test file');
  return new Promise((fullfil, reject) => {
    try {
      fs.unlink(path, (error) => {
        if (error) reject(error);
        winston.info('Test audio file removed');
        fullfil();
      });
    } catch (ex) {
      reject(ex);
    }
  });
}

module.exports = AudioFile;
