const fs      = require('fs');
const request = require('request');
const uri     = require('urijs');
const winston = require('winston');

const detoxCentralUrl = process.env.DETOX_CENTRAL_ADDRESS;
if (!detoxCentralUrl) {
  throw new Error('DETOX_CENTRAL_ADDRESS not defined!');
} else {
  detoxCentralUrl = detoxCentralUrl.split('//')[1];
}

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
  const url = uri({
    protocol: 'http',
    hostname: detoxCentralUrl,
    path:     'tts'
  });

  return url.toString();
}

function buildDownloadUrl(downloadPath) {
  const url = uri({
    protocol: 'http',
    hostname: detoxCentralUrl,
    path:     downloadPath
  });

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
