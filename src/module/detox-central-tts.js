const fs      = require('fs');
const winston = require('winston');
const request = require('request');

const consts = require('../support/constants');

function fetch(message, path) {
  return new Promise((fulfill, reject) =>  {
    request.post(buildURL('tts'), { json: { message } }, (err, response, body) => {
      if (err) {
        reject(err);
        return;
      }
      if (body.relative_url) {
        const downloadUrl = buildURL(body.relative_url);
        winston.info(`Download url: ${downloadUrl}`);
        downloadAudioFile(downloadUrl, path).then((audioPath) => { fulfill(audioPath); }, reject);
      } else {
        reject(new Error(`Response is unexpected! ${response.statusCode} : ${JSON.stringify(body, null, 2)}`));
      }
    });
  });
}

function buildURL(path) {
  return `${consts.detoxCentralAddress}/${path}`;
}

function downloadAudioFile(url, path) {
  return new Promise((fulfill, reject) => {
    request(url, { encoding: 'binary' }, (error, response, body) => {
      if (error) {
        reject(error);
        return;
      }
      if (body) {
        fs.writeFile(path, body, 'binary', (err) => {
          if (err) {
            reject(err);
            return;
          }
          winston.info(`Audio file saved to ${path}`);
          fulfill(path);
        });
      } else {
        reject(new Error(`Audio file is not available. ${error}`));
      }
    });
  });
}

module.exports = { fetch };
