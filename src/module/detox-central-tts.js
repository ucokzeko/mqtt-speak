const fs      = require('fs');
const winston = require('winston');
const request = require('request');
const parse   = require('url-parse');

const consts = require('../support/constants');

function fetch(message, path) {
  return new Promise((fulfill, reject) =>  {
    request.post(buildURL('tts'), { json: { message } }, (err, response, body) => {
      if (err) {
        reject(err);
      } else {
        if (response.statusCode === 200 || response.statusCode === 201) {
          const downloadUrl = buildURL(body.relative_url);
          downloadAudioFile(downloadUrl, path).then((audioPath) => { fulfill(audioPath); }, reject);
        } else {
          reject(new Error(`Response is unexpected! ${response.statusCode} : ${body}`));
        }
      }
    });
  });
}

function buildURL(path) {
  const url = parse(consts.detoxCentralAddress, true);
  url.set('pathname', `/${path}`);
  return url.toString();
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

module.exports = { fetch };
