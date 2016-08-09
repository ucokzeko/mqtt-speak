const fs      = require('fs');
const request = require('request');
const parse   = require('url-parse');
const winston = require('winston');
const consts  = require(`${__dirname}/../support/constants`);

function fetch(message, path) {
  return new Promise((fulfill, reject) =>  {
    request.post(getTTSRequestUrl(), { json: { message } }, (err, response, body) => {
      if (err) {
        reject(err);
      } else {
        if (response.statusCode === 200 || response.statusCode === 201) {
          const downloadUrl = buildDownloadUrl(body.relative_url);
          downloadAudioFile(downloadUrl, path).then((audioPath) => { fulfill(audioPath); }, reject);
        } else {
          reject(new Error(`Response is unexpected! ${response.statusCode} : ${body}`));
        }
      }
    });
  });
}

function getTTSRequestUrl() {
  const url = parse(consts.detoxCentralAddress);
  url.set('pathname', '/tts');
  console.log(url.toString());
  return url.toString();
}

function buildDownloadUrl(downloadPath) {
  const url = parse(consts.detoxCentralAddress);
  url.set('pathname', `/${downloadPath}`);
  console.log(url.toString());
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
