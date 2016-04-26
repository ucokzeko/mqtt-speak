const fs = require('fs');
const crypto = require('crypto');
const request = require('request');
const winston = require('winston');
const Acapela = require(`${__dirname}/acapela-tts.js`);

function Proc(msgString, root) {
  const path = `${root}${getMD5String(msgString)}.mp3`;
  return new Promise((fulfill, reject) => {
    try {
      fs.lstatSync(path);
      fulfill(path);
    } catch (e) {
      // Request TTS service to get download url
      new Acapela(msgString)
      .then((audioUrl) => {
        downloadAudioFile(audioUrl, path)
        .then((filePath) => {
          fulfill(filePath);
        }, reject);
      }, reject);
    }
  });
}

function getMD5String(text) {
  return crypto.createHash('md5').update(text).digest('hex');
}

function downloadAudioFile(url, path) {
  return new Promise((fulfill, reject) => {
    request(url, { encoding: 'binary' }, (error, response, body) => {
      if (error) {
        reject(error);
      } else {
        if (response.statusCode === 200) {
          fs.writeFile(path, body, 'binary', (err) => {
            if (err) {
              reject(err);
            }
            winston.info(`Audio file saved to ${path}`);
            fulfill(path);
          });
        } else {
          reject(error);
        }
      }
    });
  });
}

module.exports = Proc;
